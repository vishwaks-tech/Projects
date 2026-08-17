# AI QA Test Case Generator

AI-assisted QA test case generation using **Jira, TypeScript, Ollama Cloud, structured QA prompts, JSON, and ExcelJS**.

## Project Overview

This project retrieves a Jira requirement, converts the Jira description into usable requirement text, combines it with controlled QA instructions, sends the information to an Ollama Cloud model, validates the generated test cases as structured JSON, and produces an Excel workbook for human QA review.

### Phase 1 lifecycle

```text
Jira Requirement
       |
       v
Jira REST API
       |
       v
Requirement Extraction
       |
       v
QA Workflow + Test Case Prompts
       |
       v
Ollama Cloud
       |
       v
Structured JSON Test Cases
       |
       v
Validation
       |
       v
XLSX Test Case Workbook
       |
       v
Human QA Review
       |
       v
Jira
```

The current Phase 1 scope ends at **AI-assisted test case generation and QA review**. Test automation and agentic AI are future phases.

## What This Project Does

The application accepts a Jira issue key, retrieves the requirement, extracts the requirement text, and asks an AI model to generate structured QA test cases.

The generated test cases are:

1. Validated as JSON.
2. Written to an Excel workbook.
3. Prepared for human QA review.
4. Associated with the corresponding Jira requirement.

## Architecture

```text
                    +----------------+
                    |      Jira      |
                    |   Requirement  |
                    +-------+--------+
                            |
                            v
                    +---------------+
                    | Jira Client   |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | ADF -> Text   |
                    | Requirement   |
                    +-------+-------+
                            |
                            v
              +---------------------------+
              | QA_WORKFLOW.md            |
              | test-case-generation.md   |
              +-------------+-------------+
                            |
                            v
                    +---------------+
                    | Ollama Cloud  |
                    | AI Model      |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | JSON Test     |
                    | Cases         |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | Validation    |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | ExcelJS       |
                    | XLSX Output   |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    | Human QA      |
                    | Review        |
                    +---------------+
```

## End-to-End Workflow

### 1. Retrieve the Jira Requirement

The application accepts a Jira issue key as a command-line argument.

```cmd
node dist/test-case-generator-test.js AIQA-1
```

### 2. Extract the Requirement

Jira Cloud descriptions use Atlassian Document Format (ADF). The project converts the ADF structure into readable requirement text.

```text
Jira ADF
   |
   v
adfToText()
   |
   v
Readable Requirement
   |
   v
Ollama Cloud
```

### 3. Load QA Instructions

The application uses Markdown files as runtime AI instruction assets:

```text
prompts/
├── QA_WORKFLOW.md
└── test-case-generation.md
```

These files define QA workflow rules, test-case fields, scenario rules, validation expectations, and output requirements.

### 4. Generate Test Cases

The application combines the QA workflow rules, test case generation rules, and Jira requirement text and sends the complete prompt to Ollama Cloud.

The AI is instructed to return structured JSON.

### 5. Validate the AI Response

The generated response is validated before an Excel workbook is created.

The validation expectations include:

- Unique Test Case IDs
- Correct Jira requirement reference
- Valid scenario type
- Requirement-defined HTTP methods
- Requirement-defined endpoints
- Requirement-defined expected status codes
- Requirement-defined expected responses
- Required test case fields
- `QA Decision = PENDING`
- No invented external information
- Valid JSON output

### 6. Generate the XLSX Workbook

Validated test cases are written to an Excel workbook using **ExcelJS**.

The workbook contains fields including:

- Test Case ID
- Requirement Reference
- Scenario Type
- Test Scenario
- Preconditions
- Test Data
- Test Steps
- Step
- Request Method
- Endpoint
- Request Payload
- Expected Status
- Expected Response
- QA Decision
- Test Suite
- Automation Status

### 7. Human QA Review

Every AI-generated test case starts with:

```text
QA Decision = PENDING
```

Human QA can:

- Approve a test case
- Reject a test case
- Modify a test case
- Add a new test case
- Change test data
- Add additional test steps

The AI does not make the final QA approval decision.

### 8. Jira Upload

The generated artifacts are associated with the corresponding Jira requirement. The upload logic uses the requirement-specific generated artifacts.

## Project Structure

