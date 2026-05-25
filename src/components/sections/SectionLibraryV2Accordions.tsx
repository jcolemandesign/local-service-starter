import type { ReactNode } from "react";
import { Container } from "@/components/primitives";

type SectionLibraryV2Collection = {
  title: string;
  items: readonly SectionLibraryV2Item[];
};

type SectionLibraryV2Item = {
  label: string;
  element?: ReactNode;
};

type SectionLibraryV2AccordionsProps = {
  collections: readonly SectionLibraryV2Collection[];
};

function EmptySubAccordion({ item }: { item: SectionLibraryV2Item }) {
  return (
    <details className="group/item border-b border-service-border bg-white">
      <summary className="cursor-pointer list-none transition-colors hover:bg-service-surface">
        <Container className="flex items-center justify-between gap-6 py-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
            {item.label}
          </p>
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-md border border-service-border text-xl leading-none text-service-accent transition-transform group-open/item:rotate-180"
          >
            v
          </span>
        </Container>
      </summary>

      <div className="border-t border-service-border bg-service-surface/45">
        {item.element ?? (
          <Container>
            <div className="min-h-48" />
          </Container>
        )}
      </div>
    </details>
  );
}

function EmptyCollectionAccordion({
  collection,
}: {
  collection: SectionLibraryV2Collection;
}) {
  const sectionCount = collection.items.length;

  return (
    <details className="group/collection border-b border-service-border bg-white">
      <summary className="cursor-pointer list-none transition-colors hover:bg-service-surface">
        <Container className="flex items-center justify-between gap-8 py-7 max-md:gap-5 max-md:py-6">
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-service-ink max-md:text-xl">
              {collection.title}
            </h2>
            <p className="mt-2 text-sm font-medium text-service-muted">
              {sectionCount} {sectionCount === 1 ? "section" : "sections"}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-service-border text-2xl leading-none text-service-accent transition-transform group-open/collection:rotate-180 max-md:size-10"
          >
            v
          </span>
        </Container>
      </summary>

      <div className="border-t border-service-border">
        {collection.items.map((item) => (
          <EmptySubAccordion key={item.label} item={item} />
        ))}
      </div>
    </details>
  );
}

export function SectionLibraryV2Accordions({
  collections,
}: SectionLibraryV2AccordionsProps) {
  return (
    <section aria-label="Section library v2 empty accordions" className="bg-white">
      <div className="border-t border-service-border">
        {collections.map((collection) => (
          <EmptyCollectionAccordion
            key={collection.title}
            collection={collection}
          />
        ))}
      </div>
    </section>
  );
}
