export type ParsedSolution = {
  summary: string;
  code: string;
  hasCodeFence: boolean;
};

export function parseSolutionText(solutionText: string | null): ParsedSolution {
  if (!solutionText) {
    return { summary: "", code: "", hasCodeFence: false };
  }

  const fenceMatch = solutionText.match(
    /```(?:[a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/,
  );

  if (!fenceMatch || fenceMatch.index == null) {
    return {
      summary: "",
      code: solutionText.trimEnd(),
      hasCodeFence: false,
    };
  }

  const code = fenceMatch[1].trimEnd();
  const summary = [
    solutionText.slice(0, fenceMatch.index).trim(),
    solutionText.slice(fenceMatch.index + fenceMatch[0].length).trim(),
  ]
    .filter(Boolean)
    .join("\n\n");

  return { summary, code, hasCodeFence: true };
}
