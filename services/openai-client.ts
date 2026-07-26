import OpenAI from "openai";
import { ANALYSIS_SYSTEM_PROMPT } from "@/prompts/analysis-prompt";

let client: OpenAI | null = null;

/**
 * Uses Groq's free, OpenAI-compatible API by default (https://groq.com).
 * Set AI_API_KEY (and optionally AI_BASE_URL / AI_MODEL) to point this at
 * OpenAI or any other OpenAI-compatible provider instead — no other code
 * needs to change.
 */
function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.AI_API_KEY ?? process.env.GROQ_API_KEY ?? process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("AI_API_KEY (or GROQ_API_KEY / OPENAI_API_KEY) is not configured");
    }
    client = new OpenAI({
      apiKey,
      baseURL: process.env.AI_BASE_URL ?? "https://api.groq.com/openai/v1"
    });
  }
  return client;
}

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export interface RawAnalysisResponse {
  why: string;
  confidence: number;
  stillValid: { status: string; reason: string };
  impact: string;
  evidence: { type: string; title: string; url?: string }[];
}

/**
 * Sends the built context to the model and returns the parsed JSON payload.
 * Runs server-side only — never import this module from a Client Component.
 */
export async function generateAnalysis(userPrompt: string): Promise<RawAnalysisResponse> {
  const response = await getClient().chat.completions.create({
    model: process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ]
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new Error("Empty response from AI model");
  }

  return JSON.parse(content) as RawAnalysisResponse;
}
