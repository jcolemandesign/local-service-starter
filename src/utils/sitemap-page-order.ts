import type { StrategyPageDefinition } from "@/utils/strategy-site-map";

type SitemapPageIdentity = {
  altIndex?: number;
  basePageId?: string;
  clientSlug: string;
  pageId: string;
  pageType?: string;
};

export function sortPagesBySitemap<T>(
  pages: readonly T[],
  pageSlotsByClient: ReadonlyMap<
    string,
    readonly StrategyPageDefinition[]
  >,
  getIdentity: (page: T) => SitemapPageIdentity,
) {
  const originalIndex = new Map(
    pages.map((page, index) => [page, index] as const),
  );
  const clientOrder = new Map<string, number>();

  pages.forEach((page) => {
    const { clientSlug } = getIdentity(page);

    if (!clientOrder.has(clientSlug)) {
      clientOrder.set(clientSlug, clientOrder.size);
    }
  });

  return [...pages].sort((pageA, pageB) => {
    const identityA = getIdentity(pageA);
    const identityB = getIdentity(pageB);
    const clientDifference =
      (clientOrder.get(identityA.clientSlug) ?? 0) -
      (clientOrder.get(identityB.clientSlug) ?? 0);

    if (clientDifference !== 0) {
      return clientDifference;
    }

    const slots = pageSlotsByClient.get(identityA.clientSlug) ?? [];
    const slotDifference =
      getSitemapIndex(identityA, slots) - getSitemapIndex(identityB, slots);

    if (slotDifference !== 0) {
      return slotDifference;
    }

    const canonicalPageIdA = identityA.basePageId ?? identityA.pageId;
    const canonicalPageIdB = identityB.basePageId ?? identityB.pageId;

    if (canonicalPageIdA === canonicalPageIdB) {
      const variantDifference =
        getVariantOrder(identityA) - getVariantOrder(identityB);

      if (variantDifference !== 0) {
        return variantDifference;
      }
    }

    return (
      (originalIndex.get(pageA) ?? 0) - (originalIndex.get(pageB) ?? 0)
    );
  });
}

function getSitemapIndex(
  page: Pick<SitemapPageIdentity, "basePageId" | "pageId" | "pageType">,
  slots: readonly StrategyPageDefinition[],
) {
  const canonicalPageId = page.basePageId ?? page.pageId;
  const exactIndex = slots.findIndex((slot) => slot.id === canonicalPageId);

  if (exactIndex >= 0) {
    return exactIndex;
  }

  const pageType = normalizePageType(page.pageType ?? "");
  const pageTypeIndex = slots.findIndex(
    (slot) => normalizePageType(slot.pageType) === pageType,
  );

  return pageTypeIndex >= 0 ? pageTypeIndex : Number.MAX_SAFE_INTEGER;
}

function getVariantOrder(page: SitemapPageIdentity) {
  return page.basePageId ? (page.altIndex ?? 1) : 0;
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
