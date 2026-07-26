"use client";

import { useMemo } from "react";
import { RepositoryTreeNode } from "@/types/repository";
import { FileNode } from "@/components/repository/file-node";

interface RepositoryTreeProps {
  nodes: RepositoryTreeNode[];
  selectedPath: string | null;
  onSelectFile: (path: string) => void;
  filter: string;
}

function filterTree(nodes: RepositoryTreeNode[], query: string): RepositoryTreeNode[] {
  if (!query.trim()) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes.reduce<RepositoryTreeNode[]>((matches, node) => {
    if (node.type === "file") {
      if (node.name.toLowerCase().includes(lowerQuery)) matches.push(node);
      return matches;
    }

    const filteredChildren = filterTree(node.children ?? [], query);
    if (filteredChildren.length > 0) {
      matches.push({ ...node, children: filteredChildren });
    }
    return matches;
  }, []);
}

export function RepositoryTree({ nodes, selectedPath, onSelectFile, filter }: RepositoryTreeProps) {
  const visibleNodes = useMemo(() => filterTree(nodes, filter), [nodes, filter]);
  const isFiltering = filter.trim().length > 0;

  if (visibleNodes.length === 0) {
    return <p className="px-2 py-4 text-sm text-text-secondary">No files match your search.</p>;
  }

  return (
    <div>
      {visibleNodes.map((node) => (
        <FileNode
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelectFile={onSelectFile}
          expandAll={isFiltering}
        />
      ))}
    </div>
  );
}
