"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button, DownArrowIcon } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import { useScrollLock } from "@/hooks/useScrollLock";

const menuEase = [0.22, 1, 0.36, 1] as const;

type NavDropdownItem =
  | string
  | {
      href?: string;
      label: string;
    };

type NavLink = {
  href?: string;
  label: string;
  items?: readonly NavDropdownItem[];
};

type NavPrimarySectionV2Props = {
  logoHref?: string;
  logoLabel: string;
  phone: string;
  action: string;
  links: readonly NavLink[];
};

type NavPrimaryLayout = "default" | "centerLogo";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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

function getDropdownItemLabel(item: NavDropdownItem) {
  return typeof item === "string" ? item : item.label;
}

function getDropdownItemHref(item: NavDropdownItem) {
  return typeof item === "string" ? "#" : (item.href ?? "#");
}

function getDropdownItemKey(item: NavDropdownItem) {
  return `${getDropdownItemLabel(item)}-${getDropdownItemHref(item)}`;
}

function Logo({
  isMenuOpen,
  href = "#",
  label,
}: {
  href?: string;
  isMenuOpen: boolean;
  label: string;
}) {
  return (
    <a
      className={cx(
        "type-label",
        "radius-medium",
        "flex h-12 w-36 shrink-0 cursor-pointer items-center justify-center border transition-colors",
        isMenuOpen
          ? "border-white/20 bg-white/5 text-white"
          : "border-service-border bg-service-surface text-service-muted hover:border-service-accent hover:text-service-accent",
      )}
      href={href}
    >
      {label}
    </a>
  );
}

export function NavPrimarySectionV2({
  logoHref,
  logoLabel,
  phone,
  action,
  links,
}: NavPrimarySectionV2Props) {
  return (
    <NavPrimaryLayoutSection
      action={action}
      layout="default"
      links={links}
      logoHref={logoHref}
      logoLabel={logoLabel}
      phone={phone}
    />
  );
}

export function NavCenterLogoSectionV2({
  logoHref,
  logoLabel,
  phone,
  action,
  links,
}: NavPrimarySectionV2Props) {
  return (
    <NavPrimaryLayoutSection
      action={action}
      layout="centerLogo"
      links={links}
      logoHref={logoHref}
      logoLabel={logoLabel}
      phone={phone}
    />
  );
}

