/**
 * FrictionFlow Backend Server
 * - Serves the Vite dev app
 * - Provides secure /api/analyze endpoint that calls OpenRouter
 * - Keeps API key server-side only (never exposed to frontend)
 */

// This File only need For Localhost Testing and Development. For Production, /api/index.ts will used by vercel.

import express from "express";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

const API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const MODEL = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
const MODEL_CANDIDATES = Array.from(
  new Set(
    [
      DEFAULT_MODEL,
      MODEL,
      "google/gemma-4-31b-it:free",
      "meta-llama/llama-3.3-70b-instruct:free",
    ].filter(Boolean),
  ),
);
const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_PROMPT_CODE_CHARS = 16000;

if (!API_KEY) {
  console.error("❌ Error: OPENROUTER_API_KEY is not configured in .env.local");
  process.exit(1);
}

const SYSTEM_PROMPT = `You are FrictionFlow, a senior engineer guiding a junior.
Return only valid JSON with these keys:
{
  "problem_type": "string",
  "interpretation": "string",
  "friction_points": ["string"],
  "debug_steps": ["string"],
  "thinking_hints": ["string"],
  "external_insights": ["string"]
}
Explain the likely bug and debugging path, but do not give the solution code.
Do not use markdown or code fences.`;

function buildMetadataBlock({
  languageId,
  languageLabel,
  fileName,
  testFileName,
  context,
}: {
  languageId?: string;
  languageLabel?: string;
  fileName?: string;
  testFileName?: string;
  context?: string;
}) {
  const metadata: string[] = [];

  if (languageLabel || languageId) {
    metadata.push(`Language: ${languageLabel || languageId}`);
  }

  if (fileName) {
    metadata.push(`File: ${fileName}`);
  }

  if (testFileName) {
    metadata.push(`Companion test file: ${testFileName}`);
  }

  if (context) {
    metadata.push(`Context: ${context}`);
  }

  return metadata.length > 0 ? `\n\n${metadata.join("\n")}` : "";
}

function normalizeJsonResponse(content: string) {
  const trimmed = content.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1).trim();
  }

  return trimmed;
}

function preparePromptCode(code: string) {
  if (code.length <= MAX_PROMPT_CODE_CHARS) {
    return {
      code,
      truncationNotice: "",
    };
  }

  const headLength = Math.floor(MAX_PROMPT_CODE_CHARS * 0.7);
  const tailLength = MAX_PROMPT_CODE_CHARS - headLength;

  return {
    code: `${code.slice(0, headLength)}\n\n/* ...truncated to fit provider limits... */\n\n${code.slice(-tailLength)}`,
    truncationNotice:
      "\n\nNote: the source file was truncated to fit provider limits. Focus on the visible excerpt and ask for a smaller selection if needed.",
  };
}

async function readOpenRouterError(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return response.statusText;
  }

  try {
    const parsed = JSON.parse(rawBody);
    return parsed?.error?.message || parsed?.message || response.statusText;
  } catch {
    return rawBody.slice(0, 200) || response.statusText;
  }
}

function shouldFallbackOpenRouterError(status: number, message: string) {
  return (
    status === 404 ||
    status === 429 ||
    status >= 500 ||
    /No endpoints found|Provider returned error|temporarily unavailable/i.test(
      message,
    )
  );
}

async function callOpenRouterCompletion({
  systemPrompt,
  userContent,
  temperature = 0.3,
  maxTokens = 1500,
}: {
  systemPrompt: string;
  userContent: string;
  temperature?: number;
  maxTokens?: number;
}) {
  let lastError: Error | null = null;

  for (const model of MODEL_CANDIDATES) {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": `http://localhost:${PORT}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        lastError = new Error(`Empty response from OpenRouter API (${model})`);
        continue;
      }

      return { content, model };
    }

    const errorMessage = await readOpenRouterError(response);
    const modelError = new Error(
      `OpenRouter API error (${model}): ${errorMessage}`,
    );
    lastError = modelError;

    if (!shouldFallbackOpenRouterError(response.status, errorMessage)) {
      throw modelError;
    }
  }

  throw lastError ?? new Error("OpenRouter API error");
}

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0" });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const {
      code,
      context = "",
      languageId,
      languageLabel,
      fileName,
      testFileName,
    } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const promptCode = preparePromptCode(code);
    const promptContext = `${context}${promptCode.truncationNotice}`;
    const userContent = `Analyze this code${buildMetadataBlock({
      languageId,
      languageLabel,
      fileName,
      testFileName,
      context: promptContext,
    })}\n\n${promptCode.code}`;

    const { content } = await callOpenRouterCompletion({
      systemPrompt: SYSTEM_PROMPT,
      userContent,
      temperature: 0.3,
      maxTokens: 1500,
    });

    let analysisData;
    try {
      analysisData = JSON.parse(normalizeJsonResponse(content));
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      return res.status(500).json({
        error: "AI response was not valid JSON",
        details: content.substring(0, 200),
      });
    }

    res.json(analysisData);
  } catch (error) {
    console.error("Analysis endpoint error:", error);
    res.status(500).json({
      error: "Failed to analyze code",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.post("/api/solution", async (req, res) => {
  try {
    const {
      code,
      context = "",
      languageId,
      languageLabel,
      fileName,
      testFileName,
    } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }

    const promptCode = preparePromptCode(code);
    const promptContext = `${context}${promptCode.truncationNotice}`;

    const solutionPrompt = `Based on the previous analysis, provide the actual solution and corrected code.
Only provide this if explicitly requested after the user has tried thinking through it.
Keep the answer in the same programming language as the input, and match the surrounding file conventions when a language is specified.
  Return a brief explanation followed by one code block containing the full updated file.
  Preserve all unchanged code exactly and make the smallest possible edit.
  Do not return a partial snippet, outline, or unrelated rewrite.`;

    const userContent = `Provide the solution for this code${buildMetadataBlock(
      {
        languageId,
        languageLabel,
        fileName,
        testFileName,
        context: promptContext,
      },
    )}\n\n${promptCode.code}`;

    const { content } = await callOpenRouterCompletion({
      systemPrompt: solutionPrompt,
      userContent,
      temperature: 0.3,
      maxTokens: 2200,
    });

    res.json({ solution: content });
  } catch (error) {
    console.error("Solution endpoint error:", error);
    res.status(500).json({
      error: "Failed to get solution",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

async function setupMiddleware() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
    console.log("✓ Vite dev server middleware enabled");
  } else {
    app.use(express.static(path.join(__dirname, "../dist")));
    console.log("✓ Serving static files from dist/");
  }

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
  });
}

async function start() {
  try {
    await setupMiddleware();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`
🔥 FrictionFlow Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Web App: http://localhost:${PORT}
✓ API: http://localhost:${PORT}/api/analyze
✓ Health: http://localhost:${PORT}/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Model: ${MODEL}
Environment: ${process.env.NODE_ENV || "development"}
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  process.exit(0);
});
