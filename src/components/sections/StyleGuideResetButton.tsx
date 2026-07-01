"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

export function StyleGuideResetButton() {
  const { resetDraft } = useStyleGuideTokens();
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const bodyId = useId();

  function confirmReset() {
    resetDraft();
    setIsOpen(false);
  }

  const modal =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            aria-describedby={bodyId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="fixed inset-0 z-[1000] grid place-items-center bg-service-ink/48 px-[var(--site-grid-inset-inline)] py-[var(--site-grid-inset-block)]"
            role="dialog"
          >
            <div className="radius-medium relative z-[1001] grid w-full max-w-md gap-5 border border-service-border bg-bg-page p-6 shadow-service">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">
                  Reset style guide
                </p>
                <h2
                  className="type-heading-sm mt-eyebrow-heading-sm text-service-ink"
                  id={titleId}
                >
                  Are you sure?
                </h2>
                <p
                  className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted"
                  id={bodyId}
                >
                  This restores the live style guide controls to their defaults
                  and clears the saved browser draft.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  className="radius-button min-h-11 border border-service-muted/60 bg-service-surface px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-white hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="radius-button min-h-11 border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  onClick={confirmReset}
                  type="button"
                >
                  Reset Style Guide
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        className="radius-button min-h-11 border border-service-muted/60 bg-service-surface px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-white hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        Reset Style Guide
      </button>

      {modal}
    </>
  );
}
