import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

export type ContentMainIdeaGridPoint = {
  body: string;
  title: string;
};

export type ContentMainIdeaGridSectionV3Props = {
  body: string;
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  points: readonly ContentMainIdeaGridPoint[];
  title: string;
};

const pointPositions = [
  "col-start-9 row-start-1",
  "col-start-12 row-start-1",
  "col-start-9 row-start-2",
  "col-start-12 row-start-2",
] as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentMainIdeaGridSectionV3({
  body,
  colorRecipe = "default",
  eyebrow,
  points,
  title,
}: ContentMainIdeaGridSectionV3Props) {
  const colors = {
    default: {
      body: "text-service-muted",
      card: "border-service-border bg-service-surface shadow-service",
      eyebrow: "text-service-accent",
      heading: "text-service-ink",
      index: "text-service-accent",
      section: "bg-bg-page",
    },
    muted: {
      body: "text-service-muted",
      card: "border-service-border bg-bg-page shadow-service",
      eyebrow: "text-service-accent",
      heading: "text-service-ink",
      index: "text-service-accent",
      section: "bg-service-surface",
    },
    dark: {
      body: "text-white/70",
      card: "border-white/25 bg-white/5",
      eyebrow: "text-white/70",
      heading: "text-white",
      index: "text-white/50",
      section: "bg-bg-dark",
    },
    accent: {
      body: "text-[var(--live-accent-muted-text)]",
      card: "border-[color:var(--live-accent-ink)]/20 bg-bg-page shadow-service",
      eyebrow: "text-[var(--live-accent-ink)]",
      heading: "text-[var(--live-accent-ink)]",
      index: "text-[var(--live-accent-ink)]",
      section: "bg-service-accent",
    },
  }[colorRecipe];

  return (
    <section className={colors.section}>
      <LayoutGrid
        className="section-min-none auto-rows-fr items-stretch"
        columns={14}
        padding="lrg"
      >
        <LayoutGridItem className="col-span-7 col-start-1 row-span-2 max-lg:col-span-10 max-lg:row-span-1 max-md:col-span-6 max-sm:col-span-2">
          <article
            className={cx(
              "fluid-type-frame flex h-full min-h-96 flex-col justify-between rounded-[var(--radius-surface-token)] border p-8 max-md:min-h-0 max-md:p-6",
              colors.card,
            )}
          >
            <div>
              <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
              <h2
                className={cx(
                  "type-display-lg wrap-pretty mt-eyebrow-display",
                  colors.heading,
                )}
              >
                {title}
              </h2>
            </div>
            <p
              className={cx(
                "type-text-lg measure-copy-wide wrap-pretty mt-12 max-md:mt-8",
                colors.body,
              )}
            >
              {body}
            </p>
          </article>
        </LayoutGridItem>

        {points.slice(0, 4).map((point, index) => (
          <LayoutGridItem
            className={`col-span-3 ${pointPositions[index]} max-lg:col-span-5 max-lg:col-start-auto max-lg:row-auto max-md:col-span-3 max-sm:col-span-2`}
            key={`${index}-${point.title}`}
          >
            <article
              className={cx(
                "fluid-type-frame flex h-full min-h-44 flex-col justify-between rounded-[var(--radius-surface-token)] border p-5 max-md:min-h-0",
                colors.card,
              )}
            >
              <p className={cx("type-label", colors.index)}>
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="mt-8">
                <h3 className={cx("type-heading-sm wrap-pretty", colors.heading)}>
                  {point.title}
                </h3>
                <p
                  className={cx(
                    "type-text-sm wrap-pretty mt-heading-body-sm",
                    colors.body,
                  )}
                >
                  {point.body}
                </p>
              </div>
            </article>
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
