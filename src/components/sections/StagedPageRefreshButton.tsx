"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StagedPageRefreshButtonProps = {
  clientSlug: string;
  pageId: string;
  pageLabel: string;
  templateId: string;
  templateName: string;
};

type RefreshPageResponse = {
  error?: string;
  ok?: boolean;
};

export function StagedPageRefreshButton({
  clientSlug,
  pageId,
  pageLabel,
  templateId,
  templateName,
}: StagedPageRefreshButtonProps) {
  const router = useRouter();
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function rebuildPage() {
    const confirmed = window.confirm(
      `Rebuild "${pageLabel}" from the current "${templateName}" template and latest batch copy?\n\nSections that have valid new copy will be overwritten, discarding edits made to them. Sections whose new copy is missing, stale, or unverified keep the content they have now.`,
    );

    if (!confirmed) {
      return;
    }

    setIsRebuilding(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/staged-pages", {
        body: JSON.stringify({
          action: "refresh",
          clientSlug,
          pageLabel,
          pageSlug: pageId,
          templateId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as RefreshPageResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Page rebuild failed.");
      }

      setStatus("Page rebuilt from template.");
      router.refresh();
    } catch (rebuildError) {
      setError(
        rebuildError instanceof Error
          ? rebuildError.message
          : "Page rebuild failed.",
      );
    } finally {
      setIsRebuilding(false);
    }
  }

  return (
    <div className="relative grid shrink-0">
      <button
        className="radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-service-border bg-white px-6 py-2 text-sm font-semibold text-service-ink transition duration-200 ease-out hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-100"
        disabled={isRebuilding}
        onClick={() => void rebuildPage()}
        title="Rebuild this page from the current template and latest batch copy. Sections without valid new copy keep their current content."
        type="button"
      >
        {isRebuilding ? "Rebuilding..." : "Rebuild from Template"}
      </button>
      {status ? (
        <p className="type-caption mt-2 max-w-56 text-service-accent">
          {status}
        </p>
      ) : null}
      {error ? (
        <p className="type-caption mt-2 max-w-56 text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
