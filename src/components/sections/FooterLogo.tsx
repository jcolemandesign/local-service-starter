import Image from "next/image";
import type { ReactNode } from "react";

/**
 * The client's mark in a footer, or whatever that footer already drew.
 *
 * Every footer in the library identifies itself with the business name - four
 * of them in a bordered chip on a dark ground, one as a line of body copy on a
 * light panel. Those are deliberately different treatments, so this does not
 * replace them: with no mark set it renders `children`, and each footer keeps
 * exactly the appearance it had.
 *
 * WHY THE FOOTER HAS ITS OWN SLOT rather than reusing the nav's. Every footer
 * here sits on `bg-bg-dark`, and the mark that reads correctly on the nav's
 * page colour is regularly the one that disappears there - a dark wordmark on a
 * dark ground. `resolveFooterLogoSrc` falls back to the primary, so one file
 * still works; the slot exists for when one file does not.
 *
 * Rendered through `next/image`, never inlined, for the reason `SiteIdentity`
 * gives: an inlined SVG executes any script it carries, and these files end up
 * on client sites.
 */
export function FooterLogo({
  businessName,
  children,
  href = "#",
  src,
}: {
  businessName: string;
  children: ReactNode;
  href?: string;
  src?: string;
}) {
  if (!src) {
    return <>{children}</>;
  }

  return (
    <a
      className="relative block h-12 w-40 shrink-0 cursor-pointer"
      href={href}
    >
      <Image
        alt={businessName}
        className="object-contain object-left"
        fill
        // Eager rather than lazy, and deliberately not `priority`. The default
        // lazy loading never fires inside the staged preview's scroll container
        // - the image renders with an empty currentSrc, which reads as the
        // client's logo having failed to save. `priority` would fix that too
        // and add a preload hint for an image below the fold on every page.
        loading="eager"
        sizes="160px"
        src={src}
      />
    </a>
  );
}
