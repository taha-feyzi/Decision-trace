"use client";

import { GitBranch, Star } from "lucide-react";
import { Repository } from "@/types/repository";
import { formatStars } from "@/lib/utils";
import { SearchInput } from "@/components/repository/search-input";
import { RepositoryTree } from "@/components/repository/repository-tree";

interface SidebarProps {
  repository: Repository;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Sidebar({ repository, selectedPath, onSelectFile, searchValue, onSearchChange }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-surface md:w-80">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <GitBranch className="h-4 w-4 text-text-secondary" aria-hidden />
          <span className="truncate">
            {repository.owner}/{repository.name}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
          <Star className="h-3 w-3" aria-hidden />
          {formatStars(repository.stars)}
          {repository.primaryLanguage ? <span>· {repository.primaryLanguage}</span> : null}
        </div>
      </div>

      <div className="border-b border-border p-3">
        <SearchInput value={searchValue} onChange={onSearchChange} />
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <RepositoryTree nodes={repository.tree} selectedPath={selectedPath} onSelectFile={onSelectFile} filter={searchValue} />
      </div>
    </aside>
  );
}
