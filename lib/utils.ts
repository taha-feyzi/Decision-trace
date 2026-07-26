import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts,
 * so callers can safely override default component styles.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Parses a GitHub repository URL (or "owner/repo" shorthand) into its parts.
 * Returns null when the input does not resemble a GitHub repository.
 */
export function parseGithubUrl(input: string): { owner: string; repo: string } | null {
  const trimmed = input.trim().replace(/\.git$/, "").replace(/\/$/, "");

  const shorthandMatch = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);
  const shorthandOwner = shorthandMatch?.[1];
  const shorthandRepo = shorthandMatch?.[2];
  if (shorthandOwner && shorthandRepo) {
    return { owner: shorthandOwner, repo: shorthandRepo };
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname !== "github.com") return null;
    const [owner, repo] = url.pathname.replace(/^\//, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

export function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return String(stars);
}

export function confidenceLabel(confidence: number): string {
  if (confidence >= 80) return "High confidence";
  if (confidence >= 60) return "Moderate confidence";
  if (confidence >= 40) return "Low confidence";
  return "Insufficient evidence";
}
