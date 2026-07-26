import { NextRequest, NextResponse } from "next/server";
import { getCachedAnalysis } from "@/services/analysis-cache.service";

/**
 * Returns a cached analysis by composite id ("repositoryId:filePath").
 * Used by the dashboard to re-hydrate a previously generated analysis
 * without calling the AI model again.
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const [repositoryId, filePath] = params.id.split(":");
  if (!repositoryId || !filePath) {
    return NextResponse.json(
      { code: "AI_INVALID_RESPONSE", title: "Invalid analysis id", description: "Expected format: repositoryId:filePath." },
      { status: 400 }
    );
  }

  const analysis = await getCachedAnalysis(repositoryId, filePath);
  if (!analysis) {
    return NextResponse.json(
      { code: "AI_INVALID_RESPONSE", title: "Analysis not found", description: "Select the file again to generate a new analysis." },
      { status: 404 }
    );
  }

  return NextResponse.json(analysis, { status: 200 });
}
