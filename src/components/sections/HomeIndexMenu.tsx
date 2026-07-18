"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type HomeIndexLink = {
  label: string;
  href: string;
  description: string;
  mutable?: boolean;
};

export type HomeIndexGroup = {
  title: string;
  links: HomeIndexLink[];
};

type HomeIndexMenuProps = {
  initialGroups: HomeIndexGroup[];
};

type PendingAction =
  | { type: "clone"; link: HomeIndexLink }
  | { type: "delete"; link: HomeIndexLink }
  | null;

type ActionResponse =
  | { ok: true; groups: HomeIndexGroup[]; href?: string }
  | { ok: false; error: string };

const manageableGroupTitles = new Set<string>();

export function HomeIndexMenu({ initialGroups }: HomeIndexMenuProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [cloneLabel, setCloneLabel] = useState("");
  const [cloneSlug, setCloneSlug] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clonePreviewHref = useMemo(() => {
    if (pendingAction?.type !== "clone") {
      return "";
    }

    return buildCloneHref(pendingAction.link.href, cloneSlug);
  }, [cloneSlug, pendingAction]);

  function openClone(link: HomeIndexLink) {
    const label = `${link.label} Copy`;

    setCloneLabel(label);
    setCloneSlug(slugify(label));
    setStatus("");
    setError("");
    setPendingAction({ type: "clone", link });
  }

  function openDelete(link: HomeIndexLink) {
    setStatus("");
    setError("");
    setPendingAction({ type: "delete", link });
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setPendingAction(null);
    setError("");
  }

  async function submitClone() {
    if (pendingAction?.type !== "clone") {
      return;
    }

    await submitAction({
      action: "clone",
      href: pendingAction.link.href,
      label: cloneLabel,
      slug: cloneSlug,
    });
  }

  async function submitDelete() {
    if (pendingAction?.type !== "delete") {
      return;
    }

    await submitAction({
      action: "delete",
      href: pendingAction.link.href,
    });
  }

  async function submitAction(body: Record<string, string>) {
    setIsSubmitting(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/page-index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as ActionResponse;

      if (!response.ok || !result.ok) {
        setError(result.ok ? "Something went wrong." : result.error);
        return;
      }

      setGroups(result.groups);
      setStatus(body.action === "clone" ? "Page cloned." : "Page deleted.");
      setPendingAction(null);
    } catch {
      setError("The action could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="token-chrome contents">
      {status ? (
        <p className="col-start-3 col-span-5 type-caption rounded-sm border border-service-border bg-white px-4 py-3 text-service-muted max-lg:col-start-2 max-lg:col-span-4 max-md:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          {status}
        </p>
      ) : null}
      {groups.map((group) => (
        <section
          key={group.title}
          aria-labelledby={`home-${slugify(group.title)}`}
          className="contents"
        >
          <div className="col-start-1 col-span-1 mt-8 grid w-full min-w-0 content-start self-start justify-items-start text-left [&>*]:min-w-0 [&>*]:w-full max-lg:col-start-1 max-lg:col-span-1 max-lg:mt-4 max-md:col-span-3 max-sm:col-span-1">
            <div className="border-t border-[var(--chrome-border-soft)] pt-4">
              <h2
                id={`home-${slugify(group.title)}`}
                className="type-heading-sm text-[var(--chrome-text)]"
              >
                {group.title}
              </h2>
              <p className="token-chrome-muted type-caption mt-2">
                {group.links.length} links
              </p>
            </div>
          </div>
          <div className="col-start-2 col-span-6 mt-8 grid w-full min-w-0 content-start self-start justify-items-start text-left [&>*]:min-w-0 [&>*]:w-full max-lg:col-start-2 max-lg:col-span-4 max-lg:mt-4 max-md:col-start-1 max-md:col-span-3 max-md:mt-0 max-sm:col-span-1">
            <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-3 max-sm:grid-cols-1">
              {group.links.map((link) => {
                const canManagePage =
                  manageableGroupTitles.has(group.title) && link.mutable === true;

                return (
                  <div
                    key={link.href}
                    className="token-chrome-card group relative flex min-h-44 flex-col overflow-hidden rounded-[var(--chrome-radius-control)] border p-5 transition-all duration-200 hover:-translate-y-1"
                  >
                    <Link
                      aria-label={`Open ${link.label}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-0 cursor-pointer rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2"
                    />
                    <div className="relative z-10 flex items-start pr-12 pointer-events-none">
                      <span className="type-text-md block min-w-0 flex-1 font-semibold text-[var(--chrome-text)]">
                        {link.label}
                      </span>
                      <div className="absolute right-3.5 -top-1 flex shrink-0 items-center gap-2">
                        {canManagePage ? (
                          <div
                            className="pointer-events-auto flex items-center gap-1"
                            aria-label={`${link.label} actions`}
                          >
                          <CardActionButton
                            label={`Clone ${link.label}`}
                            title="Clone page for a new version or branch"
                            onClick={() => openClone(link)}
                          >
                            <CopyIcon />
                          </CardActionButton>
                          <CardActionButton
                            label={`Delete ${link.label}`}
                            title="Delete page"
                            tone="danger"
                            onClick={() => openDelete(link)}
                          >
                            <TrashIcon />
                          </CardActionButton>
                          </div>
                        ) : null}
                        <span
                          aria-hidden="true"
                          className="token-chrome-badge flex size-10 items-center justify-center rounded-[var(--chrome-radius-control)] border"
                        >
                          <IndexLinkIcon href={link.href} />
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 mt-3 flex flex-1 flex-col pointer-events-none">
                      <span className="token-chrome-muted type-text-sm block">
                        {link.description}
                      </span>
                      <span className="token-chrome-accent type-caption mt-auto block pt-5 font-semibold">
                        {link.href}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
      {pendingAction ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/40 px-4 py-8"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-index-action-title"
            className="w-full max-w-md rounded-md border border-service-border bg-white p-6 text-service-ink shadow-service"
          >
            {pendingAction.type === "clone" ? (
              <>
                <p className="type-label text-service-accent">Clone page</p>
                <h3
                  id="home-index-action-title"
                  className="type-heading-sm mt-3 text-service-ink"
                >
                  Copy {pendingAction.link.label}
                </h3>
                <label className="type-caption mt-6 block font-semibold text-service-ink">
                  New page name
                  <input
                    value={cloneLabel}
                    onChange={(event) => {
                      const nextLabel = event.target.value;
                      setCloneLabel(nextLabel);
                      setCloneSlug(slugify(nextLabel));
                    }}
                    className="mt-2 block min-h-11 w-full rounded-sm border border-service-border px-3 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                  />
                </label>
                <label className="type-caption mt-4 block font-semibold text-service-ink">
                  Route slug
                  <input
                    value={cloneSlug}
                    onChange={(event) => setCloneSlug(slugify(event.target.value))}
                    className="mt-2 block min-h-11 w-full rounded-sm border border-service-border px-3 text-sm font-normal text-service-ink outline-none focus:border-service-accent"
                  />
                </label>
                <p className="type-caption mt-3 text-service-muted">
                  New route: {clonePreviewHref}
                </p>
                <ModalError error={error} />
                <ModalActions
                  confirmLabel="Clone page"
                  isSubmitting={isSubmitting}
                  onCancel={closeModal}
                  onConfirm={submitClone}
                />
              </>
            ) : (
              <>
                <p className="type-label text-red-700">Delete page</p>
                <h3
                  id="home-index-action-title"
                  className="type-heading-sm mt-3 text-service-ink"
                >
                  Delete {pendingAction.link.label}?
                </h3>
                <p className="type-text-sm mt-4 text-service-muted">
                  This removes {pendingAction.link.href} from the project index
                  and deletes its route folder from src/app.
                </p>
                <ModalError error={error} />
                <ModalActions
                  confirmLabel="Delete page"
                  isSubmitting={isSubmitting}
                  onCancel={closeModal}
                  onConfirm={submitDelete}
                  tone="danger"
                />
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function IndexLinkIcon({ href }: { href: string }) {
  const iconClass = "size-5";
  const commonProps = {
    "aria-hidden": true,
    className: iconClass,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.75,
    viewBox: "0 0 24 24",
  };

  if (href === "/sections") {
    return <svg {...commonProps}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>;
  }

  if (href === "/dev/templates") {
    return <svg {...commonProps}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 9h16M10 9v11" /></svg>;
  }

  if (href === "/dev/prompt-library") {
    return <svg {...commonProps}><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></svg>;
  }

  if (href === "/strategy") {
    return <svg {...commonProps}><circle cx="12" cy="12" r="8" /><path d="m15 9-2.3 4.7L8 16l2.3-4.7L15 9Z" /></svg>;
  }

  if (href === "/dev/pagebuilder") {
    return <svg {...commonProps}><rect x="4" y="5" width="16" height="14" rx="1" /><path d="M4 9h16M9 9v10" /></svg>;
  }

  if (href === "/dev/style-guide") {
    return <svg {...commonProps}><path d="M12 4a8 8 0 1 0 0 16h1.1a1.9 1.9 0 0 0 1.7-2.7 1.9 1.9 0 0 1 1.7-2.7H18a2 2 0 0 0 2-2A8 8 0 0 0 12 4Z" /><circle cx="8" cy="11" r=".8" fill="currentColor" /><circle cx="11" cy="8" r=".8" fill="currentColor" /><circle cx="15" cy="9" r=".8" fill="currentColor" /></svg>;
  }

  if (href === "/dev/staged-pages") {
    return <svg {...commonProps}><path d="M5 7h5l2 2h7v10H5z" /><path d="M8 13h8M8 16h5" /></svg>;
  }

  if (href === "/dev/content-editor") {
    return <svg {...commonProps}><path d="M5 19h4l10-10a2.1 2.1 0 0 0-3-3L6 16v3Z" /><path d="m14 8 3 3" /></svg>;
  }

  if (href === "/dev/projects") {
    return <svg {...commonProps}><path d="M5 8h14v11H5z" /><path d="M8 8V5h8v3M9 12h6" /></svg>;
  }

  if (href === "/dev/dashboard" || href === "/dashboard") {
    return <svg {...commonProps}><path d="M5 19V9M12 19V5M19 19v-7" /><path d="M3 19h18" /></svg>;
  }

  if (href === "/client-intake") {
    return <svg {...commonProps}><path d="M7 5h10v15H7z" /><path d="M9 4h6v3H9zM10 12h4M10 16h4" /></svg>;
  }

  if (href === "/dev/admin") {
    return <svg {...commonProps}><path d="M12 3 5 6v5c0 4.4 3 7.5 7 10 4-2.5 7-5.6 7-10V6l-7-3Z" /><path d="M9 12h6M12 9v6" /></svg>;
  }

  if (href === "/login") {
    return <svg {...commonProps}><path d="M10 5H5v14h5M13 12h7M17 8l4 4-4 4" /></svg>;
  }

  if (href === "/thank-you") {
    return <svg {...commonProps}><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.3 2.3 4.7-5" /></svg>;
  }

  if (href === "/privacy-policy") {
    return <svg {...commonProps}><rect x="6" y="10" width="12" height="9" rx="1" /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 13v3" /></svg>;
  }

  return <svg {...commonProps}><path d="M6 4h9l3 3v13H6z" /><path d="M15 4v4h4M9 13h6M9 16h6" /></svg>;
}

function ModalError({ error }: { error: string }) {
  return error ? (
    <p className="type-caption mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-red-700">
      {error}
    </p>
  ) : null;
}

function ModalActions({
  confirmLabel,
  isSubmitting,
  onCancel,
  onConfirm,
  tone = "default",
}: {
  confirmLabel: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  tone?: "default" | "danger";
}) {
  const confirmClass =
    tone === "danger"
      ? "bg-red-700 text-white hover:bg-red-800"
      : "bg-service-accent text-white hover:bg-service-ink";

  return (
    <div className="mt-6 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="inline-flex min-h-10 items-center justify-center rounded-sm border border-service-border px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className={`inline-flex min-h-10 items-center justify-center rounded-sm px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${confirmClass}`}
      >
        {isSubmitting ? "Working..." : confirmLabel}
      </button>
    </div>
  );
}

function CardActionButton({
  children,
  label,
  onClick,
  title,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  title: string;
  tone?: "default" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "text-service-muted hover:border-red-200 hover:bg-red-50 hover:text-red-700"
      : "text-service-muted hover:border-service-accent hover:bg-bg-surface hover:text-service-accent";

  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={onClick}
      className={`inline-flex size-7 items-center justify-center rounded-sm border border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2 ${toneClass}`}
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCloneHref(sourceHref: string, slug: string) {
  const segments = sourceHref.split("/").filter(Boolean);
  const parentSegments = segments.slice(0, -1);

  return `/${[...parentSegments, slug || "new-page"].join("/")}`;
}
