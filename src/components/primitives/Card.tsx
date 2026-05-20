import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg border border-service-border bg-white shadow-service ${className}`}>
      {children}
    </div>
  );
}
