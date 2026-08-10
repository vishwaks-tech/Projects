# Framework Design

## Overview

The framework is designed to keep API test scenarios readable while centralizing common API communication, test setup, validation, request-state management, and reporting for the CRUD and negative test suites.

The project also contains a direct Playwright request-based smoke suite for fast API validation.

The primary design goals are:

- Reusability
- Maintainability
- Separation of concerns
- Readable test scenarios
- Consistent API request handling
- Controlled test execution
- Centralized reporting

---

## 1. Reusable API Request Handler

The `RequestHandler` is the core reusable component for the CRUD and negative API tests.

Instead of implementing request construction and common status validation separately in each test, the framework centralizes that functionality in:

```text
tests/utils/request-handler.ts
```

### Responsibilities

The Request Handler manages:

- Base URL
- API path
- Query parameters
- Request headers
- Request body
- GET requests
- POST requests
- PUT requests
- DELETE requests
- HTTP status validation
- Allure request/response evidence
- Request-state cleanup

---

## 2. Method Chaining

The Request Handler uses method chaining to make API test code concise and readable.

Example:

```typescript
await api
    .path('/articles/')
    .body(articleRequest)
    .headers({ Authorization: `${auth_token}` })
    .postRequest(201, 'Create Article');
```

Configuration methods return the same Request Handler instance, allowing the request to be built step by step.

### Benefits

- Improved readability
- Less repetitive code
- Consistent request construction
- Easier maintenance
- Clear separation between configuration and execution

---

## 3. Separation of Test Intent and API Communication

The test layer defines the scenario and expected behavior.

```text
Scenario
   +
Test Data
   +
Expected Result
   +
Assertions
```

The Request Handler manages:

```text
URL
+
Path
+
Parameters
+
Headers
+
Body
+
HTTP Method
+
Request Execution
+
Common Status Validation
```

This prevents common API communication logic from being duplicated across the RequestHandler-based tests.

---

## 4. Playwright Fixtures

`tests/utils/fixtures.ts` extends the Playwright test object with:

```text
api
config
```

The `api` fixture creates a Request Handler using the configured API URL.

This allows tests to use:

```typescript
async ({ api }) => {
    // API test
}
```

instead of creating a new Request Handler in every test.

The `config` fixture provides the environment configuration to tests and helpers.

---

## 5. Test Data Management

Request payload templates are maintained separately from test implementation.

```text
tests/request-objects/
├── POST-article.json
└── PUT-article.json
```

This separates test data from test logic.

The CRUD tests can copy and modify these payloads without changing the original JSON template.

---

## 6. Dynamic Test Data

`tests/utils/data-generator.ts` uses Faker to generate dynamic article content.

The JSON payload is used as a template and selected fields are replaced with generated values.

This provides more varied test data while retaining a known request structure.

---

## 7. Request State Cleanup

The Request Handler maintains request-specific state such as:

- Base URL
- Path
- Query parameters
- Headers
- Body

After each RequestHandler API operation, the request-specific fields are reset.

Conceptually:

```text
API Request 1
     |
     v
Request State
     |
     v
API Execution
     |
     v
Cleanup
     |
     v
Clean Request State
     |
     v
API Request 2
```

This prevents configuration from one API call from unintentionally affecting a subsequent call.

---

## 8. Status-Code Validation

Expected HTTP status codes are supplied by the test.

Example:

```typescript
.postRequest(201, 'Create Article');
```

The Request Handler compares:

```text
Expected Status Code
        vs
Actual Status Code
```

If the values do not match, an error is raised and the test fails.

This provides a common HTTP-level validation mechanism for RequestHandler-based API calls.

---

## 9. Response Validation

The tests perform response-level assertions where required.

Examples in the CRUD suite include:

- Article title validation
- Article count validation
- Slug validation
- Validation that a created article appears in the article list
- Validation that a deleted article no longer appears
- Validation of updated article data

The negative suite validates expected error properties and messages.

---

## 10. Failure Handling