```text
ai-qa-test-case-generator/
|
├── prompts/
│   ├── QA_WORKFLOW.md
│   └── test-case-generation.md
|
├── src/
│   ├── ai/
│   │   ├── ollama-client.ts
│   │   └── test-case-generator.ts
│   |
│   ├── jira/
│   │   ├── adf-to-text.ts
│   │   └── jira-client.ts
│   |
│   ├── xlsx/
│   │   └── xlsx-generator.ts
│   |
│   └── test-case-generator-test.ts
|
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Ollama CLI
- Ollama Cloud access
- Jira Cloud access
- Jira API credentials

Check your installed versions:

```cmd
node --version
npm --version
```

## Installation

When cloning this repository, install all dependencies with:

```cmd
npm install
```

The dependencies are already defined in `package.json` and `package-lock.json`.

### Key packages

| Package | Purpose |
|---|---|
| `typescript` | TypeScript compilation |
| `@types/node` | Node.js type definitions |
| `dotenv` | Environment variable configuration |
| `exceljs` | Excel workbook generation |

If setting up the project manually from scratch:

```cmd
npm install --save-dev typescript
npm install --save-dev @types/node
npm install dotenv
npm install exceljs
```

When using the repository, **`npm install` is sufficient**.

## Ollama Cloud

The project uses **Ollama Cloud** rather than storing a large language model locally.

This is intentional. The earlier local-model approach required significant local storage and resources, so the current project uses a cloud model instead.

### Current model

```text
gpt-oss:20b-cloud
```

### Authenticate with Ollama

```cmd
ollama signin
```

Verify that the cloud model is accessible:

```cmd
ollama run gpt-oss:20b-cloud
```

The project does **not** require a large local model to be downloaded.

## Environment Configuration

Create a local `.env` file based on `.env.example`.

Example:

```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
```

Never commit the real `.env` file to Git.

## Jira Configuration

The application requires Jira API access to retrieve requirements and upload generated artifacts.

The Jira workflow is:

```text
Jira Issue
    |
    v
Jira REST API
    |
    v
Issue Description
    |
    v
ADF
    |
    v
ADF -> Text
    |
    v
Requirement Text
```

The Jira issue key is supplied at runtime.

Example:

```cmd
node dist/test-case-generator-test.js AIQA-1
```

## AI Prompt Architecture

The project uses Markdown files as a controlled AI instruction layer.

### `QA_WORKFLOW.md`

Defines the overall QA behavior and workflow rules.

### `test-case-generation.md`

Defines the structure and detailed rules for generating test cases.

Conceptually:

```text
QA Workflow
      +
Test Case Generation Rules
      +
Jira Requirement
      |
      v
Complete AI Prompt
      |
      v
Ollama Cloud
```

This separation makes AI behavior easier to maintain without embedding the entire QA instruction set directly inside TypeScript code.

## Test Case Model

Each generated test case contains information such as:

```text
Test Case ID
Requirement Reference
Scenario Type
Test Scenario
Preconditions
Test Data
Test Steps
Request Method
Endpoint
Request Payload
Expected Status
Expected Response
QA Decision
```

### Scenario Types

The defined scenario categories are:

```text
Positive
Negative
Edge
```

The model should only generate scenarios supported by the requirement and QA rules.

## Multi-Operation Test Cases

A test case may contain multiple dependent API operations.

Example:

```text
TC001

Step 1:
POST /customers

Step 2:
Capture the generated customer ID

Step 3:
DELETE /customers/{id}
```

The Excel output represents each operation as a separate row while retaining the same Test Case ID.

This preserves the relationship between multiple operations belonging to one logical test case.

## QA Review Workflow

AI-generated test cases are proposals.

Every generated test case starts with:

```text
QA Decision = PENDING
```

Human QA can then set:

```text
APPROVED
```

or:

```text
REJECTED
```

The AI is never responsible for setting the final approval decision.

## Test Suite Classification

The Excel workbook supports test-suite classification:

```text
PENDING
SMOKE
REGRESSION
SMOKE,REGRESSION
```

This allows QA to classify test cases without relying on a separate automation-selection spreadsheet.

## Automation Status

The workbook includes:

```text
Automation Status
```

AI-generated cases initially use:

```text
NOT GENERATED
```

Automation is intentionally outside the current Phase 1 implementation.

## Build

Compile the TypeScript project:

```cmd
npm run build
```

## Run the Test Case Generator

After building:

```cmd
node dist/test-case-generator-test.js AIQA-1
```

Replace `AIQA-1` with the Jira requirement you want to process.

Example:

```cmd
node dist/test-case-generator-test.js AIQA-2
```

The requirement key is supplied at runtime rather than hard-coded into the application.

## End-to-End Execution

```text
1. Provide Jira Requirement Key
             |
             v
