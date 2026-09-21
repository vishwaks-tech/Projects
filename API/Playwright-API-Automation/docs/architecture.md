# Framework Architecture

## Overview

The Playwright API Automation Framework uses a layered design for the RequestHandler-based CRUD and negative test suites, while the smoke suite uses Playwright's request fixture directly.

This distinction reflects the actual implementation in the project.

---

## High-Level Architecture

```text
                         API TEST SUITE
                              |
               +--------------+--------------+
               |                             |
               v                             v
       RequestHandler Path              Direct Request Path
               |                             |
       +-------+-------+                     |
       |               |                     |
       v               v                     v
     CRUD           Negative              Smoke
       |               |                     |
       +-------+-------+                     |
               |                             |
               v                             v
       APIRequestContext              Playwright Request
               |                             |
               +-------------+---------------+
                             |
                             v
                          REST API
                             |
                             v
                    Response Validation
                             |
                             v
                    Playwright / Allure
```

---

## RequestHandler-Based Architecture

The CRUD and negative test suites use the custom Request Handler.

```text
Test Specification
        |
        v
Playwright Fixture
        |
        v
Request Handler
        |
        v
APIRequestContext
        |
        v
REST API
        |
        v
Response
        |
        +---- Status Validation
        |
        +---- Allure Request/Response Evidence
```

---

## Smoke Test Architecture

The smoke suite uses Playwright's built-in `request` fixture directly.

```text
Smoke Test
    |
    v
Playwright Request Fixture
    |
    v
REST API
    |
    v
HTTP Status Validation
```

The smoke suite therefore does not use the custom Request Handler for its API calls.

---

## Architecture Components

### 1. Test Layer

The test layer contains:

- `crudFramework.spec.ts`
- `negativeTests.spec.ts`
- `smokeTest.spec.ts`

The tests define API scenarios, test data, expected status codes, and response assertions.

---

### 2. Fixture Layer

`tests/utils/fixtures.ts` extends the Playwright test object with:

- `api` — a reusable `RequestHandler`
- `config` — the API environment configuration

The fixture creates the Request Handler using the configured API URL.

---

### 3. Request Handler Layer

`tests/utils/request-handler.ts` centralizes API request functionality for the CRUD and negative suites.

It manages:

- Base URL
- Path
- Query parameters
- Headers
- Request body
- GET
- POST
- PUT
- DELETE
- Status-code validation
- Allure request/response attachments
- Request-state cleanup

---

### 4. Authentication Helper

`tests/helpers/createToken.ts` uses the Request Handler to create an authentication token.

The helper:

1. Creates a Playwright API request context
2. Creates a Request Handler
3. Calls `/users/login`
4. Validates the expected status
5. Returns the API token
6. Disposes the request context

---

### 5. Test Data Layer

Request payloads are maintained in:

```text
tests/request-objects/
├── POST-article.json
└── PUT-article.json
```

`tests/utils/data-generator.ts` uses these payloads as templates and Faker to generate dynamic article content.

---

### 6. Configuration Layer

`tests/api-test.config.ts` manages:

- `TEST_ENV`
- API URL
- User credentials

The current configuration supports:

```text
dev
qa
```

The Playwright configuration is maintained separately in `playwright.config.ts`.

---

### 7. Reporting Layer

The project uses:

- Playwright HTML reporting
- Playwright list reporting
- Allure reporting

The Request Handler attaches API request and response evidence to the relevant Allure steps.

---

## Playwright Configuration

The main configuration contains:

```typescript
testDir: './tests',
fullyParallel: false,
retries: 1,
workers: 1
```

The reporter configuration includes:

```typescript
reporter: [
    ['html'],
    ['list'],
    ['allure-playwright']
]
```

---

## Playwright Projects and Dependencies

The configuration defines three projects:

```text
api-testing
smoke-tests
negative-tests
```

The `api-testing` project uses:

```typescript
dependencies: ['smoke-tests', 'negative-tests']
```

The `api-testing` project matches the CRUD framework test file.

This creates an execution relationship between the smoke/negative projects and the CRUD project.

---

## Complete RequestHandler Flow

```text
CRUD / Negative Test
        |
        v
Fixture
        |
        v
RequestHandler
        |
        +-- URL
        +-- Path
        +-- Query Parameters
        +-- Headers
        +-- Body
        |
        v
APIRequestContext
        |
        v
REST API
        |
        v
Response
        |
        +-- Status Validation
        |
        +-- API Request Attachment
        |
        +-- API Response Attachment
        |
        v
Allure Report
```

---

## Separation of Responsibilities

| Component | Responsibility |
|---|---|
| **Test Specifications** | Define API scenarios and assertions |
| **Playwright Fixtures** | Provide reusable RequestHandler and configuration |
| **Request Handler** | Construct and execute API requests |
| **Authentication Helper** | Create API authentication token |
| **JSON Test Data** | Store reusable request payload templates |
| **Data Generator** | Create dynamic article test data |
| **APIRequestContext** | Perform HTTP communication |
| **API Configuration** | Manage environment and API settings |
| **Playwright Configuration** | Control projects, workers, retries, and reporters |
| **Allure** | Provide detailed reporting and API evidence |
| **Jenkinsfile** | Define CI/CD execution |

---

## Architecture Design Goal

The architecture keeps the reusable RequestHandler-based tests focused on:

```text
What should be tested?
        +
What data should be used?
        +
What result is expected?
```

The framework components handle:

```text
How the request is constructed
        +
How the API is called
        +
How common status validation is performed
        +
How API evidence is reported
        +
How request state is cleaned up
```

The smoke suite remains intentionally simple by using Playwright's direct request fixture.

This gives the project both a reusable framework implementation and a straightforward smoke-test path.
