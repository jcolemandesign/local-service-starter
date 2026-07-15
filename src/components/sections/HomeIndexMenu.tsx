"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/primitives/Card";

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
    <>
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
            <div className="border-t border-border-default pt-3">
              <h2
                id={`home-${slugify(group.title)}`}
                className="type-label text-service-ink"
              >
                {group.title}
              </h2>
              <p className="type-caption mt-2 text-service-muted">
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
                  <Card
                    key={link.href}
                    className="group relative flex min-h-44 flex-col p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-service-accent"
                  >
                    <Link
                      aria-label={`Open ${link.label}`}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-0 cursor-pointer rounded-[inherit] focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2"
                    />
                    <div className="relative z-10 flex items-start justify-between gap-4 pointer-events-none">
                      <span className="type-text-md block min-w-0 flex-1 font-semibold text-service-ink">
                        {link.label}
                      </span>
                      {canManagePage ? (
                        <div
                          className="pointer-events-auto flex shrink-0 items-center gap-1"
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
                    </div>
                    <div className="relative z-10 mt-3 flex flex-1 flex-col pointer-events-none">
                      <span className="type-text-sm block text-service-muted">
                        {link.description}
                      </span>
                      <span className="type-caption mt-auto block pt-5 font-semibold text-service-accent">
                        {link.href}
                      </span>
                    </div>
                  </Card>
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
    </>
  );
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
