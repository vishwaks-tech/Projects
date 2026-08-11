# Playwright API Automation Framework

A TypeScript-based API automation framework built with **Playwright Test** for validating REST APIs through reusable CRUD, smoke, and negative test scenarios.

The framework includes a reusable API Request Handler, Playwright fixtures, JSON-based request payloads, Faker-generated data, controlled test execution, Allure reporting, API request/response evidence for RequestHandler-based tests, and Jenkins CI/CD integration.

---

## Project Overview

This project demonstrates the design and implementation of a maintainable API automation framework using **Playwright APIRequestContext** and **TypeScript**.

The framework uses two API execution approaches:

- A reusable **Request Handler** for the CRUD and negative test suites
- Direct Playwright `request` usage for the smoke test suite

The Request Handler centralizes API request construction, status-code validation, request-state cleanup, and Allure API evidence.

---

## Key Features

- REST API automation using Playwright
- TypeScript-based framework
- Reusable API Request Handler
- Method-chaining API request design
- GET, POST, PUT, and DELETE operations
- Query parameter handling
- Request header handling
- Request body handling
- HTTP status-code validation
- Response validation
- CRUD API testing
- Smoke testing
- Negative testing
- Reusable Playwright fixtures
- Test data maintained separately in JSON files
- Faker-based dynamic test data generation
- Single-worker API test execution
- Playwright project dependencies
- Allure reporting
- API request and response evidence for RequestHandler-based API calls
- Playwright HTML reporting
- Jenkins CI/CD integration
- Dev/QA test-environment selection through `TEST_ENV`

---

## Technology Stack

| Technology | Purpose |
|---|---|
| **TypeScript** | Programming language |
| **Node.js** | Runtime environment |
| **Playwright Test** | API automation and test execution |
| **Playwright APIRequestContext** | HTTP API communication |
| **Allure** | Test reporting and API execution evidence |
| **Faker** | Dynamic test data generation |
| **Jenkins** | CI/CD execution |
| **GitHub** | Source code management |

---

## Framework Architecture

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

Detailed architecture documentation:

[`docs/architecture.md`](docs/architecture.md)

---

## Project Structure

```text
Playwright-API-Automation/
│
├── docs/
│   ├── architecture.md
│   ├── framework-design.md
│   ├── allure-reporting.md
│   └── test-strategy.md
│
├── tests/
│   ├── api-test.config.ts
│   ├── crudFramework.spec.ts
│   ├── negativeTests.spec.ts
│   ├── smokeTest.spec.ts
│   │
│   ├── helpers/
│   │   └── createToken.ts
│   │
│   ├── request-objects/
│   │   ├── POST-article.json
│   │   └── PUT-article.json
│   │
│   └── utils/
│       ├── data-generator.ts
│       ├── fixtures.ts
│       └── request-handler.ts
│
├── Jenkinsfile
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## Test Coverage

### CRUD Testing

The CRUD suite validates article operations including:

- Retrieve articles
- Retrieve tags
- Create article
- Retrieve and validate created article
- Update article
- Retrieve and validate updated article
- Delete article
- Retrieve and validate deleted article

The CRUD suite uses the reusable Request Handler.

### Smoke Testing

The smoke suite provides fast validation of critical API functionality, including:

- Get Articles
- Get Tags
- Create, Update, Delete article workflow

The smoke suite uses Playwright's request fixture directly.

### Negative Testing

The negative suite validates username length rules and expected API validation errors for invalid user data.

The negative suite uses the reusable Request Handler and validates the returned error response.

---

## API Request Handler

The framework uses a centralized **API Request Handler** for the CRUD and negative test suites.

The Request Handler supports:

- Base URL
- API paths
- Query parameters
- Request headers
- Request bodies
- GET requests
- POST requests
- PUT requests
- DELETE requests
- HTTP status-code validation
- Allure request/response evidence
- Request-state cleanup

The method-chaining design keeps test scenarios concise and focused on API behavior.

Detailed framework design:

[`docs/framework-design.md`](docs/framework-design.md)

---

## Test Data

Request payloads are maintained separately in JSON files:

```text
tests/request-objects/
├── POST-article.json
└── PUT-article.json
```

The framework also uses Faker to generate dynamic article data for selected CRUD scenarios.

---

## Allure Reporting

The project integrates **Allure** with Playwright for detailed test reporting.

For API calls executed through the Request Handler, the framework captures:

- API request method
- API request URL
- Request headers
- Request body where applicable
- API response status code
- Response headers
- Response body where available

The request and response evidence is attached to the relevant Allure API step.

Detailed reporting documentation:

[`docs/allure-reporting.md`](docs/allure-reporting.md)

---

## Test Execution

Install dependencies:

```bash
npm install
```

Run the complete test suite:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/smokeTest.spec.ts
```

---

## Allure Report

After test execution, Allure results are generated in:

```text
allure-results/
```

Generate the Allure report:

```bash
npx allure generate allure-results --clean -o allure-report
```

Open the generated report:

```bash
npx allure open allure-report
```

---

## Test Execution Configuration

The framework is configured for controlled API test execution.

```typescript
fullyParallel: false,
workers: 1,
retries: 1
```

The project intentionally uses a single Playwright worker.

Playwright projects organize the test suites as follows:

```text
api-testing
    |
    +-- crudFramework.spec.ts
    |
    +-- dependencies:
            smoke-tests
            negative-tests
```

The `smoke-tests` and `negative-tests` projects run independently, while the `api-testing` project depends on them.

---

## Environment Configuration

The project supports selecting the test environment using the `TEST_ENV` environment variable.

Supported values in the current configuration are:

```text
dev
qa
```

Example:

```bash
set TEST_ENV=qa && npx playwright test
```

The environment configuration is maintained in:

```text
tests/api-test.config.ts
```

---

## CI/CD with Jenkins

The project includes a `Jenkinsfile` for CI/CD execution.

The Jenkins pipeline:

1. Installs project dependencies
2. Accepts a `TEST_ENV` parameter
3. Executes Playwright tests
4. Copies Allure results
5. Publishes Allure results through Jenkins

Pipeline flow:

```text
Checkout Source
      |
      v
Select TEST_ENV
      |
      v
Install Dependencies
      |
      v
Run Playwright Tests
      |
      v
Copy Allure Results
      |
      v
Publish Allure Results
```

---

## Documentation

Detailed technical documentation is available in the `docs` directory.

| Document | Description |
|---|---|
| [`architecture.md`](docs/architecture.md) | Framework architecture and component interactions |
| [`framework-design.md`](docs/framework-design.md) | Request Handler, fixtures, test data, validation, and design decisions |
| [`allure-reporting.md`](docs/allure-reporting.md) | Allure integration and API request/response evidence |
| [`test-strategy.md`](docs/test-strategy.md) | CRUD, smoke, negative testing, validation, and execution strategy |

---

## Future Enhancements

Potential future enhancements include:

- Expanded API schema validation
- Additional API coverage
- Enhanced test-data management
- AI-assisted test generation
- AI-based API failure analysis
- Agentic AI for API test execution and analysis

---

## Skills Demonstrated

- **API Automation**
- **Playwright**
- **TypeScript**
- **Node.js**
- **REST API Testing**
- **CRUD Testing**
- **Smoke Testing**
- **Negative Testing**
- **Integration Testing**
- **Test Framework Design**
- **Playwright Fixtures**
- **API Request Handling**
- **JSON Test Data Management**
- **Dynamic Test Data Generation**
- **Allure Reporting**
- **CI/CD**
- **Jenkins**
- **Git/GitHub**
