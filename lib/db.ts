/**
 * Minimal database access point. Swap this file's internals for your ORM
 * of choice (Prisma, Drizzle, Kysely) — every other module only depends on
 * the functions exported from services/analysis-cache.service.ts, not on
 * this file directly.
 *
 * Expected schema (Postgres):
 *
 *   repositories(id text primary key, owner text, name text, default_branch text,
 *                description text, primary_language text, stars integer, tree jsonb,
 *                imported_at timestamptz)
 *
 *   files(id text primary key, repository_id text references repositories(id),
 *         path text, updated_at timestamptz)
 *
 *   analyses(id text primary key, repository_id text, file_path text, why text,
 *            confidence integer, still_valid jsonb, impact text, generated_at timestamptz)
 *
 *   evidence(id serial primary key, analysis_id text references analyses(id),
 *            type text, title text, url text)
 */

import { FileAnalysis } from "@/types/analysis";

const analysisStore = new Map<string, FileAnalysis>();

function cacheKey(repositoryId: string, filePath: string): string {
  return `${repositoryId}:${filePath}`;
}

/** In-memory placeholder for the `analyses` + `evidence` tables above. */
export const db = {
  analyses: {
    async findOne(repositoryId: string, filePath: string): Promise<FileAnalysis | null> {
      return analysisStore.get(cacheKey(repositoryId, filePath)) ?? null;
    },
    async upsert(analysis: FileAnalysis): Promise<void> {
      analysisStore.set(cacheKey(analysis.repositoryId, analysis.filePath), analysis);
    }
  }
};
