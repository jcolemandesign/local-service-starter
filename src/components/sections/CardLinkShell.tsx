import type { CSSProperties, ReactNode } from "react";

/**
 * Renders a card as a link when it has a destination and as a plain article
 * when it does not.
 *
 * Not exported from the section barrel: this exists for the ordinary link-card
 * grids whose whole card is the click target. An `<a>` with no `href` is not a
 * link, is not focusable, and reads to assistive tech as a generic element, so
 * a static card has to change element rather than just drop its destination.
 *
 * `style` exists for the reveal stagger. The marker class and `--reveal-index`
 * have to land on the same element, and the card is this one - the grid cell
 * around it is a `LayoutGridItem`, which forwards no style, and animating the
 * cell rather than the card would mean reaching into a shared primitive for a
 * value that belongs to the card anyway.
 */
export function CardLinkShell({
  children,
  className,
  href,
  style,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  style?: CSSProperties;
}) {
  if (!href) {
    return (
      <article className={className} style={style}>
        {children}
      </article>
    );
  }

  return (
    <a className={className} href={href} style={style}>
      {children}
    </a>
  );
}
