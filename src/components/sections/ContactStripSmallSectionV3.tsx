import type { CSSProperties, ReactNode } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";

export type ContactStripSmallSectionV3Props = {
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
  icon: "text-service-accent",
  iconShell: "bg-service-accent/10",
  muted: "text-service-muted",
  section: "bg-bg-page",
  text: "text-service-ink",
};

/* Icons are duplicated from the bento strip rather than shared. They are the
 * same five glyphs at a smaller size, but the bento does not export them and it
 * is still being worked on - lifting them into a shared module belongs in a pass
 * that can touch both files at once. */
function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 32 32">
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
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 32 32">
      <rect
        height="20"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
        width="26"
        x="3"
        y="6"
      />
      <path
        d="m5 9 11 8 11-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 32 32">
      <circle
        cx="16"
        cy="16"
        r="11.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 9.5v7l4.5 2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 32 32">
      <path
        d="M24.8 20.9A11 11 0 0 1 11.1 7.2 10.5 10.5 0 1 0 24.8 20.9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 32 32">
      <path
        d="M26 13.3C26 21 16 27.5 16 27.5S6 21 6 13.3a10 10 0 1 1 20 0Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function mapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * One tile: optional icon, label, value. Identical shape across all five, and
 * `h-full` so they stretch to the tallest - the after-hours sentence sets the
 * row height and the rest match it.
 */
function Tile({
  children,
  className,
  icon,
  iconShellClassName,
  label,
  mutedClassName,
  revealIndex,
  showIcon,
}: {
  children: ReactNode;
  className: string;
  icon: ReactNode;
  iconShellClassName: string;
  label: string;
  mutedClassName: string;
  /** Position in the band, so the five tiles arrive left to right. */
  revealIndex: number;
  showIcon: boolean;
}) {
  return (
    <article
      className={cx(
        // Marks this tile as a revealable unit. Inert unless the section's
        // animation toggle is on - see `section-reveal` in globals.css.
        "reveal-on-scroll",
        "flex h-full min-w-0 flex-col items-start p-6 text-left max-sm:p-5",
        className,
      )}
      style={{ "--reveal-index": revealIndex } as CSSProperties}
    >
      {showIcon ? (
        <span
          className={cx(
            "grid size-9 shrink-0 place-items-center rounded-full",
            iconShellClassName,
          )}
        >
          {icon}
        </span>
      ) : null}
      <p className={cx("type-label", showIcon && "mt-4", mutedClassName)}>
        {label}
      </p>
      {children}
    </article>
  );
}

/**
 * The one-row form of the bento contact strip: the same five items - phone,
 * email, hours, after-hours guidance, location - laid out as a single band
 * rather than a stacked composition.
 *
 * Five equal tiles, left aligned, distributed across their own `grid-cols-5`
 * inside one full-width slot of the shared grid. Fourteen columns do not divide
 * by five, so spans of the site grid could only ever be 3+3+3+3+2 - one tile a
 * third narrower than its neighbours. Taking the column allocation local is what
 * buys equal widths; the section still sits on the shared frame, gutters and
 * section spacing.
 *
 * Content is left aligned and top aligned, so the labels line up across the row
 * and the tiles read as one band rather than five centred cards.
 *
 * Every detail value is `type-text-sm`. One shared size across all five is what
 * keeps them equal weight - a larger phone number or address would pull the eye
 * to a single tile.
 */
export function ContactStripSmallSectionV3({
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
}: ContactStripSmallSectionV3Props) {
  const colors = recipeClasses;

  // Matches the bento: a transparent card on the accent recipe sits directly on
  // the accent field, where the card's own white text is not guaranteed to be
  // readable - the accent-ink tokens are.
  const textClassName = colors.text;
  const mutedClassName = colors.muted;
  const iconClassName = colors.icon;
  const iconShellClassName = cx(colors.iconShell, iconClassName);

  const cardClassName = cx(
    "rounded-[var(--radius-surface-token)] border shadow-service",
    colors.card,
    colors.cardBorder,
    "recipe-card-context",
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );

  const showIcon = icons === "on";
  const valueClassName = cx("type-text-sm mt-1 font-semibold", textClassName);

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none" columns={14} padding="sml">
        {/* One full-width slot holding its own five equal columns, rather than
         * five spans of the 14-column grid. Fourteen does not divide by five, so
         * spans can only ever be 3+3+3+3+2 - one tile a third narrower than the
         * rest. An inner `grid-cols-5` distributes the row evenly instead. The
         * section still sits on the shared frame, gutters and section spacing;
         * only the column allocation is local. Same approach as the process
         * strip. */}
        <LayoutGridItem className="col-span-14 col-start-1 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
          <div className="grid grid-cols-5 items-stretch gap-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
            <Tile
              className={cardClassName}
              revealIndex={0}
              icon={<PhoneIcon />}
              iconShellClassName={iconShellClassName}
              label={phoneLabel}
              mutedClassName={mutedClassName}
              showIcon={showIcon}
            >
              <a
                className={cx(valueClassName, "break-words")}
                href={phoneHref(phone)}
              >
                {phone}
              </a>
            </Tile>

            <Tile
              className={cardClassName}
              revealIndex={1}
              icon={<MailIcon />}
              iconShellClassName={iconShellClassName}
              label={emailLabel}
              mutedClassName={mutedClassName}
              showIcon={showIcon}
            >
              <a
                className={cx(valueClassName, "break-all")}
                href={`mailto:${email}`}
              >
                {email}
              </a>
            </Tile>

            <Tile
              className={cardClassName}
              revealIndex={2}
              icon={<ClockIcon />}
              iconShellClassName={iconShellClassName}
              label={hoursLabel}
              mutedClassName={mutedClassName}
              showIcon={showIcon}
            >
              <p className={cx(valueClassName, "whitespace-pre-line")}>
                {hours}
              </p>
            </Tile>

            <Tile
              className={cardClassName}
              revealIndex={3}
              icon={<MoonIcon />}
              iconShellClassName={iconShellClassName}
              label={afterHoursLabel}
              mutedClassName={mutedClassName}
              showIcon={showIcon}
            >
              <p
                className={cx("type-text-sm mt-1 wrap-pretty", mutedClassName)}
              >
                {afterHoursBody}
              </p>
            </Tile>

            <Tile
              className={cardClassName}
              revealIndex={4}
              icon={<LocationIcon />}
              iconShellClassName={iconShellClassName}
              label={locationLabel}
              mutedClassName={mutedClassName}
              showIcon={showIcon}
            >
              <a
                className={cx(
                  valueClassName,
                  "whitespace-pre-line wrap-pretty",
                )}
                href={mapHref(address)}
                rel="noreferrer"
                target="_blank"
              >
                {address}
              </a>
            </Tile>
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
