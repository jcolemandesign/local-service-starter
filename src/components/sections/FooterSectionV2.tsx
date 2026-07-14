
type FooterLink = {
  label: string;
  href: string;
};

type FooterContact = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

type FooterSectionV2Props = {
  businessName: string;
  description: string;
  quickLinks: FooterLink[];
  services: FooterLink[];
  serviceAreas: FooterLink[];
  contact: FooterContact;
  socialLinks: FooterLink[];
  reviewLink: FooterLink;
  copyright: string;
  privacyLink: FooterLink;
  termsLink?: FooterLink;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SocialIcon({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("instagram")) {
    return (
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          height="16"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          width="16"
          x="4"
          y="4"
        />
        <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="2" />
        <path
          d="M17.5 6.8h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  if (normalizedLabel.includes("linkedin")) {
    return (
      <svg
        aria-hidden="true"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M6.5 10v8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M11 18v-8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M11 13.5c0-2 1.2-3.5 3.2-3.5 2.2 0 3.3 1.4 3.3 3.8V18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M6.5 6.5h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M14 8h2V4h-2c-3 0-5 2-5 5v2H7v4h2v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="fluid-type-frame">
      <h2 className={cx("type-label", "text-white/55")}>{title}</h2>
      <ul className="mt-5 grid gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className={cx(
                "type-text-sm",
                "cursor-pointer font-medium text-white/72 transition-colors hover:text-white",
              )}
              href={link.href}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterSectionV2({
  businessName,
  description,
  quickLinks,
  services,
  serviceAreas,
  contact,
  socialLinks,
  reviewLink,
  copyright,
  privacyLink,
  termsLink,
}: FooterSectionV2Props) {
  return (
    <footer className="token-footer-inverse bg-bg-dark py-16 text-text-inverse max-md:py-12">
      <div className="container-site">
        <div className="grid grid-cols-6 gap-10 max-lg:grid-cols-3 max-md:grid-cols-1">
          <div className={cx("fluid-type-frame", "col-span-2 max-lg:col-span-3 max-md:col-span-1")}>
            <a
              className={cx(
                "radius-medium",
                "type-label",
                "inline-flex min-h-12 min-w-40 cursor-pointer items-center justify-center border border-white/15 bg-white/5 px-5 text-white",
              )}
              href="#"
            >
              {businessName}
            </a>
            <p
              className={cx(
                "type-text-md",
                "measure-copy",
                "wrap-pretty",
                "mt-5 text-white/70",
              )}
            >
              {description}
            </p>
            <ul className="mt-7 flex gap-3" aria-label="Social links">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    aria-label={link.label}
                    className={cx(
                      "radius-medium",
                      "flex size-10 cursor-pointer items-center justify-center border border-white/15 text-white/72 transition-colors hover:border-white/45 hover:text-white",
                    )}
                    href={link.href}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick footer navigation">
            <FooterColumn links={quickLinks} title="Quick Links" />
          </nav>

          <nav aria-label="Footer services navigation">
            <FooterColumn links={services} title="Service" />
          </nav>

          <nav aria-label="Footer service areas navigation">
            <FooterColumn links={serviceAreas} title="Service Areas" />
          </nav>

          <div className="fluid-type-frame">
            <h2 className={cx("type-label", "text-white/55")}>
              Contact
            </h2>
            <address className="mt-5 grid gap-3 not-italic">
              <span className={cx("type-text-sm", "font-medium text-white/72")}>
                {contact.name}
              </span>
              <span
                className={cx(
                  "type-text-sm",
                  "wrap-pretty",
                  "font-medium text-white/72",
                )}
              >
                {contact.address}
              </span>
              <a
                className={cx(
                  "type-text-sm",
                  "cursor-pointer font-medium text-white/72 transition-colors hover:text-white",
                )}
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
              >
                {contact.phone}
              </a>
              <a
                className={cx(
                  "type-text-sm",
                  "cursor-pointer font-medium text-white/72 transition-colors hover:text-white",
                )}
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </address>
          </div>
        </div>

        <div className={cx("fluid-type-frame", "mt-12 flex items-center justify-between gap-6 border-t border-white/10 pt-7 max-md:flex-col max-md:items-start")}>
          <a
            className={cx(
              "type-text-sm",
              "cursor-pointer font-medium text-white/60 transition-colors hover:text-white",
            )}
            href={reviewLink.href}
          >
            {reviewLink.label}
          </a>
          <p className={cx("type-text-sm", "text-center font-medium text-white/60 max-md:text-left")}>
            {copyright}
          </p>
          <nav aria-label="Footer legal navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 max-md:justify-start">
              <li>
                <a
                  className={cx(
                    "type-text-sm",
                    "cursor-pointer font-medium text-white/60 transition-colors hover:text-white",
                  )}
                  href={privacyLink.href}
                >
                  {privacyLink.label}
                </a>
              </li>
              {termsLink ? (
                <li>
                  <a
                    className={cx(
                      "type-text-sm",
                      "cursor-pointer font-medium text-white/60 transition-colors hover:text-white",
                    )}
                    href={termsLink.href}
                  >
                    {termsLink.label}
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
