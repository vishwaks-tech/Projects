import ExcelJS from "exceljs";

export type TestCase = {
  testCaseId: string;
  requirementReference: string;
  scenarioType: string;
  testScenario: string;
  preconditions: string[];
  testData?: unknown;
  testSteps: string[];
  requestMethod?: string;
  endpoint?: string;
  requestPayload?: unknown;
  expectedStatus?: number;
  expectedResponse?: unknown;
  qaDecision: string;
  testSuite: string;
  operations?: Operation[];
};

export type Operation = {
  step: number;
  requestMethod: string;
  endpoint: string;
  requestPayload: unknown;
  expectedStatus: number;
  expectedResponse: unknown;
};

export type GeneratedTestCases = {
  requirementReference: string;
  testCases: TestCase[];
};

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

export async function generateXlsx(
  result: GeneratedTestCases,
  xlsxFilePath: string
): Promise<void> {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "AI QA Test Case Generator";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Test Cases");

  /*
   * Hidden sheet containing dropdown values.
   *
   * Keeping these values in cells allows Excel to treat
   * SMOKE,REGRESSION as one dropdown option.
   */
  const listsWorksheet = workbook.addWorksheet("Lists");

  listsWorksheet.getColumn(1).values = [
    "QA Decision",
    "PENDING",
    "APPROVED",
    "REJECTED"
  ];

  listsWorksheet.getColumn(2).values = [
    "Test Suite",
    "PENDING",
    "SMOKE",
    "REGRESSION",
    "SMOKE,REGRESSION"
  ];

  listsWorksheet.getColumn(3).values = [
    "Automation Status",
    "NOT GENERATED",
    "GENERATED"
  ];

  listsWorksheet.state = "hidden";

  const headers = [
    "Test Case ID",
    "Requirement Reference",
    "Scenario Type",
    "Test Scenario",
    "Preconditions",
    "Test Data",
    "Test Steps",
    "Step",
    "Request Method",
    "Endpoint",
    "Request Payload",
    "Expected Status",
    "Expected Response",
    "QA Decision",
    "Test Suite",
    "Automation Status"
  ];

  worksheet.addRow(headers);

  /*
   * Header formatting.
   */
  const headerRow = worksheet.getRow(1);

  headerRow.font = {
    bold: true
  };

  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true
  };

  headerRow.height = 30;

  /*
   * Freeze header row.
   */
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1
    }
  ];

  /*
   * Enable filtering.
   */
  worksheet.autoFilter = {
    from: {
      row: 1,
      column: 1
    },
    to: {
      row: 1,
      column: headers.length
    }
  };

  /*
   * Column widths.
   */
  const columnWidths = [
    15,
    20,
    16,
    45,
    40,
    45,
    55,
    10,
    16,
    40,
    50,
    18,
    50,
    18,
    22,
    22
  ];

  worksheet.columns.forEach((column, index) => {
    const width = columnWidths[index];

    if (width !== undefined) {
      column.width = width;
    }
  });

  /*
   * Add test cases.
   *
   * Multi-operation test cases:
   * one Excel row per operation.
   */
  for (const testCase of result.testCases) {
    if (testCase.operations && testCase.operations.length > 0) {
      for (const operation of testCase.operations) {
        const row = worksheet.addRow([
          testCase.testCaseId,
          testCase.requirementReference,
          testCase.scenarioType,
          testCase.testScenario,
          formatCellValue(testCase.preconditions),
          formatCellValue(testCase.testData),
          formatCellValue(testCase.testSteps),
          operation.step,
          operation.requestMethod,
          operation.endpoint,
          formatCellValue(operation.requestPayload),
          operation.expectedStatus,
          formatCellValue(operation.expectedResponse),
          testCase.qaDecision || "PENDING",
          testCase.testSuite || "PENDING",
          "NOT GENERATED"
        ]);

        formatDataRow(row);
      }

      continue;
    }

    /*
     * Single-operation test case.
     */
    const row = worksheet.addRow([
      testCase.testCaseId,
      testCase.requirementReference,
      testCase.scenarioType,
      testCase.testScenario,
      formatCellValue(testCase.preconditions),
      formatCellValue(testCase.testData),
      formatCellValue(testCase.testSteps),
      1,
      testCase.requestMethod ?? "",
      testCase.endpoint ?? "",
      formatCellValue(testCase.requestPayload),
      testCase.expectedStatus ?? "",
      formatCellValue(testCase.expectedResponse),
      testCase.qaDecision || "PENDING",
      testCase.testSuite || "PENDING",
      "NOT GENERATED"
    ]);

    formatDataRow(row);
  }

  /*
   * Add dropdown validation to every data row.
   */
  const firstDataRow = 2;
  const lastDataRow = worksheet.rowCount;

  if (lastDataRow >= firstDataRow) {
    for (
      let rowNumber = firstDataRow;
      rowNumber <= lastDataRow;
      rowNumber++
    ) {
      /*
       * QA Decision
       *
       * Lists!A2:A4
       */
      worksheet.getCell(rowNumber, 14).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ["Lists!$A$2:$A$4"]
      };

      /*
       * Test Suite
       *
       * Lists!B2:B5
       */
      worksheet.getCell(rowNumber, 15).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ["Lists!$B$2:$B$5"]
      };

      /*
       * Automation Status
       *
       * Lists!C2:C3
       */
      worksheet.getCell(rowNumber, 16).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: ["Lists!$C$2:$C$3"]
      };
    }
  }

  /*
   * Format all data rows.
   */
  for (
    let rowNumber = 2;
    rowNumber <= worksheet.rowCount;
    rowNumber++
  ) {
    const row = worksheet.getRow(rowNumber);

    row.alignment = {
      vertical: "top",
      wrapText: true
    };

    row.height = 60;
  }

  /*
   * Save workbook.
   */
  await workbook.xlsx.writeFile(xlsxFilePath);
}

function formatDataRow(row: ExcelJS.Row): void {
  row.alignment = {
    vertical: "top",
    wrapText: true
  };

  row.eachCell((cell) => {
    cell.alignment = {
      vertical: "top",
      wrapText: true
    };
  });
}