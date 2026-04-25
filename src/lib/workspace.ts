import { LanguageId, FileKind, WorkspaceFile } from "../types";

export interface LanguageDefinition {
  id: LanguageId;
  label: string;
  badge: string;
  extension: string;
  starterCode: string;
  testFileName: (sourceName: string) => string;
  testTemplate: (sourceName: string) => string;
}

const languageRegistry: Record<LanguageId, LanguageDefinition> = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    badge: "JS",
    extension: "js",
    starterCode: `function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

// Try editing the code and running analysis again.
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.js`;
    },
    testTemplate: (
      sourceName,
    ) => `describe("${stripExtension(sourceName)}", () => {
  it("should cover the main behavior", () => {
    expect(true).toBe(true);
  });
});
`,
  },
  javascriptreact: {
    id: "javascriptreact",
    label: "JavaScript React",
    badge: "JSX",
    extension: "jsx",
    starterCode: `export default function App() {
  return <main>Frictions first, fixes second.</main>;
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.jsx`;
    },
    testTemplate: (
      sourceName,
    ) => `describe("${stripExtension(sourceName)} component", () => {
  it("renders without crashing", () => {
    expect(true).toBe(true);
  });
});
`,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    badge: "TS",
    extension: "ts",
    starterCode: `type Item = { price: number };

export function calculateTotal(items: Item[]) {
  return items.reduce((total, item) => total + item.price, 0);
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.ts`;
    },
    testTemplate: (
      sourceName,
    ) => `describe("${stripExtension(sourceName)}", () => {
  it("keeps the TypeScript contract in place", () => {
    expect(true).toBe(true);
  });
});
`,
  },
  typescriptreact: {
    id: "typescriptreact",
    label: "TypeScript React",
    badge: "TSX",
    extension: "tsx",
    starterCode: `type Props = {
  title: string;
};

export function WorkspaceTitle({ title }: Props) {
  return <h1>{title}</h1>;
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.tsx`;
    },
    testTemplate: (
      sourceName,
    ) => `describe("${stripExtension(sourceName)} component", () => {
  it("renders its TSX contract", () => {
    expect(true).toBe(true);
  });
});
`,
  },
  python: {
    id: "python",
    label: "Python",
    badge: "PY",
    extension: "py",
    starterCode: `def calculate_total(items):
    return sum(item["price"] for item in items)
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `test_${stem}.py`;
    },
    testTemplate: (
      sourceName,
    ) => `def test_${sanitizeIdentifier(stripExtension(sourceName))}_smoke():
    assert True
`,
  },
  html: {
    id: "html",
    label: "HTML",
    badge: "HTML",
    extension: "html",
    starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>FrictionFlow</title>
  </head>
  <body>
    <main>Hello from HTML.</main>
  </body>
</html>
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.html`;
    },
    testTemplate: (
      sourceName,
    ) => `<!-- Companion test template for ${sourceName} -->
<!-- Add DOM assertions or snapshot checks here. -->
`,
  },
  css: {
    id: "css",
    label: "CSS",
    badge: "CSS",
    extension: "css",
    starterCode: `:root {
  color-scheme: dark;
}

body {
  margin: 0;
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.css`;
    },
    testTemplate: (
      sourceName,
    ) => `/* Companion test template for ${sourceName} */
/* Add visual regression or style assertions here. */
`,
  },
  json: {
    id: "json",
    label: "JSON",
    badge: "JSON",
    extension: "json",
    starterCode: `{
  "name": "frictionflow",
  "type": "module"
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.json`;
    },
    testTemplate: (sourceName) => `{
  "comment": "Companion test template for ${sourceName}"
}
`,
  },
  markdown: {
    id: "markdown",
    label: "Markdown",
    badge: "MD",
    extension: "md",
    starterCode: `# FrictionFlow

Write the debugging narrative here.
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}.test.md`;
    },
    testTemplate: (
      sourceName,
    ) => `<!-- Companion test template for ${sourceName} -->
<!-- Add doc checks or content assertions here. -->
`,
  },
  go: {
    id: "go",
    label: "Go",
    badge: "GO",
    extension: "go",
    starterCode: `package main

func calculateTotal(items []int) int {
  total := 0
  for _, item := range items {
    total += item
  }
  return total
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}_test.go`;
    },
    testTemplate: (sourceName) => `package main

import "testing"

func Test${toPascalCase(stripExtension(sourceName))}(t *testing.T) {
  t.Helper()
  if false {
    t.Fatal("placeholder")
  }
}
`,
  },
  java: {
    id: "java",
    label: "Java",
    badge: "JAVA",
    extension: "java",
    starterCode: `public class App {
  public static void main(String[] args) {
    System.out.println("Hello, FrictionFlow");
  }
}
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}Test.java`;
    },
    testTemplate: (sourceName) => `import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class ${toPascalCase(stripExtension(sourceName))}Test {
  @Test
  void placeholder() {
    assertTrue(true);
  }
}
`,
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    badge: "RB",
    extension: "rb",
    starterCode: `def calculate_total(items)
  items.sum { |item| item[:price] }
end
`,
    testFileName: (sourceName) => {
      const stem = stripExtension(sourceName);
      return `${stem}_test.rb`;
    },
    testTemplate: (sourceName) => `require "minitest/autorun"

class ${toPascalCase(stripExtension(sourceName))}Test < Minitest::Test
  def test_placeholder
    assert true
  end
end
`,
  },
};

function stripExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot <= 0) {
    return fileName;
  }

  return fileName.slice(0, lastDot);
}

