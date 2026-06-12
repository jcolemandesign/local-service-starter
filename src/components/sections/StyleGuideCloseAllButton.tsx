"use client";

export function StyleGuideCloseAllButton() {
  function closeAllAccordions() {
    document
      .querySelectorAll<HTMLDetailsElement>("main details[open]")
      .forEach((details) => {
        details.open = false;
      });
  }

  return (
    <button
      className="radius-button fixed bottom-5 right-5 z-50 min-h-10 border border-service-border bg-bg-page/88 px-3.5 text-xs font-semibold text-service-muted shadow-sm backdrop-blur transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
      onClick={closeAllAccordions}
      type="button"
    >
      Close all
    </button>
  );
}
