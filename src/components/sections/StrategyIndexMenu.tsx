"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { homeIndexContent } from "@/content/home";
import { useScrollLock } from "@/hooks/useScrollLock";

type StrategyIndexMenuProps = {
  clientSlug: string;
};

const menuEase = [0.22, 1, 0.36, 1] as const;

export function StrategyIndexMenu({ clientSlug }: StrategyIndexMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  useScrollLock(isOpen);

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: menuEase };

  return (
    <>
      <button
        aria-controls="strategy-index-menu"
        aria-expanded={isOpen}
        className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-sm border border-white/25 bg-transparent px-3 text-sm font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Index
        <IndexIcon />
      </button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <motion.div
            id="strategy-index-menu"
            aria-label="Project index"
            aria-modal="true"
            className="token-chrome fixed inset-0 z-50 flex bg-slate-950/80 p-4 backdrop-blur-sm max-md:p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            transition={transition}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsOpen(false);
              }
            }}
                >
                  <motion.div
              className="token-chrome-panel mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-md border border-[var(--chrome-border-soft)] bg-[var(--chrome-bg)] shadow-service"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              transition={transition}
            >
              <header className="flex items-center justify-between gap-4 border-b border-[var(--chrome-border-soft)] px-6 py-4 max-md:px-4">
                <div>
                  <p className="type-label text-[var(--chrome-accent)]">Local service starter</p>
                  <h2 className="type-heading-sm mt-1 text-[var(--chrome-text)]">Project index</h2>
                </div>
                <button
                  className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-[var(--chrome-border-soft)] px-3 text-sm font-semibold text-[var(--chrome-text)] transition-colors hover:border-[var(--chrome-accent)] hover:text-[var(--chrome-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chrome-accent)]"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                  <span aria-hidden="true" className="text-lg leading-none">×</span>
                </button>
              </header>

              <nav className="grid flex-1 grid-cols-3 content-start gap-x-8 gap-y-7 overflow-y-auto p-6 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:p-4" aria-label="Project tools">
                {homeIndexContent.groups.map((group) => (
                  <section key={group.title} aria-labelledby={`strategy-index-${slugify(group.title)}`}>
                    <h3 id={`strategy-index-${slugify(group.title)}`} className="type-heading-sm border-b border-[var(--chrome-border-soft)] pb-3 text-[var(--chrome-text)]">
                      {group.title}
                    </h3>
                    <ul className="mt-3 grid gap-1">
                      {group.links.map((link) => {
                        const href = link.href === "/strategy" ? `/dev/projects/${clientSlug}/strategy` : link.href;

                        return (
                          <li key={link.href}>
                            <Link
                              className="block rounded-sm px-3 py-2.5 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--chrome-accent)]"
                              href={href}
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="type-text-sm block font-semibold text-[var(--chrome-text)]">{link.label}</span>
                              <span className="type-caption mt-1 block text-[var(--chrome-muted)]">{link.description}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </nav>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

function IndexIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="M5 6h14M5 12h14M5 18h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
