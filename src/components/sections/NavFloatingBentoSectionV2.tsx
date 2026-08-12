"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Button, DownArrowIcon } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import { useScrollLock } from "@/hooks/useScrollLock";

const menuEase = [0.22, 1, 0.36, 1] as const;

/** A tile inside a floating panel has to give back the panel's inset, or its
 *  corners cut across the curve they sit in. The link bar is padded by 4px and
 *  the dropdown popover by 8px, so each nests its children by that much. The
 *  underscores are Tailwind's escape for the spaces calc() wants around the
 *  minus. */
const nestedRadiusInP1 =
  "rounded-[max(0px,calc(var(--radius-surface-token)_-_0.25rem))]";
const nestedRadiusInP2 =
  "rounded-[max(0px,calc(var(--radius-surface-token)_-_0.5rem))]";

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

type NavFloatingBentoSectionV2Props = {
  /**
   * The floating bars, unlike the primary nav's grouped surface, ship filled
   * and outlined: they sit over the hero image and the panel is what keeps
   * them legible. So these default to the rendered state and the toggles
   * strip it, rather than being opt-in as they are on the other two navs.
   *
   * The dropdown popover keeps its own surface either way - it opens over
   * whatever is behind the nav, and a transparent menu is unreadable.
   */
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  logoHref?: string;
  logoLabel: string;
  /** Public path to a logo image. Empty renders the lettered placeholder. */
  logoSrc?: string;
  phone: string;
  action: string;
  links: readonly NavLink[];
};

/** The floating panel treatment shared by the logo tile, the link bar and the
 *  mobile bar, so one toggle strips all three together. */
function floatingSurface(
  cardFill: "solid" | "none" = "solid",
  cardBorder: "on" | "off" = "on",
) {
  return cx(
    cardFill === "none" ? "!bg-transparent !shadow-none !backdrop-blur-none" : undefined,
    cardBorder === "off" ? "!border-transparent" : undefined,
  );
}

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

