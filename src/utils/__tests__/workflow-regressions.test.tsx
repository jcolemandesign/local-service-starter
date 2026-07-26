import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { NavFloatingBentoSectionV2 } from "@/components/sections/NavFloatingBentoSectionV2";
import { getStagedPageRenderData } from "@/components/sections/StagedPageCanvas";
import { isBuilderRequest } from "@/utils/supabase/middleware";
import { getStagedPreviewHref } from "@/utils/staged-page-links";
import {
  isStrategySyncTarget,
  type StagedPage,
} from "@/utils/staged-pages";
import { validateTemplateStructure } from "@/utils/template-structure";

vi.mock("@/components/request-service/RequestServiceModal", () => ({
  RequestServiceButton: ({ children }: { children: ReactNode }) =>
    createElement("button", null, children),
}));

const clientSlug = "north-star-hvac";
const canonicalNavigation = [
  { href: "/", label: "Home", pageId: "home" },
  { href: "/services", label: "Services", pageId: "services" },
  {
    href: "/services/system-replacement",
    label: "System Replacement",
    pageId: "system-replacement",
  },
  {
    href: "/services/heat-pump-service",
    label: "Heat Pump Service",
    pageId: "heat-pump-service",
  },
  {
    href: "/services/maintenance",
    label: "Maintenance",
    pageId: "maintenance",
  },
  {
    href: "/services/ac-repair",
    label: "AC Repair",
    pageId: "ac-repair",
  },
];

function makePage(
  pageId: string,
  pageLabel: string,
  pageType: string,
): StagedPage {
  const href =
    pageId === "home"
      ? "/"
      : pageId === "services"
        ? "/services"
        : `/services/${pageId}`;

  return {
    fieldCounts: { copy: 0, image: 0, link: 0, meta: 0 },
    fields: [],
    navigation: canonicalNavigation,
    pageHref: href,
    pageId,
    pageLabel,
    previewHref: `/dev/staged-pages/${pageId}`,
    promotedAt: "2026-01-01T00:00:00.000Z",
    snapshot: {
      clientSlug,
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "snapshot-1",
      version: 1,
    },
    sourceStage: "strategy-template",
    template: {
      id: `${pageId}-template`,
      name: `${pageLabel} template`,
      pageType,
      sectionCount: 0,
      sections: [],
    },
  };
}

describe("staged preview links", () => {
  it("always includes the client identity", () => {
    expect(
      getStagedPreviewHref({
        clientSlug,
        pageId: "home",
        previewHref: "/dev/staged-pages/home",
      }),
    ).toBe("/dev/staged-pages/home?client=north-star-hvac");
  });

  it("preserves existing query parameters", () => {
    expect(
      getStagedPreviewHref({
        clientSlug,
        pageId: "home",
        previewHref: "/dev/staged-pages/home?mode=compare",
      }),
    ).toBe(
      "/dev/staged-pages/home?mode=compare&client=north-star-hvac",
    );
  });
});

describe("staged navigation rendering", () => {
  it("uses canonical sitemap order instead of staged-file write order", () => {
    const pages = [
      makePage("home", "Home", "Home"),
      makePage("services", "Services Overview", "Services Overview"),
      makePage("heat-pump-service", "Heat Pump Service", "Individual Service"),
      makePage("ac-repair", "AC Repair", "Individual Service"),
      makePage("maintenance", "Maintenance", "Individual Service"),
      makePage(
        "system-replacement",
        "System Replacement",
        "Individual Service",
      ),
    ];
    const renderData = getStagedPageRenderData(pages[1], pages);
    const services = renderData.navigationLinks.find(
      (link) => link.label === "Services",
    );

    expect(services?.items?.map((item) => item.label)).toEqual([
      "Services Overview",
      "System Replacement",
      "Heat Pump Service",
      "Maintenance",
      "AC Repair",
    ]);
  });
});

describe("strategy synchronization targets", () => {
  const pageSlots = [
    {
      aliases: ["services"],
      copyField: "servicesCopy",
      id: "services",
      label: "Services",
      pageType: "Services Overview",
      path: "/services",
    },
  ];

  it("requires an active page at an exact canonical slot", () => {
    const active = makePage("services", "Services", "Services Overview");
    const alt: StagedPage = {
      ...active,
      pageId: "services-alt1",
      variant: {
        altIndex: 1,
        basePageId: "services",
        role: "alt",
      },
    };

    expect(isStrategySyncTarget(active, clientSlug, pageSlots)).toBe(true);
    expect(isStrategySyncTarget(alt, clientSlug, pageSlots)).toBe(false);
    expect(
      isStrategySyncTarget(
        makePage("services-legacy", "Services", "Services Overview"),
        clientSlug,
        pageSlots,
      ),
    ).toBe(false);
  });
});

describe("floating navigation links", () => {
  it("renders supplied top-level hrefs", () => {
    const html = renderToStaticMarkup(
      createElement(NavFloatingBentoSectionV2, {
        action: "Book service",
        links: [{ href: "/about", label: "About" }],
        logoLabel: "North Star",
        phone: "555-014-2250",
      }),
    );

    expect(html).toContain('href="/about"');
  });
});

describe("template structure validation", () => {
  const navigation = { component: "NavPrimarySectionV2", mode: "Navigation" };
  const hero = { component: "HeroCompactSectionV3", mode: "Hero" };
  const footer = { component: "FooterSectionV3", mode: "Utility" };

  it("accepts one navigation, no more than one hero, and one footer", () => {
    expect(() =>
      validateTemplateStructure([navigation, hero, footer]),
    ).not.toThrow();
  });

  it("rejects duplicate navigation sections", () => {
    expect(() =>
      validateTemplateStructure([navigation, navigation, footer]),
    ).toThrow("exactly one navigation");
  });

  it("rejects multiple hero sections", () => {
    expect(() =>
      validateTemplateStructure([navigation, hero, hero, footer]),
    ).toThrow("at most one hero");
  });
});

describe("builder request boundaries", () => {
  it("protects dev pages and internal APIs but leaves intake public", () => {
    expect(isBuilderRequest("/dev/templates")).toBe(true);
    expect(isBuilderRequest("/api/agent-export")).toBe(true);
    expect(isBuilderRequest("/api/staged-pages")).toBe(true);
    expect(isBuilderRequest("/api/intake")).toBe(false);
    expect(isBuilderRequest("/")).toBe(false);
  });
});
