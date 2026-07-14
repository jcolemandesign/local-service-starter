import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientSlug = sanitizeExportSlug(
    searchParams.get("clientSlug") ?? "north-star-hvac",
  );
  const exportPath = path.join(
    process.cwd(),
    "agent-exports",
    `${clientSlug}-page-copy-agent-instructions.md`,
  );

  try {
    const contents = await readFile(exportPath, "utf8");

    return new NextResponse(contents, {
      headers: {
        "Content-Disposition": `attachment; filename="${clientSlug}-page-copy-agent-instructions.txt"`,
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Agent export not found." },
      { status: 404 },
    );
  }
}

function sanitizeExportSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}
