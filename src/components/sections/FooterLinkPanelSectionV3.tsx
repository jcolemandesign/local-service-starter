import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FooterLink = {
  href: string;
  label: string;
};

type FooterContact = {
  address: string;
  email: string;
  name: string;
  phone: string;
};

type FooterLinkPanelSectionV3Props = {
  businessName: string;
  contact: FooterContact;
  copyright: string;
  description: string;
  privacyLink: FooterLink;
  quickLinks: readonly FooterLink[];
  reviewLink: FooterLink;
  serviceAreas: readonly FooterLink[];
  services: readonly FooterLink[];
  socialLinks: readonly FooterLink[];
  termsLink?: FooterLink;
};

function FooterPanelHeading({ children }: { children: string }) {
  return (
    <div>
      <h2 className="type-heading-sm text-service-accent">{children}</h2>
      <div className="mt-heading-body-sm h-px bg-service-border" />
    </div>
  );
}

function FooterArrowLinks({
  links,
  title,
}: {
  links: readonly FooterLink[];
  title: string;
}) {
  return (
    <nav aria-label={title} className="fluid-type-frame">
      <FooterPanelHeading>{title}</FooterPanelHeading>
      <ul className="mt-body-actions-sm grid inline-gap-med">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className="group inline-grid w-fit grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3 type-heading-sm text-service-ink transition-colors hover:text-service-accent"
              href={link.href}
            >
              <span
                aria-hidden="true"
                className="text-3xl font-normal leading-none text-service-accent transition-transform group-hover:translate-x-1"
              >
                &gt;
              </span>
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SocialMark({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();
  const mark = normalizedLabel.includes("facebook")
    ? "f"
    : normalizedLabel.includes("instagram")
      ? "ig"
      : normalizedLabel.includes("linkedin")
        ? "in"
        : normalizedLabel.includes("google")
          ? "g"
          : label.slice(0, 2).toLowerCase();

  return <span aria-hidden="true">{mark}</span>;
}

export function FooterLinkPanelSectionV3({
  businessName,
  contact,
  copyright,
  description,
  privacyLink,
  quickLinks,
  reviewLink,
  serviceAreas,
  services,
  socialLinks,
  termsLink,
}: FooterLinkPanelSectionV3Props) {
  return (
    <footer className="relative overflow-hidden bg-bg-page text-service-ink">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-[48%] border-l border-service-border bg-service-surface/70 max-lg:hidden"
      />
      <SevenColumnGrid
        className="relative z-10 section-min-none items-start"
        padding="med"
      >
        <SevenColumnGridItem className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="fluid-type-frame">
            <FooterPanelHeading>Serving You</FooterPanelHeading>
            <p className="type-text-lg wrap-pretty mt-body-actions-sm font-semibold text-service-ink">
              {description}
            </p>
            <p className="type-text-md mt-heading-body-sm font-semibold text-service-ink">
              {businessName}
            </p>
            <address className="type-text-md mt-1 not-italic text-service-muted">
              {contact.address}
            </address>

            <div className="mt-body-actions-md grid inline-gap-sml">
              {serviceAreas.slice(0, 4).map((area) => (
                <a
                  className="w-fit type-text-md font-semibold text-service-ink transition-colors hover:text-service-accent"
                  href={area.href}
                  key={area.label}
                >
                  {area.label}
                </a>
              ))}
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-2 col-start-3 max-lg:col-span-3 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid gap-[var(--section-space-sml)]">
            <FooterArrowLinks links={services} title="Services" />
            <FooterArrowLinks links={quickLinks} title="About Us" />
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-2 col-start-6 max-lg:col-span-2 max-lg:col-start-4 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1">
          <div className="fluid-type-frame">
            <FooterPanelHeading>Get In Touch</FooterPanelHeading>
            <address className="mt-body-actions-sm grid inline-gap-sml not-italic">
              <a
                className="w-fit type-heading-sm text-service-ink underline decoration-service-accent decoration-2 underline-offset-4 transition-colors hover:text-service-accent"
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
              >
                {contact.phone}
              </a>
              <a
                className="w-fit type-heading-sm text-service-ink underline decoration-service-accent decoration-2 underline-offset-4 transition-colors hover:text-service-accent"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
              <a
                className="w-fit type-heading-sm text-service-ink underline decoration-service-accent decoration-2 underline-offset-4 transition-colors hover:text-service-accent"
                href={reviewLink.href}
              >
                {reviewLink.label}
              </a>
            </address>

            <div className="mt-body-actions-md">
              <FooterPanelHeading>Connect</FooterPanelHeading>
              <ul
                aria-label="Social links"
                className="mt-body-actions-sm flex flex-wrap gap-3"
              >
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      aria-label={link.label}
                      className="flex size-10 items-center justify-center rounded-sm bg-service-accent text-sm font-black uppercase tracking-normal text-white transition-colors hover:bg-service-ink"
                      href={link.href}
                    >
                      <SocialMark label={link.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <a
              className="radius-button mt-body-actions-md inline-flex min-h-16 w-fit min-w-72 items-center justify-center gap-4 bg-service-accent px-8 type-heading-sm text-white transition-colors hover:bg-service-ink max-sm:min-w-0 max-sm:w-full"
              href="#"
            >
              Back To Top
              <span aria-hidden="true" className="text-3xl leading-none">
                ^
              </span>
            </a>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-7 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
          <div className="mt-[var(--section-space-sml)] flex flex-wrap items-center justify-between gap-4 border-t border-service-border pt-5">
            <p className="type-text-sm text-service-muted">{copyright}</p>
            <nav aria-label="Footer legal navigation">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                <li>
                  <a
                    className="type-text-sm font-semibold text-service-muted transition-colors hover:text-service-accent"
                    href={privacyLink.href}
                  >
                    {privacyLink.label}
                  </a>
                </li>
                {termsLink ? (
                  <li>
                    <a
                      className="type-text-sm font-semibold text-service-muted transition-colors hover:text-service-accent"
                      href={termsLink.href}
                    >
                      {termsLink.label}
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </footer>
  );
}
