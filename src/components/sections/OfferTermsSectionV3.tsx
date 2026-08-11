import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import type {
  SectionIcons,
} from "@/content/section-style-options";

export type OfferTermDetail = {
  label: string;
  value: string;
};

export type OfferTermStep = {
  body: string;
  title: string;
};

export type OfferTermsSectionV3Props = {
  action: string;
  assuranceBody: string;
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
  details: readonly OfferTermDetail[];
  detailsHeading: string;
  icons?: SectionIcons;
  steps: readonly OfferTermStep[];
  stepsHeading: string;
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const responsivePlacement =
  "max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

const detailIconPaths = [
  "M4 7h16v13H4zM8 3v6M16 3v6M4 11h16",
  "M12 3 9.8 5.2l-3.1-.4-.4 3.1L4 10l2.3 2.1.4 3.1 3.1-.4L12 17l2.2-2.2 3.1.4.4-3.1L20 10l-2.3-2.1-.4-3.1-3.1.4L12 3Zm0 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
  "M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "M6 6l12 12M18 6 6 18",
  "M3.8 11.2 11.2 3.8h6.3l2.7 2.7v6.3l-7.4 7.4a2 2 0 0 1-2.8 0L3.8 14a2 2 0 0 1 0-2.8Z",
] as const;

function DetailIcon({ index }: { index: number }) {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d={detailIconPaths[index % detailIconPaths.length]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.65"
      />
    </svg>
  );
}

function AssuranceIcon() {
  return (
    <svg aria-hidden="true" className="size-9" fill="none" viewBox="0 0 24 24">
      <path d="M12 2.8c2.6 1.8 5.2 2.5 7.5 2.7v5.8c0 4.8-2.8 8.1-7.5 10-4.7-1.9-7.5-5.2-7.5-10V5.5c2.3-.2 4.9-.9 7.5-2.7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.55" />
      <path d="m8.8 12.1 2.1 2.1 4.5-4.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" />
    </svg>
  );
}

export function OfferTermsSectionV3({
  action,
  assuranceBody,
  cardBorder = "on",
  cardFill = "solid",
  details,
  detailsHeading,
  icons = "on",
  steps,
  stepsHeading,
}: OfferTermsSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem
          alignY="stretch"
          className={cx("col-span-14 col-start-1", responsivePlacement)}
        >
          <article
            className={cx(
              // The section is one card, so it is one revealable unit. Its
              // three panels are divided by shared rules inside a single border
              // box; staggering them would pull the card apart as it arrives.
              "reveal-on-scroll",
              "grid grid-cols-14 overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service max-md:grid-cols-6 max-sm:grid-cols-2",
              "recipe-card-context",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <div className="col-span-6 p-[clamp(1.5rem,2.4vw,2.5rem)] max-md:col-span-6 max-sm:col-span-2">
              <h3 className="type-heading-sm text-service-ink">{detailsHeading}</h3>
              <dl className="mt-5 divide-y divide-service-border">
                {details.slice(0, 5).map((detail, index) => (
                  <div
                    className={cx(
                      "grid items-center gap-4 py-4 first:pt-0 last:pb-0",
                      icons === "on"
                        ? "grid-cols-[auto_minmax(0,1fr)_minmax(8rem,0.9fr)] max-sm:grid-cols-[auto_minmax(0,1fr)]"
                        : "grid-cols-[minmax(0,1fr)_minmax(8rem,0.9fr)] max-sm:grid-cols-1",
                    )}
                    key={detail.label}
                  >
                    {icons === "on" ? (
                      <span className="grid size-9 place-items-center text-service-accent">
                        <DetailIcon index={index} />
                      </span>
                    ) : null}
                    <dt className="type-label text-service-ink">{detail.label}</dt>
                    <dd
                      className={cx(
                        "type-text-sm text-right text-service-muted max-sm:text-left",
                        icons === "on" && "max-sm:col-span-2",
                      )}
                    >
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="col-span-5 border-l border-service-border p-[clamp(1.5rem,2.4vw,2.5rem)] max-md:col-span-6 max-md:border-l-0 max-md:border-t max-sm:col-span-2">
              <h3 className="type-heading-sm text-service-ink">{stepsHeading}</h3>
              <ol className="mt-5 grid gap-5">
                {steps.slice(0, 4).map((step, index) => (
                  <li className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-3" key={step.title}>
                    {index < Math.min(steps.length, 4) - 1 ? (
                      <span aria-hidden="true" className="absolute bottom-[-1.25rem] left-[0.95rem] top-8 border-l border-dashed border-service-border" />
                    ) : null}
                    <span className="type-label relative z-10 grid size-8 place-items-center rounded-full bg-service-accent text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="type-label text-service-ink">{step.title}</h4>
                      <p className="type-text-sm mt-1 text-service-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <RequestServiceButton className="mt-7 w-full">{action}</RequestServiceButton>
            </div>

            <aside className="col-span-3 flex flex-col justify-center border-l border-service-border p-[clamp(1.5rem,2.4vw,2.5rem)] max-md:col-span-6 max-md:border-l-0 max-md:border-t max-sm:col-span-2">
              {icons === "on" ? (
                <span className="grid size-14 place-items-center rounded-full bg-bg-muted text-service-accent">
                  <AssuranceIcon />
                </span>
              ) : null}
              <p className="type-text-md wrap-pretty mt-5 text-service-muted">
                {assuranceBody}
              </p>
            </aside>
          </article>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
