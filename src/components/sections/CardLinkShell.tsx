import type { ReactNode } from "react";

/**
 * Renders a card as a link when it has a destination and as a plain article
 * when it does not.
 *
 * Not exported from the section barrel: this exists for the ordinary link-card
 * grids whose whole card is the click target. An `<a>` with no `href` is not a
 * link, is not focusable, and reads to assistive tech as a generic element, so
 * a static card has to change element rather than just drop its destination.
 */
export function CardLinkShell({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  if (!href) {
    return <article className={className}>{children}</article>;
  }

  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}
