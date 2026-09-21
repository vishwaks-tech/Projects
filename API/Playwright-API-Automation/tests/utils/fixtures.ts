import { test as base } from '@playwright/test'
import { RequestHandler } from './request-handler'
import { config } from '../api-test.config'

export type TestOptions = {
    api: RequestHandler
    config: typeof config                       
}

export const test = base.extend<TestOptions>({
    api: async ({request}, use) => {
        const requestHandler = new RequestHandler(request, config.apiUrl)
        await use(requestHandler)
    },
    config: async({}, use) => {
        await use(config)
    }

})