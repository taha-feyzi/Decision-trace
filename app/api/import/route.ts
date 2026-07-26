import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { importRepository, RepositoryImportError } from "@/services/repository-import.service";

const bodySchema = z.object({ url: z.string().min(1) });

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { code: "REPOSITORY_NOT_FOUND", title: "Invalid request", description: "Provide a repository URL." },
      { status: 400 }
    );
  }

  try {
    const repository = await importRepository(parsed.data.url);
    return NextResponse.json(repository, { status: 201 });
  } catch (error) {
    if (error instanceof RepositoryImportError) {
      return NextResponse.json(error.appError, { status: 422 });
    }
    return NextResponse.json(
      { code: "REPOSITORY_NOT_FOUND", title: "Import failed", description: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
