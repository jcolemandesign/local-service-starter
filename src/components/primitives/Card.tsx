import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      /**
       * `recipe-card-context` re-points the colour ground to this card's own
       * fill, so the text hierarchy, borders and tint re-resolve against the
       * card instead of the section behind it. Without it a card whose fill
       * differs in lightness from its section inherits the section's already-
       * resolved foreground - light text on a light card, or the reverse.
       */
      className={`recipe-card-context radius-medium border border-service-border bg-bg-surface shadow-service ${className}`}
    >
      {children}
    </div>
  );
}
