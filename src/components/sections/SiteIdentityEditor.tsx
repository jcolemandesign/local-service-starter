"use client";

import Image from "next/image";
import { useState } from "react";
import {
  emptySiteIdentity,
  siteIdentityLogoFields,
  type SiteIdentity,
  type SiteIdentityLogoSlot,
} from "@/content/site-identity";

type SiteIdentityEditorProps = {
  clientSlug: string;
  initialIdentity?: SiteIdentity;
};

type SaveIdentityResponse =
  | { identity: SiteIdentity; ok: true }
  | { error?: string; ok: false };

type LogoField = (typeof siteIdentityLogoFields)[SiteIdentityLogoSlot];

/**
 * THE THREE SLOTS, AND WHAT EACH ONE IS FOR.
 *
 * Written out here rather than derived from the field names, because what
 * separates them is editorial and not technical: the person filling this in
 * needs to know that the icon exists for places a wordmark will not fit, and
 * that the footer's mark sits on a dark ground. Nothing downstream can tell
 * them that.
 */
const logoSlots: readonly {
  field: LogoField;
  hint: string;
  label: string;
  slot: SiteIdentityLogoSlot;
}[] = [
  {
    field: "logoSrc",
    hint: "The full wordmark. Used by every nav unless a slot below replaces it.",
    label: "Primary logo",
    slot: "primary",
  },
  {
    field: "logoIconSrc",
    hint: "The compact mark, for slots a wordmark is too wide for. Falls back to the primary when empty.",
    label: "Logo icon",
    slot: "icon",
  },
  {
    field: "footerLogoSrc",
    hint: "The footer's mark. Every footer sits on a dark ground, so this is usually a light version. Falls back to the primary when empty.",
    label: "Footer logo",
    slot: "footer",
  },
];

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
  /** Which slot is mid-upload, so only that slot's input is disabled and the
   *  other two stay usable. A single boolean locked all three on any upload. */
  const [uploadingSlot, setUploadingSlot] = useState<SiteIdentityLogoSlot | "">(
    "",
  );
  const [isOpen, setIsOpen] = useState(false);
  /** The paths whose preview image failed to load, so a stored path that no
   *  longer resolves is visible here rather than only as a missing mark in the
   *  builder. Holding paths rather than booleans resets itself: a different
   *  path is not in the list, so its preview is retried. */
  const [failedLogoSrcs, setFailedLogoSrcs] = useState<readonly string[]>([]);

  const isDirty =
    identity.businessName !== savedIdentity.businessName ||
    logoSlots.some(({ field }) => identity[field] !== savedIdentity[field]);

  function updateIdentity(patch: Partial<SiteIdentity>) {
    setIdentity((current) => ({ ...current, ...patch }));
  }

  function markFailed(src: string) {
    setFailedLogoSrcs((current) =>
      current.includes(src) ? current : [...current, src],
    );
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
        setStatus(
          result.ok
            ? "Could not save site identity."
            : (result.error ?? "Could not save site identity."),
        );
        return;
      }

      setIdentity(result.identity);
      setSavedIdentity(result.identity);
      setStatus(
        isDirty
          ? "Site identity saved."
          : "Re-checked. Every saved path still resolves to a file.",
      );
    } catch {
      setStatus("Could not save site identity.");
    } finally {
      setIsSaving(false);
    }
  }

  async function uploadLogo(
    slot: SiteIdentityLogoSlot,
    file: File | undefined,
  ) {
    if (!file) {
      return;
    }

    setUploadingSlot(slot);
    setStatus("");

    try {
      const formData = new FormData();
      formData.append("clientSlug", clientSlug);
      formData.append("file", file);
      // The slot the server writes into. Omitting it overwrites the primary,
      // which is the one mistake this form must not be able to make.
      formData.append("slot", slot);

      const response = await fetch("/api/site-identity/logo", {
        body: formData,
        method: "POST",
      });
      const result = (await response.json()) as SaveIdentityResponse;

      if (!response.ok || !result.ok) {
        setStatus(
          result.ok
            ? "Could not upload logo."
            : (result.error ?? "Could not upload logo."),
        );
        return;
      }

      setIdentity(result.identity);
      setSavedIdentity(result.identity);
      setStatus("Logo uploaded and saved.");
    } catch {
      setStatus("Could not upload logo.");
    } finally {
      setUploadingSlot("");
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
            <span className="type-label block text-service-accent">
              Site chrome
            </span>
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
        className="mt-6 grid gap-6"
        hidden={!isOpen}
        id="site-identity-editor"
      >
        <p className="type-text-sm text-service-muted">
          Used by every navigation and footer for this client. Upload SVG, PNG,
          JPEG, or WebP up to 2 MB.
        </p>

        <label className="type-label grid max-w-md gap-2 text-service-ink">
          Business name
          <input
            className="radius-4 type-text-sm border border-service-border bg-bg-surface px-3 py-2 text-service-ink"
            onChange={(event) =>
              updateIdentity({ businessName: event.target.value })
            }
            placeholder="North Star HVAC"
            type="text"
            value={identity.businessName}
          />
        </label>

        {logoSlots.map(({ field, hint, label, slot }) => {
          const value = identity[field];
          const isBroken = Boolean(value) && failedLogoSrcs.includes(value);
          const isUploading = uploadingSlot === slot;

          return (
            <div
              className="grid grid-cols-[11rem_minmax(0,1fr)] gap-6 border-t border-service-border pt-6 max-md:grid-cols-1"
              key={slot}
            >
              <div className="radius-surface relative flex min-h-28 items-center justify-center border border-service-border bg-service-surface p-4">
                {value && !isBroken ? (
                  <Image
                    alt={`${identity.businessName || "Client"} ${label.toLowerCase()}`}
                    className="object-contain"
                    fill
                    onError={() => markFailed(value)}
                    sizes="176px"
                    src={value}
                  />
                ) : (
                  <span className="type-caption text-center text-service-muted">
                    {isBroken ? "That path did not load" : `${label} preview`}
                  </span>
                )}
              </div>

              <div className="grid content-start gap-3">
                <div>
                  <p className="type-label text-service-ink">{label}</p>
                  <p className="type-caption mt-heading-body-sm text-service-muted">
                    {hint}
                  </p>
                </div>

                <label className="type-label grid gap-2 text-service-ink">
                  Upload
                  <input
                    accept="image/svg+xml,image/png,image/jpeg,image/webp"
                    className="type-text-sm text-service-muted"
                    disabled={isUploading}
                    // Clearing the input afterwards is what makes a second
                    // attempt at the SAME file work. A file input fires
                    // `change` only when the selection differs from what it
                    // already holds, so re-picking the file you just picked is
                    // silently a no-op - which reads as the upload button being
                    // dead.
                    onChange={(event) => {
                      const input = event.currentTarget;

                      void uploadLogo(slot, input.files?.[0]).finally(() => {
                        input.value = "";
                      });
                    }}
                    type="file"
                  />
                </label>

                <label className="type-label grid gap-2 text-service-ink">
                  Path
                  <input
                    className="radius-4 type-text-sm border border-service-border bg-bg-surface px-3 py-2 text-service-ink"
                    onChange={(event) =>
                      updateIdentity({ [field]: event.target.value })
                    }
                    placeholder={`/clients/client/${slot}.svg`}
                    type="text"
                    value={value}
                  />
                </label>

                {isUploading ? (
                  <span className="type-caption text-service-muted">
                    Uploading…
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-3 border-t border-service-border pt-6">
          {/* Not disabled when nothing has changed. Saving an unchanged record
              re-runs the server's file check and reports whether the stored
              paths still resolve, which is the answer someone is looking for
              when a mark has stopped appearing - and a dead button reads as the
              save being broken. */}
          <button
            className="radius-4 min-h-10 border border-service-ink bg-service-ink px-4 type-label text-white transition-colors hover:bg-service-accent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSaving || uploadingSlot !== ""}
            onClick={() => void saveIdentity()}
            type="button"
          >
            {isSaving ? "Saving…" : "Save identity"}
          </button>
          <p className="type-caption text-service-muted">
            Uploading saves on its own. This button is for the business name, a
            hand-typed path, or clearing one - leave a path empty to fall back.
          </p>
          {status ? (
            <span aria-live="polite" className="type-caption text-service-muted">
              {status}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
