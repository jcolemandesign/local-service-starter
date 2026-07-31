import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type SectionHeaderSplitLinkSectionV3Props = {
  actionHref?: string;
  actionLabel: string;
  body: string;
  headingLevel?: 1 | 2;
  title: string;
};

// Heading left, description and link right. Deliberately fixed: the mirrored
// arrangement put the heading's ragged edge against the description's and read
// as a misalignment rather than a choice, so the axis was dropped instead of
// shipped broken.
const headingClassName =
  "col-span-4 col-start-1 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1";
const asideClassName =
  "col-span-3 col-start-5 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1";

/**
 * Heading on one side, a short description over a single text link on the
 * other. Lifted out of the split-large-cards section, which used to carry this
 * header inline - as its own section it can introduce any block, and the cards
 * section is free to be only cards.
 */
export function SectionHeaderSplitLinkSectionV3({
  actionHref = "#contact",
  actionLabel,
  body,
  headingLevel = 2,
  title,
}: SectionHeaderSplitLinkSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid
        className="items-end"
        minHeight="none"
        padding="none"
        style={{ paddingBlock: "var(--section-space-vsml)" }}
      >
        <SevenColumnGridItem
          className={headingClassName}
          measure="none"
        >
          <Heading className="type-heading-xl max-w-3xl text-service-ink">
            {title}
          </Heading>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="bottom"
          className={asideClassName}
          measure="none"
        >
          <div className="fluid-type-frame">
            <p className="type-text-md wrap-pretty text-service-muted">
              {body}
            </p>
            <a
              className="type-label mt-body-actions-md inline-flex w-fit items-center border-b border-service-ink pb-1 text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
              href={actionHref}
            >
              {actionLabel}
            </a>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
