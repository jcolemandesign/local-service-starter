import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  ContentEditorField,
  ContentEditorPage,
} from "@/content/content-editor";
import { sectionLibraryV3Content } from "../../../content/section-library-v3";

export const runtime = "nodejs";

type PageTemplateSection = {
  component: string;
  instruction: string;
  mode: string;
  name: string;
  originalComponent: string;
  originalIndex: number;
  ratio?: string;
  variant?: string;
};

type PageTemplate = {
  designStyle: {
    showSectionMarkers: boolean;
    viewportId: string;
  };
  id: string;
  name: string;
  notes?: string;
  pageType: string;
  promotedAt: string;
  sectionCount: number;
  sections: PageTemplateSection[];
  sourceOptionName: string;
  sourceRecipeId: string;
  sourceRecipeName: string;
};

type PageTemplatesFile = {
  templates?: PageTemplate[];
};

type ContentEditorPagesFile = {
  pages?: ContentEditorPage[];
};

type ContentFieldKind = "copy" | "image" | "link" | "meta";
type ContentSourceValue = unknown;

type CreateContentEditorPageRequest = {
  pageLabel: string;
  pageSlug: string;
  templateId: string;
};

const pageTemplatesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "page-templates.json",
);
const contentEditorPagesPath = path.join(
  process.cwd(),
  "src",
  "content",
  "content-editor-pages.json",
);
const slugPattern = /^[a-z0-9-]+$/;

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Content Editor page creation is disabled in production.", 403);
  }

  let body: CreateContentEditorPageRequest;

  try {
    body = (await request.json()) as CreateContentEditorPageRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const template = await findTemplate(body.templateId);
    const page = buildContentEditorPage({
      pageLabel: body.pageLabel,
      pageSlug: body.pageSlug,
      template,
    });
    const currentPages = await readContentEditorPages();
    const nextPages = [
      page,
      ...currentPages.pages.filter((currentPage) => currentPage.id !== page.id),
    ];

    await mkdir(path.dirname(contentEditorPagesPath), { recursive: true });
    await writeFile(
      contentEditorPagesPath,
      `${JSON.stringify({ pages: nextPages }, null, 2)}\n`,
    );

    return Response.json({ ok: true, page, pages: nextPages });
  } catch (error) {
    return jsonError(
      error instanceof Error
        ? error.message
        : "Content Editor page creation failed.",
      400,
    );
  }
}