2. Retrieve Requirement from Jira
             |
             v
3. Convert Jira ADF to Text
             |
             v
4. Load QA Markdown Prompts
             |
             v
5. Send Requirement + QA Rules to Ollama Cloud
             |
             v
6. Receive Structured JSON
             |
             v
7. Validate Generated Test Cases
             |
             v
8. Generate XLSX Workbook
             |
             v
9. QA Reviews Test Cases
             |
             v
10. Upload Generated Artifacts to Jira
```

## Example

For:

```text
AIQA-1
```

the application can generate test cases such as:

```text
TC001 - Create Customer
Scenario Type: Positive
QA Decision: PENDING

TC002 - Delete Customer
Scenario Type: Positive
QA Decision: PENDING

TC003 - Update Customer
Scenario Type: Negative
QA Decision: PENDING
```

The actual scenarios, endpoints, status codes, payloads, and expected responses must come from the Jira requirement and defined QA rules.

## Important Design Decisions

### Jira is the Requirement Source

Requirements are retrieved directly from Jira rather than manually copied into the generator.

### Markdown is the AI Instruction Layer

QA behavior is maintained in Markdown prompt files rather than being embedded entirely in application code.

### Ollama Cloud is Used for AI Inference

The project does not depend on storing a large language model locally.

### JSON is the AI/Application Contract

The AI is instructed to return structured JSON so that the application can validate the output before generating Excel.

### Excel is the QA Review Artifact

The generated workbook is intended for human QA review and classification.

### Human QA Owns Approval

AI-generated test cases remain `PENDING` until reviewed by a human.

### Automation Is Downstream

The project does not automatically turn every AI-generated test case into an automated test. Only approved cases are candidates for future automation.

## Current Scope

The current Phase 1 scope is:

```text
Jira Requirement
       |
       v
AI Test Case Generation
       |
       v
Structured Test Cases
       |
       v
XLSX QA Review
       |
       v
Jira Artifact Upload
```

The current project does **not** implement:

- Agentic AI
- AI QA agent
- Multi-agent architecture
- Playwright MCP
- Automated test execution
- Environment selection through an agent
- Email orchestration
- AI-driven failure analysis

These are potential future phases.

## Troubleshooting

### TypeScript compilation error

```cmd
npm install
npm run build
```

Review any TypeScript errors reported by the compiler.

### Jira authentication problems

Check:

```env
JIRA_BASE_URL=
JIRA_EMAIL=
JIRA_API_TOKEN=
```

Make sure the Jira API token is valid and has the required permissions.

### Ollama authentication

```cmd
ollama signin
ollama run gpt-oss:20b-cloud
```

### Invalid AI JSON

The generator expects structured JSON from the AI model.

If the response cannot be parsed or does not satisfy the expected structure, the generation process should be treated as unsuccessful rather than blindly generating a QA artifact.

## Security

Never commit:

```text
.env
```

Never place the following in source control:

- Jira API tokens
- Jira passwords
- Ollama credentials
- Other secrets

Use:

```text
.env.example
```

to document required configuration without exposing real values.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Application development |
| Node.js | Runtime |
| Jira REST API | Requirement retrieval and artifact upload |
| Atlassian Document Format (ADF) | Jira description format |
| Ollama Cloud | AI inference |
| gpt-oss:20b-cloud | Current AI model |
| Markdown | QA instruction / prompt layer |
| JSON | AI-to-application data contract |
| ExcelJS | XLSX generation |
| dotenv | Environment configuration |
| npm | Dependency management |
| Git | Version control |

## Phase 1 Goal

The goal of Phase 1 is to establish a reliable foundation for an AI-assisted QA lifecycle:

```text
Jira Requirement
       |
       v
AI Test Generation
       |
       v
Structured Test Cases
       |
       v
Human QA Review
       |
       v
Approved Test Cases
       |
       v
Future Automation
```

The project deliberately separates **AI generation**, **human QA decision-making**, and **future automation**.

This creates a foundation that can later be extended into an agentic AI QA workflow without requiring the Phase 1 test-case generation capability to be redesigned.
