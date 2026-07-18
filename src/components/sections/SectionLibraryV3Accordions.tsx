"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
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

function SectionLibraryPreviewFrame({
  children,
  fitLandscapeCanvas = false,
}: {
  children: ReactNode;
  fitLandscapeCanvas?: boolean;
}) {
  if (!fitLandscapeCanvas) {
    return <div className="bg-bg-page">{children}</div>;
  }

  return (
    <div className="aspect-video min-h-0 overflow-x-hidden overflow-y-auto bg-bg-page max-md:aspect-auto max-md:overflow-visible">
      <div
        className="h-full min-h-full w-full bg-bg-page [&>section]:h-full [&_.section-min-screen]:!h-full [&_.section-min-screen]:!min-h-full"
        style={{ "--section-min-screen": "100%" } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

function EmptySubAccordion({
  item,
  fitLandscapeCanvas,
}: {
  item: SectionLibraryV3Item;
  fitLandscapeCanvas: boolean;
}) {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const activeVariant = item.variants?.[activeVariantIndex];
  const element = activeVariant?.element ?? item.element;

  return (
    <details className="token-chrome-card group/item border-b border-[var(--chrome-border-soft)] last:border-b-0">
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

      <div className="border-t border-[var(--chrome-border-soft)] text-service-ink">
        <SectionLibraryPreviewFrame fitLandscapeCanvas={fitLandscapeCanvas}>
          {element ?? (
            <Container>
              <div className="min-h-48" />
            </Container>
          )}
        </SectionLibraryPreviewFrame>
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
    <details className="token-chrome-panel group/collection overflow-hidden rounded-[var(--chrome-radius-panel)] border">
      <summary className="cursor-pointer list-none transition-colors">
        <Container className="flex items-center justify-between gap-8 py-5 max-md:gap-5 max-md:py-5">
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
          <EmptySubAccordion
            fitLandscapeCanvas={collection.title === "Hero"}
            key={item.label}
            item={item}
          />
        ))}
      </div>
    </details>
  );
}

export function SectionLibraryV3Accordions({
  collections,
}: SectionLibraryV3AccordionsProps) {
  return (
    <section aria-label="Section library v3 accordions" className="token-chrome">
      <Container className="grid gap-4 py-4 max-md:gap-3 max-md:py-3">
        {collections.map((collection) => (
          <EmptyCollectionAccordion
            key={collection.title}
            collection={collection}
          />
        ))}
      </Container>
    </section>
  );
}
