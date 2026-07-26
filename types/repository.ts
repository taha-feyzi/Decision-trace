export interface RepositoryTreeNode {
  path: string;
  name: string;
  type: "file" | "folder";
  children?: RepositoryTreeNode[];
}

export interface Repository {
  id: string;
  owner: string;
  name: string;
  defaultBranch: string;
  description: string | null;
  primaryLanguage: string | null;
  stars: number;
  tree: RepositoryTreeNode[];
  importedAt: string;
}

export interface RepositoryImportInput {
  url: string;
}
