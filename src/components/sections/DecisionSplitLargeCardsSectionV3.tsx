import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type SplitLargeCard = {
  body: string;
  eyebrow: string;
  title: string;
};

type DecisionSplitLargeCardsSectionV3Props = {
  actionLabel: string;
  cards: readonly SplitLargeCard[];
  title: string;
};

export function DecisionSplitLargeCardsSectionV3({
  actionLabel,
  cards,
  title,
}: DecisionSplitLargeCardsSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-tiny items-start" padding="med">
        <SevenColumnGridItem
          className="col-span-4 max-md:col-span-3 max-sm:col-span-1"
          measure="none"
        >
          <h2 className="type-heading-xl max-w-3xl text-service-ink">
            {title}
          </h2>
        </SevenColumnGridItem>
        <SevenColumnGridItem
          className="col-span-3 col-start-5 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1"
          alignY="bottom"
          measure="none"
        >
          <div className="flex items-end">
            <a
              className="type-label inline-flex w-fit items-center border-b border-service-ink pb-1 text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
              href="#contact"
            >
              {actionLabel}
            </a>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-3 col-start-2 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1"
          measure="none"
        >
          {cards[0] ? <SplitLargeCard card={cards[0]} /> : null}
        </SevenColumnGridItem>
        <SevenColumnGridItem
          className="col-span-3 col-start-5 max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1"
          measure="none"
        >
          {cards[1] ? <SplitLargeCard card={cards[1]} /> : null}
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

function SplitLargeCard({ card }: { card: SplitLargeCard }) {
  return (
    <article className="fluid-type-frame radius-medium min-h-64 border border-service-border bg-service-surface p-6 text-service-ink shadow-none max-md:min-h-0">
      <p className="type-label text-service-accent">{card.eyebrow}</p>
      <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
        {card.title}
      </h3>
      <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
        {card.body}
      </p>
    </article>
  );
}
