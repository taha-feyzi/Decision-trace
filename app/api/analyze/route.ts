import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeFile, AnalyzeFileError } from "@/services/analyze-file.service";
import { Repository } from "@/types/repository";

const bodySchema = z.object({
  repository: z.custom<Repository>((value) => typeof value === "object" && value !== null),
  filePath: z.string().min(1),
  forceRefresh: z.boolean().optional()
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { code: "AI_INVALID_RESPONSE", title: "Invalid request", description: "Provide a repository and file path." },
      { status: 400 }
    );
  }

  try {
    const analysis = await analyzeFile(parsed.data.repository, {
      repositoryId: parsed.data.repository.id,
      filePath: parsed.data.filePath,
      forceRefresh: parsed.data.forceRefresh
    });
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    if (error instanceof AnalyzeFileError) {
      return NextResponse.json(error.appError, { status: 422 });
    }
    console.error("[POST /api/analyze] unexpected error:", error);
    return NextResponse.json(
      { code: "AI_TIMEOUT", title: "Analysis failed", description: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
