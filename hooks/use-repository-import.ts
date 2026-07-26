"use client";

import { useEffect, useState } from "react";
import { Repository } from "@/types/repository";
import { AppError } from "@/types/analysis";

interface UseRepositoryImportResult {
  repository: Repository | null;
  error: AppError | null;
  isLoading: boolean;
}

/**
 * Imports a repository by URL on mount. Dashboard/page.tsx reads the `repo`
 * query param and passes it here so the loading/error/success states stay
 * driven by a single request lifecycle.
 */
export function useRepositoryImport(repoUrl: string | null): UseRepositoryImportResult {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!repoUrl) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: repoUrl })
    })
      .then(async (response) => {
        const data = await response.json();
        if (isCancelled) return;
        if (!response.ok) {
          setError(data as AppError);
        } else {
          setRepository(data as Repository);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setError({ code: "REPOSITORY_NOT_FOUND", title: "Import failed", description: "Check the repository URL and try again." });
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [repoUrl]);

  return { repository, error, isLoading };
}
