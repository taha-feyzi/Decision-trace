"use client";

import { useCallback, useState } from "react";
import { Repository } from "@/types/repository";
import { FileAnalysis, AppError } from "@/types/analysis";

interface UseFileAnalysisResult {
  analysis: FileAnalysis | null;
  error: AppError | null;
  isLoading: boolean;
  analyzeFile: (filePath: string) => Promise<void>;
}

/**
 * Drives the analysis lifecycle for the currently selected file. Kept
 * separate from repository import so selecting a new file never re-fetches
 * repository metadata.
 */
export function useFileAnalysis(repository: Repository | null): UseFileAnalysisResult {
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeFile = useCallback(
    async (filePath: string) => {
      if (!repository) return;
      setIsLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repository, filePath })
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data as AppError);
        } else {
          setAnalysis(data as FileAnalysis);
        }
      } catch {
        setError({ code: "AI_TIMEOUT", title: "Analysis failed", description: "Something went wrong. Try again." });
      } finally {
        setIsLoading(false);
      }
    },
    [repository]
  );

  return { analysis, error, isLoading, analyzeFile };
}
