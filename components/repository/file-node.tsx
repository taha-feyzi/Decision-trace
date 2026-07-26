"use client";

import { useState } from "react";
import { ChevronRight, Folder, File } from "lucide-react";
import { RepositoryTreeNode } from "@/types/repository";
import { cn } from "@/lib/utils";

interface FileNodeProps {
  node: RepositoryTreeNode;
  depth: number;
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  expandAll: boolean;
}

export function FileNode({ node, depth, selectedPath, onSelectFile, expandAll }: FileNodeProps) {
  const [isOpen, setIsOpen] = useState(expandAll);
  const isFolder = node.type === "folder";
  const isSelected = node.path === selectedPath;

  if (isFolder) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-left text-sm text-text-secondary hover:bg-border/40 hover:text-white"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-90")} aria-hidden />
          <Folder className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && node.children ? (
          <div>
            {node.children.map((child) => (
              <FileNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
                expandAll={expandAll}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelectFile(node.path)}
      aria-current={isSelected}
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm px-2 py-1 text-left text-sm hover:bg-border/40 hover:text-white",
        isSelected ? "bg-primary/10 text-primary" : "text-text-secondary"
      )}
      style={{ paddingLeft: `${depth * 14 + 26}px` }}
    >
      <File className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
