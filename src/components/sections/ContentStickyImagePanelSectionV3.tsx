import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ContentStickyImagePanelSectionV3Props = {
  body: string;
  eyebrow: string;
  imageLabel: string;
  points: readonly string[];
  title: string;
};

function FullBleedImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className="absolute inset-0 overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(23_33_29_/_0.18),rgb(31_122_90_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_20px)]" />
      <div className="absolute inset-0 bg-service-accent/15" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-service-ink/30 to-transparent" />
      <span className="type-label absolute bottom-[var(--site-grid-inset-block)] left-[var(--site-grid-inset-inline)] text-white/70">
        {label}
      </span>
    </div>
  );
}

export function ContentStickyImagePanelSectionV3({
  body,
  eyebrow,
  imageLabel,
  points,
  title,
}: ContentStickyImagePanelSectionV3Props) {
  return (
    <section className="relative bg-service-ink text-service-ink">
      <FullBleedImage label={imageLabel} />

      <SevenColumnGrid className="relative section-min-story items-start max-md:section-min-screen">
        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className="col-span-3 col-start-5 h-full max-lg:col-span-4 max-lg:col-start-4 max-md:col-span-7 max-md:col-start-1"
        >
          <div className="sticky top-[var(--site-grid-inset-block)] max-md:static">
            <article className="content-padding fluid-type-frame radius-medium card-min-medium flex max-h-[calc(100svh-(var(--site-grid-inset-block)*2))] w-full flex-col justify-between overflow-auto border border-white/45 bg-white shadow-service max-md:card-min-tall">
              <div>
                <p className="type-label text-service-accent">{eyebrow}</p>
                <h2 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
                  {title}
                </h2>
                <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                  {body}
                </p>
              </div>

              <ul className="mt-body-actions-md grid card-grid-gap-sml">
                {points.map((point) => (
                  <li
                    className="type-caption flex items-center justify-between inline-gap-med border-t border-service-border pt-[var(--inline-gap-active)] text-service-muted"
                    key={point}
                  >
                    <span>{point}</span>
                    <span
                      aria-hidden="true"
                      className="size-2 shrink-0 rounded-full bg-service-accent"
                    />
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