function NavPrimaryLayoutSection({
  logoHref,
  logoLabel,
  phone,
  action,
  links,
  layout,
}: NavPrimarySectionV2Props & { layout: NavPrimaryLayout }) {
  const visibleLinks = links
    .filter((link) => link.href !== "/thank-you")
    .map((link) => ({
      ...link,
      items: link.items?.filter(
        (item) => getDropdownItemHref(item) !== "/thank-you",
      ),
    }));
  const phoneHref = `tel:${phone.replace(/\D/g, "")}`;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lockActive, setLockActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: menuEase };
  const isCenterLogo = layout === "centerLogo";
  useScrollLock(lockActive);

  return (
    <section className={cx("relative bg-bg-page", "fluid-type-frame")}>
      <nav
        aria-label={
          isCenterLogo
            ? "Center logo v2 preview navigation"
            : "Primary v2 preview navigation"
        }
        className={cx(
          isCenterLogo
            ? "grid grid-cols-[1fr_auto_1fr] max-lg:flex max-lg:justify-between"
            : "flex justify-between",
          "relative z-30 min-h-20 w-full items-center gap-8 border-b px-8 max-md:px-6",
          isMenuOpen
            ? "border-transparent bg-transparent max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:z-50 max-lg:text-white"
            : "border-service-border bg-bg-page",
        )}
      >
        <div
          className={
            isCenterLogo
              ? "flex min-w-0 items-center gap-7 justify-self-start"
              : "flex min-w-0 items-center gap-10"
          }
        >
          {!isCenterLogo ? (
            <Logo href={logoHref} isMenuOpen={isMenuOpen} label={logoLabel} />
          ) : null}

          <ul
            className={cx(
              "type-text-sm",
              "flex items-center gap-7 font-semibold text-service-ink max-lg:hidden",
            )}
          >
            {visibleLinks.map((link) => {
              const hasDropdown = Boolean(link.items?.length);
              const isOpen = openDropdown === link.label;
              const menuId = `desktop-v2-nav-${link.label.toLowerCase().replaceAll(" ", "-")}`;

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
                      <div className="flex items-center">
                        <a
                          className="cursor-pointer py-3 transition-colors hover:text-service-accent"
                          href={link.href ?? "#"}
                        >
                          {link.label}
                        </a>
                        <button
                          aria-controls={menuId}
                          aria-expanded={isOpen}
                          aria-label={`Open ${link.label} menu`}
                          className="cursor-pointer p-2 transition-colors hover:text-service-accent"
                          type="button"
                          onClick={() =>
                            setOpenDropdown(isOpen ? null : link.label)
                          }
                        >
                          <span
                            aria-hidden="true"
                            className={cx(
                              "inline-flex transition-transform",
                              isOpen ? "rotate-180" : undefined,
                            )}
                          >
                            <DownArrowIcon className="size-3.5" />
                          </span>
                        </button>
                      </div>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            id={menuId}
                            className={cx(
                              "radius-medium",
                              "absolute left-0 top-[calc(100%+0.75rem)] z-40 w-56 border border-service-border bg-bg-page p-2 shadow-service",
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
                                <li key={getDropdownItemKey(item)}>
                                  <a
                                    className={cx(
                                      "radius-4",
                                      "block cursor-pointer px-4 py-3 text-sm font-semibold text-service-ink transition-colors hover:bg-service-surface hover:text-service-accent",
                                    )}
                                    href={getDropdownItemHref(item)}
                                  >
                                    {getDropdownItemLabel(item)}
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
                      href={link.href ?? "#"}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {isCenterLogo ? (
          <Logo href={logoHref} isMenuOpen={isMenuOpen} label={logoLabel} />
        ) : null}

        <button
          aria-controls="primary-v2-nav-menu"
          aria-expanded={isMenuOpen}
          className={cx(
            "radius-medium",
            "hidden min-h-12 cursor-pointer items-center gap-3 border px-5 text-sm font-semibold transition-colors max-lg:flex",
            isMenuOpen
              ? "border-white/20 bg-white/5 text-white hover:border-white/45"
              : "border-service-border bg-bg-page text-service-ink hover:border-service-accent hover:text-service-accent",
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

        <div className="flex shrink-0 items-center gap-3 justify-self-end max-lg:hidden">
          <Button className="gap-2 px-5" href={phoneHref} variant="secondary">
            <PhoneIcon />
            {phone}
          </Button>
          <RequestServiceButton>{action}</RequestServiceButton>
        </div>
      </nav>

      <AnimatePresence
        initial={false}
        onExitComplete={() => setLockActive(false)}
      >
        {isMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-40 hidden h-dvh overflow-hidden bg-service-ink text-white max-lg:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            <div
              id="primary-v2-nav-menu"
              className="flex h-full min-h-0 flex-1 flex-col px-8 pb-16 pt-28 max-md:px-6"
            >
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain">
                <ul className="grid justify-items-center gap-8 text-center">
                  {visibleLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        className="cursor-pointer text-5xl font-semibold leading-none transition-colors hover:text-service-accent max-md:text-4xl"
                        href={link.href ?? "#"}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                      {link.items?.length ? (
                        <ul className="mt-5 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold uppercase text-white/60">
                          {link.items.map((item) => (
                            <li key={getDropdownItemKey(item)}>
                              <a
                                className="cursor-pointer transition-colors hover:text-white"
                                href={getDropdownItemHref(item)}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {getDropdownItemLabel(item)}
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
                      "radius-medium",
                      "inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap border border-white/25 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:text-white",
                    )}
                    href={phoneHref}
                  >
                    <PhoneIcon />
                    {phone}
                  </a>
                  <RequestServiceButton onClick={() => setIsMenuOpen(false)}>
                    {action}
                  </RequestServiceButton>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
