# Framework Design

## Overview

The framework is designed to keep API test scenarios simple while centralizing common API communication, test setup, validation, and reporting responsibilities.

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

The `RequestHandler` is the core reusable component for API communication.

Instead of implementing `request.get()`, `request.post()`, `request.put()`, and `request.delete()` directly in every test, common request functionality is centralized in the Request Handler.

### Responsibilities

The Request Handler manages:

- Base URL
- API path
- Query parameters
- Request headers
- Request body
- HTTP methods
- Response status validation
- Request/response reporting
- Request-state cleanup

This allows individual tests to concentrate on the scenario being validated.

---

## 2. Method Chaining

The Request Handler uses method chaining to make API test code concise and readable.

For example:

```typescript
await api
    .path('/articles')
    .headers(headers)
    .body(payload)
    .postRequest(201);
```

Each configuration method returns the same `RequestHandler` instance:

```typescript
return this;
```

### Benefits

- Improved readability
- Less repetitive code
- Consistent request construction
- Easier maintenance
- Clear separation between request configuration and execution

---

## 3. Separation of Test Intent and API Communication

A key design principle is separating **what the test validates** from **how the API request is executed**.

### Test layer

```text
Scenario
   +
Test Data
   +
Expected Result
```

### Request Handler

```text
URL
+
Path
+
Headers
+
Parameters
+
Body
+
HTTP Method
+
Request Execution
```

This prevents API communication code from being duplicated across test scenarios.

---

## 4. Playwright Fixtures

Playwright fixtures are used to provide reusable test setup and dependencies.

Instead of creating common API-related objects repeatedly in every test, fixtures provide the required objects to the test execution context.

This helps keep test specifications focused on the API behavior being validated.

---

## 5. Test Data Management

Request payloads are maintained separately from test implementation using JSON files.

Example:

```text
test-data/
    |
    +-- POST-article.json
```

This separates test logic from test data and improves maintainability.

---

## 6. Request State Cleanup

The Request Handler maintains request-specific state such as:

- URL
- Path
- Query parameters
- Headers
- Body

After an API request is completed, these fields are cleared before the handler is reused.

The cleanup prevents configuration from one API request from unintentionally affecting the next API request.

---

## 7. Status-Code Validation

Expected HTTP status codes are supplied by the test scenario.

Example:

```typescript
await api
    .path('/articles')
    .postRequest(201);
```

The Request Handler compares:

```text
Expected Status Code
        vs
Actual Status Code
```

If the values do not match, the test fails with an error indicating the expected and actual status codes.

---

## 8. Failure Handling

When status-code validation fails, the framework creates an error containing information about the failed API operation.

The failure is raised from the Request Handler so that the test execution identifies the API operation that caused the failure.

---

## 9. API Request and Response Reporting

API request and response information is captured as part of the Allure reporting implementation.

The reporting approach provides visibility into:

```text
API Request
    |
    +-- Method
    +-- URL
    +-- Headers
    +-- Request Body
    |
    v
API Response
    |
    +-- Status Code
    +-- Response Body
```

The evidence is associated with the relevant API execution step in the Allure report.

Detailed reporting implementation is documented in:

[`allure-reporting.md`](allure-reporting.md)

---

## 10. Request Handler Lifecycle

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
Validate Status
        |
        v
Report API Activity
        |
        v
Cleanup Request State
```

---

## 11. Single-Worker Execution

The framework intentionally uses a single Playwright worker:

```typescript
workers: 1
```

and disables fully parallel test execution:

```typescript
fullyParallel: false
```

This provides:

- Predictable execution
- Easier troubleshooting
- Controlled API activity
- Consistent execution behavior

---

## 12. Playwright Project Organization

The framework uses Playwright projects to organize test categories.

The current configuration includes:

```text
api-testing
     |
     +-- smoke-tests
     |
     +-- negative-tests
```

Project dependencies are used to control the relationship between the test suites.

---

## 13. Reporting Design

The framework uses Allure as the detailed reporting solution.

```text
Test
 |
 v
Request Handler
 |
 v
API Request / Response
 |
 v
Allure Evidence
 |
 v
Allure Report
```

This keeps reporting reusable across the API test scenarios.

---

## 14. Design Principles

### Reusability

Common API functionality is implemented once and reused across tests.

### Separation of Concerns

Test scenarios, API communication, test setup, test data, and reporting have distinct responsibilities.

### Maintainability

Changes to common API behavior can be implemented in the Request Handler rather than duplicated across test cases.

### Readability

Method chaining keeps test scenarios concise and makes the intended API operation easy to understand.

### Controlled Execution

Single-worker execution provides predictable API test execution.

### Evidence-Based Reporting

Allure provides API execution evidence that can be used for troubleshooting and test-result analysis.

---

## 15. Design Summary

```text
                    TEST SCENARIO
                          |
                          v
                      FIXTURE
                          |
                          v
                  REQUEST HANDLER
                          |
            +-------------+-------------+
            |             |             |
            v             v             v
           URL         Headers        Body
            |             |             |
            +-------------+-------------+
                          |
                          v
                 PLAYWRIGHT API
                   REQUEST CONTEXT
                          |
                          v
                      REST API
                          |
                          v
                 RESPONSE VALIDATION
                          |
                          v
                   ALLURE EVIDENCE
                          |
                          v
                    ALLURE REPORT
```

The resulting design keeps test scenarios focused on **API behavior and validation**, while reusable framework components handle **request construction, execution, validation, cleanup, and reporting**.
