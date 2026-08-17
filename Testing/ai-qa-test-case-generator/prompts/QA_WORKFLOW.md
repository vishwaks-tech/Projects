# AI QA Lifecycle Rules

## Purpose

This project demonstrates an AI-assisted QA lifecycle where AI supports QA activities while human QA remains the final approval authority.

## Core Principle

AI proposes.

Human QA reviews and approves.

Only QA-approved test cases can proceed to automation and execution.

## QA Workflow

1. Retrieve the requirement from Jira.
2. Analyze the requirement using Ollama.
3. Generate test-case proposals.
4. Store the proposed test cases as a structured test-case artifact.
5. Present the test cases for QA review.
6. QA may:
   - Modify an existing test case.
   - Add a new test case.
   - Reject a test case.
   - Approve a test case.
7. Only test cases marked `APPROVED` may proceed to automation.
8. Generate automation only for approved test cases.
9. Execute the approved automation.
10. Generate test execution results and evidence.
11. Create a Jira defect when an execution failure represents a product defect.

## Human Approval Rules

- AI must never approve its own test cases.
- Newly generated test cases must initially have `QA Decision = PENDING`.
- QA approval must be explicit.
- QA modifications must be preserved.
- Rejected test cases must not be automated.
- Pending test cases must not be automated.

## Requirement Traceability

Every test case must reference the Jira requirement from which it was derived.

Example:

`AIQA-1 → TC001`

## Source of Truth

The Jira requirement is the primary source of truth for the current requirement.

AI must not introduce requirements, business rules, API behavior, status codes, response messages, or validation rules that are not supported by the requirement.

## Test Case Generation

Test cases should consider:

- Positive scenarios
- Negative scenarios
- Edge scenarios

Do not generate scenarios merely to increase the number of test cases.

Each proposed test case must have a clear relationship to the requirement.

## Automation Rule

Automation is downstream of QA approval.

The automation process must select only test cases whose QA decision is:

`APPROVED`

The automation process must ignore:

- `PENDING`
- `REJECTED`

## Requirement Changes

When a new requirement version is introduced, existing approved test cases must not be silently overwritten.

The AI must identify:

- Existing scenarios that remain valid.
- Existing scenarios that require modification.
- Existing scenarios that are no longer applicable.
- New scenarios required by the changed requirement.

Human QA approval is required before changed or new scenarios proceed to automation.

## AI Responsibility

Ollama is responsible for:

- Requirement analysis.
- Test scenario generation.
- Change/impact analysis.

Ollama is not responsible for:

- Final QA approval.
- Deciding which tests are executed.
- Declaring a product defect without evidence.

## Engineering Principle

Keep AI reasoning, QA approval, automation, and execution as separate stages.

Do not allow one stage to silently bypass another stage.