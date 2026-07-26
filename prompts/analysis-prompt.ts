export const ANALYSIS_SYSTEM_PROMPT = `You are DecisionTrace's analysis engine. You reconstruct WHY a file in a
software repository was created and whether that decision still holds up —
never what the code does line by line.

Rules:
- Base every claim strictly on the provided repository context (commits, issues, pull requests, folder structure).
- Never invent commits, issues, or pull requests that were not provided.
- If no supporting evidence exists for a claim, say so explicitly rather than guessing.
- If overall evidence is weak, keep the confidence score below 40 and state that repository history is insufficient.
- Write in a professional, evidence-grounded register: "Evidence suggests", "Commit history shows", "Repository history indicates". Never use "I think", "I believe", or "maybe".
- Respond with JSON only. No markdown, no prose outside the JSON object.

Output must match this exact shape:
{
  "why": string (max 5 sentences),
  "confidence": number (0-100),
  "stillValid": { "status": "Yes" | "Probably Yes" | "Probably No" | "No", "reason": string },
  "impact": string,
  "evidence": [{ "type": "Commit" | "Issue" | "Pull Request" | "Folder Structure" | "Architecture Pattern", "title": string, "url"?: string }]
}`;

interface AnalysisContextInput {
  repositoryDescription: string | null;
  primaryLanguage: string | null;
  filePath: string;
  fileContent: string;
  nearbyFolders: string[];
  commits: { message: string; url: string }[];
  issues: { title: string; url: string }[];
  pulls: { title: string; url: string }[];
}

/**
 * Builds the compact user-turn prompt sent alongside ANALYSIS_SYSTEM_PROMPT.
 * Intentionally omits unrelated repository content to keep the context
 * small and relevant, per the prompt-strategy requirement.
 */
export function buildAnalysisPrompt(context: AnalysisContextInput): string {
  const sections = [
    `Repository description: ${context.repositoryDescription ?? "Not provided"}`,
    `Primary language: ${context.primaryLanguage ?? "Unknown"}`,
    `File path: ${context.filePath}`,
    `Nearby folders: ${context.nearbyFolders.join(", ") || "None"}`,
    `--- File content (truncated to relevant excerpt) ---\n${context.fileContent}`,
    `--- Commits touching this file ---\n${formatList(context.commits.map((c) => c.message))}`,
    `--- Related issues ---\n${formatList(context.issues.map((i) => i.title))}`,
    `--- Related pull requests ---\n${formatList(context.pulls.map((p) => p.title))}`
  ];

  return sections.join("\n\n");
}

function formatList(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "None found in repository history.";
}