function FloatingLogo({
  cardBorder,
  cardFill,
  href = "#",
  label,
  src,
}: {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  href?: string;
  label: string;
  src?: string;
}) {
  // A real logo is its own ground: it takes the full height of the bar it sits
  // beside and carries the shadow on its own silhouette, so no panel is drawn
  // behind it. The lettered placeholder below still needs one - it is type, not
  // a mark, and would disappear into the hero image without a surface.
  if (src) {
    return (
      <a
        className="relative block h-12 w-36 shrink-0 cursor-pointer"
        href={href}
      >
        <Image
          alt={label}
          className={cx(
            "object-contain object-left",
            cardFill === "none" ? undefined : "drop-shadow-service",
          )}
          fill
          priority
          sizes="144px"
          src={src}
        />
      </a>
    );
  }

  return (
    <a
      className={cx(
        "type-label",
        "rounded-[var(--radius-surface-token)]",
        "flex h-12 w-36 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-bg-page/90 p-1 text-service-muted shadow-service backdrop-blur-md transition-colors hover:border-service-accent hover:text-service-accent",
        floatingSurface(cardFill, cardBorder),
      )}
      href={href}
    >
      {label}
    </a>
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
  links: readonly NavLink[];
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
          className="fixed inset-0 z-40 hidden h-dvh overflow-hidden bg-bg-dark text-white max-lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <div
            id="floating-bento-v2-nav-menu"
            className="flex h-full min-h-0 flex-1 flex-col px-[var(--site-grid-inset-inline)] pb-[var(--section-space-sml-mobile)] pt-[var(--section-space-med-mobile)]"
          >
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain">
              <ul className="grid justify-items-center layout-gap-lrg text-center">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="cursor-pointer text-5xl font-semibold leading-none transition-colors hover:text-service-accent max-md:text-4xl"
                      href={link.href ?? "#"}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                    {link.items?.length ? (
                      <ul className="mt-heading-body-sm flex max-w-xl flex-wrap justify-center inline-gap-med text-sm font-semibold uppercase text-white/60">
                        {link.items.map((item) => (
                          <li key={getDropdownItemKey(item)}>
                            <a
                              className="cursor-pointer transition-colors hover:text-white"
                              href={getDropdownItemHref(item)}
                              onClick={() => setIsOpen(false)}
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

              <div className="mt-body-actions-lg flex flex-wrap items-center justify-center inline-gap-sml">
                <a
                  className={cx(
                    "radius-button",
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
  cardBorder = "on",
  cardFill = "solid",
  logoHref,
  logoLabel,
  logoSrc,
  phone,
  action,
  links,
}: NavFloatingBentoSectionV2Props) {
  const visibleLinks = links
    .filter((link) => link.href !== "/thank-you")
    .map((link) => ({
      ...link,
      items: link.items?.filter(
        (item) => getDropdownItemHref(item) !== "/thank-you",
      ),
    }));
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lockActive, setLockActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: menuEase };
  useScrollLock(lockActive);

  return (
    <section className="fluid-type-frame relative min-h-20 bg-transparent">
      {/* Pinned like the other two navs, but it never hides: the bars float
        * over the hero rather than sitting on a band, so there is no moment
        * where they are in the reader's way. The section keeps its height in
        * flow so what follows starts below the bars, same as the primary. */}
      <nav
        aria-label="Floating bento v2 preview navigation"
        className={cx(
          "fixed inset-x-0 top-0",
          // Above the mobile menu overlay only while that menu is open, so the
          // Close control stays reachable; z-30 otherwise, matching the primary.
          isMenuOpen ? "z-50" : "z-30",
        )}
      >
        <div className="pointer-events-none relative z-30 grid grid-cols-[1fr_auto_1fr] items-center px-[var(--site-grid-inset-inline)] py-[var(--site-grid-gap)] max-lg:hidden">
          <div className="pointer-events-auto col-start-1 flex justify-self-start">
            <FloatingLogo cardBorder={cardBorder} cardFill={cardFill} href={logoHref} label={logoLabel} src={logoSrc} />
          </div>

          <ul
            className={cx(
              "type-text-sm",
              "rounded-[var(--radius-surface-token)]",
              "pointer-events-auto col-start-2 flex min-h-12 items-center gap-1 border border-service-border bg-bg-page/90 p-1 font-semibold text-service-ink shadow-service backdrop-blur-md",
              floatingSurface(cardFill, cardBorder),
            )}
          >
            {visibleLinks.map((link) => {
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
                          nestedRadiusInP1,
                          "flex h-10 cursor-pointer items-center gap-2 px-4 transition-colors hover:bg-service-surface hover:text-service-accent",
                        )}
                        type="button"
                        onClick={() =>
                          setOpenDropdown(isOpen ? null : link.label)
                        }
                      >
                        {link.label}
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
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            id={menuId}
                            className={cx(
                              "rounded-[var(--radius-surface-token)]",
                              "absolute left-0 top-[calc(100%+0.5rem)] z-40 w-56 border border-service-border bg-bg-page p-2 shadow-service",
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
                                      nestedRadiusInP2,
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
                      className={cx(
                        nestedRadiusInP1,
                        "flex h-10 cursor-pointer items-center px-4 transition-colors hover:bg-service-surface hover:text-service-accent",
                      )}
                      href={link.href ?? "#"}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="pointer-events-auto col-start-3 flex justify-self-end">
            <div className="flex items-center inline-gap-sml">
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

        <div className="relative z-50 hidden items-center justify-between inline-gap-med px-[var(--site-grid-inset-inline)] py-[var(--site-grid-gap)] max-lg:flex">
          <FloatingLogo cardBorder={cardBorder} cardFill={cardFill} href={logoHref} label={logoLabel} src={logoSrc} />

          <button
            aria-controls="floating-bento-v2-nav-menu"
            aria-expanded={isMenuOpen}
            className={cx(
              "radius-button",
              "flex min-h-12 cursor-pointer items-center gap-3 border border-service-border bg-bg-page/90 px-5 text-sm font-semibold text-service-ink shadow-service backdrop-blur-md transition-colors hover:border-service-accent hover:text-service-accent",
              floatingSurface(cardFill, cardBorder),
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
        links={visibleLinks}
        onExitComplete={() => setLockActive(false)}
        phone={phone}
        setIsOpen={setIsMenuOpen}
      />
    </section>
  );
}
