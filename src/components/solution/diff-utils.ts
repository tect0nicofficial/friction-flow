export type DiffRow = {
  kind: "same" | "added" | "removed";
  oldLineNumber: number | null;
  newLineNumber: number | null;
  oldText: string;
  newText: string;
};

export function buildDiffRows(oldCode: string, newCode: string) {
  const oldLines = oldCode.replace(/\s+$/u, "").split("\n");
  const newLines = newCode.replace(/\s+$/u, "").split("\n");

  if (
    oldLines.length === 1 &&
    oldLines[0] === "" &&
    newLines.length === 1 &&
    newLines[0] === ""
  ) {
    return {
      rows: [],
      additions: 0,
      deletions: 0,
      unchanged: 0,
      oldLineCount: 0,
      newLineCount: 0,
    };
  }

  const matrix = Array.from({ length: oldLines.length + 1 }, () =>
    Array(newLines.length + 1).fill(0),
  );

  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex -= 1) {
      matrix[oldIndex][newIndex] =
        oldLines[oldIndex] === newLines[newIndex]
          ? matrix[oldIndex + 1][newIndex + 1] + 1
          : Math.max(
              matrix[oldIndex + 1][newIndex],
              matrix[oldIndex][newIndex + 1],
            );
    }
  }

  const rows: DiffRow[] = [];
  let oldIndex = 0;
  let newIndex = 0;
  let oldLineNumber = 1;
  let newLineNumber = 1;

  while (oldIndex < oldLines.length && newIndex < newLines.length) {
    if (oldLines[oldIndex] === newLines[newIndex]) {
      rows.push({
        kind: "same",
        oldLineNumber,
        newLineNumber,
        oldText: oldLines[oldIndex],
        newText: newLines[newIndex],
      });
      oldIndex += 1;
      newIndex += 1;
      oldLineNumber += 1;
      newLineNumber += 1;
      continue;
    }
    if (matrix[oldIndex + 1][newIndex] >= matrix[oldIndex][newIndex + 1]) {
      rows.push({
        kind: "removed",
        oldLineNumber,
        newLineNumber: null,
        oldText: oldLines[oldIndex],
        newText: "",
      });
      oldIndex += 1;
      oldLineNumber += 1;
      continue;
    }
    rows.push({
      kind: "added",
      oldLineNumber: null,
      newLineNumber,
      oldText: "",
      newText: newLines[newIndex],
    });
    newIndex += 1;
    newLineNumber += 1;
  }
  while (oldIndex < oldLines.length) {
    rows.push({
      kind: "removed",
      oldLineNumber,
      newLineNumber: null,
      oldText: oldLines[oldIndex],
      newText: "",
    });
    oldIndex += 1;
    oldLineNumber += 1;
  }
  while (newIndex < newLines.length) {
    rows.push({
      kind: "added",
      oldLineNumber: null,
      newLineNumber,
      oldText: "",
      newText: newLines[newIndex],
    });
    newIndex += 1;
    newLineNumber += 1;
  }

  const additions = rows.filter((r) => r.kind === "added").length;
  const deletions = rows.filter((r) => r.kind === "removed").length;
  const unchanged = rows.filter((r) => r.kind === "same").length;

  return {
    rows,
    additions,
    deletions,
    unchanged,
    oldLineCount: oldLines.length,
    newLineCount: newLines.length,
  };
}
