import type { CSSProperties, ReactNode } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";

export type ContactStripBentoSectionV3Props = {
  address: string;
  afterHoursBody: string;
  afterHoursLabel: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  email: string;
  emailLabel: string;
  hours: string;
  hoursLabel: string;
  icons?: SectionIcons;
  locationLabel: string;
  phone: string;
  phoneLabel: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const recipeClasses = {
  card: "bg-service-surface",
  cardBorder: "border-service-border",
  divider: "border-service-border",
  icon: "text-service-accent",
  iconShell: "bg-service-accent/10",
  muted: "text-service-muted",
  section: "bg-bg-page",
  text: "text-service-ink",
};

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <path
        d="M8.2 5.5h4.1l2 6-2.7 2.2a19.1 19.1 0 0 0 6.7 6.7l2.2-2.7 6 2v4.1a2.7 2.7 0 0 1-2.7 2.7A18.3 18.3 0 0 1 5.5 8.2a2.7 2.7 0 0 1 2.7-2.7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <rect height="20" rx="3" stroke="currentColor" strokeWidth="1.8" width="26" x="3" y="6" />
      <path d="m5 9 11 8 11-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="11.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 9.5v7l4.5 2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <path d="M24.8 20.9A11 11 0 0 1 11.1 7.2 10.5 10.5 0 1 0 24.8 20.9Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 32 32">
      <path d="M26 13.3C26 21 16 27.5 16 27.5S6 21 6 13.3a10 10 0 1 1 20 0Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="16" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconShell({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={cx("grid size-12 shrink-0 place-items-center rounded-full", className)}>
      {children}
    </span>
  );
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function mapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function ContactStripBentoSectionV3({
  address,
  afterHoursBody,
  afterHoursLabel,
  cardBorder = "on",
  cardFill = "solid",
  email,
  emailLabel,
  hours,
  hoursLabel,
  icons = "on",
  locationLabel,
  phone,
  phoneLabel,
}: ContactStripBentoSectionV3Props) {
  const colors = recipeClasses;
  const textClassName = colors.text;
  const mutedClassName = colors.muted;
  const iconClassName = colors.icon;
  const iconShellClassName = colors.iconShell;
  const dividerClassName = colors.divider;
  const cardClassName = cx(
    // Every card in this bento is a revealable unit, and they all take their
    // classes from here - so the marker rides along and each card only has to
    // declare which index it is. Inert unless the section's animation toggle
    // is on; see `section-reveal` in globals.css.
    "reveal-on-scroll reveal-role-card",
    "h-full min-w-0 rounded-[var(--radius-surface-token)] border shadow-service",
    colors.card,
    colors.cardBorder,
    "recipe-card-context",
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none" columns={14} padding="sml">
        <LayoutGridItem alignY="stretch" className="col-span-5 col-start-1 max-lg:col-span-5 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2">
          <article
            className={cx(cardClassName, "grid grid-rows-2 overflow-hidden")}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <div className="flex min-w-0 flex-col items-center justify-center px-8 py-10 text-center max-sm:px-5 max-sm:py-8">
              {icons === "on" ? (
                <IconShell className={cx(iconShellClassName, iconClassName)}>
                  <PhoneIcon />
                </IconShell>
              ) : null}
              <p className={cx("type-label", icons === "on" && "mt-5", mutedClassName)}>{phoneLabel}</p>
              <a className={cx("type-heading-md mt-2 break-words", textClassName)} href={phoneHref(phone)}>
                {phone}
              </a>
            </div>
            <div className={cx("flex min-w-0 flex-col items-center justify-center border-t px-8 py-8 text-center max-sm:px-5 max-sm:py-7", dividerClassName)}>
              {icons === "on" ? (
                <IconShell className={cx(iconShellClassName, iconClassName)}>
                  <MailIcon />
                </IconShell>
              ) : null}
              <p className={cx("type-label", icons === "on" && "mt-5", mutedClassName)}>{emailLabel}</p>
              <a className={cx("type-text-md mt-2 break-all font-semibold", textClassName)} href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          </article>
        </LayoutGridItem>

        <LayoutGridItem alignY="stretch" className="col-span-5 col-start-6 max-lg:col-span-5 max-lg:col-start-6 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2">
          <div className="grid h-full min-w-0 grid-rows-[auto_1fr] gap-6">
            <article
              className={cx(cardClassName, "flex min-w-0 flex-col items-center justify-center px-8 py-8 text-center max-sm:px-5")}
              style={{ "--reveal-index": 1 } as CSSProperties}
            >
              {icons === "on" ? (
                <IconShell className={cx(iconShellClassName, iconClassName)}>
                  <ClockIcon />
                </IconShell>
              ) : null}
              <h2 className={cx("type-heading-sm", icons === "on" && "mt-4", textClassName)}>{hoursLabel}</h2>
              <p className={cx("type-text-md mt-2 whitespace-pre-line", mutedClassName)}>{hours}</p>
            </article>

            <article
              className={cx(cardClassName, "flex min-w-0 flex-col items-center justify-center px-10 py-10 text-center max-sm:px-5 max-sm:py-8")}
              style={{ "--reveal-index": 2 } as CSSProperties}
            >
              {icons === "on" ? (
                <IconShell className={cx(iconShellClassName, iconClassName)}>
                  <MoonIcon />
                </IconShell>
              ) : null}
              <h2 className={cx("type-heading-sm", icons === "on" && "mt-4", textClassName)}>{afterHoursLabel}</h2>
              <p className={cx("type-text-sm mt-3 max-w-[38rem] wrap-pretty", mutedClassName)}>{afterHoursBody}</p>
            </article>
          </div>
        </LayoutGridItem>

        <LayoutGridItem alignY="stretch" className="col-span-4 col-start-11 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2">
          <article
            className={cx(cardClassName, "flex min-w-0 flex-col items-center justify-center px-8 py-10 text-center max-sm:px-5 max-sm:py-8")}
            style={{ "--reveal-index": 3 } as CSSProperties}
          >
            {icons === "on" ? (
              <IconShell className={cx(iconShellClassName, iconClassName)}>
                <LocationIcon />
              </IconShell>
            ) : null}
            <h2 className={cx("type-heading-sm", icons === "on" && "mt-5", textClassName)}>{locationLabel}</h2>
            <a
              className={cx("type-text-md mt-3 max-w-[24rem] whitespace-pre-line font-semibold wrap-pretty", textClassName)}
              href={mapHref(address)}
              rel="noreferrer"
              target="_blank"
            >
              {address}
            </a>
          </article>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
