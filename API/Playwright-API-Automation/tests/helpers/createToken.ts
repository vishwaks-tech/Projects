import { RequestHandler } from "../utils/request-handler";
import { config } from "../api-test.config";
import { request } from '@playwright/test'

// We could have used api fixture directl
export async function createToken(email: string, password: string) {
    const context = await request.newContext()
    const apiToken = new RequestHandler(context, config.apiUrl)

    try {
        const tokenResponse = await apiToken
            .path('/users/login')
            .body({ "user": { "email": email, "password": password } })
            .postRequest(200, 'Create Token')
        return 'Token' + ' ' + tokenResponse.user.token
    } catch (error) {
        if (error instanceof Error) {
            Error.captureStackTrace(error, createToken)
        }
        throw error
    } finally {
        await context.dispose()
    }

}