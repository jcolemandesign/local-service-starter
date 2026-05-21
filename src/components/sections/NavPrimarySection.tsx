"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/primitives";

const menuEase = [0.22, 1, 0.36, 1] as const;

type NavLink = {
  label: string;
  items?: string[];
};

type NavPrimarySectionProps = {
  logoLabel: string;
  phone: string;
  action: string;
  links: NavLink[];
};

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
    >
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

export function NavPrimarySection({
  logoLabel,
  phone,
  action,
  links,
}: NavPrimarySectionProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: menuEase };

  return (
    <section className="relative bg-white">
      <nav
        aria-label="Primary preview navigation"
        className="relative z-30 flex min-h-20 w-full items-center justify-between gap-8 border-b border-service-border bg-white px-8 max-md:px-6"
      >
        <div className="flex min-w-0 items-center gap-10">
          <a
            className="flex h-12 w-36 shrink-0 cursor-pointer items-center justify-center rounded-md border border-service-border bg-service-surface text-sm font-semibold uppercase text-service-muted"
            href="#"
          >
            {logoLabel}
          </a>

          <ul className="flex items-center gap-7 text-sm font-semibold text-service-ink max-lg:hidden">
            {links.map((link) => {
              const hasDropdown = Boolean(link.items?.length);
              const isOpen = openDropdown === link.label;
              const menuId = `desktop-nav-${link.label.toLowerCase().replaceAll(" ", "-")}`;

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
                        className="flex cursor-pointer items-center gap-2 py-3 transition-colors hover:text-service-accent"
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
                            className="absolute left-0 top-[calc(100%+0.75rem)] z-40 w-56 rounded-lg border border-service-border bg-white p-2 shadow-service"
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
                                    className="block cursor-pointer rounded-md px-4 py-3 text-sm font-semibold text-service-ink transition-colors hover:bg-service-surface hover:text-service-accent"
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
                      className="block cursor-pointer py-3 transition-colors hover:text-service-accent"
                      href="#"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          aria-controls="primary-nav-menu"
          aria-expanded={isMenuOpen}
          className="hidden min-h-12 cursor-pointer items-center gap-3 rounded-md border border-service-border bg-white px-5 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent max-lg:flex"
          type="button"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? "Close" : "Menu"}
          <span aria-hidden="true">{isMenuOpen ? "x" : "v"}</span>
        </button>

        <div className="flex shrink-0 items-center gap-3 max-lg:hidden">
          <Button className="gap-2 px-5" href="tel:5550142250" variant="secondary">
            <PhoneIcon />
            {phone}
          </Button>
          <Button href="#contact">{action}</Button>
        </div>
      </nav>

      <AnimatePresence initial={false}>
        {isMenuOpen ? (
          <motion.div
            id="primary-nav-menu"
            className="relative z-20 hidden min-h-[70svh] flex-col items-center justify-center bg-service-ink px-8 py-16 text-white max-lg:flex max-md:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <ul className="grid justify-items-center gap-8 text-center">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    className="cursor-pointer text-5xl font-semibold leading-none transition-colors hover:text-service-accent max-md:text-4xl"
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
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
                            onClick={() => setIsMenuOpen(false)}
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
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/25 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:text-white"
                href="tel:5550142250"
              >
                <PhoneIcon />
                {phone}
              </a>
              <Button href="#contact">{action}</Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
