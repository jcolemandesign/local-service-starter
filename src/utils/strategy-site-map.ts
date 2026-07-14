import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

export type StrategyPageStatus = "needs-template" | "staged" | "ready";

export type StrategyPageSummary = {
  copyField: string;
  detected: boolean;
  id: string;
  label: string;
  parentId?: string;
  pageType: string;
  path: string;
  repeatable?: boolean;
  status: StrategyPageStatus;
};

export type StrategyNavigationItem = {
  href: string;
  label: string;
  pageId: string;
};

type StrategyPageDefinition = Omit<
  StrategyPageSummary,
  "detected" | "status"
> & {
  aliases: string[];
};

export const strategyPageSlots: StrategyPageDefinition[] = [
  {
    aliases: ["home", "homepage", "home page"],
    copyField: "homepageCopy",
    id: "home",
    label: "Home",
    pageType: "Home",
    path: "/",
  },
  {
    aliases: [
      "services overview",
      "services page",
      "main services",
      "service overview",
      "/services",
    ],
    copyField: "servicesCopy",
    id: "services",
    label: "Services Overview",
    pageType: "Services Overview",
    path: "/services",
  },
  {
    aliases: [
      "individual service",
      "specific service",
      "service detail",
      "service detail page",
      "individual services",
    ],
    copyField: "servicesCopy",
    id: "individual-service",
    label: "Individual Service",
    parentId: "services",
    pageType: "Individual Service",
    path: "/services/[service]",
    repeatable: true,
  },
  {
    aliases: [
      "system replacement",
      "hvac replacement",
      "replacement page",
      "/services/system-replacement",
      "/system-replacement",
    ],
    copyField: "servicesCopy",
    id: "system-replacement",
    label: "System Replacement",
    parentId: "services",
    pageType: "Individual Service",
    path: "/services/system-replacement",
  },
  {
    aliases: [
      "heat pump service",
      "heat pump page",
      "/services/heat-pump-service",
      "/heat-pump-service",
    ],
    copyField: "servicesCopy",
    id: "heat-pump-service",
    label: "Heat Pump Service",
    parentId: "services",
    pageType: "Individual Service",
    path: "/services/heat-pump-service",
  },
  {
    aliases: [
      "maintenance / tune-ups",
      "maintenance & tune-ups",
      "maintenance and tune ups",
      "maintenance page",
      "tune-up page",
      "tune up page",
      "/maintenance",
    ],
    copyField: "servicesCopy",
    id: "maintenance",
    label: "Maintenance / Tune-Ups",
    parentId: "services",
    pageType: "Individual Service",
    path: "/maintenance",
  },
  {
    aliases: ["ac repair", "cooling repair", "/services/ac-repair", "/ac-repair"],
    copyField: "servicesCopy",
    id: "ac-repair",
    label: "AC Repair",
    parentId: "services",
    pageType: "Individual Service",
    path: "/services/ac-repair",
  },
  {
    aliases: [
      "heating repair",
      "heat repair",
      "/services/heating-repair",
      "/heating-repair",
    ],
    copyField: "servicesCopy",
    id: "heating-repair",
    label: "Heating Repair",
    parentId: "services",
    pageType: "Individual Service",
    path: "/services/heating-repair",
  },
  {
    aliases: [
      "emergency hvac service",
      "emergency hvac",
      "urgent hvac",
      "/services/emergency-hvac",
      "/emergency-hvac",
    ],
    copyField: "servicesCopy",
    id: "emergency-hvac",
    label: "Emergency HVAC Service",
    parentId: "services",
    pageType: "Individual Service",
    path: "/services/emergency-hvac",
  },
  {
    aliases: ["service area", "service areas", "areas served", "coverage area"],
    copyField: "contentPlan",
    id: "service-area",
    label: "Service Area",
    pageType: "Service Area",
    path: "/service-area",
    repeatable: true,
  },
  {
    aliases: [
      "service plan",
      "service plans",
      "maintenance plan",
      "maintenance plans",
      "membership",
      "memberships",
    ],
    copyField: "contentPlan",
    id: "service-plan",
    label: "Service Plan",
    pageType: "Service Plan",
    path: "/service-plan",
  },
  {
    aliases: [
      "specials",
      "offers",
      "specials / offers",
      "special offers",
      "seasonal offer",
      "promotion",
      "promotions",
    ],
    copyField: "contentPlan",
    id: "specials",
    label: "Specials / Offers",
    pageType: "Specials / Offers",
    path: "/specials",
  },
  {
    aliases: ["financing", "payment options", "financing page"],
    copyField: "contentPlan",
    id: "financing",
    label: "Financing",
    pageType: "Financing",
    path: "/financing",
  },
  {
    aliases: ["about", "about page", "about us", "company story"],
    copyField: "aboutCopy",
    id: "about",
    label: "About",
    pageType: "About",
    path: "/about",
  },
  {
    aliases: ["contact", "contact page", "request service", "schedule"],
    copyField: "contactCopy",
    id: "contact",
    label: "Contact",
    pageType: "Contact",
    path: "/contact",
  },
  {
    aliases: ["blog index", "blog", "articles", "resources", "resource center"],
    copyField: "contentPlan",
    id: "blog",
    label: "Blog Index",
    pageType: "Blog Index",
    path: "/blog",
  },
  {
    aliases: [
      "blog post",
      "individual blog",
      "article page",
      "individual article",
    ],
    copyField: "contentPlan",
    id: "blog-post",
    label: "Blog Post",
    parentId: "blog",
    pageType: "Blog Post",
    path: "/blog/[post]",
    repeatable: true,
  },
  {
    aliases: [
      "product listing",
      "products page",
      "product page",
    ],
    copyField: "contentPlan",
    id: "products",
    label: "Product Listing",
    pageType: "Product Listing",
    path: "/products",
    repeatable: true,
  },
  {
    aliases: ["thank you", "thank-you", "confirmation page"],
    copyField: "thankYouCopy",
    id: "thank-you",
    label: "Thank You",
    pageType: "Thank You",
    path: "/thank-you",
  },
];

