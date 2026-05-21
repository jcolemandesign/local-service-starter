import type { ReactNode } from "react";
import { Container } from "@/components/primitives";

type SectionLibraryItem = {
  label: string;
  element: ReactNode;
};

type SectionLibraryCollection = {
  title: string;
  items: SectionLibraryItem[];
};

type SectionLibraryCollectionsProps = {
  collections: SectionLibraryCollection[];
};

function ShowcaseLabel({ label }: { label: string }) {
  return (
    <div className="border-y border-service-border bg-white py-4">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
          {label}
        </p>
      </Container>
    </div>
  );
}

function SectionCollection({ collection }: { collection: SectionLibraryCollection }) {
  const sectionCount = collection.items.length;

  return (
    <details className="group border-b border-service-border bg-white">
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
            className="flex size-11 shrink-0 items-center justify-center rounded-md border border-service-border text-2xl leading-none text-service-accent transition-transform group-open:rotate-180 max-md:size-10"
          >
            v
          </span>
        </Container>
      </summary>

      <div className="border-t border-service-border">
        {collection.items.map((item) => (
          <div key={item.label}>
            <ShowcaseLabel label={item.label} />
            {item.element}
          </div>
        ))}
      </div>
    </details>
  );
}

export function SectionLibraryCollections({
  collections,
}: SectionLibraryCollectionsProps) {
  return (
    <section aria-label="Section collections" className="bg-white">
      <div className="border-t border-service-border">
        {collections.map((collection) => (
          <SectionCollection key={collection.title} collection={collection} />
        ))}
      </div>
    </section>
  );
}
