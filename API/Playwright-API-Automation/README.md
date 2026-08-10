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
- Jenkins CI/CD execution

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
| **Jenkins** | CI/CD execution |
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