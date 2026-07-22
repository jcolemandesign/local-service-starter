"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TemplateCopyContractStatus } from "@/utils/template-copy-contract";

type StagedPageRefreshButtonProps = {
  clientSlug: string;
  contractStatus: TemplateCopyContractStatus;
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
  contractStatus,
  pageId,
  pageLabel,
  templateId,
  templateName,
}: StagedPageRefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const canRefresh = contractStatus === "current";

  async function refreshPage() {
    const confirmed = window.confirm(
      `Replace "${pageLabel}" with a fresh build from the latest batch copy and the current "${templateName}" template? Any content edits made directly on this staged page will be overwritten.`,
    );

    if (!confirmed) {
      return;
    }

    setIsRefreshing(true);
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
        throw new Error(result.error ?? "Page refresh failed.");
      }

      setStatus("Refreshed from latest batch copy.");
      router.refresh();
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Page refresh failed.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div
      className="relative grid shrink-0"
      title={
        canRefresh
          ? undefined
          : "Update this page's copy contract in Strategy before refreshing."
      }
    >
      <button
        aria-describedby={canRefresh ? undefined : `${pageId}-refresh-status`}
        className="radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-service-border bg-white px-6 py-2 text-sm font-semibold text-service-ink transition duration-200 ease-out hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-100"
        disabled={isRefreshing || !canRefresh}
        onClick={() => void refreshPage()}
        type="button"
      >
        {isRefreshing ? "Refreshing..." : "Refresh from Batch Copy"}
      </button>
      {!canRefresh ? (
        <>
          <span
            aria-hidden="true"
            className="absolute top-1/2 right-4 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800"
          >
            !
          </span>
          <span className="sr-only" id={`${pageId}-refresh-status`}>
            Update this page&apos;s copy contract in Strategy before refreshing.
          </span>
        </>
      ) : null}
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
