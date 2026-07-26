"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Shared by the alt row's links on the server-rendered staged pages screen, so
 * the navigation and the actions in one row cannot drift apart visually.
 */
export const altActionClass =
  "type-caption radius-button inline-flex cursor-pointer items-center border border-service-border bg-white px-3 py-1 font-semibold text-service-ink transition duration-200 ease-out hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-60";

const altDestructiveActionClass =
  "type-caption radius-button inline-flex cursor-pointer items-center border border-service-border bg-white px-3 py-1 font-semibold text-service-muted transition duration-200 ease-out hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60";

type StagedPageAltControlsProps = {
  activePageLabel: string;
  altIndex: number;
  altPageId: string;
  basePageId: string;
  clientSlug: string;
};

/**
 * Promote/remove controls for one archived alternate. Promotion swaps the alt
 * with whatever is live at the base slug, so both addresses stay valid and only
 * their contents trade places - a comparison open in two tabs survives it.
 */
export function StagedPageAltControls({
  activePageLabel,
  altIndex,
  altPageId,
  basePageId,
  clientSlug,
}: StagedPageAltControlsProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"promote" | "remove" | "">(
    "",
  );

  async function promoteAlt() {
    const confirmed = window.confirm(
      `Make alt ${altIndex} the live version of "${activePageLabel}"?\n\nAlt ${altIndex} moves to /${basePageId} and the current version moves to alt ${altIndex}. Nothing is deleted, and the page loses its export approval.`,
    );

    if (!confirmed) {
      return;
    }

    await run("promote", async () => {
      const response = await fetch("/api/staged-pages", {
        body: JSON.stringify({
          action: "promote-alt",
          clientSlug,
          pageId: altPageId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as {
        error?: string;
        ok?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Promotion failed.");
      }
    });
  }

  async function removeAlt() {
    const confirmed = window.confirm(`Delete alt ${altIndex} permanently?`);

    if (!confirmed) {
      return;
    }

    await run("remove", async () => {
      const response = await fetch("/api/staged-pages", {
        body: JSON.stringify({ clientSlug, pageId: altPageId }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });
      const result = (await response.json()) as {
        error?: string;
        ok?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Alt removal failed.");
      }
    });
  }

  async function run(
    action: "promote" | "remove",
    perform: () => Promise<void>,
  ) {
    setPendingAction(action);
    setError("");

    try {
      await perform();
      router.refresh();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed.",
      );
    } finally {
      setPendingAction("");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 max-md:justify-start">
      {error ? (
        <p className="type-caption text-red-700">{error}</p>
      ) : null}
      <button
        className={altActionClass}
        disabled={Boolean(pendingAction)}
        onClick={promoteAlt}
        type="button"
      >
        {pendingAction === "promote" ? "Promoting..." : "Make live"}
      </button>
      <button
        className={altDestructiveActionClass}
        disabled={Boolean(pendingAction)}
        onClick={removeAlt}
        type="button"
      >
        {pendingAction === "remove" ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
