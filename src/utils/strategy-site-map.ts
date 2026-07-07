import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

export type StrategyPageStatus = "needs-template" | "staged" | "ready";

export type StrategyPageSummary = {
  copyField: keyof StrategyWorkspaceFields;
  detected: boolean;
  id: string;
  label: string;
  path: string;
  status: StrategyPageStatus;
};

export type StrategyNavigationItem = {
  href: string;
  label: string;
  pageId: string;
};

export const strategyPageSlots: Array<
  Omit<StrategyPageSummary, "detected" | "status">
> = [
  {
    copyField: "homepageCopy",
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    copyField: "servicesCopy",
    id: "services",
    label: "Services",
    path: "/services",
  },
  {
    copyField: "aboutCopy",
    id: "about",
    label: "About",
    path: "/about",
  },
  {
    copyField: "contactCopy",
    id: "contact",
    label: "Contact",
    path: "/contact",
  },
  {
    copyField: "thankYouCopy",
    id: "thank-you",
    label: "Thank You",
    path: "/thank-you",
  },
];

export function deriveStrategyPagesFromFields(
  fields: StrategyWorkspaceFields,
): StrategyPageSummary[] {
  return strategyPageSlots.map((slot) => ({
    ...slot,
    detected: fields[slot.copyField].trim().length > 0,
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
  const copy = matchingSlot ? fields[matchingSlot.copyField].trim() : "";

  return copy || fields.contentPlan.trim() || fields.strategyBrief.trim();
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
    return "service";
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

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
