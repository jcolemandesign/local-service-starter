import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The nav opens the request-service modal, which reads the app router. Neither
// is what these assertions are about; without the stub the nav cannot render
// outside Next at all.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push() {}, refresh() {}, replace() {} }),
  useSearchParams: () => new URLSearchParams(),
}));

const { NavCenterLogoSectionV2 } = await import(
  "@/components/sections/NavPrimarySectionV2"
);
const { RequestServiceProvider } = await import("@/components/request-service");
const { resolveNavLogoLayout } = await import(
  "@/content/section-style-options"
);

/**
 * The centre-logo nav's split arrangement: a wordmark at the left edge and the
 * compact mark on the centre line.
 *
 * Driven through the component rather than the toggle plumbing, because the
 * thing worth pinning is what the reader sees. The plumbing has its own guards -
 * `section-toggle-props.test.ts` proves the value reaches the element, and
 * `section-toggle-transport.test.ts` proves it survives promotion.
 */

const links = [{ href: "/services", label: "Services" }];

function countImages(markup: string) {
  // Counting <img> elements rather than occurrences of a src: next/image
  // writes the same URL into both `src` and `srcSet`, so a URL count reads
  // two marks where there is one.
  return markup.split("<img").length - 1;
}

function render(props: Record<string, unknown>) {
  return renderToStaticMarkup(
    <RequestServiceProvider>
      <NavCenterLogoSectionV2
        action="Book a visit"
        links={links}
        logoLabel="North Star HVAC"
        phone="(555) 010-1998"
        {...props}
      />
    </RequestServiceProvider>,
  );
}

describe("the centre-logo nav's logo layout", () => {
  it("draws one mark when the layout is unset", () => {
    const markup = render({ logoSrc: "/images/wordmark.svg" });

    expect(countImages(markup)).toBe(1);
    expect(markup).toContain("/images/wordmark.svg");
  });

  it("draws the wordmark and the icon when it is split", () => {
    const markup = render({
      logoIconSrc: "/images/mark.svg",
      logoSrc: "/images/wordmark.svg",
      navLogoLayout: "split",
    });

    expect(countImages(markup)).toBe(2);
    expect(markup).toContain("/images/wordmark.svg");
    expect(markup).toContain("/images/mark.svg");
  });

  it("falls the centre slot back to the wordmark with no icon set", () => {
    // One file is the common case, and a split nav with an empty middle would
    // read as the toggle being broken rather than as a missing asset.
    const markup = render({
      logoSrc: "/images/wordmark.svg",
      navLogoLayout: "split",
    });

    expect(countImages(markup)).toBe(2);
    expect(markup).toContain("/images/wordmark.svg");
  });

  it("draws no centre slot when there is no mark at all", () => {
    // Both slots would otherwise render the same lettered placeholder - the
    // business name twice, which reads as a bug rather than as a brand with no
    // artwork yet.
    const markup = render({ navLogoLayout: "split" });

    expect(countImages(markup)).toBe(0);
    expect(markup.split("North Star HVAC")).toHaveLength(2);
  });
});

describe("the stored value", () => {
  it("resolves anything unrecognised to the shipped arrangement", () => {
    // No saved nav may gain a second mark it was never given.
    expect(resolveNavLogoLayout(undefined)).toBe("center");
    expect(resolveNavLogoLayout("")).toBe("center");
    expect(resolveNavLogoLayout("nonsense")).toBe("center");
    expect(resolveNavLogoLayout("split")).toBe("split");
  });
});
