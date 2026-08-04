import type { CSSProperties } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ProcessImageChecklistSectionV3Props = {
  action: string;
  body: string;
  eyebrow: string;
  /** Label on the FPO image placeholder. Not client copy. */
  imageLabel?: string;
  items: readonly string[];
  title: string;
};

/**
 * Sticky media column.
 *
 * The frame imposes no height of its own - it is as wide as its columns allow
 * and as tall as whatever it holds - so a real photo of any ratio sits here
 * uncropped. The 2:3 belongs to the placeholder alone, which needs a shape to
 * stand in at, and goes with it when an image replaces it.
 *
 * The width cap is what keeps the stick working. Height follows width through
 * the ratio, so bounding the width at `maxHeight x 2/3` bounds the height
 * without the frame fighting its own aspect-ratio. Above roughly 1100px of
 * column the frame stops widening rather than growing past the viewport.
 *
 * `h-fit` matters too: the grid item stretches to the row, and a sticky child
 * that stretches with it has nothing to travel through. Sticky only holds
 * while the columns are side by side, so it is dropped at `max-lg`.
 */
function ProcessImage({ label }: { label: string }) {
  return (
    <div className="sticky top-[var(--sticky-media-inset)] h-fit w-full max-lg:static">
      <div
        aria-label={`${label} image placeholder`}
        className="radius-medium relative aspect-[2/3] w-full max-w-[calc(var(--sticky-media-max-h)*2/3)] overflow-hidden bg-service-border"
      >
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.28),rgb(23_33_29_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
        <div className="absolute inset-0 bg-service-accent/10" />
        <div className="radius-medium absolute bottom-6 left-6 border border-white/45 bg-white/25 px-4 py-3 text-sm font-semibold uppercase text-service-ink backdrop-blur-sm">
          {label}
        </div>
      </div>
    </div>
  );
}

export function ProcessImageChecklistSectionV3({
  action,
  body,
  eyebrow,
  imageLabel = "Process",
  items,
  title,
}: ProcessImageChecklistSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-3 max-lg:col-span-7"
        >
          <ProcessImage label={imageLabel} />
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="middle"
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>

            <ul className="mt-body-actions-md grid card-grid-gap-med">
              {items.map((item, index) => (
                <li
                  className="reveal-on-scroll content-padding radius-medium grid grid-cols-[2rem_minmax(0,1fr)] items-start inline-gap-med border border-service-border bg-service-surface"
                  key={index}
                  style={{ "--reveal-index": index } as CSSProperties}
                >
                  <span className="radius-4 flex size-8 shrink-0 items-center justify-center bg-service-ink text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="type-text-md wrap-pretty min-w-0 pt-0.5 font-medium text-service-ink">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <a
              className="type-label mt-body-actions-md inline-flex cursor-pointer items-center text-service-accent transition-colors hover:text-service-ink"
              href="#contact"
            >
              {action} -&gt;
            </a>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
