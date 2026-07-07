import {
  PageTemplatePreview,
  type PageTemplatePreviewSection,
} from "@/components/sections/PageTemplatePreview";
import type {
  StagedPage,
  StagedPageField,
  StagedPageTemplateSection,
} from "@/utils/staged-pages";

type StagedPageCanvasProps = {
  chrome?: boolean;
  page: StagedPage;
};

type StagedPageRenderData = {
  fieldsBySection: Record<string, StagedPageField[]>;
  sections: PageTemplatePreviewSection[];
};

export function StagedPageCanvas({ chrome = true, page }: StagedPageCanvasProps) {
  const renderData = getStagedPageRenderData(page);

  if (!chrome) {
    return <PageTemplatePreview {...renderData} />;
  }

  return (
    <div className="overflow-hidden rounded-sm border border-service-border bg-white shadow-service">
      <div className="border-b border-service-border bg-service-surface px-4 py-3">
        <p className="type-label text-service-accent">Visual Staged Preview</p>
        <p className="type-caption mt-1 text-service-muted">
          {page.template?.name ?? page.sourceStage} / {page.pageLabel}
        </p>
      </div>
      <PageTemplatePreview {...renderData} />
    </div>
  );
}

function getStagedPageRenderData(page: StagedPage): StagedPageRenderData {
  const fieldsBySection = page.fields
    .filter((field) => !field.path.startsWith("strategy."))
    .reduce<Record<string, StagedPageField[]>>((sections, field) => {
      const sectionId = field.path.split(".")[0] || "section";

      return {
        ...sections,
        [sectionId]: [...(sections[sectionId] ?? []), field],
      };
    }, {});
  const templateSections = page.template?.sections ?? [];

  if (templateSections.length > 0) {
    return {
      fieldsBySection,
      sections: templateSections.map((section, index) =>
        toPreviewSection(section, getSectionId(section, index)),
      ),
    };
  }

  return {
    fieldsBySection,
    sections: Object.entries(fieldsBySection).map(([sectionId, fields]) => ({
      component: "UnknownSection",
      id: sectionId,
      instruction:
        fields.find((field) => field.path.endsWith(".contentDirection"))
          ?.value ?? "",
      mode: inferFallbackMode(sectionId),
      name: humanize(sectionId),
    })),
  };
}

function toPreviewSection(
  section: StagedPageTemplateSection,
  id: string,
): PageTemplatePreviewSection {
  return {
    component: section.component,
    id,
    instruction: section.instruction,
    mode: section.mode,
    name: section.name,
    ratio: section.ratio,
    variant: section.variant,
  };
}

function getSectionId(section: StagedPageTemplateSection, index: number) {
  return `${String(index + 1).padStart(2, "0")}-${slugify(
    section.name || section.component,
  )}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferFallbackMode(sectionId: string) {
  const normalized = sectionId.toLowerCase();

  if (normalized.includes("nav")) {
    return "Navigation";
  }

  if (
    normalized.includes("hero") ||
    normalized.includes("split-content") ||
    normalized.includes("full-image")
  ) {
    return "Hero";
  }

  if (
    normalized.includes("trust") ||
    normalized.includes("proof") ||
    normalized.includes("stories") ||
    normalized.includes("testimonial")
  ) {
    return "Proof";
  }

  if (normalized.includes("services")) {
    return "Scan";
  }

  if (normalized.includes("feature") || normalized.includes("about")) {
    return "Narrative";
  }

  if (normalized.includes("area") || normalized.includes("contact")) {
    return "Utility";
  }

  if (normalized.includes("footer")) {
    return "Footer";
  }

  return "Section";
}

function humanize(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
