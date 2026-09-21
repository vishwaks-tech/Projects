import { getIssue, addAttachment } from "./jira/jira-client.js";
import { adfToText, type AdfNode } from "./jira/adf-to-text.js";
import { generateTestCases } from "./ai/test-case-generator.js";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import {  generateXlsx,  type GeneratedTestCases} from "./xlsx/xlsx-generator.js";

const requirementReference = process.argv[2];

if (!requirementReference) {
  throw new Error(
    "Please provide a Jira issue key. Example: node dist/test-case-generator-test.js AIQA-1"
  );
}

console.log(`Fetching requirement: ${requirementReference}`);

const issue = await getIssue(requirementReference);

const requirement = adfToText(
  issue.fields.description as AdfNode
);

console.log("Requirement retrieved from Jira:", issue.key);
console.log("Summary:", issue.fields.summary);

/*
 * Requirement-specific test-case directory.
 *
 * Example:
 * features/AIQA-1/testcases
 */
const testCasesDir =
  `features/${requirementReference}/testcases`;

await mkdir(testCasesDir, { recursive: true });

const now = new Date();

const timestamp =
  `${now.getFullYear()}_` +
  `${String(now.getMonth() + 1).padStart(2, "0")}_` +
  `${String(now.getDate()).padStart(2, "0")}_` +
  `${String(now.getHours()).padStart(2, "0")}_` +
  `${String(now.getMinutes()).padStart(2, "0")}_` +
  `${String(now.getSeconds()).padStart(2, "0")}`;

console.log("\nSending requirement to Ollama...\n");

const result = await generateTestCases(
  requirement,
  requirementReference
);

console.log("\n===== VALIDATING AI GENERATED TEST CASES =====\n");

let parsedResult: unknown;

try {
  parsedResult = JSON.parse(result);
} catch (error) {
  console.error("AI response is not valid JSON.");
  console.error("Raw AI response:");
  console.error(result);

  throw new Error(
    `Failed to parse AI-generated test cases as JSON: ${
      error instanceof Error ? error.message : String(error)
    }`
  );
}

console.log("AI response is valid JSON.");

/*
 * Save JSON
 */
const jsonFileName =
  `${requirementReference}-test-cases_${timestamp}.json`;

const jsonFilePath =
  `${testCasesDir}/${jsonFileName}`;

await writeFile(
  jsonFilePath,
  JSON.stringify(parsedResult, null, 2),
  "utf-8"
);

console.log(`JSON artifact saved: ${jsonFilePath}`);

// Xlsx file generation
const xlsxFileName =
  `${requirementReference}-test-cases_${timestamp}.xlsx`;

const xlsxFilePath =
  `${testCasesDir}/${xlsxFileName}`;

await generateXlsx(
  parsedResult as GeneratedTestCases,
  xlsxFilePath
);

console.log(`XLSX artifact saved: ${xlsxFilePath}`);

/*
 * Find the latest generation timestamp.
 *
 * We search ONLY inside:
 *
 * features/<requirementReference>/testcases
 *
 * This prevents artifacts from other Jira requirements
 * from being considered.
 */
const files = await readdir(testCasesDir);

const matchingFiles = files.filter(
  (file) =>
    file.startsWith(`${requirementReference}-test-cases_`)
);

/*
 * Extract timestamps from filenames.
 *
 * Example:
 *
 * AIQA-1-test-cases_2026_08_14_17_05_12.json
 *
 * becomes:
 *
 * 2026_08_14_17_05_12
 */
const generationTimestamps = matchingFiles
  .map((file) => {
    const match = file.match(
      new RegExp(
        `^${requirementReference}-test-cases_(\\d{4}_\\d{2}_\\d{2}_\\d{2}_\\d{2}_\\d{2})\\.(json|xlsx)$`
      )
    );

    return match ? match[1] : null;
  })
  .filter(
    (timestamp): timestamp is string =>
      timestamp !== null
  );

if (generationTimestamps.length === 0) {
  throw new Error(
    `No test-case artifacts found for ${requirementReference} in ${testCasesDir}.`
  );
}

generationTimestamps.sort();

const latestTimestamp =
  generationTimestamps[generationTimestamps.length - 1];

/*
 * Select artifacts belonging to the SAME generation.
 */
const latestJsonFile =
  `${requirementReference}-test-cases_${latestTimestamp}.json`;

const latestXlsxFile =
  `${requirementReference}-test-cases_${latestTimestamp}.xlsx`;

const latestJsonPath =
  `${testCasesDir}/${latestJsonFile}`;

const latestXlsxPath =
  `${testCasesDir}/${latestXlsxFile}`;


console.log("\n===== LATEST TEST-CASE ARTIFACTS =====");
console.log(`Generation: ${latestTimestamp}`);
console.log(`JSON: ${latestJsonPath}`);
console.log(`XLSX:  ${latestXlsxPath}`);

/*
 * Upload the latest JSON and CSV from the same generation
 * to the same Jira requirement.
 */
console.log(
  `\nUploading latest artifacts to Jira ${requirementReference}...\n`
);

await addAttachment(
  requirementReference,
  latestJsonPath
);

await addAttachment(
  requirementReference,
  latestXlsxPath
);

console.log(
  `\nBoth artifacts uploaded successfully to Jira ${requirementReference}.`
);

console.log("\n===== AI GENERATED TEST CASES =====\n");
console.log(
  JSON.stringify(parsedResult, null, 2)
);

