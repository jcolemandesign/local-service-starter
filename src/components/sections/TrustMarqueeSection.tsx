import {
  Button,
  Section,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { MeasuredMarquee } from "@/components/sections/MeasuredMarquee";
import type { SectionHeadingSize } from "@/content/section-style-options";

type TrustMarqueeSectionProps = {
  actionHref?: string;
  actionLabel?: string;
  callHref?: string;
  callLabel?: string;
  ctaBody?: string;
  ctaTitle?: string;
  headingSize?: SectionHeadingSize;
  label: string;
  items: string[];
};

/** Copy-neutral, so it is its own axis rather than a suffix on `variant` -
 *  see `docs/builder-workflow.md` section 3. */
const headingSizeClassName: Record<SectionHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function MarqueeItems({
  items,
  hidden = false,
}: {
  items: string[];
  hidden?: boolean;
}) {
  return (
    <ul
      className="flex shrink-0 items-center gap-6 px-3"
      aria-hidden={hidden ? "true" : undefined}
    >
      {items.map((item) => (
        <li
          className={cx(
            "type-label",
            "flex shrink-0 items-center gap-6 text-service-muted",
          )}
          key={item}
        >
          <span>{item}</span>
          <span className="size-1.5 rounded-full bg-service-accent" />
        </li>
      ))}
    </ul>
  );
}

export function TrustMarqueeSection({
  actionHref = "/contact",
  actionLabel = "Request service",
  callHref = "tel:5550142250",
  callLabel,
  ctaBody,
  ctaTitle,
  headingSize = "display-lg",
  label,
  items,
}: TrustMarqueeSectionProps) {
  return (
    <Section
      className="overflow-x-hidden bg-transparent"
      style={{ paddingBlock: "var(--section-space-vsml)" }}
    >
      <SevenColumnGrid className="section-min-none items-stretch" padding="none">
        {/* Five columns to the headline, two to the action. The headline is the
          * section - it carries the whole message - and at the larger sizes this
          * axis now offers it needs the room; the action beside it is a short
          * stack that reads better narrow than stretched. */}
        <SevenColumnGridItem className="col-span-5 max-lg:col-span-7">
          <div
            className={cx(
              "relative z-10 h-full",
              "fluid-type-frame",
              "rounded-t-[var(--radius-medium-token)] bg-transparent px-7 py-4 max-md:px-5",
            )}
          >
            <p
              className={cx(
                headingSizeClassName[headingSize] ??
                  headingSizeClassName["display-lg"],
                "wrap-pretty",
                "font-semibold text-service-ink",
              )}
            >
              {label}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-2 col-start-6 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="relative z-10 flex h-full flex-col justify-center px-7 py-4 max-md:px-5">
            {ctaTitle ? (
              <p className="type-heading-sm text-service-ink">{ctaTitle}</p>
            ) : null}
            {ctaBody ? (
              <p className="type-text-sm wrap-pretty mt-2 text-service-muted">
                {ctaBody}
              </p>
            ) : null}
            <div className="mt-4">
              <Button href={actionHref}>{actionLabel}</Button>
            </div>
            {callLabel ? (
              <a
                className="type-text-sm mt-3 cursor-pointer font-semibold text-service-accent underline-offset-4 transition-colors hover:underline"
                href={callHref}
              >
                {callLabel}
              </a>
            ) : null}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>

      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="overflow-hidden bg-transparent py-4">
          <MeasuredMarquee>
            <MarqueeItems items={items} />
          </MeasuredMarquee>
        </div>
      </div>
    </Section>
  );
}
