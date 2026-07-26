import { db } from "@/lib/db";
import { FileAnalysis } from "@/types/analysis";

/**
 * Read/write boundary for cached analyses. Isolated from analyze-file.service.ts
 * so the caching strategy (currently in-memory, see lib/db.ts) can change
 * without touching orchestration logic.
 */
export async function getCachedAnalysis(repositoryId: string, filePath: string): Promise<FileAnalysis | null> {
  return db.analyses.findOne(repositoryId, filePath);
}

export async function saveAnalysis(analysis: FileAnalysis): Promise<void> {
  await db.analyses.upsert(analysis);
}
