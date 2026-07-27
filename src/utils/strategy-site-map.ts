import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

/**
 * A page either has a template staged against it or it does not. There is no
 * "ready" state: nothing ever assigned one, so the branch that rendered it was
 * unreachable and the staged-page pill only ever read "staged". Approval for
 * export is tracked separately, in `site-export.json`.
 */
export type StrategyPageStatus = "needs-template" | "staged";

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

export type StrategyPageDefinition = Omit<
  StrategyPageSummary,
  "detected" | "status"
> & {
  aliases: string[];
};

/**
 * The trade-neutral page skeleton every client starts from.
 *
 * Named service pages are deliberately NOT here. They are the part of a sitemap
 * that differs per client, and hardcoding one client's services meant every
 * client of every trade got the North Star sitemap - a plumber was offered
 * "Heat Pump Service" as a page slot. A client's own service pages live in
 * `src/content/projects/<clientSlug>/page-slots.json` and are merged in by
 * `withClientPageSlots`.
 *
 * The generic repeatable `individual-service` slot stays here, so a client with
 * no configured services can still stage one.
 */
export const baseStrategyPageSlots: StrategyPageDefinition[] = [
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

/**
 * The slots a given client's sitemap is built from: the shared skeleton with
 * that client's own service pages inserted directly after the generic
 * `individual-service` slot, so the Services group stays contiguous.
 *
 * A client slot may also override a base slot by reusing its id - that is how a
 * client with a different label or path for, say, Financing says so, without
 * needing a second copy of the whole skeleton.
 *
 * Every reader below takes its slots as an argument and defaults to the base
 * set. Client components receive the resolved list as a prop; server code loads
 * it with `readClientPageSlots`. Nothing reads a module-level client sitemap
 * anymore, which is what made every trade look like an HVAC company.
 */
export function withClientPageSlots(
  clientSlots: readonly StrategyPageDefinition[] = [],
): StrategyPageDefinition[] {
  if (clientSlots.length === 0) {
    return [...baseStrategyPageSlots];
  }

  const baseIds = new Set(baseStrategyPageSlots.map((slot) => slot.id));
  const addedSlots = clientSlots.filter((slot) => !baseIds.has(slot.id));
  const servicePages = addedSlots.filter((slot) => slot.parentId === "services");
  const merged: StrategyPageDefinition[] = [];

  for (const slot of baseStrategyPageSlots) {
    merged.push(
      clientSlots.find((clientSlot) => clientSlot.id === slot.id) ?? slot,
    );

    if (slot.id === "individual-service") {
      merged.push(...servicePages);
    }
  }

  // Client pages that are not services keep their own order, after the
  // skeleton, rather than being dropped into the middle of the Services group.
  merged.push(...addedSlots.filter((slot) => slot.parentId !== "services"));

  return merged;
}

export function deriveStrategyPagesFromFields(
  fields: StrategyWorkspaceFields,
  slots: readonly StrategyPageDefinition[] = baseStrategyPageSlots,
): StrategyPageSummary[] {
  const detectedPageIds = detectStrategyPageIds(fields, slots);

  return slots.map((slot) => ({
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

/**
 * Where a page's resolved copy actually came from.
 *
 * `page` is real page copy written for this slot. The other two are whole-site
 * planning prose used as a last resort so a staged page is not completely bare.
 * Callers that judge whether seeding "worked" must distinguish them: the
 * fallbacks are keyed by page name, never by section id, so they are expected
 * to seed zero fields and that is not a failure.
 */
export type StrategyCopySource =
  | "content-plan"
  | "none"
  | "page"
  | "strategy-brief";

export function resolveStrategyCopyForPage(
  fields: StrategyWorkspaceFields,
  pageSlug: string,
  pageType: string,
  slots: readonly StrategyPageDefinition[] = baseStrategyPageSlots,
): { copy: string; source: StrategyCopySource } {
  const normalizedPageSlug = pageSlug.toLowerCase().trim();
  const normalized = `${pageSlug} ${pageType}`.toLowerCase();
  const matchingSlot =
    slots.find((slot) => slot.id === normalizedPageSlug) ??
    slots.find(
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

  if (copy) {
    return { copy, source: "page" };
  }

  const contentPlan = fields.contentPlan.trim();

  if (contentPlan) {
    return { copy: contentPlan, source: "content-plan" };
  }

  const strategyBrief = fields.strategyBrief.trim();

  if (strategyBrief) {
    return { copy: strategyBrief, source: "strategy-brief" };
  }

  return { copy: "", source: "none" };
}

export function getStrategyCopyForPage(
  fields: StrategyWorkspaceFields,
  pageSlug: string,
  pageType: string,
  slots: readonly StrategyPageDefinition[] = baseStrategyPageSlots,
) {
  return resolveStrategyCopyForPage(fields, pageSlug, pageType, slots).copy;
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

export function getDefaultPageLabel(
  pageType: string,
  templateName: string,
  slots: readonly StrategyPageDefinition[] = baseStrategyPageSlots,
) {
  const slug = getDefaultPageSlug(pageType, templateName);
  const matchingSlot = slots.find((slot) => slot.id === slug);

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

export function isRepeatablePageType(
  pageType: string,
  slots: readonly StrategyPageDefinition[] = baseStrategyPageSlots,
) {
  const matchingSlot = slots.find(
    (slot) => normalizePageType(slot.pageType) === normalizePageType(pageType),
  );

  return Boolean(matchingSlot?.repeatable);
}

export function getPageTypeRelationshipLabel(
  pageType: string,
  slots: readonly StrategyPageDefinition[] = baseStrategyPageSlots,
) {
  const matchingSlot = slots.find(
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

function detectStrategyPageIds(
  fields: StrategyWorkspaceFields,
  slots: readonly StrategyPageDefinition[],
) {
  const detectedPageIds = new Set<string>();
  const sourceText = [
    fields.contentPlan,
    fields.strategyBrief,
    fields.generalNotes,
  ].join("\n");

  for (const slot of slots) {
    if (canCopyFieldDirectlyDetectPage(fields, slot)) {
      detectedPageIds.add(slot.id);
    }

    if (matchesPageDefinition(sourceText, slot)) {
      detectedPageIds.add(slot.id);
    }
  }

  collapseGenericRepeatablePageIds(detectedPageIds, slots);

  return detectedPageIds;
}

function collapseGenericRepeatablePageIds(
  detectedPageIds: Set<string>,
  slots: readonly StrategyPageDefinition[],
) {
  const hasSpecificServicePage = slots.some(
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
