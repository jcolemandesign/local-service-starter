import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type QuickPageLink = {
  body: string;
  href: string;
  label: string;
  title: string;
};

type QuickPageLinksSectionV2Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow: string;
  pageLinks: QuickPageLink[];
  title: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function QuickPageLinksSectionV2({
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  pageLinks,
  title,
}: QuickPageLinksSectionV2Props) {
  return (
    <section className="bg-bg-page text-service-ink">
      <SevenColumnGrid minHeight="none" padding="sml">
        <SevenColumnGridItem className="col-span-2 max-lg:col-span-7">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <p className="type-text-md mt-heading-body-sm text-service-muted">
              {title}
            </p>
          </div>
        </SevenColumnGridItem>
        <SevenColumnGridItem className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1">
          <nav
            aria-label="Helpful pages"
            className="grid grid-cols-3 gap-3 max-md:grid-cols-1"
          >
            {pageLinks.map((link) => (
              <a
                className={cx(
                  // The fill is an unmodified card token on purpose: the recipe
                  // card context keys on the class itself, so `/70` softening
                  // would leave the card ungrounded. Hover is carried by the
                  // accent border alone, as on the three sibling link grids -
                  // a hover fill change is a no-op under a recipe, where every
                  // card token resolves to the same `--recipe-card`.
                  "radius-medium group/page-link grid min-h-28 content-between border border-service-border bg-service-surface p-4 transition-colors hover:border-service-accent",
                  cardFill === "none" && "!bg-transparent",
                  cardBorder === "off" && "!border-transparent",
                )}
                href={link.href}
                key={link.label}
              >
                <span>
                  <span className="type-label text-service-accent">
                    {link.label}
                  </span>
                  <span className="type-heading-sm mt-2 block text-service-ink">
                    {link.title}
                  </span>
                </span>
                <span className="type-text-sm mt-4 block text-service-muted transition-colors group-hover/page-link:text-service-ink">
                  {link.body}
                </span>
              </a>
            ))}
          </nav>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
