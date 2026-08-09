/**
 * Client-level identity shared by every page's site chrome.
 *
 * The nav logo and the footer business name were per-page copy fields, one copy
 * on each staged page, so changing the business name meant editing it on every
 * page and nothing kept them in sync afterwards. Nav and footer are site chrome:
 * their copy is deliberately excluded from the page copy spec, so those fields
 * were never seeded either - every one of North Star's sat empty, falling back
 * to the section-library demo.
 *
 * This is injected the same way `navigationLinks` and `homeHref` already are,
 * which is the existing channel for values belonging to the site rather than the
 * page. The per-page field survives as an override, and because `getValue`
 * treats an empty field as absent, "empty means inherit" needs no migration - it
 * is what those fields already hold.
 *
 * The type lives here rather than beside the reader because the render chain
 * reaches `StrategyWorkspaceSection`, which is a client component: a module that
 * imports `node:fs` cannot be pulled into that bundle.
 */
export type SiteIdentity = {
  businessName: string;
  /**
   * Public path to a logo image, e.g. `/images/north-star-logo.svg`. Typed or
   * pasted by hand for now; an upload button is phase two.
   *
   * Empty means the chrome keeps rendering `businessName` as text, which is the
   * previous behaviour, so this can be left unset indefinitely.
   *
   * Rendered through `next/image`, never inlined. That matters for SVG: an
   * inlined SVG executes any script it carries, while one rendered as an image
   * does not - and these files end up on client sites.
   */
  logoSrc: string;
};

export const emptySiteIdentity: SiteIdentity = {
  businessName: "",
  logoSrc: "",
};

/**
 * Only same-origin public paths are accepted. A remote URL would need to be in
 * `next.config` image domains to render, and would leave a client's site
 * depending on someone else's host; a relative path could escape `public/`.
 */
function sanitizeLogoSrc(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "";
  }

  const segments = trimmed.slice(1).split("/");

  return segments.every((segment) => segment && segment !== "." && segment !== "..")
    ? trimmed
    : "";
}

export function sanitizeSiteIdentity(value: unknown): SiteIdentity {
  const record = (value ?? {}) as Partial<SiteIdentity>;

  return {
    businessName:
      typeof record.businessName === "string" ? record.businessName.trim() : "",
    logoSrc: sanitizeLogoSrc(record.logoSrc),
  };
}
