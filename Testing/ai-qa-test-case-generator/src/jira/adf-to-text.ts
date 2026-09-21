export type AdfNode = {
  type?: string;
  text?: string;
  content?: AdfNode[];
};

function extractInlineText(node: AdfNode): string {
  if (node.type === "text") {
    return node.text ?? "";
  }

  return (node.content ?? [])
    .map(extractInlineText)
    .join("");
}

function extractTableRow(row: AdfNode): string {
  const cells = (row.content ?? []).map((cell) => {
    return extractInlineText(cell).trim();
  });

  return cells.join(" | ");
}

export function adfToText(node: AdfNode): string {
  if (!node) {
    return "";
  }

  if (node.type === "text") {
    return node.text ?? "";
  }

  if (node.type === "tableRow") {
    return extractTableRow(node) + "\n";
  }

  if (node.type === "table") {
    return (node.content ?? [])
      .map((row) => extractTableRow(row))
      .join("\n") + "\n";
  }

  if (node.type === "codeBlock") {
    const code = (node.content ?? [])
      .map(extractInlineText)
      .join("");

    return code + "\n";
  }

  if (node.type === "paragraph" || node.type === "heading") {
    const text = (node.content ?? [])
      .map(extractInlineText)
      .join("");

    return text + "\n";
  }

  return (node.content ?? [])
    .map(adfToText)
    .join("");
}