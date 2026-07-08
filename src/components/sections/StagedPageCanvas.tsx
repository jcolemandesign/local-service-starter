import {
  PageTemplatePreview,
  type PageTemplatePreviewSection,
  type SiteNavigationLink,
} from "@/components/sections/PageTemplatePreview";
import type {
  StagedPage,
  StagedPageField,
  StagedPageTemplateSection,
} from "@/utils/staged-pages";

type StagedPageCanvasProps = {
  allPages?: StagedPage[];
  chrome?: boolean;
  page: StagedPage;
};

type StagedPageRenderData = {
  fieldsBySection: Record<string, StagedPageField[]>;
  homeHref: string;
  navigationLinks: SiteNavigationLink[];
  sections: PageTemplatePreviewSection[];
};

export function StagedPageCanvas({
  allPages,
  chrome = true,
  page,
}: StagedPageCanvasProps) {
  const renderData = getStagedPageRenderData(page, allPages ?? [page]);

  if (!chrome) {
    return <PageTemplatePreview {...renderData} fixedNavigation />;
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

function getStagedPageRenderData(
  page: StagedPage,
  allPages: StagedPage[],
): StagedPageRenderData {
  const sitePages = allPages.filter(
    (candidate) => candidate.snapshot.clientSlug === page.snapshot.clientSlug,
  );
  const homePage = sitePages.find(isHomePage) ?? page;
  const homeNavigation = getNavigationSection(homePage);
  const fieldsBySection = getFieldsBySection(page);
  const homeHref = getStagedPageHref(homePage);
  const navigationLinks = buildStagedNavigationLinks(sitePages);
  const templateSections = page.template?.sections ?? [];

  if (templateSections.length > 0) {
    const sections = templateSections.map((section, index) =>
      toPreviewSection(section, getSectionId(section, index)),
    );
    const sectionsWithInheritedNavigation =
      homeNavigation && !isHomePage(page)
        ? replaceNavigationSection(sections, homeNavigation.section)
        : sections;

    if (homeNavigation && !isHomePage(page)) {
      fieldsBySection[homeNavigation.section.id ?? "homepage-navigation"] =
        homeNavigation.fields;
    }

    return {
      fieldsBySection,
      homeHref,
      navigationLinks,
      sections: sectionsWithInheritedNavigation,
    };
  }

  return {
    fieldsBySection,
    homeHref,
    navigationLinks,
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

function getFieldsBySection(page: StagedPage) {
  return page.fields
    .filter((field) => !field.path.startsWith("strategy."))
    .reduce<Record<string, StagedPageField[]>>((sections, field) => {
      const sectionId = field.path.split(".")[0] || "section";

      return {
        ...sections,
        [sectionId]: [...(sections[sectionId] ?? []), field],
      };
    }, {});
}

function getNavigationSection(page: StagedPage) {
  const templateSections = page.template?.sections ?? [];
  const sectionIndex = templateSections.findIndex(
    (section) => section.mode === "Navigation",
  );

  if (sectionIndex < 0) {
    return null;
  }

  const templateSection = templateSections[sectionIndex];
  const section = toPreviewSection(
    templateSection,
    getSectionId(templateSection, sectionIndex),
  );
  const fields = getFieldsBySection(page)[section.id ?? ""] ?? [];

  return { fields, section };
}

function replaceNavigationSection(
  sections: PageTemplatePreviewSection[],
  navigationSection: PageTemplatePreviewSection,
) {
  const existingNavigationIndex = sections.findIndex(
    (section) => section.mode === "Navigation",
  );

  if (existingNavigationIndex < 0) {
    return [navigationSection, ...sections];
  }

  return sections.map((section, index) =>
    index === existingNavigationIndex ? navigationSection : section,
  );
}

function buildStagedNavigationLinks(pages: StagedPage[]) {
  const sortedPages = pages
    .slice()
    .sort((a, b) => getNavigationSort(a) - getNavigationSort(b));
  const serviceOverviewPage = sortedPages.find(isServicesOverviewPage);
  const serviceAreaOverviewPage = sortedPages.find(isServiceAreaOverviewPage);
  const individualServicePages = sortedPages.filter(isIndividualServicePage);
  const childServiceAreaPages = sortedPages.filter(
    (page) => isServiceAreaPage(page) && page !== serviceAreaOverviewPage,
  );

  return sortedPages
    .filter((stagedPage) => {
      if (isHomePage(stagedPage)) {
        return false;
      }

      if (isIndividualServicePage(stagedPage)) {
        return false;
      }

      if (isServiceAreaPage(stagedPage) && stagedPage !== serviceAreaOverviewPage) {
        return false;
      }

      return true;
    })
    .map((stagedPage) => {
      if (stagedPage === serviceOverviewPage) {
        return toNavigationLink(stagedPage, individualServicePages);
      }

      if (stagedPage === serviceAreaOverviewPage) {
        return toNavigationLink(stagedPage, childServiceAreaPages);
      }

      return toNavigationLink(stagedPage);
    });
}

function toNavigationLink(page: StagedPage, childPages: StagedPage[] = []) {
  return {
    href: getStagedPageHref(page),
    items: childPages.map((childPage) => ({
      href: getStagedPageHref(childPage),
      label: childPage.pageLabel,
    })),
    label: getNavigationLabel(page),
  };
}

function getStagedPageHref(page: StagedPage) {
  return page.previewHref ?? `/dev/staged-pages/${page.pageId}`;
}

function getNavigationLabel(page: StagedPage) {
  if (isServicesOverviewPage(page)) {
    return "Services";
  }

  if (isServiceAreaOverviewPage(page)) {
    return "Service Areas";
  }

  return page.pageLabel;
}

function getNavigationSort(page: StagedPage) {
  if (isHomePage(page)) {
    return 0;
  }

  if (page.pageId.includes("service")) {
    return 1;
  }

  if (page.pageId.includes("about")) {
    return 2;
  }

  if (page.pageId.includes("contact")) {
    return 3;
  }

  return 4;
}

function isHomePage(page: StagedPage) {
  return (
    page.pageId === "home" ||
    page.pageId === "homepage" ||
    page.pageHref === "/" ||
    page.pageLabel.toLowerCase() === "home" ||
    page.pageLabel.toLowerCase() === "homepage"
  );
}

function isServicesOverviewPage(page: StagedPage) {
  const normalizedType = normalizePageType(page.template?.pageType ?? "");
  const normalizedId = normalizePageType(`${page.pageId} ${page.pageLabel}`);

  return (
    normalizedType === "servicesoverview" ||
    normalizedType === "services" ||
    normalizedId.includes("servicesoverview") ||
    normalizedId === "services"
  );
}

function isIndividualServicePage(page: StagedPage) {
  const normalizedType = normalizePageType(page.template?.pageType ?? "");

  return (
    normalizedType === "individualservice" ||
    normalizedType === "service" ||
    normalizePageType(page.pageId).startsWith("service")
  ) && !isServicesOverviewPage(page) && !isServiceAreaPage(page);
}

function isServiceAreaOverviewPage(page: StagedPage) {
  const normalizedType = normalizePageType(page.template?.pageType ?? "");
  const normalizedId = normalizePageType(`${page.pageId} ${page.pageLabel}`);

  return (
    normalizedType === "servicearea" ||
    normalizedId.includes("servicearea") ||
    normalizedId.includes("serviceareas")
  );
}

function isServiceAreaPage(page: StagedPage) {
  return isServiceAreaOverviewPage(page);
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
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
