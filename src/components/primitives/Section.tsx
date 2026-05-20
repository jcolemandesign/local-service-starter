import type { ElementType, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
};

export function Section({
  children,
  className = "",
  id,
  as: Component = "section",
}: SectionProps) {
  return (
    <Component id={id} className={`py-24 max-lg:py-20 max-md:py-16 ${className}`}>
      {children}
    </Component>
  );
}
