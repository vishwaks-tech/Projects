// process.env is OOB TS. Using CLI when I run the test case I can pass what env i want.
// ex) TEST_ENV = qa
const processENV = process.env.TEST_ENV
// When running locally, If you want to run in QA change 'dev' to 'qa' and the corresponding username/passwd and links will be picked
const env = processENV || 'dev'

export const config = {
    apiUrl: 'https://conduit-api.bondaracademy.com/api',
    userEmail: 'XXX',
    userPassword: 'YYY'
}

// since fixture creates the config object already, we are re-assigning the values which were assigned as part of the previous export line
if (env === 'dev') {
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
    config.userEmail = 'XXX',
    config.userPassword = 'YYY'
}

if (env === 'qa') {
    config.apiUrl = 'https://conduit-api.bondaracademy.com/api',
    config.userEmail = 'XXX',
    config.userPassword = 'YYY'
}