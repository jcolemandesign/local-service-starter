"use client";

import { useState, type ReactNode } from "react";
import { Container } from "@/components/primitives";

type SectionLibraryV3Collection = {
  title: string;
  items: readonly SectionLibraryV3Item[];
};

type SectionLibraryV3Item = {
  element?: ReactNode;
  label: string;
  variants?: readonly SectionLibraryV3Variant[];
};

type SectionLibraryV3Variant = {
  element: ReactNode;
  label: string;
};

type SectionLibraryV3AccordionsProps = {
  collections: readonly SectionLibraryV3Collection[];
};

function EmptySubAccordion({ item }: { item: SectionLibraryV3Item }) {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const activeVariant = item.variants?.[activeVariantIndex];
  const element = activeVariant?.element ?? item.element;

  return (
    <details className="group/item border-b border-service-border bg-white">
      <summary className="cursor-pointer list-none transition-colors hover:bg-service-surface">
        <Container className="grid gap-3 py-4">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
                {item.label}
              </p>
              {activeVariant ? (
                <p className="mt-1 text-sm font-medium text-service-muted">
                  Active layout: {activeVariant.label}
                </p>
              ) : null}
            </div>

            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center border border-service-border text-lg leading-none text-service-accent transition-transform group-open/item:rotate-180"
            >
              v
            </span>
          </div>

          {item.variants ? (
            <div className="grid gap-2">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-widest text-service-muted">
                Layout
              </p>
              <div
                className="flex flex-wrap gap-1.5"
                aria-label={`${item.label} layout variants`}
              >
                {item.variants.map((variant, index) => (
                  <button
                    aria-pressed={activeVariantIndex === index}
                    className={[
                      "min-h-7 border px-2.5 text-xs font-semibold transition-colors",
                      activeVariantIndex === index
                        ? "border-service-accent bg-service-accent text-white"
                        : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={variant.label}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setActiveVariantIndex(index);
                    }}
                    type="button"
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </summary>

      <div className="border-t border-service-border bg-service-surface/45">
        {element ?? (
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
  collection: SectionLibraryV3Collection;
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
            className="flex size-11 shrink-0 items-center justify-center border border-service-border text-2xl leading-none text-service-accent transition-transform group-open/collection:rotate-180 max-md:size-10"
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

export function SectionLibraryV3Accordions({
  collections,
}: SectionLibraryV3AccordionsProps) {
  return (
    <section aria-label="Section library v3 accordions" className="bg-white">
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
