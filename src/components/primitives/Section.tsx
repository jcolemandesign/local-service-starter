import type { CSSProperties, ElementType, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
  style?: CSSProperties;
};

export function Section({
  children,
  className = "",
  id,
  as: Component = "section",
  style,
}: SectionProps) {
  return (
    <Component
      id={id}
      className={`section-space-med ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
}
