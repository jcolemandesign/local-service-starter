import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  TemplateLibrarySection,
  type PageTemplateSummary,
} from "@/components/sections";
import { listLatestStrategySnapshotSummaries } from "@/utils/strategy-snapshots";

export const metadata: Metadata = {
  title: "Template Library",
  description: "Reusable page layouts promoted from Pagebuilder options.",
};

export const dynamic = "force-dynamic";

type PageTemplatesFile = {
  templates?: PageTemplateSummary[];
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);

export default async function TemplatesPage() {
  const templates = await readPageTemplates();
  const strategySnapshots = await listLatestStrategySnapshotSummaries();

  return (
    <main>
      <TemplateLibrarySection
        strategySnapshots={strategySnapshots}
        templates={templates}
      />
    </main>
  );
}

async function readPageTemplates() {
  try {
    const contents = await readFile(pageTemplatesPath, "utf8");
    const parsed = JSON.parse(contents) as PageTemplatesFile;

    return Array.isArray(parsed.templates) ? parsed.templates : [];
  } catch {
    return [];
  }
}
