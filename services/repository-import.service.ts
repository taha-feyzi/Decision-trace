import { fetchRepository, fetchRepositoryTree, GithubApiError } from "@/services/github-client";
import { Repository } from "@/types/repository";
import { AppError } from "@/types/analysis";
import { parseGithubUrl } from "@/lib/utils";

export class RepositoryImportError extends Error {
  constructor(public readonly appError: AppError) {
    super(appError.title);
  }
}

/**
 * Imports a public GitHub repository: validates the URL, fetches repo
 * metadata and the full file tree, and returns a Repository ready to
 * persist. Never touches the database directly — callers decide caching.
 */
export async function importRepository(url: string): Promise<Repository> {
  const parsed = parseGithubUrl(url);
  if (!parsed) {
    throw new RepositoryImportError({
      code: "REPOSITORY_NOT_FOUND",
      title: "Invalid repository URL",
      description: "Check the repository URL and try again."
    });
  }

  try {
    const repo = await fetchRepository(parsed.owner, parsed.repo);
    const tree = await fetchRepositoryTree(parsed.owner, repo.name, repo.default_branch);

    return {
      id: `${parsed.owner}/${repo.name}`,
      owner: parsed.owner,
      name: repo.name,
      defaultBranch: repo.default_branch,
      description: repo.description,
      primaryLanguage: repo.language,
      stars: repo.stargazers_count,
      tree,
      importedAt: new Date().toISOString()
    };
  } catch (error) {
    throw toAppError(error);
  }
}

function toAppError(error: unknown): RepositoryImportError {
  if (error instanceof GithubApiError) {
    if (error.status === 404) {
      return new RepositoryImportError({
        code: "REPOSITORY_NOT_FOUND",
        title: "Repository not found",
        description: "Check the repository URL and try again."
      });
    }
    if (error.message === "Repository is private") {
      return new RepositoryImportError({
        code: "REPOSITORY_PRIVATE",
        title: "Private repository",
        description: "DecisionTrace only analyzes public repositories."
      });
    }
    if (error.status === 403) {
      return new RepositoryImportError({
        code: "GITHUB_RATE_LIMIT",
        title: "GitHub rate limit reached",
        description: "Try again in a few minutes."
      });
    }
  }

  return new RepositoryImportError({
    code: "REPOSITORY_NOT_FOUND",
    title: "Import failed",
    description: "Check the repository URL and try again."
  });
}
