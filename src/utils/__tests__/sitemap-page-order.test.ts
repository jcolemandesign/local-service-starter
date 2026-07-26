import { describe, expect, it } from "vitest";
import type { StrategyPageDefinition } from "@/utils/strategy-site-map";
import { sortPagesBySitemap } from "@/utils/sitemap-page-order";

const slots: StrategyPageDefinition[] = [
  {
    aliases: [],
    copyField: "homepageCopy",
    id: "home",
    label: "Home",
    pageType: "Home",
    path: "/",
  },
  {
    aliases: [],
    copyField: "servicesCopy",
    id: "services",
    label: "Services",
    pageType: "Services",
    path: "/services",
  },
  {
    aliases: [],
    copyField: "serviceCopy",
    id: "heating",
    label: "Heating",
    pageType: "Individual Service",
    parentId: "services",
    path: "/services/heating",
  },
  {
    aliases: [],
    copyField: "aboutCopy",
    id: "about",
    label: "About",
    pageType: "About",
    path: "/about",
  },
];

describe("sortPagesBySitemap", () => {
  it("uses each client's sitemap while preserving stable order within a slot", () => {
    const pages = [
      { clientSlug: "alpha", pageId: "about", pageType: "About" },
      {
        altIndex: 1,
        basePageId: "heating",
        clientSlug: "alpha",
        pageId: "heating-alt1",
        pageType: "Individual Service",
      },
      { clientSlug: "alpha", pageId: "home", pageType: "Home" },
      { clientSlug: "alpha", pageId: "heating", pageType: "Individual Service" },
      { clientSlug: "alpha", pageId: "services", pageType: "Services" },
    ];

    expect(
      sortPagesBySitemap(
        pages,
        new Map([["alpha", slots]]),
        (page) => page,
      ).map((page) => page.pageId),
    ).toEqual([
      "home",
      "services",
      "heating",
      "heating-alt1",
      "about",
    ]);
  });
});