export function deriveStrategyPagesFromFields(
  fields: StrategyWorkspaceFields,
): StrategyPageSummary[] {
  const detectedPageIds = detectStrategyPageIds(fields);

  return strategyPageSlots.map((slot) => ({
    copyField: slot.copyField,
    detected: detectedPageIds.has(slot.id),
    id: slot.id,
    label: slot.label,
    parentId: slot.parentId,
    pageType: slot.pageType,
    path: slot.path,
    repeatable: slot.repeatable,
    status: "needs-template",
  }));
}

export function buildStrategyNavigation(
  pages: StrategyPageSummary[],
): StrategyNavigationItem[] {
  return pages
    .filter((page) => page.detected)
    .map((page) => ({
      href: page.path,
      label: page.label,
      pageId: page.id,
    }));
}

export function getStrategyCopyForPage(
  fields: StrategyWorkspaceFields,
  pageSlug: string,
  pageType: string,
) {
  const normalized = `${pageSlug} ${pageType}`.toLowerCase();
  const matchingSlot = strategyPageSlots.find(
    (slot) =>
      normalized.includes(slot.id) ||
      normalized.includes(slot.label.toLowerCase()) ||
      normalized.includes(slot.copyField.replace("Copy", "").toLowerCase()),
  );
  const dynamicCopy = matchingSlot
    ? (fields[getStrategyPageCopyField(matchingSlot)] ?? "").trim()
    : "";
  const copy =
    dynamicCopy || (matchingSlot ? fields[matchingSlot.copyField].trim() : "");

  return copy || fields.contentPlan.trim() || fields.strategyBrief.trim();
}

export function getStrategyPageCopyField(
  page: Pick<StrategyPageSummary, "id">,
) {
  return `pageCopy.${page.id}`;
}

export function getDefaultPageSlug(pageType: string, templateName: string) {
  const normalized = `${pageType} ${templateName}`.toLowerCase();

  if (normalized.includes("home")) {
    return "home";
  }

  if (normalized.includes("service area")) {
    return "service-area";
  }

  if (normalized.includes("service plan")) {
    return "service-plan";
  }

  if (
    normalized.includes("special") ||
    normalized.includes("offer")
  ) {
    return "specials";
  }

  if (normalized.includes("financing")) {
    return "financing";
  }

  if (
    normalized.includes("individual service") ||
    normalized.includes("service detail")
  ) {
    return "individual-service";
  }

  if (
    normalized.includes("services overview") ||
    normalized.includes("services")
  ) {
    return "services";
  }

  if (normalized.includes("about")) {
    return "about";
  }

  if (normalized.includes("contact")) {
    return "contact";
  }

  if (normalized.includes("thank")) {
    return "thank-you";
  }

  if (
    normalized.includes("blog index") ||
    normalized.includes("blog listing")
  ) {
    return "blog";
  }

  if (
    normalized.includes("blog post") ||
    normalized.includes("individual blog")
  ) {
    return "blog-post";
  }

  if (
    normalized.includes("product listing") ||
    normalized.includes("products")
  ) {
    return "products";
  }

  return slugify(templateName);
}

