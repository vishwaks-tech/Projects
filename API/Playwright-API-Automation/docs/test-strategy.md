# Test Strategy

## Overview

The API automation test strategy validates REST API behavior through:

- CRUD testing
- Smoke testing
- Negative testing
- HTTP status-code validation
- Response validation
- API request/response evidence for RequestHandler-based tests

The strategy combines a reusable RequestHandler-based framework with a lightweight direct-request smoke suite.

---

## Test Objectives

The primary objectives are to:

- Validate API functionality
- Validate CRUD operations
- Verify expected HTTP status codes
- Validate API response content
- Validate negative scenarios
- Provide fast smoke-test feedback
- Capture API request/response evidence where supported
- Produce detailed test execution reports

---

## Test Suite Organization

```text
API Test Suite
     |
     +-- Smoke Tests
     |
     +-- Negative Tests
     |
     +-- CRUD Framework Tests
```

Playwright projects organize these suites as:

```text
smoke-tests
negative-tests
api-testing
```

---

## 1. CRUD Testing

The CRUD framework validates article operations across the resource lifecycle.

```text
Create
   ↓
Retrieve
   ↓
Update
   ↓
Delete
```

### Retrieve

The CRUD suite validates:

- Article retrieval
- HTTP status
- Article count
- Returned article data

### Create

The suite validates:

- Article creation
- HTTP 201 response
- Returned article title
- Presence of the created article in subsequent retrieval

### Update

The suite validates:

- Article update
- HTTP 200 response
- Updated slug
- Updated article title

### Delete

The suite validates:

- Article deletion
- HTTP 204 response
- Absence of the deleted article from subsequent retrieval

---

## 2. Smoke Testing

The smoke suite provides fast validation of critical API functionality.

Current smoke scenarios include:

- Get Articles
- Get Tags
- Create, Update, Delete article workflow

The smoke suite uses Playwright's built-in `request` fixture directly.

### Smoke Objectives

- Verify basic API availability
- Validate critical API operations
- Detect major failures early
- Provide fast feedback

---

## 3. Negative Testing

The negative suite validates username length rules through API responses.

Current scenarios cover:

- Username shorter than the minimum length
- Username at the minimum boundary
- Username at the maximum boundary
- Username longer than the maximum length

The test validates the expected error response and error message behavior.

Example boundary values covered include:

```text
2 characters
3 characters
20 characters
21 characters
```

---

## HTTP Status-Code Validation

Expected status codes are defined by the test scenario.

Examples include:

```text
GET     -> 200
POST    -> 201
PUT     -> 200
DELETE  -> 204
Negative validation -> 422
```

The Request Handler compares the expected status code with the actual response status for RequestHandler-based tests.

The smoke suite performs direct Playwright status assertions.

---

## Response Validation

The tests perform response-level assertions in addition to HTTP status validation.

### CRUD Response Validation

Examples include:

- Article title
- Article count
- Article slug
- Created article presence
- Updated article presence
- Deleted article absence

### Negative Response Validation

The negative tests validate:

- Presence or absence of the `username` error property
- Expected validation error message

---

## Test Data Strategy

The project maintains reusable JSON request payloads in:

```text
tests/request-objects/
├── POST-article.json
└── PUT-article.json
```

These files provide request templates for CRUD operations.

The data generator also uses Faker to create dynamic article values for selected tests.

---

## Authentication Strategy

Authentication is handled in two ways within the project.

### CRUD / Negative Framework

The CRUD suite uses:

```text
tests/helpers/createToken.ts
```

The helper uses the Request Handler to call the login endpoint, validate the response, and return the authentication token.

### Smoke Suite

The smoke suite obtains its token directly through Playwright's request fixture.

This reflects the current implementation of the two test approaches.

---

## Test Execution Strategy

The Playwright configuration uses:

```typescript
fullyParallel: false,
workers: 1,
retries: 1
```

### Single Worker

The project intentionally uses one worker to provide:

- Predictable execution
- Controlled API activity
- Easier troubleshooting
- Consistent execution behavior

### Retry

The Playwright configuration is set to one retry.

---

## Test Organization and Dependencies

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

The CRUD framework is therefore organized as the dependent API-testing project.

---

## Environment Strategy

The project supports:

```text
TEST_ENV=dev
TEST_ENV=qa
```

The environment value is read by:

```text
tests/api-test.config.ts
```

Jenkins exposes the same environment selection as a build parameter.

The current configuration contains the environment-specific settings used by the project.

---

## Reporting Strategy

The project uses:

- Playwright HTML reporting
- Playwright list reporting
- Allure reporting

For RequestHandler-based API calls, Allure captures:

```text
API Request
    +
API Response
    +
Status Validation
```

This provides evidence that can be used during failure investigation.

---

## Defect Investigation

When an API test fails, the following information can be used to investigate the failure:

1. Test scenario
2. API method
3. API URL
4. Request headers
5. Request body where applicable
6. Response status code
7. Response body where available
8. Validation result
9. Allure evidence for RequestHandler-based calls

This reduces the need to manually reconstruct the API operation during initial investigation.

---

## Test Strategy Summary

```text
                 API TEST STRATEGY
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
        CRUD           Smoke        Negative
          |              |              |
          v              v              v
   RequestHandler    Direct Request   RequestHandler
          |              |              |
          +--------------+--------------+
                         |
                         v
               Status Validation
                         |
                         v
                Response Validation
                         |
                         v
             Allure / Test Reporting
```

The strategy combines reusable API automation, direct smoke validation, negative boundary testing, controlled execution, and detailed reporting.
