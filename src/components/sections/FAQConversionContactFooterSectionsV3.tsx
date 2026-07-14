import type { ReactNode } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type FAQItem = {
  answer: string;
  question: string;
};

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

type FAQSectionV3Props = {
  body: string;
  eyebrow: string;
  items: readonly FAQItem[];
  title: string;
};

type CTASectionV3Props = {
  action: string;
  body: string;
  title: string;
};

type CTAFullscreenSectionV3Props = {
  action: string;
  body: string;
  eyebrow: string;
  title: string;
};

type ContactSectionV3Props = {
  body: string;
  details: readonly string[];
  eyebrow: string;
  title: string;
};

type FooterSectionV3Props = {
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

function SocialIcon({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("instagram")) {
    return (
      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
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
      <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
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
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
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
  links,
  title,
}: {
  links: readonly FooterLink[];
  title: string;
}) {
  return (
    <div className="fluid-type-frame">
      <h2 className="type-label text-white/55">{title}</h2>
      <ul className="mt-heading-body-sm grid card-grid-gap-sml">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
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

function FooterInlineGroup({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="grid grid-cols-[8rem_minmax(0,1fr)] items-start gap-x-5 gap-y-2 border-t border-white/10 py-4 max-md:grid-cols-1">
      <h2 className="type-label text-white/55">{title}</h2>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function FooterInlineLinks({ links }: { links: readonly FooterLink[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
            href={link.href}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function PlaceholderBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-10 border border-white/45 max-md:inset-6" />
      <div className="radius-medium absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        Image
      </div>
    </div>
  );
}

export function FAQSectionV3({
  body,
  eyebrow,
  items,
  title,
}: FAQSectionV3Props) {
  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem className="col-span-3 max-lg:col-span-7">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">{title}</h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1">
          <div className="grid card-grid-gap-med">
            {items.map((item) => (
              <article
                className="content-padding fluid-type-frame radius-medium border border-service-border bg-bg-page shadow-service"
                key={item.question}
              >
                <h3 className="type-heading-sm text-service-ink">
                  {item.question}
                </h3>
                <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function CTASectionV3({ action, body, title }: CTASectionV3Props) {
  return (
    <section className="bg-bg-dark text-text-inverse">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem className="col-span-5 max-lg:col-span-7">
          <div className="fluid-type-frame">
            <h2 className="type-heading-xl">{title}</h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-white/75">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="right"
          alignY="middle"
          className="col-span-2 col-start-6 max-lg:col-span-7 max-lg:col-start-1 max-lg:justify-items-start"
        >
          <RequestServiceButton
            className="shrink-0 border-bg-page bg-bg-page text-service-ink hover:bg-service-surface"
            variant="secondary"
          >
            {action}
          </RequestServiceButton>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function CTAFullscreenSectionV3({
  action,
  body,
  eyebrow,
  title,
}: CTAFullscreenSectionV3Props) {
  return (
    <section className="relative overflow-hidden bg-bg-dark text-text-inverse">
      <PlaceholderBackground />
      <div aria-hidden="true" className="absolute inset-0 bg-bg-dark/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/35 to-service-ink/10"
      />

      <SevenColumnGrid className="relative z-10 min-h-[80svh] grid-rows-[1fr_auto_1fr]">
        <div className="col-span-7" />
        <SevenColumnGridItem
          alignX="center"
          className="col-span-5 col-start-2 row-start-2 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="fluid-type-frame mx-auto w-full text-center">
            <p className="type-label text-white/75">{eyebrow}</p>
            <h2 className="type-display-lg mx-auto max-w-5xl">{title}</h2>
            <p className="type-text-xl wrap-pretty mx-auto mt-display-body text-white/80">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>
        <SevenColumnGridItem
          alignX="center"
          alignY="bottom"
          className="col-span-7 row-start-3 mt-body-actions-md max-md:mt-body-actions-sm"
        >
          <div className="flex w-full justify-center">
            <RequestServiceButton
              className="w-auto max-w-max shrink-0 border-bg-page bg-bg-page text-service-ink hover:bg-service-surface"
              variant="secondary"
            >
              {action}
            </RequestServiceButton>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function ContactSectionV3({
  body,
  details,
  eyebrow,
  title,
}: ContactSectionV3Props) {
  return (
    <section className="bg-bg-page" id="contact">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem className="col-span-2 col-start-2 max-lg:col-span-7 max-lg:col-start-1">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">{title}</h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>

            <ul className="mt-body-actions-md grid card-grid-gap-sml">
              {details.map((detail) => (
                <li
                  className="type-text-md wrap-pretty font-semibold text-service-ink"
                  key={detail}
                >
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-3 col-start-4 max-lg:col-span-7 max-lg:col-start-1">
          <div className="content-padding fluid-type-frame radius-medium border border-service-border bg-service-surface shadow-service">
            <form className="grid card-grid-gap-med">
              <label className="type-text-sm grid card-grid-gap-sml font-semibold text-service-ink">
                Name
                <input
                  className="radius-4 min-h-12 border border-service-border bg-bg-page px-4 text-base font-normal outline-none transition-colors focus:border-service-accent"
                  placeholder="Jane Smith"
                  type="text"
                />
              </label>
              <label className="type-text-sm grid card-grid-gap-sml font-semibold text-service-ink">
                Service needed
                <input
                  className="radius-4 min-h-12 border border-service-border bg-bg-page px-4 text-base font-normal outline-none transition-colors focus:border-service-accent"
                  placeholder="Repair, installation, maintenance"
                  type="text"
                />
              </label>
              <label className="type-text-sm grid card-grid-gap-sml font-semibold text-service-ink">
                Message
                <textarea
                  className="radius-4 min-h-32 border border-service-border bg-bg-page px-4 py-3 text-base font-normal outline-none transition-colors focus:border-service-accent"
                  placeholder="Briefly describe the issue"
                />
              </label>
              <button
                className="radius-button type-label min-h-12 cursor-pointer bg-service-accent px-6 text-text-inverse transition-colors hover:bg-bg-dark"
                type="button"
              >
                Submit preview
              </button>
            </form>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function FooterSectionV3({
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
}: FooterSectionV3Props) {
  return (
    <footer className="token-footer-inverse bg-bg-dark text-text-inverse">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem className="col-span-2 max-lg:col-span-7">
          <div className="fluid-type-frame">
            <a
              className="radius-medium type-label inline-flex min-h-12 min-w-40 cursor-pointer items-center justify-center border border-white/15 bg-white/5 px-5 text-white"
              href="#"
            >
              {businessName}
            </a>
            <p className="type-text-md wrap-pretty mt-heading-body-sm text-white/70">
              {description}
            </p>
            <ul aria-label="Social links" className="mt-body-actions-sm flex inline-gap-sml">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    aria-label={link.label}
                    className="radius-medium flex size-10 cursor-pointer items-center justify-center border border-white/15 text-white/72 transition-colors hover:border-white/45 hover:text-white"
                    href={link.href}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-1 col-start-3 max-lg:col-span-2 max-lg:col-start-1 max-md:col-span-7">
          <nav aria-label="Quick footer navigation">
            <FooterColumn links={quickLinks} title="Quick Links" />
          </nav>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-1 col-start-4 max-lg:col-span-2 max-lg:col-start-3 max-md:col-span-7 max-md:col-start-1">
          <nav aria-label="Footer services navigation">
            <FooterColumn links={services} title="Service" />
          </nav>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-1 col-start-5 max-lg:col-span-2 max-lg:col-start-5 max-md:col-span-7 max-md:col-start-1">
          <nav aria-label="Footer service areas navigation">
            <FooterColumn links={serviceAreas} title="Service Areas" />
          </nav>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-2 col-start-6 max-lg:col-span-7 max-lg:col-start-1">
          <div className="fluid-type-frame">
            <h2 className="type-label text-white/55">Contact</h2>
            <address className="mt-heading-body-sm grid card-grid-gap-sml not-italic">
              <span className="type-text-sm font-medium text-white/72">
                {contact.name}
              </span>
              <span className="type-text-sm wrap-pretty font-medium text-white/72">
                {contact.address}
              </span>
              <a
                className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
              >
                {contact.phone}
              </a>
              <a
                className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </address>
          </div>
        </SevenColumnGridItem>

        <div className="fluid-type-frame col-span-7 mt-body-actions-sm flex items-center justify-between inline-gap-lrg border-t border-white/10 pt-[var(--inline-gap-active)] max-md:flex-col max-md:items-start">
          <a
            className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
            href={reviewLink.href}
          >
            {reviewLink.label}
          </a>
          <p className="type-text-sm text-center font-medium text-white/60 max-md:text-left">
            {copyright}
          </p>
          <nav aria-label="Footer legal navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 max-md:justify-start">
              <li>
                <a
                  className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
                  href={privacyLink.href}
                >
                  {privacyLink.label}
                </a>
              </li>
              {termsLink ? (
                <li>
                  <a
                    className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
                    href={termsLink.href}
                  >
                    {termsLink.label}
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </SevenColumnGrid>
    </footer>
  );
}

export function FooterHorizontalSectionV3({
  businessName,
  contact,
  copyright,
  privacyLink,
  quickLinks,
  reviewLink,
  serviceAreas,
  services,
  socialLinks,
  termsLink,
}: FooterSectionV3Props) {
  return (
    <footer className="token-footer-inverse bg-bg-dark text-text-inverse">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem className="col-span-2 max-lg:col-span-7">
          <div className="fluid-type-frame">
            <a
              className="radius-medium type-label inline-flex min-h-12 min-w-40 cursor-pointer items-center justify-center border border-white/15 bg-white/5 px-5 text-white"
              href="#"
            >
              {businessName}
            </a>
            <ul
              aria-label="Social links"
              className="mt-body-actions-sm flex inline-gap-sml"
            >
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    aria-label={link.label}
                    className="radius-medium flex size-10 cursor-pointer items-center justify-center border border-white/15 text-white/72 transition-colors hover:border-white/45 hover:text-white"
                    href={link.href}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1">
          <nav aria-label="Horizontal footer navigation">
            <FooterInlineGroup title="Quick Links">
              <FooterInlineLinks links={quickLinks} />
            </FooterInlineGroup>
            <FooterInlineGroup title="Service">
              <FooterInlineLinks links={services} />
            </FooterInlineGroup>
            <FooterInlineGroup title="Service Areas">
              <FooterInlineLinks links={serviceAreas} />
            </FooterInlineGroup>
            <FooterInlineGroup title="Contact">
              <address className="flex flex-wrap gap-x-5 gap-y-2 not-italic">
                <span className="type-text-sm font-medium text-white/72">
                  {contact.name}
                </span>
                <span className="type-text-sm wrap-pretty font-medium text-white/72">
                  {contact.address}
                </span>
                <a
                  className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
                >
                  {contact.phone}
                </a>
                <a
                  className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
                  href={`mailto:${contact.email}`}
                >
                  {contact.email}
                </a>
              </address>
            </FooterInlineGroup>
          </nav>
        </SevenColumnGridItem>

        <div className="fluid-type-frame col-span-7 flex items-center justify-between inline-gap-lrg border-t border-white/10 pt-[var(--inline-gap-active)] max-md:flex-col max-md:items-start">
          <a
            className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
            href={reviewLink.href}
          >
            {reviewLink.label}
          </a>
          <p className="type-text-sm text-center font-medium text-white/60 max-md:text-left">
            {copyright}
          </p>
          <nav aria-label="Footer legal navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 max-md:justify-start">
              <li>
                <a
                  className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
                  href={privacyLink.href}
                >
                  {privacyLink.label}
                </a>
              </li>
              {termsLink ? (
                <li>
                  <a
                    className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
                    href={termsLink.href}
                  >
                    {termsLink.label}
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </SevenColumnGrid>
    </footer>
  );
}

export function FooterCompactSectionV3({
  businessName,
  contact,
  copyright,
  privacyLink,
  quickLinks,
  reviewLink,
  socialLinks,
  termsLink,
}: FooterSectionV3Props) {
  return (
    <footer className="token-footer-inverse bg-bg-dark text-text-inverse">
      <SevenColumnGrid className="section-min-none" padding="sml">
        <SevenColumnGridItem className="col-span-2 max-lg:col-span-7">
          <div className="fluid-type-frame">
            <a
              className="radius-medium type-label inline-flex min-h-12 min-w-40 cursor-pointer items-center justify-center border border-white/15 bg-white/5 px-5 text-white"
              href="#"
            >
              {businessName}
            </a>
            <ul
              aria-label="Social links"
              className="mt-body-actions-sm flex inline-gap-sml"
            >
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    aria-label={link.label}
                    className="radius-medium flex size-10 cursor-pointer items-center justify-center border border-white/15 text-white/72 transition-colors hover:border-white/45 hover:text-white"
                    href={link.href}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-5 col-start-3 max-lg:col-span-7 max-lg:col-start-1">
          <div className="grid gap-4">
            <nav aria-label="Condensed footer navigation">
              <FooterInlineLinks links={quickLinks} />
            </nav>

            <div className="border-t border-white/10 pt-4">
              <address className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 not-italic">
                <span className="type-text-sm font-medium text-white/72">
                  {contact.name}
                </span>
                <span className="type-text-sm wrap-pretty font-medium text-white/72">
                  {contact.address}
                </span>
                <a
                  className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
                >
                  {contact.phone}
                </a>
                <a
                  className="type-text-sm cursor-pointer font-medium text-white/72 transition-colors hover:text-white"
                  href={`mailto:${contact.email}`}
                >
                  {contact.email}
                </a>
              </address>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-4">
              <a
                className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
                href={reviewLink.href}
              >
                {reviewLink.label}
              </a>
              <p className="type-text-sm font-medium text-white/60">
                {copyright}
              </p>
              <nav aria-label="Footer legal navigation">
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <li>
                    <a
                      className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
                      href={privacyLink.href}
                    >
                      {privacyLink.label}
                    </a>
                  </li>
                  {termsLink ? (
                    <li>
                      <a
                        className="type-text-sm cursor-pointer font-medium text-white/60 transition-colors hover:text-white"
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
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </footer>
  );
}
