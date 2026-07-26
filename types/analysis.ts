import { Evidence } from "./evidence";

export type StillValidStatus = "Yes" | "Probably Yes" | "Probably No" | "No";

export interface StillValid {
  status: StillValidStatus;
  reason: string;
}

export interface FileAnalysis {
  id: string;
  repositoryId: string;
  filePath: string;
  why: string;
  confidence: number;
  stillValid: StillValid;
  impact: string;
  evidence: Evidence[];
  generatedAt: string;
}

export interface AnalyzeFileInput {
  repositoryId: string;
  filePath: string;
  forceRefresh?: boolean;
}

/**
 * Discriminated union describing every recoverable failure mode surfaced
 * to the UI. Kept separate from unexpected runtime errors, which are never
 * shown to the user directly.
 */
export type AppErrorCode =
  | "REPOSITORY_NOT_FOUND"
  | "REPOSITORY_PRIVATE"
  | "GITHUB_RATE_LIMIT"
  | "AI_TIMEOUT"
  | "AI_INVALID_RESPONSE";

export interface AppError {
  code: AppErrorCode;
  title: string;
  description: string;
}
