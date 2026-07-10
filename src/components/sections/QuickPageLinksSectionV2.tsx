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
  eyebrow: string;
  pageLinks: QuickPageLink[];
  title: string;
};

export function QuickPageLinksSectionV2({
  eyebrow,
  pageLinks,
  title,
}: QuickPageLinksSectionV2Props) {
  return (
    <section className="bg-white text-service-ink">
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
                className="radius-medium group/page-link grid min-h-28 content-between border border-service-border bg-service-surface/70 p-4 transition-colors hover:border-service-accent hover:bg-white"
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
