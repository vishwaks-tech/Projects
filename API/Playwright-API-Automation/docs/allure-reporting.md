# Allure Reporting

## Overview

The framework integrates **Allure** with Playwright to provide detailed test execution reporting.

The reporting implementation is designed to make API test execution easier to understand and troubleshoot by capturing API request and response information as part of the relevant test execution.

---

## Why Allure?

The framework uses Allure to provide detailed execution evidence beyond a basic pass/fail result.

The report provides visibility into:

- Test execution status
- Test steps
- Test duration
- Failures
- Attachments
- API request information
- API response information

---

## Allure Integration

The project uses the `allure-playwright` package.

The package is configured as a Playwright reporter in `playwright.config.ts`.

```typescript
reporter: [
    ['html'],
    ['list'],
    ['allure-playwright']
]
```

This allows Playwright execution to generate Allure-compatible result files in addition to the standard Playwright reports.

---

## Allure Execution Flow

```text
Playwright Test Execution
          |
          v
   API Test Scenario
          |
          v
     API Request
          |
          v
    API Response
          |
          v
    Allure Results
          |
          v
   Allure Report
```

---

## API Request and Response Evidence

A key feature of this project is capturing API request and response information in the Allure report.

For an API operation, the evidence can include:

```text
API Request
-----------
Method
URL
Headers
Request Body

API Response
------------
Status Code
Response Body
```

This allows a test report consumer to understand the API interaction that occurred during the test.

---

## Reporting API Activity as Test Steps

The API request and response information is associated with the relevant API execution step.

Conceptually:

```text
Test
 |
 +-- Create Article
       |
       +-- POST Request
       |
       +-- Request Details
       |
       +-- Response Details
       |
       +-- Status Validation
```

This keeps evidence associated with the API operation that produced it.

---

## Allure Results

After Playwright execution, the framework generates Allure result files in:

```text
allure-results/
```

These result files contain the information required to generate the HTML-based Allure report.

---

## Generate the Allure Report

```bash
npx allure generate allure-results --clean -o allure-report
```

The `--clean` option removes the previous generated report before creating the new report.

The generated report is placed in:

```text
allure-report/
```

---

## Open the Allure Report

```bash
npx allure open allure-report
```

This opens the generated report in the browser.

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

## Playwright and Allure Reports

The framework uses both Playwright and Allure reporting.

### Playwright HTML Report

The Playwright HTML report provides the standard Playwright test execution view.

### Allure Report

Allure provides additional reporting capabilities, including test steps and API request/response evidence.

The two reporting mechanisms complement each other.

---

## Troubleshooting API Evidence

If API request/response evidence does not appear as expected in Allure:

1. Confirm that Playwright execution completed successfully.
2. Confirm that `allure-results` was generated.
3. Check whether the expected result and attachment files were created.
4. Confirm that API reporting steps are being created during request execution.
5. Regenerate the report:

```bash
npx allure generate allure-results --clean -o allure-report
```

6. Open the newly generated report:

```bash
npx allure open allure-report
```

This helps distinguish between an API evidence issue and an Allure report-generation issue.

---

## Reporting Design

```text
Test Scenario
      |
      v
Request Handler
      |
      +---- API Request
      |
      +---- API Response
      |
      v
Allure Evidence
      |
      v
Allure Report
```

This keeps reporting concerns centralized and reusable across CRUD, smoke, and negative tests.

---

## Summary

The Allure integration provides a detailed view of API test execution and makes the **API request and response evidence available alongside the relevant API execution**.

This improves:

- Troubleshooting
- Test-result analysis
- Failure investigation
- Visibility into API behavior
- Communication of API test results
