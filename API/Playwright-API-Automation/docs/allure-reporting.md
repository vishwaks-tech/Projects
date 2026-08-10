# Allure Reporting

## Overview

The framework integrates **Allure** with Playwright for detailed test execution reporting.

Allure is used to provide test steps, execution status, failures, and API evidence for API operations executed through the Request Handler.

---

## Allure Integration

The project uses:

- `allure-playwright`
- `allure-js-commons`

The Playwright reporter configuration is:

```typescript
reporter: [
    ['html'],
    ['list'],
    ['allure-playwright']
]
```

This generates Allure-compatible result files during test execution.

---

## Allure Execution Flow

```text
Playwright Test
      |
      v
API Test Scenario
      |
      v
Request Handler
      |
      +---- Allure Step
      |
      +---- API Request
      |
      +---- API Response
      |
      v
allure-results
      |
      v
Allure Report
```

---

## API Request Evidence

For API operations executed through the Request Handler, the framework creates an `API Request` attachment.

The request evidence contains:

```text
Method
URL
Headers
Body where applicable
```

The attachment is generated as JSON.

---

## API Response Evidence

For RequestHandler-based operations, the framework creates an `API Response` attachment.

The response evidence contains:

```text
Status Code
Response Headers
Response Body where available
```

This gives the report consumer visibility into the actual API response received during execution.

---

## Allure Steps

Each RequestHandler API method creates an Allure step containing the operation name and HTTP request.

Examples include:

```text
Get Article: GET <API URL>
Create Article: POST <API URL>
Update Article: PUT <API URL>
Delete Article: DELETE <API URL>
```

Within the step, the API request and response evidence is attached.

Conceptually:

```text
Create Article: POST <API URL>
        |
        +-- API Request
        |
        +-- API Response
        |
        +-- Status Validation
```

This keeps the API evidence associated with the API call that generated it.

---

## RequestHandler Reporting Scope

The current API request/response attachment implementation is part of the custom Request Handler.

Therefore:

```text
CRUD Tests       -> Request Handler -> API evidence
Negative Tests   -> Request Handler -> API evidence
Token Creation   -> Request Handler -> API evidence
Smoke Tests      -> Direct request   -> No RequestHandler attachments
```

The smoke suite still appears in the Allure report through the Playwright Allure reporter, but its API calls do not use the custom Request Handler attachment methods.

---

## Allure Results

After Playwright execution, result files are generated in:

```text
allure-results/
```

These files contain the data used to build the Allure report.

---

## Generate the Allure Report

Use:

```bash
npx allure generate allure-results --clean -o allure-report
```

The `--clean` option removes the previously generated report before creating a new report.

The generated report is placed in:

```text
allure-report/
```

---

## Open the Allure Report

Use:

```bash
npx allure open allure-report
```

This opens the generated Allure report in a browser.

---

## Reporting Workflow

```text
1. Execute Playwright Tests
          |
          v
2. Generate allure-results
          |
          v
3. Generate allure-report
          |
          v
4. Open Allure Report
```

---

## Playwright HTML Report and Allure

The project generates both:

### Playwright HTML Report

The Playwright HTML report provides the standard Playwright test execution view.

### Allure Report

The Allure report provides:

- Test steps
- Execution status
- Failures
- Request/response evidence for RequestHandler-based API calls
- API execution context

The two reporting mechanisms provide complementary views of test execution.

---

## Troubleshooting API Evidence

If API request/response evidence is not visible in Allure:

1. Confirm the test uses the custom Request Handler.
2. Confirm Playwright execution completed.
3. Confirm `allure-results/` was generated.
4. Check that Allure result and attachment files were created.
5. Confirm the Request Handler is creating `API Request` and `API Response` attachments.
6. Regenerate the report:

```bash
npx allure generate allure-results --clean -o allure-report
```

7. Open the regenerated report:

```bash
npx allure open allure-report
```

This helps determine whether the issue is with evidence generation or report generation.

---

## Jenkins Allure Integration

The project includes a `Jenkinsfile` that:

1. Installs dependencies
2. Accepts the `TEST_ENV` parameter
3. Executes Playwright tests
4. Copies `allure-results`
5. Publishes the Allure results through Jenkins

The Jenkins post-build configuration uses the Allure Jenkins integration:

```text
Playwright Tests
      |
      v
allure-results
      |
      v
Jenkins Allure Publisher
      |
      v
Allure Report
```

---

## Reporting Design

The reporting implementation keeps API evidence generation inside the reusable Request Handler.

```text
Test
 |
 v
Request Handler
 |
 +---- Request Attachment
 |
 +---- API Request
 |
 +---- API Response
 |
 +---- Response Attachment
 |
 v
Allure Report
```

This avoids duplicating request/response reporting logic across the CRUD and negative tests.

---

## Summary

The Allure implementation provides detailed test reporting and, for RequestHandler-based API calls, makes the **API request and response evidence available alongside the relevant API execution step**.

This improves:

- Troubleshooting
- Failure investigation
- API visibility
- Test-result analysis
- Communication of test results
