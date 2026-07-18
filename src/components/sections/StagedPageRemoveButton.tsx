"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StagedPageRemoveButtonProps = {
  clientSlug: string;
  pageId: string;
  pageLabel: string;
};

export function StagedPageRemoveButton({
  clientSlug,
  pageId,
  pageLabel,
}: StagedPageRemoveButtonProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState("");

  async function removePage() {
    const confirmed = window.confirm(
      `Remove "${pageLabel}" from staged pages?`,
    );

    if (!confirmed) {
      return;
    }

    setIsRemoving(true);
    setError("");

    try {
      const response = await fetch("/api/staged-pages", {
        body: JSON.stringify({ clientSlug, pageId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      });
      const result = (await response.json()) as {
        error?: string;
        ok?: boolean;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Page removal failed.");
      }

      router.refresh();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Page removal failed.",
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        className="radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border border-service-border bg-white px-6 py-2 text-sm font-semibold text-service-ink transition duration-200 ease-out hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isRemoving}
        onClick={removePage}
        type="button"
      >
        {isRemoving ? "Removing..." : "Remove"}
      </button>
      {error ? (
        <p className="type-caption max-w-52 text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
