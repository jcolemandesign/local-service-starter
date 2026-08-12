"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  backgroundFill?: "solid" | "none";
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

type NavPrimaryLayout = "default" | "centerLogo";

/**
 * The nearest ancestor that actually scrolls, or null for the window.
 *
 * The builder canvas is an `overflow: auto` box, so a nav inside it scrolls
 * against that element and not against the page. Everywhere else - a real
 * site, the staged preview, the template preview - nothing between the nav and
 * the document scrolls, and this returns null so the window is used.
 *
 * The overflow check is paired with a real height comparison on purpose: an
 * `overflow: auto` box that is not actually overflowing scrolls nothing, and
 * treating it as the scroll surface would freeze the nav in a container the
 * reader is scrolling past rather than through.
 */
function getScrollContainer(node: HTMLElement | null): HTMLElement | null {
  let current = node?.parentElement ?? null;

  while (current && current !== document.body) {
    const { overflowY } = window.getComputedStyle(current);

    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      current.scrollHeight > current.clientHeight
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

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

/**
 * The lettered placeholder box is dropped once a real logo is set - a mark
 * inside a bordered panel reads as a placeholder that someone forgot to finish.
 * `fill` with `object-contain` because the image's aspect ratio is whatever the
 * client's file happens to be; the box only caps it.
 */
function Logo({
  isMenuOpen,
  href = "#",
  label,
  src,
}: {
  href?: string;
  isMenuOpen: boolean;
  label: string;
  src?: string;
}) {
  if (src) {
    return (
      <a
        className="relative block h-[3.6rem] w-[10.8rem] shrink-0 cursor-pointer"
        href={href}
      >
        <Image
          alt={label}
          className="object-contain object-left"
          fill
          // Eager: the logo is above-the-fold chrome on every page, and the
          // default lazy loading never fires inside the staged preview's
          // container - the image element renders with an empty currentSrc.
          priority
          sizes="173px"
          src={src}
        />
      </a>
    );
  }

  return (
    <a
      className={cx(
        "type-label",
        "radius-medium",
        "flex h-[3.6rem] w-[10.8rem] shrink-0 cursor-pointer items-center justify-center border transition-colors",
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
  backgroundFill,
  cardBorder,
  cardFill,
  logoHref,
  logoLabel,
  logoSrc,
  phone,
  action,
  links,
}: NavPrimarySectionV2Props) {
  return (
    <NavPrimaryLayoutSection
      action={action}
      backgroundFill={backgroundFill}
      cardBorder={cardBorder}
      cardFill={cardFill}
      layout="default"
      links={links}
      logoHref={logoHref}
      logoLabel={logoLabel}
      logoSrc={logoSrc}
      phone={phone}
    />
  );
}

export function NavCenterLogoSectionV2({
  backgroundFill,
  cardBorder,
  cardFill,
  logoHref,
  logoLabel,
  logoSrc,
  phone,
  action,
  links,
}: NavPrimarySectionV2Props) {
  return (
    <NavPrimaryLayoutSection
      action={action}
      backgroundFill={backgroundFill}
      cardBorder={cardBorder}
      cardFill={cardFill}
      layout="centerLogo"
      links={links}
      logoHref={logoHref}
      logoLabel={logoLabel}
      logoSrc={logoSrc}
      phone={phone}
    />
  );
}

function NavPrimaryLayoutSection({
  backgroundFill = "solid",
  cardBorder = "off",
  cardFill = "none",
  logoHref,
  logoLabel,
  logoSrc,
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
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [hiddenTravel, setHiddenTravel] = useState(0);
  const [lockActive, setLockActive] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: menuEase };
  const isCenterLogo = layout === "centerLogo";
  const hasGroupSurface = cardFill === "solid" || cardBorder === "on";
  const groupSurfaceClassName = cx(
    "radius-medium",
    cardFill === "solid"
      ? "px-8 py-2"
      : hasGroupSurface
        ? "p-2"
        : undefined,
    cardFill === "solid" ? "bg-service-surface shadow-service" : undefined,
    cardBorder === "on" ? "border border-service-border" : undefined,
  );
  useScrollLock(lockActive);

  useEffect(() => {
    /**
     * How far up the nav has to travel to actually be gone.
     *
     * Its own height is not far enough. The group surface inside it carries
     * `shadow-service`, which paints past the nav's bottom edge by the
     * shadow's y-offset plus its blur - so a `-100%` translate parked the box
     * out of sight and left the shadow's falloff on screen as a band along the
     * top. Reading the token off the nav rather than the document keeps this
     * right inside the builder canvas, which overrides the shadow per preview.
     */
    const measureHiddenTravel = () => {
      const nav = navRef.current;

      if (!nav) {
        return;
      }

      const [, offsetY, blur] =
        getComputedStyle(nav)
          .getPropertyValue("--shadow-service")
          .match(/-?[\d.]+px/g) ?? [];
      const shadowReach =
        (Number.parseFloat(offsetY) || 0) + (Number.parseFloat(blur) || 0);

      setHiddenTravel(nav.offsetHeight + Math.max(shadowReach, 0));
    };

    measureHiddenTravel();
    window.addEventListener("resize", measureHiddenTravel);

    return () => {
      window.removeEventListener("resize", measureHiddenTravel);
    };
  }, []);

  useEffect(() => {
    /**
     * The surface this nav scrolls against.
     *
     * On a real page and in the staged/template preview that is the window. In
     * the builder canvas it is the canvas itself, which is an `overflow: auto`
     * box - so `window.scrollY` never moves and every measurement below reads
     * zero. That is why this effect used to detect the builder and return,
     * leaving the nav statically in flow with no hide-on-scroll at all.
     *
     * Reading the scroll container instead gives the builder the same behaviour
     * as the site. What pins the nav to the canvas rather than to the browser
     * window is the `contain: layout` wrapper around the canvas in
     * `PagebuilderShell` - `container-type` alone reads like it should be
     * enough and measurably is not.
     */
    let scroller = getScrollContainer(navRef.current);

    /**
     * Resolved again while it is still unknown. On the builder's first paint
     * the canvas has not overflowed yet, so the walk finds no scrolling
     * ancestor; a mount-only lookup left the nav listening to a window that
     * never scrolls, and hide-on-scroll silently did nothing there for the
     * whole session even once the canvas filled up.
     */
    const readScroller = () => {
      scroller ??= getScrollContainer(navRef.current);

      return scroller;
    };
    const readScrollTop = () => readScroller()?.scrollTop ?? window.scrollY;
    /** Where the top of the scrolling viewport sits in client coordinates. */
    const readViewportTop = () =>
      readScroller()?.getBoundingClientRect().top ?? 0;
    const readViewportHeight = () =>
      readScroller()?.clientHeight ?? window.innerHeight;

    let lastScrollY = readScrollTop();

    const getFollowingHero = () => {
      const navSection = navRef.current?.closest("section");

      if (!navSection) {
        return null;
      }

      const adjacentSection = navSection.nextElementSibling;

      if (adjacentSection?.tagName === "SECTION") {
        return adjacentSection;
      }

      const adjacentFrame = navSection.parentElement?.nextElementSibling;

      return adjacentFrame?.querySelector("section") ?? null;
    };

    const updateNavVisibility = () => {
      const currentScrollY = readScrollTop();
      const scrollDelta = currentScrollY - lastScrollY;
      const hero = getFollowingHero();
      const navHeight = navRef.current?.offsetHeight ?? 0;
      // Both sides in the same coordinate space. `getBoundingClientRect` is
      // relative to the window, so inside a scroll container the container's
      // own offset has to come out of it - otherwise the hero reads as passed
      // from the moment the canvas sits below the top of the page.
      const hasPassedHero = hero
        ? hero.getBoundingClientRect().bottom - readViewportTop() <= navHeight
        : currentScrollY > readViewportHeight();

      if (!hasPassedHero || currentScrollY <= 0) {
        setIsNavHidden(false);
      } else if (Math.abs(scrollDelta) > 6) {
        setIsNavHidden(scrollDelta > 0);
      }

      lastScrollY = currentScrollY;
    };

    // Captured on the window rather than bound to the scroller: scroll events
    // do not bubble, so a listener attached to whatever scrolled at mount
    // misses the canvas in the case above where it was not scrollable yet. In
    // the capture phase the window sees a scroll from any element on the page.
    const listenerOptions = { capture: true, passive: true } as const;

    window.addEventListener("scroll", updateNavVisibility, listenerOptions);
    window.addEventListener("resize", updateNavVisibility);
    updateNavVisibility();

    return () => {
      window.removeEventListener("scroll", updateNavVisibility, listenerOptions);
      window.removeEventListener("resize", updateNavVisibility);
    };
  }, []);

  return (
    <section
      className={cx(
        "relative",
        "min-h-20",
        backgroundFill === "solid" ? "bg-bg-page" : "bg-transparent",
      )}
      style={
        backgroundFill === "none"
          ? { backgroundColor: "transparent" }
          : undefined
      }
    >
      <motion.nav
        aria-label={
          isCenterLogo
            ? "Center logo v2 preview navigation"
            : "Primary v2 preview navigation"
        }
        className={cx(
          isCenterLogo
            ? "grid grid-cols-[1fr_auto_1fr] max-lg:flex max-lg:justify-between"
            : "flex justify-between",
          "fixed inset-x-0 top-0 z-30 min-h-20 w-full items-center gap-8 border-b px-8 max-md:px-6",
          isMenuOpen
            ? "border-transparent bg-transparent max-lg:fixed max-lg:inset-x-0 max-lg:top-0 max-lg:z-50 max-lg:text-white"
            : cx(
                "border-service-border",
                backgroundFill === "solid" ? "bg-bg-page" : "bg-transparent",
              ),
        )}
        style={
          backgroundFill === "none"
            ? { backgroundColor: "transparent" }
            : undefined
        }
        animate={{
          y: isMenuOpen || !isNavHidden ? 0 : -hiddenTravel,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.22, ease: menuEase }
        }
        ref={navRef}
      >
        <div
          className={
            isCenterLogo
              ? "flex min-w-0 items-center gap-7 justify-self-start"
              : "flex min-w-0 items-center gap-10"
          }
        >
          {!isCenterLogo ? (
            <Logo href={logoHref} isMenuOpen={isMenuOpen} label={logoLabel} src={logoSrc} />
          ) : null}

          <ul
            className={cx(
              "type-text-sm",
              "flex items-center gap-7 font-semibold text-service-ink max-lg:hidden",
              groupSurfaceClassName,
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
          <Logo href={logoHref} isMenuOpen={isMenuOpen} label={logoLabel} src={logoSrc} />
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
      </motion.nav>

      <AnimatePresence
        initial={false}
        onExitComplete={() => setLockActive(false)}
      >
        {isMenuOpen ? (
          <motion.div
            className="fixed inset-0 z-40 hidden h-dvh overflow-hidden bg-bg-dark text-white max-lg:flex"
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
