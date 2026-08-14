import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PageTemplatePreview } from "@/components/sections/PageTemplatePreview";
import { readPromotedPalette } from "@/utils/promoted-palette";
import { readSiteIdentity } from "@/utils/site-identity";
import {
  listProjectWorkspaces,
  sanitizeClientSlug,
} from "@/utils/strategy-workspace";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import type { PageTemplateSummary } from "@/components/sections";

export const dynamic = "force-dynamic";

const templatePreviewDescription =
  "Preview a saved page template's layout and section order. Shows placeholder copy only — real content is populated once a page is staged.";

type TemplatePreviewPageProps = {
  params: Promise<{
    templateId: string;
  }>;
  searchParams: Promise<{ client?: string | string[] }>;
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

export async function generateMetadata({
  params,
}: TemplatePreviewPageProps): Promise<Metadata> {
  const { templateId } = await params;
  const templates = await readPageTemplates();
  const template = templates.find((item) => item.id === templateId);

  return {
    title: template ? `${template.name} - Template Preview` : "Template Preview",
    description: templatePreviewDescription,
  };
}

export default async function TemplatePreviewPage({
  params,
  searchParams,
}: TemplatePreviewPageProps) {
  const { templateId } = await params;
  const templates = await readPageTemplates();
  const template = templates.find((item) => item.id === templateId);

  if (!template) {
    notFound();
  }

  // Without an identity the nav falls back to its demo wordmark, so this route
  // showed the placeholder LOGO while pagebuilder showed the real one. Resolved
  // exactly as `/dev/pagebuilder` resolves it, and for the same reason recorded
  // there: a template is reached from the builder navigation with no project
  // query string, and an empty slug silently produces an empty identity. A
  // template is not client-scoped, so the most recently edited workspace is the
  // same default the project index presents first.
  const client = (await searchParams).client;
  const requestedClientSlug = sanitizeClientSlug(
    Array.isArray(client) ? client[0] : client ?? "",
  );
  const clientSlug =
    requestedClientSlug || (await listProjectWorkspaces())[0]?.clientSlug || "";

  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-svh bg-white text-service-ink">
        <PageTemplatePreview
          overlayNavigation={false}
          palette={readPromotedPalette()}
          sections={template.sections.map((section) => ({
            ...section,
            instruction: section.instruction ?? "",
          }))}
          siteIdentity={await readSiteIdentity(clientSlug)}
        />
      </main>
    </StyleGuidePreviewSurface>
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
