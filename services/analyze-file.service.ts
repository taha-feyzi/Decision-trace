import { z } from "zod";
import { buildAnalysisContext } from "@/services/context-builder.service";
import { generateAnalysis } from "@/services/openai-client";
import { getCachedAnalysis, saveAnalysis } from "@/services/analysis-cache.service";
import { Repository } from "@/types/repository";
import { AnalyzeFileInput, AppError, FileAnalysis } from "@/types/analysis";
import { CONFIDENCE_LOW_THRESHOLD } from "@/lib/constants";

import { GithubApiError } from "@/services/github-client";

export class AnalyzeFileError extends Error {
  constructor(public readonly appError: AppError) {
    super(appError.title);
  }
}

const analysisSchema = z.object({
  why: z.string().min(1),
  confidence: z.number().min(0).max(100),
  stillValid: z.object({
    status: z.enum(["Yes", "Probably Yes", "Probably No", "No"]),
    reason: z.string().min(1)
  }),
  impact: z.string().min(1),
  evidence: z.array(
    z.object({
      type: z.enum(["Commit", "Issue", "Pull Request", "Folder Structure", "Architecture Pattern"]),
      title: z.string().min(1),
      url: z.string().url().optional()
    })
  )
});

/**
 * Orchestrates a single file analysis: reuse cache unless a refresh was
 * requested, otherwise build context, call the model, validate the shape,
 * and persist the result. This is the only entry point UI code should call.
 */
export async function analyzeFile(repository: Repository, input: AnalyzeFileInput): Promise<FileAnalysis> {
  if (!input.forceRefresh) {
    const cached = await getCachedAnalysis(repository.id, input.filePath);
    if (cached) return cached;
  }

  let context: string;
  try {
    context = await buildAnalysisContext(repository, input.filePath);
  } catch (error) {
    console.error("[analyzeFile] buildAnalysisContext failed:", error);
    if (error instanceof GithubApiError && error.status === 403) {
      throw new AnalyzeFileError({
        code: "GITHUB_RATE_LIMIT",
        title: "GitHub rate limit reached",
        description: "Try again in a few minutes, or add a GITHUB_TOKEN to raise the limit."
      });
    }
    throw new AnalyzeFileError({
      code: "AI_INVALID_RESPONSE",
      title: "Could not read repository data",
      description: "This file's history could not be retrieved. Try again."
    });
  }

  let raw;
  try {
    raw = await generateAnalysis(context);
  } catch (error) {
    console.error("[analyzeFile] generateAnalysis failed:", error);
    throw new AnalyzeFileError({
      code: "AI_TIMEOUT",
      title: "Analysis timed out",
      description: "The AI model took too long to respond. Try again."
    });
  }

  const parsed = analysisSchema.safeParse(raw);
  if (!parsed.success) {
    console.error("[analyzeFile] AI response failed validation:", parsed.error.flatten(), "raw:", raw);
    throw new AnalyzeFileError({
      code: "AI_INVALID_RESPONSE",
      title: "Analysis failed",
      description: "The AI response could not be validated. Try again."
    });
  }

  const data = parsed.data;
  const analysis: FileAnalysis = {
    id: `${repository.id}:${input.filePath}`,
    repositoryId: repository.id,
    filePath: input.filePath,
    why: data.confidence < CONFIDENCE_LOW_THRESHOLD
      ? "There is not enough repository history to support a reliable conclusion."
      : data.why,
    confidence: data.confidence,
    stillValid: data.stillValid,
    impact: data.impact,
    evidence: data.evidence.length > 0 ? data.evidence : [{ type: "Architecture Pattern", title: "No supporting repository evidence found." }],
    generatedAt: new Date().toISOString()
  };

  await saveAnalysis(analysis);
  return analysis;
}
