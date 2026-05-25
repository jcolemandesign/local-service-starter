"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import { useScrollLock } from "@/hooks/useScrollLock";
import styles from "./section-v2-type.module.css";

const menuEase = [0.22, 1, 0.36, 1] as const;

type NavLink = {
  label: string;
  items?: string[];
};

type NavFloatingBentoSectionV2Props = {
  logoLabel: string;
  phone: string;
  action: string;
  links: NavLink[];
  fixed?: boolean;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 5l3 3-2 3c1 2 3 4 5 5l3-2 3 3c-1 2-2 3-4 3-6 0-11-5-11-11 0-2 1-3 3-4z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FloatingLogo({ label }: { label: string }) {
  return (
    <a
      className={cx(
        styles["fluid-label"],
        styles["radius-medium"],
        "flex h-12 w-36 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-white/90 p-1 text-service-muted shadow-service backdrop-blur-md transition-colors hover:border-service-accent hover:text-service-accent",
      )}
      href="#"
    >
      {label}
    </a>
  );
}

function ModalMenu({
  action,
  isOpen,
  links,
  onExitComplete,
  phone,
  setIsOpen,
}: {
  action: string;
  isOpen: boolean;
  links: NavLink[];
  onExitComplete: () => void;
  phone: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: menuEase };

  return (
    <AnimatePresence initial={false} onExitComplete={onExitComplete}>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-40 hidden h-dvh overflow-hidden bg-service-ink text-white max-lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <div
            id="floating-bento-v2-nav-menu"
            className="flex h-full min-h-0 flex-1 flex-col px-8 pb-16 pt-28 max-md:px-6"
          >
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain">
              <ul className="grid justify-items-center gap-8 text-center">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="cursor-pointer text-5xl font-semibold leading-none transition-colors hover:text-service-accent max-md:text-4xl"
                      href="#"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                    {link.items ? (
                      <ul className="mt-5 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold uppercase text-white/60">
                        {link.items.map((item) => (
                          <li key={item}>
                            <a
                              className="cursor-pointer transition-colors hover:text-white"
                              href="#"
                              onClick={() => setIsOpen(false)}
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <a
                  className={cx(
                    styles["radius-medium"],
                    "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap border border-white/25 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:text-white",
                  )}
                  href="tel:5550142250"
                >
                  <PhoneIcon />
                  {phone}
                </a>
                <RequestServiceButton onClick={() => setIsOpen(false)}>
                  {action}
                </RequestServiceButton>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function NavFloatingBentoSectionV2({
  logoLabel,
  phone,
  action,
  links,
  fixed = false,
}: NavFloatingBentoSectionV2Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lockActive, setLockActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: menuEase };
  useScrollLock(lockActive);

  return (
    <section
      className={cx(
        fixed
          ? "fixed inset-x-0 top-0 z-50 bg-transparent"
          : "relative min-h-20 bg-white",
        styles["fluid-type-frame"],
      )}
    >
      <nav aria-label="Floating bento v2 preview navigation">
        <div className="pointer-events-none relative z-30 grid grid-cols-[1fr_auto_1fr] items-center px-8 py-3 max-lg:hidden">
          <div className="pointer-events-auto col-start-1 flex justify-self-start">
            <FloatingLogo label={logoLabel} />
          </div>

          <ul
            className={cx(
              styles["fluid-text-sm"],
              styles["radius-medium"],
              "pointer-events-auto col-start-2 flex min-h-12 items-center gap-1 border border-service-border bg-white/90 p-1 font-semibold text-service-ink shadow-service backdrop-blur-md",
            )}
          >
            {links.map((link) => {
              const hasDropdown = Boolean(link.items?.length);
              const isOpen = openDropdown === link.label;
              const menuId = `floating-v2-nav-${link.label.toLowerCase().replaceAll(" ", "-")}`;

              return (
                <li
                  className="relative"
                  key={link.label}
                  onMouseEnter={() => {
                    if (hasDropdown) {
                      setOpenDropdown(link.label);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasDropdown) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  {hasDropdown ? (
                    <>
                      <button
                        aria-controls={menuId}
                        aria-expanded={isOpen}
                        className={cx(
                          styles["radius-4"],
                          "flex h-10 cursor-pointer items-center gap-2 px-4 transition-colors hover:bg-service-surface hover:text-service-accent",
                        )}
                        type="button"
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : link.label)
                        }
                      >
                        {link.label}
                        <span aria-hidden="true">{isOpen ? "^" : "v"}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            id={menuId}
                            className={cx(
                              styles["radius-medium"],
                              "absolute left-0 top-[calc(100%+0.5rem)] z-40 w-56 border border-service-border bg-white p-2 shadow-service",
                            )}
                            initial={{
                              opacity: 0,
                              y: shouldReduceMotion ? 0 : 6,
                            }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{
                              opacity: 0,
                              y: shouldReduceMotion ? 0 : 6,
                            }}
                            transition={transition}
                          >
                            <ul className="grid gap-1">
                              {link.items?.map((item) => (
                                <li key={item}>
                                  <a
                                    className={cx(
                                      styles["radius-4"],
                                      "block cursor-pointer px-4 py-3 text-sm font-semibold text-service-ink transition-colors hover:bg-service-surface hover:text-service-accent",
                                    )}
                                    href="#"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      className={cx(
                        styles["radius-4"],
                        "flex h-10 cursor-pointer items-center px-4 transition-colors hover:bg-service-surface hover:text-service-accent",
                      )}
                      href="#"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="pointer-events-auto col-start-3 flex justify-self-end">
            <div className="flex items-center gap-3">
              <Button
                className="gap-2 px-5"
                href="tel:5550142250"
                variant="secondary"
              >
                <PhoneIcon />
                {phone}
              </Button>
              <RequestServiceButton>{action}</RequestServiceButton>
            </div>
          </div>
        </div>

        <div className="relative z-50 hidden items-center justify-between gap-4 px-8 py-3 max-lg:flex max-md:px-6">
          <FloatingLogo label={logoLabel} />

          <button
            aria-controls="floating-bento-v2-nav-menu"
            aria-expanded={isMenuOpen}
            className={cx(
              styles["radius-medium"],
              "flex min-h-12 cursor-pointer items-center gap-3 border border-service-border bg-white/90 px-5 text-sm font-semibold text-service-ink shadow-service backdrop-blur-md transition-colors hover:border-service-accent hover:text-service-accent",
            )}
            type="button"
            onClick={() => {
              if (!isMenuOpen) {
                setLockActive(true);
              }

              setIsMenuOpen((currentValue) => !currentValue);
            }}
          >
            {isMenuOpen ? "Close" : "Menu"}
            <span aria-hidden="true">{isMenuOpen ? "x" : "v"}</span>
          </button>
        </div>
      </nav>

      <ModalMenu
        action={action}
        isOpen={isMenuOpen}
        links={links}
        onExitComplete={() => setLockActive(false)}
        phone={phone}
        setIsOpen={setIsMenuOpen}
      />
    </section>
  );
}
