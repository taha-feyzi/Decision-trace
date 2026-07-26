import { GITHUB_API_BASE } from "@/lib/constants";
import { RepositoryTreeNode } from "@/types/repository";

/**
 * Thin wrapper around the GitHub REST API. Every method throws a typed
 * error that repository-import.service.ts and analyze-file.service.ts
 * translate into AppError responses — this module never shapes UI errors.
 */

export class GithubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "GithubApiError";
  }
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, { headers: authHeaders() });

  if (response.status === 404) {
    throw new GithubApiError("Repository not found", 404);
  }
  if (response.status === 403) {
    throw new GithubApiError("GitHub API rate limit exceeded", 403);
  }
  if (!response.ok) {
    throw new GithubApiError(`GitHub API request failed (${response.status})`, response.status);
  }

  return response.json() as Promise<T>;
}

interface GithubRepoResponse {
  name: string;
  owner: { login: string };
  default_branch: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  private: boolean;
}

export async function fetchRepository(owner: string, repo: string): Promise<GithubRepoResponse> {
  const data = await githubFetch<GithubRepoResponse>(`/repos/${owner}/${repo}`);
  if (data.private) {
    throw new GithubApiError("Repository is private", 403);
  }
  return data;
}

interface GithubTreeItem {
  path: string;
  type: "blob" | "tree";
}

interface GithubTreeResponse {
  tree: GithubTreeItem[];
  truncated: boolean;
}

export async function fetchRepositoryTree(owner: string, repo: string, branch: string): Promise<RepositoryTreeNode[]> {
  const data = await githubFetch<GithubTreeResponse>(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  return buildTree(data.tree);
}

function buildTree(items: GithubTreeItem[]): RepositoryTreeNode[] {
  const root: RepositoryTreeNode[] = [];
  const folderIndex = new Map<string, RepositoryTreeNode>();

  const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));

  for (const item of sorted) {
    const segments = item.path.split("/");
    const name = segments[segments.length - 1] ?? item.path;
    const parentPath = segments.slice(0, -1).join("/");
    const node: RepositoryTreeNode = {
      path: item.path,
      name,
      type: item.type === "tree" ? "folder" : "file",
      ...(item.type === "tree" ? { children: [] } : {})
    };

    if (item.type === "tree") {
      folderIndex.set(item.path, node);
    }

    const parent = parentPath ? folderIndex.get(parentPath) : undefined;
    if (parent?.children) {
      parent.children.push(node);
    } else {
      root.push(node);
    }
  }

  return root;
}

export async function fetchFileContent(owner: string, repo: string, path: string, ref: string): Promise<string> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`, {
    headers: authHeaders()
  });

  if (!response.ok) {
    throw new GithubApiError(`Unable to read file: ${path}`, response.status);
  }

  const data = (await response.json()) as { content: string; encoding: string };
  return Buffer.from(data.content, data.encoding as BufferEncoding).toString("utf-8");
}

interface GithubCommit {
  sha: string;
  commit: { message: string; author: { name: string; date: string } | null };
  html_url: string;
}

export async function fetchCommitsForFile(owner: string, repo: string, path: string): Promise<GithubCommit[]> {
  const data = await githubFetch<GithubCommit[]>(`/repos/${owner}/${repo}/commits?path=${encodeURIComponent(path)}&per_page=10`);
  return data;
}

interface GithubIssue {
  number: number;
  title: string;
  html_url: string;
  pull_request?: unknown;
}

export async function fetchRecentIssuesAndPulls(owner: string, repo: string): Promise<{ issues: GithubIssue[]; pulls: GithubIssue[] }> {
  const data = await githubFetch<GithubIssue[]>(`/repos/${owner}/${repo}/issues?state=all&per_page=20`);
  return {
    issues: data.filter((item) => !item.pull_request),
    pulls: data.filter((item) => item.pull_request)
  };
}