function sanitizeIdentifier(value: string) {
  const sanitized = value.replace(/[^a-zA-Z0-9_]+/g, "_");
  return /^[A-Za-z_]/.test(sanitized) ? sanitized : `_${sanitized}`;
}

function toPascalCase(value: string) {
  return sanitizeIdentifier(value)
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export const supportedLanguages = Object.values(languageRegistry);

export function getLanguageDefinition(languageId: LanguageId) {
  return languageRegistry[languageId] ?? languageRegistry.javascript;
}

export function getDefaultSourceStem(languageId: LanguageId) {
  switch (languageId) {
    case "javascriptreact":
    case "typescriptreact":
    case "java":
      return "App";
    case "html":
      return "index";
    case "css":
      return "styles";
    case "json":
      return "data";
    case "markdown":
      return "notes";
    case "go":
      return "main";
    default:
      return "app";
  }
}

export function buildUniqueFileName(
  existingNames: string[],
  proposedName: string,
) {
  if (!existingNames.includes(proposedName)) {
    return proposedName;
  }

  const dotIndex = proposedName.lastIndexOf(".");
  const baseName =
    dotIndex > 0 ? proposedName.slice(0, dotIndex) : proposedName;
  const extension = dotIndex > 0 ? proposedName.slice(dotIndex) : "";

  for (let suffix = 1; suffix < Number.MAX_SAFE_INTEGER; suffix += 1) {
    const candidate = `${baseName}-${suffix}${extension}`;
    if (!existingNames.includes(candidate)) {
      return candidate;
    }
  }

  throw new Error("Unable to build a unique file name.");
}

export function inferLanguageId(fileName: string): LanguageId {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascriptreact";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescriptreact";
    case "py":
      return "python";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "go":
      return "go";
    case "java":
      return "java";
    case "rb":
      return "ruby";
    default:
      return "javascript";
  }
}

function buildPath(kind: FileKind, name: string) {
  return kind === "test" ? `tests/${name}` : `src/${name}`;
}

export function createWorkspaceFile(input: {
  id: string;
  name: string;
  kind: FileKind;
  languageId: LanguageId;
  code: string;
  sourceFileId?: string;
  pairedFileId?: string;
}): WorkspaceFile {
  const definition = getLanguageDefinition(input.languageId);

  return {
    id: input.id,
    name: input.name,
    path: buildPath(input.kind, input.name),
    extension: definition.extension,
    languageId: definition.id,
    languageLabel: definition.label,
    kind: input.kind,
    sourceFileId: input.sourceFileId,
    pairedFileId: input.pairedFileId,
    code: input.code,
    analysis: null,
    isAnalyzing: false,
    isSolutionLoading: false,
    isSolutionUnlocked: false,
    hasTriedSolution: false,
    solutionText: null,
    error: null,
  };
}

export function createCompanionTestFile(sourceFile: WorkspaceFile, id: string) {
  const definition = getLanguageDefinition(sourceFile.languageId);
  const testName = definition.testFileName(sourceFile.name);

  return createWorkspaceFile({
    id,
    name: testName,
    kind: "test",
    languageId: sourceFile.languageId,
    code: definition.testTemplate(sourceFile.name),
    sourceFileId: sourceFile.id,
    pairedFileId: sourceFile.id,
  });
}

export function createSourceFile(input: {
  id: string;
  name: string;
  languageId: LanguageId;
  code?: string;
  pairedFileId?: string;
}) {
  const definition = getLanguageDefinition(input.languageId);

  return createWorkspaceFile({
    id: input.id,
    name: input.name,
    kind: "source",
    languageId: input.languageId,
    code: input.code ?? definition.starterCode,
    pairedFileId: input.pairedFileId,
  });
}

export function createPairedDocuments(input: {
  sourceId: string;
  testId: string;
  name: string;
  languageId: LanguageId;
  code?: string;
}) {
  const source = createSourceFile({
    id: input.sourceId,
    name: input.name,
    languageId: input.languageId,
    code: input.code,
    pairedFileId: input.testId,
  });

  const test = createCompanionTestFile(source, input.testId);

  return { source, test };
}

export function createWorkspaceFilePair(input: {
  sourceId: string;
  testId: string;
  languageId: LanguageId;
  existingNames: string[];
  code?: string;
}) {
  const definition = getLanguageDefinition(input.languageId);
  const sourceFileName = buildUniqueFileName(
    input.existingNames,
    `${getDefaultSourceStem(input.languageId)}.${definition.extension}`,
  );
  const source = createSourceFile({
    id: input.sourceId,
    name: sourceFileName,
    languageId: input.languageId,
    code: input.code,
    pairedFileId: input.testId,
  });
  const test = createCompanionTestFile(source, input.testId);
  const uniqueTestName = buildUniqueFileName(
    [...input.existingNames, source.name],
    test.name,
  );

  if (uniqueTestName !== test.name) {
    test.name = uniqueTestName;
    test.path = `tests/${uniqueTestName}`;
  }

  return { source, test };
}

export type WorkspaceSeed = {
  sourceId: string;
  testId: string;
  name: string;
  languageId: LanguageId;
  code?: string;
};

export function createInitialWorkspace(seeds: WorkspaceSeed[]) {
  const files: WorkspaceFile[] = [];
  const openTabIds: string[] = [];

  for (const seed of seeds) {
    const { source, test } = createPairedDocuments(seed);
    files.push(source, test);
    openTabIds.push(source.id);
  }

  return {
    files,
    openTabIds,
    activeTabId: openTabIds[0] ?? "",
  };
}