export function getDefaultPageLabel(pageType: string, templateName: string) {
  const slug = getDefaultPageSlug(pageType, templateName);
  const matchingSlot = strategyPageSlots.find((slot) => slot.id === slug);

  return matchingSlot?.label ?? templateName;
}

export function getPathFromSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export function getPathFromSlugForPageType(slug: string, pageType: string) {
  const normalizedSlug = slugify(slug);
  const normalizedPageType = normalizePageType(pageType);

  if (!normalizedSlug || normalizedSlug === "home") {
    return "/";
  }

  if (normalizedPageType === "individualservice") {
    if (normalizedSlug === "maintenance") {
      return "/maintenance";
    }

    return `/services/${normalizedSlug}`;
  }

  if (
    normalizedPageType === "servicearea" &&
    normalizedSlug !== "service-area" &&
    normalizedSlug !== "service-areas"
  ) {
    return `/service-area/${normalizedSlug}`;
  }

  if (normalizedPageType === "blogpost") {
    return `/blog/${normalizedSlug}`;
  }

  if (
    normalizedPageType === "productlisting" &&
    normalizedSlug !== "products"
  ) {
    return `/products/${normalizedSlug}`;
  }

  return getPathFromSlug(normalizedSlug);
}

export function isRepeatablePageType(pageType: string) {
  const matchingSlot = strategyPageSlots.find(
    (slot) => normalizePageType(slot.pageType) === normalizePageType(pageType),
  );

  return Boolean(matchingSlot?.repeatable);
}

export function getPageTypeRelationshipLabel(pageType: string) {
  const matchingSlot = strategyPageSlots.find(
    (slot) => normalizePageType(slot.pageType) === normalizePageType(pageType),
  );

  if (!matchingSlot?.repeatable) {
    return "Single page";
  }

  if (matchingSlot.parentId === "services") {
    return "Repeatable child of Services";
  }

  if (matchingSlot.parentId === "blog") {
    return "Repeatable child of Blog";
  }

  return "Repeatable page group";
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectStrategyPageIds(fields: StrategyWorkspaceFields) {
  const detectedPageIds = new Set<string>();
  const sourceText = [
    fields.contentPlan,
    fields.strategyBrief,
    fields.generalNotes,
  ].join("\n");

  for (const slot of strategyPageSlots) {
    if (canCopyFieldDirectlyDetectPage(fields, slot)) {
      detectedPageIds.add(slot.id);
    }

    if (matchesPageDefinition(sourceText, slot)) {
      detectedPageIds.add(slot.id);
    }
  }

  collapseGenericRepeatablePageIds(detectedPageIds);

  return detectedPageIds;
}

function collapseGenericRepeatablePageIds(detectedPageIds: Set<string>) {
  const hasSpecificServicePage = strategyPageSlots.some(
    (slot) =>
      slot.parentId === "services" &&
      slot.id !== "individual-service" &&
      detectedPageIds.has(slot.id),
  );

  if (hasSpecificServicePage) {
    detectedPageIds.delete("individual-service");
  }
}

function canCopyFieldDirectlyDetectPage(
  fields: StrategyWorkspaceFields,
  pageDefinition: StrategyPageDefinition,
) {
  return (
    fields[pageDefinition.copyField].trim().length > 0 &&
    pageDefinition.copyField !== "contentPlan" &&
    !pageDefinition.parentId &&
    pageDefinition.repeatable !== true
  );
}

function matchesPageDefinition(
  sourceText: string,
  pageDefinition: StrategyPageDefinition,
) {
  const normalizedSourceText = normalizeSearchText(sourceText);

  if (!normalizedSourceText) {
    return false;
  }

  return pageDefinition.aliases.some((alias) => {
    const normalizedAlias = normalizeSearchText(alias);
    const escapedAlias = normalizedAlias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const aliasPattern = new RegExp(
      `(^|[^a-z0-9])${escapedAlias}([^a-z0-9]|$)`,
      "i",
    );

    return aliasPattern.test(normalizedSourceText);
  });
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[_/]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
