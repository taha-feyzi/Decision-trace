"use client";

import { useState } from "react";
import { Repository } from "@/types/repository";
import { Sidebar } from "@/components/layout/sidebar";
import { AnalysisPanel } from "@/components/analysis/analysis-panel";
import { EmptyState } from "@/components/analysis/empty-state";
import { ErrorCard } from "@/components/analysis/error-card";
import { LoadingSteps } from "@/components/analysis/loading-steps";
import { useFileAnalysis } from "@/hooks/use-file-analysis";

export function DashboardShell({ repository }: { repository: Repository }) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const { analysis, error, isLoading, analyzeFile } = useFileAnalysis(repository);

  function handleSelectFile(path: string) {
    setSelectedPath(path);
    void analyzeFile(path);
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Sidebar
        repository={repository}
        selectedPath={selectedPath}
        onSelectFile={handleSelectFile}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {!selectedPath ? (
          <EmptyState />
        ) : isLoading ? (
          <div className="mx-auto max-w-sm pt-16">
            <LoadingSteps />
          </div>
        ) : error ? (
          <ErrorCard error={error} />
        ) : analysis ? (
          <AnalysisPanel analysis={analysis} />
        ) : null}
      </main>
    </div>
  );
}
