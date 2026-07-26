"use client";

import { useSearchParams } from "next/navigation";
import { useRepositoryImport } from "@/hooks/use-repository-import";
import { LoadingSteps } from "@/components/analysis/loading-steps";
import { ErrorCard } from "@/components/analysis/error-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const repoUrl = searchParams.get("repo");
  const { repository, error, isLoading } = useRepositoryImport(repoUrl);

  if (!repoUrl) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <ErrorCard
          error={{
            code: "REPOSITORY_NOT_FOUND",
            title: "No repository selected",
            description: "Go back and paste a GitHub repository URL to get started."
          }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <LoadingSteps />
        </div>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <ErrorCard
          error={
            error ?? {
              code: "REPOSITORY_NOT_FOUND",
              title: "Repository not found",
              description: "Check the repository URL and try again."
            }
          }
        />
      </div>
    );
  }

  return <DashboardShell repository={repository} />;
}
