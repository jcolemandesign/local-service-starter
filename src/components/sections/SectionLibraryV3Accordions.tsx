"use client";

import { useState, type ReactNode } from "react";
import { Container, DownArrowIcon } from "@/components/primitives";

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
    <details className="token-chrome-card group/item border-b">
      <summary className="cursor-pointer list-none transition-colors">
        <Container className="grid gap-3 py-4">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-widest">
                {item.label}
              </p>
              {activeVariant ? (
                <p className="token-chrome-muted mt-1 text-sm font-medium">
                  Active layout: {activeVariant.label}
                </p>
              ) : null}
            </div>

            <span
              aria-hidden="true"
              className="token-chrome-badge flex size-8 shrink-0 items-center justify-center border transition-transform group-open/item:rotate-180"
            >
              <DownArrowIcon className="size-3.5" />
            </span>
          </div>

          {item.variants ? (
            <div className="grid gap-2">
              <p className="token-chrome-muted text-[0.6875rem] font-semibold uppercase tracking-widest">
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
                        ? "token-chrome-card-active"
                        : "token-chrome-control",
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

      <div className="border-t border-service-border bg-bg-page text-service-ink">
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
    <details className="token-chrome-card group/collection border-b">
      <summary className="cursor-pointer list-none transition-colors">
        <Container className="flex items-center justify-between gap-8 py-7 max-md:gap-5 max-md:py-6">
          <div>
            <h2 className="text-2xl font-semibold leading-tight max-md:text-xl">
              {collection.title}
            </h2>
            <p className="token-chrome-muted mt-2 text-sm font-medium">
              {sectionCount} {sectionCount === 1 ? "section" : "sections"}
            </p>
          </div>
          <span
            aria-hidden="true"
            className="token-chrome-badge flex size-11 shrink-0 items-center justify-center border transition-transform group-open/collection:rotate-180 max-md:size-10"
          >
            <DownArrowIcon className="size-4" />
          </span>
        </Container>
      </summary>

      <div className="border-t border-[var(--chrome-border-soft)]">
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
    <section
      aria-label="Section library v3 accordions"
      className="token-chrome"
    >
      <div className="border-t border-[var(--chrome-border-soft)]">
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
