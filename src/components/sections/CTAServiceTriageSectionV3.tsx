import type { CSSProperties, ReactNode } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";
import {
  CTAServiceTriageRequestControls,
  type ServiceTriageChoice,
} from "./CTAServiceTriageRequestControls";

export type CTAServiceTriageSectionV3Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  customerAction: string;
  customerActionHref?: string;
  customerBody: string;
  customerHelper: string;
  customerTitle: string;
  icons?: SectionIcons;
  serviceAction: string;
  serviceBody: string;
  serviceChoices: readonly ServiceTriageChoice[];
  serviceTitle: string;
  urgentAction: string;
  urgentBody: string;
  urgentHelper: string;
  urgentPhone: string;
  urgentTitle: string;
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

function ToolIcon() {
  return (
    <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 32 32">
      <path
        d="m18.5 6.25 7.25 7.25-3.5 3.5-2.1-2.1L9.4 25.65a2.45 2.45 0 0 1-3.45-3.45L16.7 11.45l-2.2-2.2 4-3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M7.75 6.25a5 5 0 0 0 6.6 6.6M6.25 7.75l3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="10.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 10.25v7.25M16 22v.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function CustomerIcon() {
  return (
    <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 32 32">
      <circle cx="16" cy="11.5" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.5 26v-2.25A7.5 7.5 0 0 1 16 16.25a7.5 7.5 0 0 1 7.5 7.5V26h-15Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg aria-hidden="true" className="size-10 shrink-0" fill="none" viewBox="0 0 32 32">
      <path
        d="M6 23.75 4.75 28l4.75-1.5A11 11 0 1 0 6 23.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CardIcon({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span
      className={cx(
        "grid size-14 shrink-0 place-items-center rounded-full",
        className,
      )}
    >
      {children}
    </span>
  );
}

function phoneHref(phone: string) {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized}`;
}

export function CTAServiceTriageSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  customerAction,
  customerActionHref = "#contact",
  customerBody,
  customerHelper,
  customerTitle,
  icons = "on",
  serviceAction,
  serviceBody,
  serviceChoices,
  serviceTitle,
  urgentAction,
  urgentBody,
  urgentHelper,
  urgentPhone,
  urgentTitle,
}: CTAServiceTriageSectionV3Props) {
  const colors = recipeClasses;
  const cardText = colors.text;
  const cardMuted = colors.muted;
  const cardIcon = colors.icon;
  const cardIconShell = colors.iconShell;
  const cardActionText = "!text-service-ink";
  const cardClassName = cx(
    // Each triage card is a revealable unit and they all take their classes
    // from here, so the marker rides along and each card only declares which
    // index it is. Inert unless the section animation toggle is on.
    "fluid-type-frame flex h-full min-w-0 flex-col rounded-[var(--radius-surface-token)] border p-8 shadow-service max-md:p-6",
    colors.card,
    colors.cardBorder,
    "recipe-card-context",
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem className="col-span-6 max-lg:col-span-7 max-md:col-span-6 max-sm:col-span-2">
          <article
            className={cx(
              cardClassName,
              "reveal-on-scroll reveal-role-action service-triage-card-primary",
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <div className="flex items-start gap-5">
              {icons === "on" ? (
                <CardIcon className={cx(cardIconShell, cardIcon)}>
                  <ToolIcon />
                </CardIcon>
              ) : null}
              <div className="min-w-0">
                <h2 className={cx("type-heading-md wrap-pretty", cardText)}>
                  {serviceTitle}
                </h2>
                <p className={cx("type-text-md mt-2 wrap-pretty", cardMuted)}>
                  {serviceBody}
                </p>
              </div>
            </div>

            <CTAServiceTriageRequestControls
              action={serviceAction}
              choices={serviceChoices}
              icons={icons}
            />
          </article>
        </LayoutGridItem>

        <LayoutGridItem className="col-span-4 max-lg:col-span-7 max-md:col-span-3 max-sm:col-span-2">
          <article
            className={cx(
              cardClassName,
              "reveal-on-scroll reveal-role-card service-triage-card-secondary",
            )}
            style={{ "--reveal-index": 1 } as CSSProperties}
          >
            <div className="flex items-start gap-5">
              {icons === "on" ? (
                <CardIcon className={cx(cardIconShell, cardIcon)}>
                  <AlertIcon />
                </CardIcon>
              ) : null}
              <div className="min-w-0">
                <h2 className={cx("type-heading-md wrap-pretty", cardText)}>
                  {urgentTitle}
                </h2>
                <p className={cx("type-text-md mt-2 wrap-pretty", cardMuted)}>
                  {urgentBody}
                </p>
              </div>
            </div>

            <p className={cx("type-heading-lg mt-8 wrap-pretty", cardText)}>
              Call <span className={cardText}>{urgentPhone}</span>
            </p>
            <Button
              className={cx(
                "mt-6 w-full",
              )}
              href={phoneHref(urgentPhone)}
            >
              {urgentAction}
              {icons === "on" ? <span aria-hidden="true" className="ml-3">→</span> : null}
            </Button>
            <p className={cx("type-caption mt-4 text-center", cardMuted)}>
              {urgentHelper}
            </p>
          </article>
        </LayoutGridItem>

        <LayoutGridItem className="col-span-4 max-lg:col-span-7 max-md:col-span-3 max-sm:col-span-2">
          <article
            className={cx(
              cardClassName,
              "reveal-on-scroll reveal-role-card service-triage-card-secondary",
            )}
            style={{ "--reveal-index": 2 } as CSSProperties}
          >
            <div className="flex items-start gap-5">
              {icons === "on" ? (
                <CardIcon className={cx(cardIconShell, cardIcon)}>
                  <CustomerIcon />
                </CardIcon>
              ) : null}
              <div className="min-w-0">
                <h2 className={cx("type-heading-md wrap-pretty", cardText)}>
                  {customerTitle}
                </h2>
                <p className={cx("type-text-md mt-2 wrap-pretty", cardMuted)}>
                  {customerBody}
                </p>
              </div>
            </div>

            <div className="mt-9 flex items-center gap-4">
              {icons === "on" ? (
                <span className={cardIcon}>
                  <MessageIcon />
                </span>
              ) : null}
              <a
                className={cx(
                  "type-heading-sm wrap-pretty min-w-0 text-left no-underline transition-colors",
                  cardActionText,
                )}
                href={customerActionHref}
              >
                {customerAction}
              </a>
            </div>
            <p className={cx("type-caption mt-auto pt-8", cardMuted)}>
              {customerHelper}
            </p>
          </article>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
