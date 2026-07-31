import Image from "next/image";
import {
  Button,
  LayoutGrid,
  LayoutGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

/**
 * Which side the image tile sits on. Only two arrangements, unlike the
 * fixed-ratio split it was cloned from: the tiles are a matched pair here, so
 * the column weighting is fixed at 6/8 and the only real choice is handedness.
 */
export type HeroSplitBentoVariant = "image-right" | "image-left";

type HeroSplitBentoSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingLevel?: 1 | 2;
  imageAlt: string;
  imageSrc: string;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionHref?: string;
  stats?: readonly string[];
  title: string;
  variant?: HeroSplitBentoVariant;
};

const colorRecipeClassName: Record<
  SectionColorRecipe,
  {
    action: string;
    body: string;
    eyebrow: string;
    ink: string;
    secondaryAction: string;
    section: string;
  }
> = {
  default: {
    action: "",
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    secondaryAction: "",
    section: "bg-bg-page",
  },
  muted: {
    action: "",
    body: "text-service-muted",
    eyebrow: "text-service-accent",
    ink: "text-service-ink",
    secondaryAction: "",
    section: "bg-service-surface",
  },
  dark: {
    action: "!border-white !bg-white !text-bg-dark hover:!bg-service-surface",
    body: "text-white/70",
    eyebrow: "text-white",
    ink: "text-white",
    secondaryAction:
      "!border-white/40 !bg-transparent !text-white hover:!border-white hover:!bg-white/10 hover:!text-white",
    section: "bg-bg-dark",
  },
  accent: {
    action: "!border-white !bg-white !text-bg-dark hover:!bg-white/85",
    body: "text-[var(--live-accent-muted-text)]",
    eyebrow: "text-[var(--live-accent-ink)]",
    ink: "text-[var(--live-accent-ink)]",
    secondaryAction:
      "!border-[color-mix(in_oklab,var(--live-accent-ink)_40%,transparent)] !bg-transparent !text-[var(--live-accent-ink)] hover:!border-[color:var(--live-accent-ink)] hover:!bg-white/10 hover:!text-[var(--live-accent-ink)]",
    section: "bg-service-accent",
  },
};

/**
 * Adjacent columns with no spacer between them - the tray is two slots divided
 * by the grid gap alone, so 6 + 8 fills all fourteen. This is the deliberate
 * difference from the fixed-ratio split, which keeps an empty column between
 * its slots.
 */
const variantConfig: Record<
  HeroSplitBentoVariant,
  { imageClassName: string; textClassName: string }
> = {
  "image-right": {
    textClassName:
      "col-span-6 col-start-1 max-lg:col-span-4 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-8 col-start-7 max-lg:col-span-6 max-lg:col-start-5 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
  "image-left": {
    textClassName:
      "col-span-6 col-start-9 max-lg:col-span-4 max-lg:col-start-7 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
    imageClassName:
      "col-span-8 col-start-1 max-lg:col-span-6 max-lg:col-start-1 max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
  },
};

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroSplitBentoSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  colorRecipe = "default",
  eyebrow,
  headingLevel = 1,
  imageAlt,
  imageSrc,
  primaryAction,
  secondaryAction,
  secondaryActionHref = "#services",
  stats = [],
  title,
  variant = "image-right",
}: HeroSplitBentoSectionV3Props) {
  const config = variantConfig[variant] ?? variantConfig["image-right"];
  const colors = colorRecipeClassName[colorRecipe];
  const HeadingTag = `h${headingLevel}` as const;
  const isFilled = cardFill === "solid";
  const hasBorder = cardBorder === "on";

  return (
    <section className={colors.section}>
      {/* No `content-center` here, unlike the fixed-ratio split: the single row
          is meant to stretch. The grid's min-height is the sliver, padding is
          inside it, and both slots take the whole content box - which is what
          makes the pair read as one tray rather than two centred blocks. */}
      <LayoutGrid columns={14} minHeight="sliver">
        <LayoutGridItem
          alignX="left"
          alignY="stretch"
          className={cx(
            "row-start-1 max-md:row-auto",
            colors.ink,
            config.textClassName,
          )}
        >
          <div
            className={cx(
              "fluid-type-frame flex h-full w-full flex-col justify-center",
              isFilled &&
                "radius-medium bg-service-surface p-14 shadow-service max-md:p-10",
              isFilled && hasBorder && "border border-service-border",
            )}
          >
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
            <HeadingTag
              className={cx("type-display-lg mt-eyebrow-display", colors.ink)}
            >
              {title}
            </HeadingTag>
            <p
              className={cx(
                "type-text-xl wrap-pretty mt-display-body",
                colors.body,
              )}
            >
              {body}
            </p>
            <div className="mt-body-actions-md flex flex-wrap inline-gap-med">
              <RequestServiceButton className={colors.action}>
                {primaryAction}
              </RequestServiceButton>
              <Button
                className={colors.secondaryAction}
                href={secondaryActionHref}
                variant="secondary"
              >
                {secondaryAction}
              </Button>
            </div>
            {stats.length > 0 ? (
              <ul className="mt-body-actions-lg grid grid-cols-3 card-grid-gap-med max-md:mt-body-actions-md max-md:grid-cols-1">
                {stats.map((stat) => (
                  <li
                    className={cx(
                      "type-text-sm border-l border-service-border pl-4 font-semibold max-md:border-l-0 max-md:border-t max-md:pl-0 max-md:pt-3",
                      colors.ink,
                    )}
                    key={stat}
                  >
                    {stat}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignX="stretch"
          alignY="stretch"
          className={cx("row-start-1 max-md:row-auto", config.imageClassName)}
        >
          {/* No aspect ratio - the tile takes the tray's height and the photo
              crops to whatever shape that leaves. */}
          <div
            className={cx(
              "radius-medium relative h-full min-h-0 w-full overflow-hidden bg-service-surface shadow-service",
              hasBorder && "border border-service-border",
            )}
          >
            <Image
              alt={imageAlt}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              src={imageSrc}
            />
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
