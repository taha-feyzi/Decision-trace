import { NextRequest, NextResponse } from "next/server";

/**
 * Returns cached repository metadata by id ("owner/name"). Repository
 * documents are fetched fresh at import time and stored by the import
 * route; this endpoint is a read-only lookup for the dashboard.
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(
    { code: "REPOSITORY_NOT_FOUND", title: "Repository not found", description: `No cached repository for "${params.id}".` },
    { status: 404 }
  );
}
