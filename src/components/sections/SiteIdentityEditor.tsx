"use client";

import Image from "next/image";
import { useState } from "react";
import {
  emptySiteIdentity,
  type SiteIdentity,
} from "@/content/site-identity";

type SiteIdentityEditorProps = {
  clientSlug: string;
  initialIdentity?: SiteIdentity;
};

type SaveIdentityResponse =
  | { identity: SiteIdentity; ok: true }
  | { error?: string; ok: false };

/**
 * Site-wide chrome belongs with the project strategy, rather than a single
 * staged page. Uploading writes the logo and immediately persists its public
 * path; saving the text fields handles deliberate edits and clearing a logo.
 */
export function SiteIdentityEditor({
  clientSlug,
  initialIdentity = emptySiteIdentity,
}: SiteIdentityEditorProps) {
  const [identity, setIdentity] = useState(initialIdentity);
  const [savedIdentity, setSavedIdentity] = useState(initialIdentity);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isDirty =
    identity.businessName !== savedIdentity.businessName ||
    identity.logoSrc !== savedIdentity.logoSrc;

  function updateIdentity(patch: Partial<SiteIdentity>) {
    setIdentity((current) => ({ ...current, ...patch }));
  }

  async function saveIdentity() {
    setIsSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/site-identity", {
        body: JSON.stringify({ ...identity, clientSlug }),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const result = (await response.json()) as SaveIdentityResponse;

      if (!response.ok || !result.ok) {
        setStatus(result.ok ? "Could not save site identity." : (result.error ?? "Could not save site identity."));
        return;
      }

      setIdentity(result.identity);
      setSavedIdentity(result.identity);
      setStatus("Site identity saved.");
    } catch {
      setStatus("Could not save site identity.");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadLogo(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsUploading(true);
    setStatus("");

    try {
      const formData = new FormData();
      formData.append("clientSlug", clientSlug);
      formData.append("file", file);

      const response = await fetch("/api/site-identity/logo", {
        body: formData,
        method: "POST",
      });
      const result = (await response.json()) as SaveIdentityResponse;

      if (!response.ok || !result.ok) {
        setStatus(result.ok ? "Could not upload logo." : (result.error ?? "Could not upload logo."));
        return;
      }

      setIdentity(result.identity);
      setSavedIdentity(result.identity);
      setStatus("Logo uploaded and saved.");
    } catch {
      setStatus("Could not upload logo.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section
      aria-labelledby="site-identity-heading"
      className="radius-surface border border-service-border bg-bg-surface p-6 shadow-service max-md:p-5"
    >
      <h2 id="site-identity-heading">
        <button
          aria-controls="site-identity-editor"
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span>
            <span className="type-label block text-service-accent">Site chrome</span>
            <span className="type-heading-md mt-eyebrow-heading-sm block text-service-ink">
              Site identity
            </span>
          </span>
          <span aria-hidden="true" className="type-label text-service-muted">
            {isOpen ? "Hide" : "Edit"}
          </span>
        </button>
      </h2>

      <div
        className="mt-6 grid grid-cols-[11rem_minmax(0,1fr)] gap-6 max-md:grid-cols-1"
        hidden={!isOpen}
        id="site-identity-editor"
      >
        <p className="type-text-sm col-span-full text-service-muted">
          Used by every navigation and footer for this client. Upload SVG, PNG,
          JPEG, or WebP up to 2 MB.
        </p>
        <div className="radius-surface relative flex min-h-28 items-center justify-center border border-service-border bg-service-surface p-4">
          {identity.logoSrc ? (
            <Image
              alt={identity.businessName || "Client logo"}
              className="object-contain"
              fill
              sizes="176px"
              src={identity.logoSrc}
            />
          ) : (
            <span className="type-caption text-center text-service-muted">
              {identity.businessName || "Logo preview"}
            </span>
          )}
        </div>

        <div className="grid gap-4">
          <label className="type-label grid gap-2 text-service-ink">
            Business name
            <input
              className="radius-4 type-text-sm border border-service-border bg-bg-surface px-3 py-2 text-service-ink"
              onChange={(event) => updateIdentity({ businessName: event.target.value })}
              placeholder="North Star HVAC"
              type="text"
              value={identity.businessName}
            />
          </label>

          <label className="type-label grid gap-2 text-service-ink">
            Upload logo
            <input
              accept="image/svg+xml,image/png,image/jpeg,image/webp"
              className="type-text-sm text-service-muted"
              disabled={isUploading}
              onChange={(event) => void uploadLogo(event.target.files?.[0])}
              type="file"
            />
          </label>

          <label className="type-label grid gap-2 text-service-ink">
            Logo path
            <input
              className="radius-4 type-text-sm border border-service-border bg-bg-surface px-3 py-2 text-service-ink"
              onChange={(event) => updateIdentity({ logoSrc: event.target.value })}
              placeholder="/clients/client/logo.svg"
              type="text"
              value={identity.logoSrc}
            />
          </label>
          <p className="type-caption text-service-muted">
            Leave the path empty to use the business name as text.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="radius-4 min-h-10 border border-service-ink bg-service-ink px-4 type-label text-white transition-colors hover:bg-service-accent disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isDirty || isSaving || isUploading}
              onClick={() => void saveIdentity()}
              type="button"
            >
              {isSaving ? "Saving…" : "Save site identity"}
            </button>
            {isUploading ? <span className="type-caption text-service-muted">Uploading…</span> : null}
            {status ? <span aria-live="polite" className="type-caption text-service-muted">{status}</span> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