async function findTemplate(templateId: string) {
  const normalizedTemplateId = sanitizeSlug(templateId);

  if (!normalizedTemplateId) {
    throw new Error("Missing template id.");
  }

  const templates = await readPageTemplates();
  const template = templates.find(
    (currentTemplate) => currentTemplate.id === normalizedTemplateId,
  );

  if (!template) {
    throw new Error("Template not found.");
  }

  return template;
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

async function readContentEditorPages(): Promise<{
  pages: ContentEditorPage[];
}> {
  try {
    const contents = await readFile(contentEditorPagesPath, "utf8");
    const parsed = JSON.parse(contents) as ContentEditorPagesFile;

    return {
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    };
  } catch {
    return { pages: [] };
  }
}

function buildContentEditorPage({
  pageLabel,
  pageSlug,
  template,
}: {
  pageLabel: string;
  pageSlug: string;
  template: PageTemplate;
}): ContentEditorPage {
  const id = sanitizeSlug(pageSlug);
  const label = normalizeRequiredString(pageLabel, "Enter a page label.");

  if (!id || !slugPattern.test(id)) {
    throw new Error("Enter a valid page slug.");
  }

  return {
    href: `/${id}`,
    id,
    label,
    sections: template.sections.map((section, index) =>
      buildContentEditorSection({ pageId: id, section, index }),
    ),
    sourceRecipe: `${template.sourceRecipeName} / ${template.sourceOptionName}`,
  };
}

function buildContentEditorSection({
  index,
  pageId,
  section,
}: {
  index: number;
  pageId: string;
  section: PageTemplateSection;
}) {
  const sectionId = `${String(index + 1).padStart(2, "0")}-${sanitizeSlug(
    section.name || section.component,
  )}`;
  const baseId = `${pageId}.${sectionId}`;
  const sectionContent = getSectionContent(section.component);
  const fields = sectionContent
    ? extractContentFields({
        baseId,
        pathParts: [sectionId],
        sectionContent,
      })
    : [];

  return {
    fields:
      fields.length > 0
        ? fields
        : [
            contentField({
              id: `${baseId}.contentDirection`,
              label: "Content direction",
              path: `${sectionId}.contentDirection`,
              value: section.instruction,
            }),
          ],
    id: sectionId,
    label: section.name,
  };
}

function getSectionContent(component: string): ContentSourceValue | null {
  const contentByComponent: Record<string, ContentSourceValue> = {
    ContactSectionV2: sectionLibraryV3Content.contact,
    ContactSectionV3: sectionLibraryV3Content.contact,
    ContentAboutCompanySectionV2: sectionLibraryV3Content.contentAboutCompany,
    ContentFixedCoverFadeSectionV2: sectionLibraryV3Content.contentFixedCoverFade,
    ContentHorizontalCardCarouselSectionV2:
      sectionLibraryV3Content.contentHorizontalCardCarousel,
    ContentPhotoGalleryCarouselSectionV3:
      sectionLibraryV3Content.contentPhotoGalleryCarousel,
    ImageStripSectionV3: sectionLibraryV3Content.imageStrip,
    QuickPageLinksSectionV2: sectionLibraryV3Content.quickPageLinks,
    ContentRevealParagraphSectionV2: sectionLibraryV3Content.contentRevealParagraph,
    ContentRuleHeaderSectionV2: sectionLibraryV3Content.contentRuleHeader,
    ContentScrollWrittenRevealSectionV2:
      sectionLibraryV3Content.contentScrollWrittenReveal,
    ContentSplitFixedImageSectionV3: sectionLibraryV3Content.heroSplitFullHeight,
    ContentSplitHeadlineImageSectionV2:
      sectionLibraryV3Content.contentSplitHeadlineImage,
    ContentStickyCardStreamSectionV2:
      sectionLibraryV3Content.contentStickyCardStream,
    ContentStickyIdeasSectionV2: sectionLibraryV3Content.contentStickyIdeas,
    CTAFullscreenSectionV3: sectionLibraryV3Content.ctaFullscreen,
    CTAMutedSectionV3: sectionLibraryV3Content.cta,
    CTASectionV3: sectionLibraryV3Content.cta,
    CTAScrollRevealOfferSectionV3: sectionLibraryV3Content.ctaScrollRevealOffer,
    FAQAccordionSectionV3: sectionLibraryV3Content.faqAccordion,
    FAQSectionV3: sectionLibraryV3Content.faq,
    FeatureAsymmetricCardsSectionV3:
      sectionLibraryV3Content.featureAsymmetricCards,
    FeatureOverlapRowsSectionV3: sectionLibraryV3Content.featureOverlapRows,
    FeaturePortraitParagraphSectionV3:
      sectionLibraryV3Content.featurePortraitParagraph,
    FooterSectionV3: sectionLibraryV3Content.footer,
    FooterHorizontalSectionV3: sectionLibraryV3Content.footer,
    FooterCompactSectionV3: sectionLibraryV3Content.footer,
    HeroCenteredFloatersSectionV2: sectionLibraryV3Content.hero,
    HeroCompactSectionV3: sectionLibraryV3Content.heroCompact,
    SectionHeaderCompactSectionV3:
      sectionLibraryV3Content.sectionHeaderCompact,
    HeroContentTopImageBottomSectionV2: sectionLibraryV3Content.hero,
    HeroFullscreenSectionV2: sectionLibraryV3Content.heroFullscreen,
    HeroGridMosaicSectionV2: sectionLibraryV3Content.heroGridMosaic,
    HeroSplitFixedImageSectionV3: sectionLibraryV3Content.heroSplitFullHeight,
    HeroSplitFullHeightSectionV3: sectionLibraryV3Content.heroSplitFullHeight,
    NavCenterLogoSectionV2: getNavigationContent(),
    NavFloatingBentoSectionV2: getNavigationContent(),
    NavPrimarySectionV2: getNavigationContent(),
    ProcessImageChecklistSectionV3: sectionLibraryV3Content.processImageChecklist,
    ProcessStepsSectionV3: sectionLibraryV3Content.process,
    ServiceAreaZipLookupSectionV3: sectionLibraryV3Content.serviceAreaZipLookup,
    ServicesBentoCardsSectionV2: sectionLibraryV3Content.servicesBento,
    ServicesHoverPanelSectionV2: sectionLibraryV3Content.servicesHoverPanel,
    ServicesScrollCardsSectionV2: sectionLibraryV3Content.servicesScrollCards,
    ServicesThreeCardsRightSectionV3:
      sectionLibraryV3Content.servicesThreeCardsRight,
    TestimonialsCarouselSectionV3: sectionLibraryV3Content.testimonialsCarousel,
    TestimonialsMasonrySectionV3: sectionLibraryV3Content.testimonialsMasonry,
    TestimonialsSectionV3: sectionLibraryV3Content.testimonials,
    TrustBarFloatingBentoSectionV3: sectionLibraryV3Content.trustBar,
    TrustBarSectionV3: sectionLibraryV3Content.trustBar,
    TrustLogoGridSectionV3: sectionLibraryV3Content.trustLogoMarquee,
    TrustLogoMarqueeSectionV3: sectionLibraryV3Content.trustLogoMarquee,
    TrustMarqueeSection: sectionLibraryV3Content.trustMarquee,
    TrustMarqueeSectionV3: getTrustMarqueeV3Content(),
  };

  return contentByComponent[component] ?? null;
}

function getNavigationContent(): ContentSourceValue {
  const nav = sectionLibraryV3Content.navPrimary;

  return {
    logoImageSrc: "",
    logoLabel: nav.logoLabel,
    logoHref: "/",
    phone: nav.phone,
    phoneHref: `tel:${nav.phone.replace(/\D/g, "")}`,
    actionLabel: nav.action,
    actionHref: "#contact",
    links: createNavigationLinkSlots(nav.links, 10),
  };
}

function createNavigationLinkSlots(
  links: Array<{ href?: string; label: string }>,
  slotCount: number,
) {
  return Array.from({ length: slotCount }, (_, index) => {
    const link = links[index];

    return {
      href: link?.href ?? (link ? `#${sanitizeSlug(link.label)}` : ""),
      label: link?.label ?? "",
    };
  });
}

function getTrustMarqueeV3Content(): ContentSourceValue {
  return {
    items: sectionLibraryV3Content.trustMarquee.items,
  };
}

function extractContentFields({
  baseId,
  pathParts,
  sectionContent,
}: {
  baseId: string;
  pathParts: string[];
  sectionContent: ContentSourceValue;
}): ContentEditorField[] {
  if (typeof sectionContent === "string") {
    return [
      contentField({
        id: `${baseId}.${pathParts.slice(1).join(".")}`,
        kind: inferFieldKind(pathParts),
        label: humanizePath(pathParts.slice(1)),
        path: pathParts.join("."),
        value: sectionContent,
      }),
    ];
  }

  if (typeof sectionContent === "number" || typeof sectionContent === "boolean") {
    return [
      contentField({
        id: `${baseId}.${pathParts.slice(1).join(".")}`,
        kind: inferFieldKind(pathParts),
        label: humanizePath(pathParts.slice(1)),
        path: pathParts.join("."),
        value: String(sectionContent),
      }),
    ];
  }

  if (!sectionContent) {
    return [];
  }

  if (Array.isArray(sectionContent)) {
    return sectionContent.flatMap((item, index) =>
      extractContentFields({
        baseId,
        pathParts: [...pathParts, String(index + 1)],
        sectionContent: item,
      }),
    );
  }

  return Object.entries(sectionContent).flatMap(([key, value]) =>
    shouldExposeContentKey(key)
      ? extractContentFields({
          baseId,
          pathParts: [...pathParts, key],
          sectionContent: value,
        })
      : [],
  );
}

function shouldExposeContentKey(key: string) {
  const normalizedKey = key.toLowerCase();

  return ![
    "ratio",
    "size",
    "variant",
    "variants",
  ].includes(normalizedKey);
}

function inferFieldKind(pathParts: string[]): ContentFieldKind {
  const fieldKey = pathParts.at(-1)?.toLowerCase() ?? "";

  if (fieldKey === "href" || fieldKey === "url" || fieldKey.endsWith("href")) {
    return "link";
  }

  if (
    fieldKey === "alt" ||
    fieldKey.endsWith("alt") ||
    fieldKey === "imagelabel" ||
    fieldKey.endsWith("imagelabel") ||
    fieldKey.includes("caption") ||
    fieldKey.includes("note")
  ) {
    return "meta";
  }

  if (
    fieldKey === "src" ||
    fieldKey.endsWith("src") ||
    fieldKey.includes("image")
  ) {
    return "image";
  }

  return "copy";
}

function humanizePath(pathParts: string[]) {
  if (pathParts.length === 0) {
    return "Content";
  }

  const labels: string[] = [];

  for (let index = 0; index < pathParts.length; index += 1) {
    const part = pathParts[index];
    const nextPart = pathParts[index + 1];
    const collectionLabel = getCollectionItemLabel(part);

    if (collectionLabel && nextPart && /^\d+$/.test(nextPart)) {
      labels.push(`${collectionLabel} ${nextPart}`);
      index += 1;
      continue;
    }

    labels.push(humanize(part));
  }

  return labels.join(" / ");
}

function humanize(value: string) {
  const labelOverrides: Record<string, string> = {
    logoHref: "Logo Destination",
    logoImageSrc: "Logo Image Src",
    logoLabel: "Logo Text",
  };

  if (labelOverrides[value]) {
    return labelOverrides[value];
  }

  const normalizedValue = /^\d+$/.test(value) ? `Item ${value}` : value;

  return normalizedValue
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (letter) => letter.toUpperCase());
}

function getCollectionItemLabel(value: string) {
  const labelsByCollection: Record<string, string> = {
    cards: "Card",
    items: "Item",
    links: "Link",
    points: "Point",
    services: "Service",
    stats: "Stat",
  };

  return labelsByCollection[value] ?? "";
}

function contentField({
  id,
  kind = "copy",
  label,
  path: fieldPath,
  value,
}: {
  id: string;
  kind?: ContentFieldKind;
  label: string;
  path: string;
  value: string;
}) {
  return {
    id,
    kind,
    label,
    path: fieldPath,
    value,
  };
}

function normalizeRequiredString(value: unknown, message: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(message);
  }

  return value.trim();
}

function sanitizeSlug(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
