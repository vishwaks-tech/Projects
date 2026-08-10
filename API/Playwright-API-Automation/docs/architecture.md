# Framework Architecture

## Overview

The Playwright API Automation Framework follows a layered architecture that separates:

- Test scenarios
- Test setup and dependencies
- API request handling
- Test data
- Response validation
- Test reporting

The objective is to keep individual API tests focused on **what is being validated**, while reusable framework components handle common API execution responsibilities.

---

## High-Level Architecture

```text
                    Test Scenarios
                          |
                          v
                  Playwright Fixtures
                          |
                          v
                   Request Handler
                          |
                          v
              Playwright APIRequestContext
                          |
                          v
                       REST API
                          |
                          v
                  Response Validation
                          |
                          v
                    Allure Results
                          |
                          v
                    Allure Report
```

---

## Architecture Components

### 1. Test Layer

The test layer contains the API test scenarios.

The tests define:

- API operation to be performed
- Test data
- Expected HTTP status code
- Response validations
- Business-level assertions

The test layer focuses on the **test scenario and expected behavior** rather than implementing the underlying API communication.

Example:

```typescript
await api
    .path('/articles')
    .headers(headers)
    .body(payload)
    .postRequest(201);
```

### 2. Fixture Layer

Playwright fixtures provide reusable test setup and dependencies.

The fixture layer is responsible for creating and providing the objects required by the tests. This avoids repeating common setup logic across individual test cases.

### 3. Request Handler Layer

The Request Handler is the central API communication component.

It manages:

- Base URL
- API path
- Query parameters
- Request headers
- Request body
- GET, POST, PUT, and DELETE requests
- HTTP status-code validation
- API reporting
- Request-state cleanup

### 4. Test Data Layer

Test data is maintained separately from the test implementation using JSON files.

Example:

```text
test-data/
    |
    +-- POST-article.json
```

### 5. Playwright APIRequestContext

The framework uses Playwright's `APIRequestContext` to communicate with the REST API.

```text
Test
  |
  v
Request Handler
  |
  v
APIRequestContext
  |
  v
HTTP Request
  |
  v
REST API
```

### 6. Response Validation

After the API request is executed, the response is validated against the expected result.

```text
API Response
     |
     +-- Actual Status Code
     |
     +-- Response Body
     |
     v
Validation
     |
     v
Pass / Fail
```

### 7. Reporting Layer

Allure is used for detailed test reporting.

API request and response information is captured as evidence associated with the relevant API execution.

```text
API Request
     |
     v
API Response
     |
     v
Allure Evidence
     |
     v
Allure Report
```

Detailed Allure implementation is documented in:

[`allure-reporting.md`](allure-reporting.md)

---

## Complete Execution Flow

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
                Playwright APIRequestContext
                           |
                           v
                       REST API
                           |
                           v
                    API Response
                           |
                           v
                 Status Code Validation
                           |
                           v
                    Test Result
                           |
                           v
                    Allure Results
                           |
                           v
                    Allure Report
```

---

## Separation of Responsibilities

| Component | Responsibility |
|---|---|
| **Test Specifications** | Define API scenarios and assertions |
| **Playwright Fixtures** | Provide reusable test setup and dependencies |
| **Request Handler** | Construct and execute API requests |
| **JSON Test Data** | Store reusable request payloads |
| **APIRequestContext** | Perform HTTP communication |
| **Response Validation** | Validate expected API outcomes |
| **Allure** | Provide detailed test reporting and API evidence |
| **Playwright Configuration** | Control test execution |

---

## Playwright Configuration

The framework uses `playwright.config.ts` to centralize test execution configuration.

The project intentionally uses a single worker:

```typescript
fullyParallel: false,
workers: 1
```

This provides controlled and predictable API test execution.

---

## Playwright Projects

The framework uses Playwright projects to organize different categories of tests.

The current configuration contains:

```text
api-testing
     |
     +-- smoke-tests
     |
     +-- negative-tests
```

Project dependencies are used to control the relationship between the test suites.

---

## Architecture Design Goal

The architecture is designed so that adding a new API test does not require duplicating the underlying API communication logic.

A new test primarily defines:

```text
What should be tested?
        +
What data should be used?
        +
What result is expected?
```

The reusable framework components handle:

```text
How the request is constructed
        +
How the API is called
        +
How common validation is performed
        +
How the execution is reported
```

This separation makes the framework easier to maintain and extend as additional API endpoints and test scenarios are introduced.
