"use client";

import { useState } from "react";
import { useStyleGuideTokens } from "@/components/sections/StyleGuideLiveSurface";

type PromoteResponse =
  | {
      block: string;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export function StyleGuidePromoteTokensButton() {
  const { draft } = useStyleGuideTokens();
  const [status, setStatus] = useState("");
  const [isPromoting, setIsPromoting] = useState(false);

  async function promoteTokens() {
    setIsPromoting(true);
    setStatus("");

    try {
      const response = await fetch("/api/style-guide-tokens", {
        body: JSON.stringify({ tokens: draft }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as PromoteResponse;

      if (!response.ok || !result.ok) {
        setStatus(result.ok ? "Promotion failed." : result.error);
        return;
      }

      setStatus("Promoted to globals.css.");
    } catch {
      setStatus("Promotion failed.");
    } finally {
      setIsPromoting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end inline-gap-sml">
      {status ? (
        <p className="type-caption text-service-muted" role="status">
          {status}
        </p>
      ) : null}
      <button
        className="radius-button min-h-11 border border-service-accent bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:border-service-ink hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent disabled:cursor-wait disabled:opacity-70"
        disabled={isPromoting}
        onClick={promoteTokens}
        type="button"
      >
        {isPromoting ? "Promoting" : "Promote Tokens"}
      </button>
    </div>
  );
}
