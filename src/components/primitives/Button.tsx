import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-service-accent text-white hover:bg-service-ink"
      : "border border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent";

  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold transition-colors ${styles} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
