/**
 * Alt-variant vocabulary for staged pages, kept apart from `staged-pages.ts`
 * because that module reads the filesystem at import time and these helpers are
 * needed inside client components (the staged page canvas filters alts out of
 * the site nav). Structural parameter types keep this module free of any
 * dependency back on the record type.
 */

/**
 * Marks a staged page as an archived alternate of another page rather than the
 * live one for its slot.
 *
 * An alt is a full staged page with its own `pageId` (`<base>-alt1`), so the
 * preview route, content editor, and debug view address it with no special
 * casing. What the marker buys is the ability to keep alts out of the places
 * that must show exactly one page per slot - site navigation and export.
 *
 * `altIndex` is a stable slot, not a recency rank: a demoted page takes the
 * lowest free index and keeps it. Renumbering on every stage would move the
 * URL of a page you already have open in the other tab, which defeats the
 * point of staging an alternate to compare against.
 */
export type StagedPageVariant = {
  altIndex?: number;
  archivedAt?: string;
  basePageId: string;
  role: "active" | "alt";
};

type VariantBearing = {
  variant?: StagedPageVariant;
};

type AltGroupable = VariantBearing & {
  pageId: string;
  snapshot: {
    clientSlug: string;
  };
};

/** A record with no `variant` predates alts and is therefore the live page. */
export function isAltStagedPage(page: VariantBearing) {
  return page.variant?.role === "alt";
}

export function getBasePageId(page: VariantBearing & { pageId: string }) {
  return page.variant?.basePageId ?? page.pageId;
}

/**
 * The pages that represent the site itself - one per slot. Every surface that
 * answers "what pages does this client have" wants this, not the raw list.
 */
export function getActiveStagedPages<T extends VariantBearing>(pages: T[]) {
  return pages.filter((page) => !isAltStagedPage(page));
}

export function getAltStagedPages<T extends AltGroupable>(
  pages: T[],
  page: Pick<AltGroupable, "pageId" | "snapshot">,
) {
  return pages
    .filter(
      (candidate) =>
        isAltStagedPage(candidate) &&
        candidate.snapshot.clientSlug === page.snapshot.clientSlug &&
        getBasePageId(candidate) === page.pageId,
    )
    .sort((a, b) => (a.variant?.altIndex ?? 0) - (b.variant?.altIndex ?? 0));
}

export function getAltPageId(basePageId: string, altIndex: number) {
  return `${basePageId}-alt${altIndex}`;
}

/**
 * Lowest index not currently occupied for this base page. Reusing a freed slot
 * keeps alt addresses short and predictable across many stage/promote cycles.
 *
 * Tested against every page id the client has rather than just the alt indexes,
 * because nothing stops a page from being slugged "<base>-alt1" outright - and
 * two records sharing a page id would make the pair unaddressable.
 */
export function getNextAltIndex<T extends AltGroupable>(
  pages: T[],
  page: AltGroupable,
) {
  const takenIds = new Set(
    pages
      .filter(
        (candidate) =>
          candidate.snapshot.clientSlug === page.snapshot.clientSlug,
      )
      .map((candidate) => candidate.pageId),
  );
  let altIndex = 1;

  while (takenIds.has(getAltPageId(page.pageId, altIndex))) {
    altIndex += 1;
  }

  return altIndex;
}
