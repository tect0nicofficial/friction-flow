/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIResponse } from "../types";

type CodeMetadata = {
  context?: string;
  languageId?: string;
  languageLabel?: string;
  fileName?: string;
  testFileName?: string;
};

const BACKEND_URL =
  typeof window !== "undefined"
    ? window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : ""
    : "http://localhost:3000";

async function callBackendAPI(
  endpoint: string,
  payload: { code: string } & CodeMetadata,
): Promise<unknown> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = (await response.json()) as { error?: string };
      throw new Error(
        `Backend API error: ${error.error || response.statusText}`,
      );
    }

    const data = (await response.json()) as unknown;
    return data;
  } catch (error) {
    console.error(`Backend API call failed (${endpoint}):`, error);
    throw error;
  }
}

export async function analyzeCode(
  code: string,
  options: CodeMetadata = {},
): Promise<AIResponse> {
  try {
    const analysis = await callBackendAPI("/api/analyze", {
      code,
      ...options,
    });

    if (!isAIResponse(analysis)) {
      throw new Error("Invalid response structure from AI");
    }

    return analysis;
  } catch (error) {
    console.error("AI Analysis error:", error);
    throw error;
  }
}

export async function getSolution(
  code: string,
  previousAnalysis: AIResponse,
  options: CodeMetadata = {},
): Promise<string> {
  try {
    const context = `PREVIOUS ANALYSIS:\n${JSON.stringify(previousAnalysis)}`;
    const response = await callBackendAPI("/api/solution", {
      code,
      context,
      ...options,
    });

    if (isRecord(response) && typeof response.solution === "string") {
      return response.solution;
    }

    return "No solution generated.";
  } catch (error) {
    console.error("AI Solution error:", error);
    throw error;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAIResponse(value: unknown): value is AIResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.problem_type === "string" &&
    typeof value.interpretation === "string" &&
    Array.isArray(value.friction_points) &&
    Array.isArray(value.debug_steps) &&
    Array.isArray(value.thinking_hints) &&
    Array.isArray(value.external_insights)
  );
}
