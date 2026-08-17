import "dotenv/config";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

type JiraIssue = {
  key: string;
  fields: {
    summary: string;
    description: unknown;
  };
};

const baseUrl = process.env.JIRA_BASE_URL;
const email = process.env.JIRA_EMAIL;
const apiToken = process.env.JIRA_API_TOKEN;

if (!baseUrl || !email || !apiToken) {
  throw new Error("Jira environment variables are missing.");
}

const credentials = Buffer.from(
  `${email}:${apiToken}`
).toString("base64");

export async function getIssue(
  issueKey: string
): Promise<JiraIssue> {
  const response = await fetch(
    `${baseUrl}/rest/api/3/issue/${issueKey}`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      `Jira request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<JiraIssue>;
}

export async function addAttachment(
  issueKey: string,
  filePath: string
): Promise<void> {
  const fileBuffer = await readFile(filePath);
  const fileName = basename(filePath);

  const formData = new FormData();

  formData.append(
    "file",
    new Blob([fileBuffer]),
    fileName
  );

  const response = await fetch(
    `${baseUrl}/rest/api/3/issue/${issueKey}/attachments`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "X-Atlassian-Token": "no-check"
      },
      body: formData
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Jira attachment upload failed: ${response.status} ${response.statusText}\n${errorBody}`
    );
  }

  console.log(
    `Attachment uploaded to Jira ${issueKey}: ${fileName}`
  );
}