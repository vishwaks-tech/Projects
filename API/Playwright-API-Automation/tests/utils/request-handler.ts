// Responsible for all API requests. Each request has fields like
// url;path;params;header;body
// method chaining:
//  return this: “Give me back the same RequestHandler object so I can call another method on it.”

import type { APIRequestContext } from "playwright-core"
// Allure change
import * as allure from "allure-js-commons"

// api.url("https://api.com").path("/articles").params({ limit: 10 }).send()
export class RequestHandler {

    private request: APIRequestContext
    private baseUrl: string | undefined
    private defaultBaseUrl: string
    private apiPath: string = ''
    private queryParams: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiBody: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string) {
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
    }

    url(url: string) {
        this.baseUrl = url
        return this

    }

    path(path: string) {
        this.apiPath = path
        return this

    }

    params(params: object) {
        this.queryParams = params
        return this

    }

    headers(header: Record<string, string>) {
        this.apiHeaders = header
        return this

    }

    body(body: object) {
        this.apiBody = body
        return this

    }

    // combination fo URL+PATH. If .url is provided in the test script use it else the default set in this file.
    private getUrl() {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        return url.toString()

    }

    // Allure change
    private async attachRequest(
        method: string, 
        url: string, 
        body?: object) { 
            const requestDetails = { 
                method, 
                url, 
                headers: this.apiHeaders, 
                body: body ?? null 
            }

    await allure.attachment(
        "API Request", 
        JSON.stringify(requestDetails, null, 2), "application/json"
        ) 
    } 

    private async attachResponse(
        statusCode: number, 
        responseHeaders: Record<string, string>, 
        responseBody?: unknown
    ) { 
        const responseDetails = { 
            statusCode, 
            headers: responseHeaders, 
            body: responseBody ?? null 
        } 
    
    await allure.attachment(
        "API Response", 
        JSON.stringify(responseDetails, null, 2), "application/json"
        ) 
    }


    async getRequest(statusCode: number, stepName: string) {
        const url = this.getUrl()
        // we are storing the request before being sent
        return await allure.step(`${stepName}: GET ${url}`, async () => {
        await this.attachRequest('GET', url)
        const response = await this.request.get(url, {
            headers: this.apiHeaders
        })

  
        const actualStatus = response.status()
        const responseHeaders = response.headers()
        const responseJSON = await response.json()
        // Attach response before status code validation
        await this.attachResponse(actualStatus, responseHeaders, responseJSON)
        this.cleanupFields()
        this.statusCodeValidator(actualStatus, statusCode, this.getRequest)

        return responseJSON
        })
    }

    async postRequest(statusCode: number, stepName: string) {
        const url = this.getUrl()
		return await allure.step(`${stepName}: POST ${url}`, async () => {
        await this.attachRequest('POST', url, this.apiBody)
        const response = await this.request.post(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })

        const actualStatus = response.status()
        const responseHeaders = response.headers()
        const responseJSON = await response.json()

        // Attach response after receiving it 
        await this.attachResponse( actualStatus, responseHeaders, responseJSON )
        this.cleanupFields()
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest)

        return responseJSON
		})
    }

	async putRequest(statusCode: number, stepName: string) {
        const url = this.getUrl()
		return await allure.step(`${stepName}: PUT ${url}`, async () => {
        await this.attachRequest( "PUT", url, this.apiBody )
        const response = await this.request.put(url, {
            headers: this.apiHeaders,
            data: this.apiBody
        })
        

        const actualStatus = response.status()
        const responseJSON = await response.json()
        const responseHeaders = response.headers()
        await this.attachResponse( actualStatus, responseHeaders, responseJSON )
        this.cleanupFields()
        this.statusCodeValidator(actualStatus, statusCode, this.putRequest)

        return responseJSON
		})
    }

    async deleteRequest(statusCode: number, stepName: string) {
        const url = this.getUrl()
        return await allure.step(`${stepName}: DELETE ${url}`, async () => {
        await this.attachRequest( "DELETE", url )
        const response = await this.request.delete(url, {
            headers: this.apiHeaders,
        })
        const actualStatus = response.status()
        const responseHeaders = response.headers()
        await this.attachResponse( actualStatus, responseHeaders )
        this.cleanupFields()
        this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
        })
        

    }

    // This function ensures that the error is thrown from the actual API method
    // when the expected status code does not match the actual status code.
    private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
        if (actualStatus !== expectStatus) {
            const error = new Error(`Expected status ${expectStatus} but got ${actualStatus}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }

    private cleanupFields() {
        this.apiBody = {}
        this.apiHeaders = {}
        this.apiPath = ''
        this.baseUrl = undefined
        this.queryParams = {}
    }
}