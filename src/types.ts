/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AIResponse {
  problem_type: string;
  interpretation: string;
  friction_points: string[];
  debug_steps: string[];
  thinking_hints: string[];
  external_insights: string[];
  solution?: string;
}

export type LanguageId =
  | "javascript"
  | "javascriptreact"
  | "typescript"
  | "typescriptreact"
  | "python"
  | "html"
  | "css"
  | "json"
  | "markdown"
  | "go"
  | "java"
  | "ruby";

export type FileKind = "source" | "test";

export type SidebarView = "explorer" | "search" | "analysis" | "settings";

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  extension: string;
  languageId: LanguageId;
  languageLabel: string;
  kind: FileKind;
  sourceFileId?: string;
  pairedFileId?: string;
  code: string;
  analysis: AIResponse | null;
  isAnalyzing: boolean;
  isSolutionLoading: boolean;
  isSolutionUnlocked: boolean;
  hasTriedSolution: boolean;
  solutionText: string | null;
  error: string | null;
}

export interface FrictionFlowState {
  currentAnalysis: AIResponse | null;
  isAnalyzing: boolean;
  isSolutionUnlocked: boolean;
  hasTriedSolution: boolean;
  error: string | null;
}
