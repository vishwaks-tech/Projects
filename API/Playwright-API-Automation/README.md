# Playwright API Automation Framework

A TypeScript-based API automation framework built with **Playwright Test** for validating REST APIs through reusable CRUD, smoke, and negative test scenarios.

The framework is designed with a reusable API Request Handler, Playwright fixtures, JSON-based test data, controlled test execution, and **Allure reporting with API request and response evidence**.

---

## Project Overview

This project demonstrates the design and implementation of a maintainable API automation framework using **Playwright APIRequestContext** and **TypeScript**.

The framework separates test scenarios from common API communication and test setup, allowing API tests to remain focused on business validation while reusable framework components handle request execution and reporting.

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
- Faker-based test data generation
- Single-worker API test execution
- Playwright project dependencies
- Allure reporting
- API request and response evidence in Allure
- Playwright HTML reporting
- Jenkins CI/CD integration

---

## Technology Stack

| Technology | Purpose |
|---|---|
| **TypeScript** | Programming language |
| **Node.js** | Runtime environment |
| **Playwright Test** | API automation and test execution |
| **Playwright APIRequestContext** | HTTP API communication |
| **Allure** | Test reporting |
| **Faker** | Dynamic test data generation |
| **Jenkins** | CI/CD integration |
| **GitHub** | Source code management |

---

## Framework Architecture

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

## Project Structure

```text
Playwright-API-Automation/
│
├── tests/
│   ├── crudFramework.spec.ts
│   ├── smoke-tests.spec.ts
│   └── negative-tests.spec.ts
│
├── utilities/
│   ├── request-handler.ts
│   ├── fixtures.ts
│   └── ...
│
├── test-data/
│   └── ...
│
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

The framework separates test scenarios, reusable API request handling, test fixtures, test data, configuration, and reporting.

---

## Test Coverage

### CRUD Testing

The framework validates API resource operations including:

- Create
- Retrieve
- Update
- Delete

CRUD scenarios validate expected HTTP status codes and API responses.

### Smoke Testing

Smoke tests validate critical API functionality and provide quick feedback on the basic health of the API.

### Negative Testing

Negative tests validate how the API responds to invalid or unexpected inputs and expected error conditions.

---

## API Request Handler

The framework uses a centralized **API Request Handler** to provide reusable API communication.

The Request Handler supports:

- URL configuration
- API paths
- Query parameters
- Request headers
- Request bodies
- GET requests
- POST requests
- PUT requests
- DELETE requests
- HTTP status-code validation

The method-chaining design keeps individual test scenarios concise and focused on the API behavior being validated.

Detailed framework design is documented in:

[`docs/framework-design.md`](docs/framework-design.md)

---

## Allure Reporting

The project integrates **Allure** with Playwright for detailed test reporting.

The report provides visibility into:

- Test execution status
- Test steps
- Test duration
- Failures
- Attachments
- API request information
- API response information

A key feature of this implementation is the capture of **API request and response evidence alongside the relevant API test execution**.

Detailed Allure implementation is documented in:

[`docs/allure-reporting.md`](docs/allure-reporting.md)

---

## Test Execution

Install project dependencies:

```bash
npm install
```

Run the complete test suite:

```bash
npx playwright test
```

Run a specific test file:

```bash
npx playwright test tests/smoke-tests.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
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

The Allure report provides test execution details together with the API request and response evidence captured during execution.

---

## Test Execution Configuration

The framework is configured for controlled API test execution.

Key settings include:

```typescript
fullyParallel: false
workers: 1
```

The project intentionally uses a **single Playwright worker** to provide predictable API test execution.

Playwright projects are also used to organize test categories and their execution dependencies.

---

## CI/CD

The framework supports **Jenkins-based CI/CD execution**.

A typical execution flow is:

```text
Checkout Source
      ↓
Install Dependencies
      ↓
Execute Playwright Tests
      ↓
Generate Test Results
      ↓
Generate Allure Report
      ↓
Publish / Review Results
```

---

## Documentation

Detailed technical documentation is available in the `docs` directory.

| Document | Description |
|---|---|
| [`architecture.md`](docs/architecture.md) | Framework architecture and component interactions |
| [`framework-design.md`](docs/framework-design.md) | Framework design decisions and reusable components |
| [`allure-reporting.md`](docs/allure-reporting.md) | Allure integration and API request/response evidence |
| [`test-strategy.md`](docs/test-strategy.md) | Test coverage and testing approach |

---

## Future Enhancements

Potential future enhancements include:

- Environment-specific configuration
- Expanded API schema validation
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
- **Test Data Management**
- **Allure Reporting**
- **CI/CD**
- **Jenkins**
- **Git/GitHub**
