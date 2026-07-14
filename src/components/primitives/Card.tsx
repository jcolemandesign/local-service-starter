import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`radius-medium border border-service-border bg-bg-surface shadow-service ${className}`}>
      {children}
    </div>
  );
}
