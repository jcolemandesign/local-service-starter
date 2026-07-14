import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  buildCopywritingAgentInstructions,
  buildGlobalCopywritingAgentInstructions,
} from "@/content/copywriting-personality-packets";
import { readStrategyWorkspace } from "@/utils/strategy-workspace";

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
    const [contents, workspace] = await Promise.all([
      readFile(exportPath, "utf8"),
      readStrategyWorkspace(clientSlug),
    ]);
    const exportContents = injectCopywritingPacket(
      contents,
      [
        buildGlobalCopywritingAgentInstructions(),
        buildCopywritingAgentInstructions(workspace.fields),
      ].join("\n\n"),
    );

    return new NextResponse(exportContents, {
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

function injectCopywritingPacket(contents: string, packetInstructions: string) {
  if (
    contents.includes("## Global Copywriting Rules") &&
    contents.includes("## Copywriting Voice Packet")
  ) {
    return contents;
  }

  const businessSnapshotHeading = "\n## 3. Business Snapshot";

  if (contents.includes(businessSnapshotHeading)) {
    return contents.replace(
      businessSnapshotHeading,
      `\n${packetInstructions}\n${businessSnapshotHeading}`,
    );
  }

  return `${contents.trimEnd()}\n\n${packetInstructions}\n`;
}
