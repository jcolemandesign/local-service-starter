import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="border-b border-service-border bg-white px-5 py-4">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="type-label text-service-accent">
              {template.pageType}
            </p>
            <h1 className="type-heading-sm mt-1 text-service-ink">
              {template.name}
            </h1>
          </div>
          <Link
            className="radius-button inline-flex min-h-11 items-center justify-center border border-service-border bg-white px-4 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
            href="/dev/templates"
          >
            Back to templates
          </Link>
        </div>
      </div>
      <PageTemplatePreview
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
