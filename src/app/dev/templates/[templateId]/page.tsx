import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PageTemplatePreview } from "@/components/sections/PageTemplatePreview";
import type { PageTemplateSummary } from "@/components/sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Template Preview | Local Service Starter",
  description: "Preview a saved page template.",
};

type TemplatePreviewPageProps = {
  params: Promise<{
    templateId: string;
  }>;
};

type PageTemplatesFile = {
  templates?: PageTemplateSummary[];
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);

export default async function TemplatePreviewPage({
  params,
}: TemplatePreviewPageProps) {
  const { templateId } = await params;
  const templates = await readPageTemplates();
  const template = templates.find((item) => item.id === templateId);

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-service-surface text-service-ink">
      <PageTemplatePreview
        fixedNavigation
        sections={template.sections.map((section) => ({
          ...section,
          instruction: section.instruction ?? "",
        }))}
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
