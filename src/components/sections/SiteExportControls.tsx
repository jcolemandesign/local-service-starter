"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteExportAnalysis } from "@/utils/site-export";

type SiteExportControlsProps = {
  approvedPageIds: string[];
  clientSlug: string;
  pages: Array<{
    pageId: string;
    pageLabel: string;
  }>;
};

type SiteExportResponse = {
  analysis?: SiteExportAnalysis;
  error?: string;
  ok: boolean;
  result?: SiteExportAnalysis & {
    outputPath: string;
  };
};

export function SiteExportControls({
  approvedPageIds,
  clientSlug,
  pages,
}: SiteExportControlsProps) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<SiteExportAnalysis | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [status, setStatus] = useState("");

  async function setApproval(pageId: string, approved: boolean) {
    setIsWorking(true);
    setStatus("");

    try {
      const result = await runAction(approved ? "approve" : "unapprove", pageId);

      if (!result.ok) {
        throw new Error(result.error ?? "Approval update failed.");
      }

      setAnalysis(null);
      setStatus(approved ? "Page approved for export." : "Page approval removed.");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Approval update failed.");
    } finally {
      setIsWorking(false);
    }
  }

  async function dryRun() {
    setIsWorking(true);
    setStatus("");

    try {
      const result = await runAction("dry-run");
      setAnalysis(result.analysis ?? null);

      if (!result.ok) {
        throw new Error(result.error ?? "Dry run failed.");
      }

      setStatus(
        result.analysis?.ready
          ? "Dry run passed. The approved site is ready to export."
          : "Dry run found issues to resolve.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Dry run failed.");
    } finally {
      setIsWorking(false);
    }
  }

  async function exportSite() {
    setIsWorking(true);
    setStatus("Generating and build-checking the client site...");

    try {
      const result = await runAction("export");
      setAnalysis(result.analysis ?? result.result ?? null);

      if (!result.ok || !result.result) {
        throw new Error(result.error ?? "Site export failed.");
      }

      setStatus(`Export complete: ${result.result.outputPath}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Site export failed.");
    } finally {
      setIsWorking(false);
    }
  }

  async function runAction(
    action: "approve" | "dry-run" | "export" | "unapprove",
    pageId?: string,
  ) {
    const response = await fetch("/api/site-export", {
      body: JSON.stringify({ action, clientSlug, pageId }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = (await response.json()) as SiteExportResponse;

    if (!response.ok && !result.analysis) {
      throw new Error(result.error ?? "Site export request failed.");
    }

    return result;
  }

  return (
    <div className="grid gap-5 rounded-sm border border-service-border bg-white p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 max-md:grid-cols-1">
        <div>
          <p className="type-label text-service-accent">Client export</p>
          <h2 className="type-heading-sm mt-2 text-service-ink">
            {clientSlug}
          </h2>
          <p className="type-caption mt-2 text-service-muted">
            Approve final pages, run validation, then generate the independent
            Next.js client site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="radius-button min-h-11 border border-service-border bg-white px-4 text-sm font-semibold text-service-ink disabled:opacity-60"
            disabled={isWorking}
            onClick={() => void dryRun()}
            type="button"
          >
            Dry run
          </button>
          <button
            className="radius-button min-h-11 border border-service-accent bg-service-accent px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isWorking || approvedPageIds.length === 0}
            onClick={() => void exportSite()}
            type="button"
          >
            Export site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
        {pages.map((page) => {
          const approved = approvedPageIds.includes(page.pageId);

          return (
            <div
              className="flex items-center justify-between gap-3 rounded-sm border border-service-border bg-service-surface px-3 py-3"
              key={page.pageId}
            >
              <div className="min-w-0">
                <p className="type-caption truncate font-semibold text-service-ink">
                  {page.pageLabel}
                </p>
                <p className="type-caption truncate text-service-muted">
                  {approved ? "Approved" : "Not approved"}
                </p>
              </div>
              <button
                className="radius-button min-h-9 whitespace-nowrap border border-service-border bg-white px-3 type-caption font-semibold text-service-ink disabled:opacity-60"
                disabled={isWorking}
                onClick={() => void setApproval(page.pageId, !approved)}
                type="button"
              >
                {approved ? "Unapprove" : "Approve"}
              </button>
            </div>
          );
        })}
      </div>

      {status ? (
        <p className="type-caption break-all text-service-muted" role="status">
          {status}
        </p>
      ) : null}

      {analysis ? (
        <div className="grid gap-3 border-t border-service-border pt-4">
          <p className="type-caption font-semibold text-service-ink">
            {analysis.ready
              ? `${analysis.approvedPageCount} pages ready`
              : `${analysis.issues.length} issues found`}
          </p>
          {analysis.issues.length > 0 ? (
            <ul className="grid gap-2">
              {analysis.issues.slice(0, 12).map((issue, index) => (
                <li
                  className="type-caption rounded-sm bg-amber-50 px-3 py-2 text-amber-900"
                  key={`${issue.code}-${issue.pageId ?? "site"}-${index}`}
                >
                  {issue.pageId ? `${issue.pageId}: ` : ""}
                  {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
