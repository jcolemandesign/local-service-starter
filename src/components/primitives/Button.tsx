import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ButtonTreatment = "standard" | "expanding-arrow" | "wrapping-arrow" | "text-lift";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  treatment?: ButtonTreatment;
  variant?: "primary" | "secondary";
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const buttonFocusClassName =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent";

const standardButtonBaseClassName =
  "radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap border px-6 py-2 text-sm font-semibold transition duration-200 ease-out";

const standardButtonVariantClassNames = {
  primary:
    "border-transparent bg-service-accent text-white hover:bg-service-ink",
  secondary:
    "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
} as const;

export function Button({
  children,
  className = "",
  treatment = "standard",
  variant = "primary",
  ...props
}: ButtonProps) {
  if (treatment === "expanding-arrow") {
    return (
      <ExpandingArrowButton className={className} {...props}>
        {children}
      </ExpandingArrowButton>
    );
  }

  if (treatment === "wrapping-arrow") {
    return (
      <WrappingArrowButton className={className} {...props}>
        {children}
      </WrappingArrowButton>
    );
  }

  if (treatment === "text-lift") {
    return (
      <TextLiftButton className={className} {...props}>
        {children}
      </TextLiftButton>
    );
  }

  return (
    <a
      className={cx(
        standardButtonBaseClassName,
        standardButtonVariantClassNames[variant],
        buttonFocusClassName,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function ExpandingArrowButton({
  children,
  className = "",
  ...props
}: Omit<ButtonProps, "treatment" | "variant">) {
  return (
    <a
      className={cx(
        "group/button radius-button relative isolate inline-flex min-h-12 cursor-pointer items-center overflow-hidden border border-service-ink bg-service-ink px-6 py-2 pr-16 text-sm font-semibold text-service-accent transition-colors duration-300 ease-out hover:text-service-ink",
        buttonFocusClassName,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="radius-button absolute right-1.5 top-1/2 -z-10 h-9 w-9 -translate-y-1/2 bg-service-accent transition-all duration-300 ease-out group-hover/button:right-0 group-hover/button:h-full group-hover/button:w-full"
      />
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="absolute right-5 top-1/2 -translate-y-1/2 text-service-ink transition-transform duration-300 ease-out group-hover/button:-translate-x-1"
      >
        -&gt;
      </span>
    </a>
  );
}

export function WrappingArrowButton({
  children,
  className = "",
  ...props
}: Omit<ButtonProps, "treatment" | "variant">) {
  return (
    <a
      className={cx(
        "group/button radius-button relative isolate inline-flex min-h-12 cursor-pointer items-center overflow-hidden border border-service-ink bg-service-ink px-6 py-2 pr-16 text-sm font-semibold text-service-accent transition-colors duration-300 ease-out hover:text-service-ink",
        buttonFocusClassName,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="radius-button absolute right-1.5 top-1/2 -z-10 h-9 w-9 -translate-y-1/2 bg-service-accent transition-all duration-300 ease-out group-hover/button:right-0 group-hover/button:h-full group-hover/button:w-full"
      />
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="radius-button absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 overflow-hidden bg-service-accent text-service-ink transition-transform duration-300 ease-out group-hover/button:-translate-x-1"
      >
        <span className="absolute inset-0 grid place-items-center transition-transform duration-300 ease-out group-hover/button:translate-x-full">
          -&gt;
        </span>
        <span className="absolute inset-0 grid -translate-x-full place-items-center transition-transform duration-300 ease-out group-hover/button:translate-x-0">
          -&gt;
        </span>
      </span>
    </a>
  );
}

export function TextLiftButton({
  children,
  className = "",
  ...props
}: Omit<ButtonProps, "treatment" | "variant">) {
  return (
    <a
      className={cx(
        "group/button radius-button relative inline-flex min-h-12 cursor-pointer items-center justify-center overflow-hidden border border-transparent bg-service-accent px-7 py-2 text-sm font-semibold text-white transition duration-200 ease-out hover:scale-[0.97] hover:bg-service-ink",
        buttonFocusClassName,
        className,
      )}
      {...props}
    >
      <span className="invisible" aria-hidden="true">
        {children}
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover/button:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex translate-y-full items-center justify-center transition-transform duration-200 ease-out group-hover/button:translate-y-0"
      >
        {children}
      </span>
    </a>
  );
}
