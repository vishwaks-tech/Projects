import { readFile } from "node:fs/promises";
import { generateWithOllama } from "./ollama-client.js";

export async function generateTestCases(
  requirement: string,
  requirementReference: string
): Promise<string> {
  const workflowRules = await readFile(
    "prompts/QA_WORKFLOW.md",
    "utf-8"
  );

  const generationPrompt = await readFile(
    "prompts/test-case-generation.md",
    "utf-8"
  );

  const prompt = `
${workflowRules}

${generationPrompt}

## Requirement Reference

${requirementReference}

## Requirement

${requirement}

Generate the test case proposals now.
`;

  return generateWithOllama(prompt);
}