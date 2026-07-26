import { fetchCommitsForFile, fetchFileContent, fetchRecentIssuesAndPulls } from "@/services/github-client";
import { Repository, RepositoryTreeNode } from "@/types/repository";
import { buildAnalysisPrompt } from "@/prompts/analysis-prompt";

const MAX_FILE_CHARS = 6000;

/**
 * Gathers everything the AI needs to reconstruct engineering intent for a
 * single file: content, nearby structure, and related history. Keeps the
 * OpenAI context compact instead of dumping the whole repository.
 */
export async function buildAnalysisContext(repository: Repository, filePath: string): Promise<string> {
  const [fileContent, commits, { issues, pulls }] = await Promise.all([
    fetchFileContent(repository.owner, repository.name, filePath, repository.defaultBranch),
    fetchCommitsForFile(repository.owner, repository.name, filePath),
    fetchRecentIssuesAndPulls(repository.owner, repository.name)
  ]);

  return buildAnalysisPrompt({
    repositoryDescription: repository.description,
    primaryLanguage: repository.primaryLanguage,
    filePath,
    fileContent: fileContent.slice(0, MAX_FILE_CHARS),
    nearbyFolders: findNearbyFolders(repository.tree, filePath),
    commits: commits.map((c) => ({ message: c.commit.message, url: c.html_url })),
    issues: issues.slice(0, 5).map((i) => ({ title: i.title, url: i.html_url })),
    pulls: pulls.slice(0, 5).map((p) => ({ title: p.title, url: p.html_url }))
  });
}

function findNearbyFolders(tree: RepositoryTreeNode[], filePath: string): string[] {
  const parentPath = filePath.split("/").slice(0, -1).join("/");
  const parent = findNode(tree, parentPath);
  if (!parent?.children) return [];
  return parent.children.filter((node) => node.type === "folder").map((node) => node.name);
}

function findNode(nodes: RepositoryTreeNode[], path: string): RepositoryTreeNode | undefined {
  if (!path) return { path: "", name: "", type: "folder", children: nodes };
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}
