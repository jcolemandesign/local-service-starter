export type PromptLibraryPageGroupKey =
  | "core"
  | "repeatable-services"
  | "service-areas"
  | "content-resources"
  | "supporting";

type PromptLibraryPageIdentity = {
  id: string;
  label: string;
  pageType: string;
};

const promptLibraryPageGroupOrder: PromptLibraryPageGroupKey[] = [
  "core",
  "repeatable-services",
  "service-areas",
  "content-resources",
  "supporting",
];

export function sortByPromptLibraryPageOrder<
  T extends PromptLibraryPageIdentity,
>(pages: readonly T[]) {
  return pages.toSorted((pageA, pageB) => {
    const groupDifference =
      getPromptLibraryPageGroupRank(pageA) -
      getPromptLibraryPageGroupRank(pageB);

    if (groupDifference !== 0) {
      return groupDifference;
    }

    if (getPromptLibraryPageGroupKey(pageA) === "core") {
      return getCorePageSortOrder(pageA) - getCorePageSortOrder(pageB);
    }

    return pageA.label.localeCompare(pageB.label);
  });
}

export function getPromptLibraryPageGroupKey(
  page: PromptLibraryPageIdentity,
): PromptLibraryPageGroupKey {
  const normalizedPageType = normalizePageKey(page.pageType);
  const normalizedId = normalizePageKey(page.id);

  if (
    ["home", "services", "about", "contact"].includes(normalizedId) ||
    ["home", "services-overview", "about", "contact"].includes(
      normalizedPageType,
    )
  ) {
    return "core";
  }

  if (normalizedPageType === "individual-service") {
    return "repeatable-services";
  }

  if (normalizedPageType === "service-area") {
    return "service-areas";
  }

  if (
    normalizedPageType.includes("blog") ||
    normalizedPageType.includes("product")
  ) {
    return "content-resources";
  }

  return "supporting";
}

function getPromptLibraryPageGroupRank(page: PromptLibraryPageIdentity) {
  return promptLibraryPageGroupOrder.indexOf(
    getPromptLibraryPageGroupKey(page),
  );
}

function getCorePageSortOrder(page: PromptLibraryPageIdentity) {
  const normalizedValues = [page.id, page.pageType, page.label].map(
    normalizePageKey,
  );
  const coreOrder = [
    ["home", "homepage"],
    ["about"],
    ["services", "services-overview"],
    ["contact"],
  ];
  const matchIndex = coreOrder.findIndex((aliases) =>
    aliases.some((alias) => normalizedValues.includes(alias)),
  );

  return matchIndex === -1 ? coreOrder.length : matchIndex;
}

function normalizePageKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
