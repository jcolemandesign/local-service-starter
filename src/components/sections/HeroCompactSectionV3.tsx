import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service/RequestServiceModal";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

type HeroCompactSectionV3Props = {
  align?: HeroCompactAlign;
  body: string;
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  headingSize?: HeroCompactHeadingSize;
  headingLevel?: 1 | 2;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionHref?: string;
  title: string;
};

export type HeroCompactAlign = "left" | "center" | "right";
export type HeroCompactHeadingSize =
  | "heading-lg"
  | "heading-xl"
  | "display-lg";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const alignClassName: Record<
  HeroCompactAlign,
  {
    body: string;
    item: string;
    measure: string;
    text: string;
  }
> = {
  left: {
    body: "",
    item: "col-span-4 col-start-1",
    measure: "mr-auto max-w-[var(--measure-copy-wide)]",
    text: "text-left",
  },
  center: {
    body: "mx-auto",
    item: "col-span-5 col-start-2",
    measure: "mx-auto max-w-[var(--measure-copy-wide)]",
    text: "text-center",
  },
  right: {
    body: "ml-auto",
    item: "col-span-4 col-start-4",
    measure: "ml-auto max-w-[var(--measure-copy-wide)]",
    text: "text-right",
  },
};

const sideActionClassName: Record<Exclude<HeroCompactAlign, "center">, string> = {
  left: "col-span-3 col-start-5",
  right: "col-span-3 col-start-1 row-start-1",
};

const headingSizeClassName: Record<HeroCompactHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

function HeroCompactActions({
  actionClassName,
  className,
  primaryAction,
  secondaryAction,
  secondaryActionClassName,
  secondaryActionHref,
}: {
  actionClassName?: string;
  className?: string;
  primaryAction: string;
  secondaryAction: string;
  secondaryActionClassName?: string;
  secondaryActionHref: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-center inline-gap-med",
        className,
      )}
    >
      <RequestServiceButton className={actionClassName}>
        {primaryAction}
      </RequestServiceButton>
      <Button
        className={secondaryActionClassName}
        href={secondaryActionHref}
        variant="secondary"
      >
        {secondaryAction}
      </Button>
    </div>
  );
}

const colorRecipeClassName = {
  action: "",
  body: "text-service-muted",
  eyebrow: "text-service-accent",
  ink: "text-service-ink",
  secondaryAction: "",
  section: "bg-bg-page",
};

export function HeroCompactSectionV3({
  align = "center",
  body,
  eyebrow,
  headingSize = "display-lg",
  headingLevel = 1,
  primaryAction,
  secondaryAction,
  secondaryActionHref = "#services",
  title,
}: HeroCompactSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const alignment = alignClassName[align];
  const colors = colorRecipeClassName;

  return (
    <section className={colors.section}>
      <SevenColumnGrid
        className="section-min-tiny content-center"
        padding="med"
      >
        <SevenColumnGridItem
          alignX={align}
          className={cx(
            alignment.item,
            "max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1",
          )}
        >
          <div
            className={cx(
              "fluid-type-frame",
              alignment.measure,
              alignment.text,
            )}
          >
            <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
            <Heading
              className={cx(
                headingSizeClassName[headingSize],
                "mt-eyebrow-display",
                colors.ink,
              )}
            >
              {title}
            </Heading>
            <p
              className={cx(
                headingSize === "display-lg"
                  ? "type-text-xl"
                  : "type-text-lg",
                "wrap-pretty mt-heading-body-lg",
                colors.body,
                alignment.body,
              )}
            >
              {body}
            </p>
            {align === "center" ? (
              <HeroCompactActions
                actionClassName={colors.action}
                className="mt-body-actions-md"
                primaryAction={primaryAction}
                secondaryAction={secondaryAction}
                secondaryActionClassName={colors.secondaryAction}
                secondaryActionHref={secondaryActionHref}
              />
            ) : null}
          </div>
        </SevenColumnGridItem>
        {align !== "center" ? (
          <SevenColumnGridItem
            alignX="center"
            alignY="middle"
            className={cx(
              sideActionClassName[align],
              "max-lg:col-span-5 max-lg:col-start-1 max-lg:row-auto max-lg:mt-body-actions-md max-md:col-span-3 max-sm:col-span-1",
            )}
          >
            <HeroCompactActions
              actionClassName={colors.action}
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              secondaryActionClassName={colors.secondaryAction}
              secondaryActionHref={secondaryActionHref}
            />
          </SevenColumnGridItem>
        ) : null}
      </SevenColumnGrid>
    </section>
  );
}
