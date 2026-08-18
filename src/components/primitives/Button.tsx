import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export type ButtonVariant = "primary" | "secondary";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * The two class hooks every button in the system renders, and the whole of what
 * a call site may say about a button's appearance.
 *
 * THE STYLE IS NOT HERE. `.button-cta` and the three slot rules live in
 * `globals.css`; the styles themselves are data in
 * `src/content/button-styles.ts`, assigned in the Style Guide and promoted like
 * every other token. This component chooses a ROLE - is this the page's primary
 * action or its companion - and the system answers what that role looks like.
 *
 * That is the same ownership split the motion axis settled on, and it arrived
 * here for the same reason: the `treatment` prop this replaces let a section
 * pick its own button, and exactly one section had - the narrative feature rail,
 * hard-coded to the old text lift. A per-section choice of style is what the
 * Style Guide exists to prevent, so the prop is gone rather than deprecated.
 *
 * `buttonClassNames` is exported because `RequestServiceButton` renders a
 * `<button>` that opens the request modal rather than an `<a>`, and it has to be
 * the same button. It used to hand-copy these classes; the two drifted, and its
 * secondary was still the filled pill this system removed.
 */
export function buttonClassNames(
  variant: ButtonVariant = "primary",
  className = "",
) {
  return cx(
    "button-cta",
    variant === "secondary" ? "button-cta-secondary" : "button-cta-primary",
    className,
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <a className={buttonClassNames(variant, className)} {...props}>
      {children}
    </a>
  );
}
