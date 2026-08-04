import { describe, expect, it } from "vitest";

import { findDeadRouteLinks } from "@/utils/site-export";

/**
 * Nav and footer links resolve from the client's whole sitemap rather than
 * from the approved subset, so a site exported from two approved pages ships a
 * nav pointing at every other page in the sitemap.
 *
 * Measured on a real two-page export of the North Star home and AC Repair
 * pages: ten internal links - /about, /contact, /financing, /privacy-policy,
 * /service-area, /services, /services/maintenance,
 * /services/system-replacement, /specials, /terms - all returned 404 from the
 * generated site, and the export reported nothing.
 */
describe("dead internal links in an export", () => {
  it("reports a link to a route the export does not generate", () => {
    const nav = {
      navigationLinks: [
        { href: "/", label: "Home" },
        { href: "/services/ac-repair", label: "AC Repair" },
        { href: "/about", label: "About" },
      ],
    };

    expect(findDeadRouteLinks([nav], ["/", "/services/ac-repair"])).toEqual([
      "/about",
    ]);
  });

  it("finds links nested in arrays and dropdown items", () => {
    const nav = {
      navLinks: [
        {
          href: "/services",
          items: [{ href: "/services/maintenance", label: "Maintenance" }],
        },
      ],
    };

    expect(findDeadRouteLinks([nav], ["/"])).toEqual([
      "/services",
      "/services/maintenance",
    ]);
  });

  it("says nothing when every link has a generated route", () => {
    const props = { ctaHref: "/contact", logoHref: "/" };

    expect(findDeadRouteLinks([props], ["/", "/contact"])).toEqual([]);
  });

  /**
   * `logoHref` is "/" and the logo image sits beside it as a path with an
   * extension. Asset references are owned by `validateReferencedAssets`, which
   * fails the export outright when a file is missing - counting them here
   * would report a shipped image as a dead route.
   */
  it("ignores hrefs that name a file", () => {
    const props = {
      logoHref: "/images/northstar logo 1.2.svg",
      styleHref: "/_next/static/css/862f88b616a43f20.css",
    };

    expect(findDeadRouteLinks([props], ["/"])).toEqual([]);
  });

  it("ignores external and anchor links", () => {
    const props = {
      anchorHref: "#main",
      externalHref: "https://example.com/about",
      protocolRelativeHref: "//cdn.example.com/about",
      telHref: "tel:+15555550123",
    };

    expect(findDeadRouteLinks([props], ["/"])).toEqual([]);
  });

  /**
   * A trailing slash and a query string address the same route. Reporting
   * "/about/" as dead next to a generated "/about" would be noise.
   */
  it("normalises trailing slashes and ignores query strings", () => {
    const props = { a: { href: "/about/" }, b: { href: "/about?utm=x" } };

    expect(findDeadRouteLinks([props], ["/about"])).toEqual([]);
    expect(findDeadRouteLinks([props], ["/"])).toEqual(["/about"]);
  });

  it("reports each dead route once across every page and section", () => {
    const navOnPageOne = { href: "/financing" };
    const navOnPageTwo = { href: "/financing" };

    expect(
      findDeadRouteLinks([navOnPageOne, navOnPageTwo], ["/"]),
    ).toEqual(["/financing"]);
  });
});