The Request Handler raises an error when the actual HTTP status does not match the expected status.

The error includes the expected and actual status codes.

The Request Handler also uses stack-trace handling so the failure can be associated with the relevant API method.

---

## 11. API Request and Response Reporting

For API calls executed through the Request Handler, the framework captures request and response evidence using Allure.

The request evidence includes:

```text
Method
URL
Headers
Request Body
```

The response evidence includes:

```text
Status Code
Response Headers
Response Body where available
```

The evidence is attached inside an Allure step named with the API operation.

Example structure:

```text
Create Article: POST <API URL>
    |
    +-- API Request
    |
    +-- API Response
```

---

## 12. Request Handler Lifecycle

```text
Create / Obtain Handler
        |
        v
Configure URL / Path
        |
        v
Configure Parameters
        |
        v
Configure Headers
        |
        v
Configure Body
        |
        v
Execute HTTP Request
        |
        v
Capture Response
        |
        v
Attach Allure Evidence
        |
        v
Validate Status
        |
        v
Cleanup Request State
```

---

## 13. Authentication Helper Design

The authentication helper:

```text
tests/helpers/createToken.ts
```

uses a temporary Playwright API request context and the Request Handler to create a token.

Flow:

```text
createToken()
     |
     v
request.newContext()
     |
     v
RequestHandler
     |
     v
POST /users/login
     |
     v
Validate 200
     |
     v
Return Token
     |
     v
Dispose Context
```

This keeps authentication setup separate from the CRUD test logic.

---

## 14. Direct Smoke-Test Design

The smoke suite intentionally uses Playwright's built-in `request` fixture directly.

```text
Smoke Test
    |
    v
Playwright request
    |
    v
REST API
    |
    v
HTTP Status Validation
```

This provides a simple path for fast critical API validation without introducing the Request Handler into the smoke tests.

---

## 15. Single-Worker Execution

The framework uses:

```typescript
fullyParallel: false,
workers: 1
```

The project intentionally uses one worker to provide:

- Predictable execution
- Controlled API activity
- Easier troubleshooting
- Consistent execution behavior

---

## 16. Playwright Project Organization

The Playwright configuration defines:

```text
api-testing
smoke-tests
negative-tests
```

The `api-testing` project depends on:

```typescript
dependencies: ['smoke-tests', 'negative-tests']
```

The projects use `testMatch` patterns to select their respective test files.

---

## 17. Environment Configuration

`tests/api-test.config.ts` reads:

```text
TEST_ENV
```

The current configuration supports:

```text
dev
qa
```

The Jenkins pipeline passes the selected value into the Playwright execution.

---

## 18. Design Principles

### Reusability

Common API functionality is implemented once in the Request Handler.

### Separation of Concerns

Test scenarios, fixtures, API communication, test data, authentication, configuration, and reporting have separate responsibilities.

### Maintainability

Changes to common API request behavior can be made in the Request Handler rather than duplicated across tests.

### Readability

Method chaining keeps RequestHandler-based test scenarios concise.

### Controlled Execution

Single-worker execution provides predictable test execution.

### Evidence-Based Reporting

Allure provides request and response evidence for RequestHandler-based API operations.

---

## 19. Design Summary

```text
                 REQUESTHANDLER TESTS
                         |
                         v
                      FIXTURE
                         |
                         v
                  REQUEST HANDLER
                         |
            +------------+------------+
            |            |            |
            v            v            v
           URL        Headers        Body
            |            |            |
            +------------+------------+
                         |
                         v
                APIRequestContext
                         |
                         v
                     REST API
                         |
                         v
                 Status Validation
                         |
                         v
                 Allure Evidence
                         |
                         v
                   Allure Report
```

The smoke suite follows a simpler direct-request path:

```text
Smoke Test
    |
    v
Playwright Request
    |
    v
REST API
    |
    v
Status Validation
```

The resulting design combines a reusable API framework for the main CRUD/negative suites with a lightweight direct-request approach for smoke validation.
