# Test Strategy

## Overview

The API automation test strategy is designed to validate REST API behavior through a combination of **CRUD, smoke, and negative testing**.

The strategy focuses on validating both successful API operations and expected behavior under invalid conditions.

---

## Test Objectives

The primary objectives are to:

- Validate API functionality
- Validate CRUD operations
- Verify expected HTTP status codes
- Validate API responses
- Validate negative scenarios
- Provide fast smoke-test feedback
- Capture API request and response evidence
- Produce detailed test execution reports

---

## Test Coverage

```text
API Test Suite
     |
     +-- CRUD Testing
     |
     +-- Smoke Testing
     |
     +-- Negative Testing
```

---

## 1. CRUD Testing

CRUD testing validates the primary resource lifecycle.

```text
Create
   ↓
Retrieve
   ↓
Update
   ↓
Delete
```

### Create

Validates that a new resource can be created successfully.

Typical validation includes:

- HTTP status code
- Response body
- Returned resource information

### Retrieve

Validates that an existing resource can be retrieved successfully.

Typical validation includes:

- HTTP status code
- Response data
- Resource information

### Update

Validates that an existing resource can be updated successfully.

Typical validation includes:

- HTTP status code
- Updated response data
- Expected field changes

### Delete

Validates that a resource can be deleted successfully.

Typical validation includes:

- HTTP status code
- Expected delete behavior

---

## 2. Smoke Testing

Smoke testing provides a fast validation of critical API functionality.

The purpose is to determine whether the API is sufficiently healthy for broader test execution.

Smoke tests focus on critical and representative API operations rather than comprehensive coverage.

### Smoke Testing Objectives

- Verify basic API availability
- Validate critical API operations
- Detect major failures early
- Provide fast feedback

---

## 3. Negative Testing

Negative testing validates how the API behaves when invalid or unexpected input is provided.

Examples include:

- Invalid request data
- Invalid resource identifiers
- Invalid parameters
- Validation failures
- Expected error responses

The objective is to verify that the API handles invalid conditions correctly and returns the expected error behavior.

---

## HTTP Status-Code Validation

Expected HTTP status codes are defined by the test scenario.

The Request Handler compares the expected status code with the actual response status.

```text
Expected Status Code
          |
          v
       Compare
          ^
          |
Actual Status Code
          |
          v
      Pass / Fail
```

This provides consistent HTTP-level validation across API operations.

---

## Response Validation

In addition to HTTP status validation, test scenarios can validate response content.

Examples include:

- Required response fields
- Expected field values
- Returned resource information
- Updated data
- Error response content
- Conditions specific to the API scenario

---

## Test Data Strategy

Request payloads are maintained separately in JSON files where applicable.

Example:

```text
test-data/
    |
    +-- POST-article.json
```

This keeps request data separate from the test implementation and improves maintainability.

Faker is also used where dynamic test data generation is required.

---

## Test Execution Strategy

The framework uses controlled Playwright execution.

The configuration includes:

```typescript
fullyParallel: false,
workers: 1
```

### Reason for Single Worker

The project intentionally uses a single worker to provide:

- Predictable execution
- Controlled API activity
- Easier troubleshooting
- Consistent execution behavior

---

## Test Organization

Playwright projects are used to organize test categories.

The configuration includes:

```text
api-testing
     |
     +-- smoke-tests
     |
     +-- negative-tests
```

Project dependencies are used to control the execution relationship between the test suites.

---

## Test Reporting Strategy

Allure is used to provide detailed test execution reporting.

The strategy includes capturing:

- Test execution status
- Test steps
- Failures
- API request information
- API response information
- Supporting evidence

This makes the test report useful for both result analysis and troubleshooting.

---

## API Evidence Strategy

For API execution, the report should make it possible to understand:

```text
What API was called?
        |
        v
Which HTTP method was used?
        |
        v
What request data was sent?
        |
        v
What response was received?
        |
        v
What status code was returned?
        |
        v
Did the validation pass?
```

This provides traceability between the test scenario and the API behavior being validated.

---

## Defect Investigation

When an API test fails, the following information can be used to investigate the failure:

1. Test scenario
2. API request
3. Request headers
4. Request body
5. API response
6. Response status code
7. Validation result
8. Allure test evidence

This reduces the need to reproduce the API call manually during initial investigation.

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
          +--------------+--------------+
                         |
                         v
               Status Validation
                         |
                         v
                Response Validation
                         |
                         v
             Request / Response Evidence
                         |
                         v
                  Allure Report
```

The strategy combines functional API validation, negative testing, controlled execution, and detailed reporting to provide meaningful coverage and troubleshooting evidence.
