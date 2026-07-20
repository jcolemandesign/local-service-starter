import type { CSSProperties, ReactNode } from "react";

export type LayoutGridColumns = 7 | 14;
export type LayoutGridFrame = "site" | "none";
export type LayoutGridGap = "site" | "sml" | "med" | "lrg";
export type LayoutGridMinHeight =
  | "default"
  | "none"
  | "tiny"
  | "short"
  | "medium"
  | "tall"
  | "screen"
  | "story";
export type LayoutGridPadding = "none" | "sml" | "med" | "lrg";
export type LayoutGridAlignX = "left" | "center" | "right" | "stretch";
export type LayoutGridAlignY = "top" | "middle" | "bottom" | "stretch";
export type LayoutGridMeasure =
  | "none"
  | "caption"
  | "copy"
  | "copyWide"
  | "lead";

export type LayoutGridProps = {
  children: ReactNode;
  className?: string;
  columns?: LayoutGridColumns;
  frame?: LayoutGridFrame;
  gap?: LayoutGridGap;
  minHeight?: LayoutGridMinHeight;
  padding?: LayoutGridPadding;
  style?: CSSProperties;
};

export type LayoutGridItemProps = {
  alignX?: LayoutGridAlignX;
  alignY?: LayoutGridAlignY;
  children: ReactNode;
  className?: string;
  measure?: LayoutGridMeasure;
};

const columnClasses: Record<LayoutGridColumns, string> = {
  7: "grid-cols-7 max-lg:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-1",
  14: "grid-cols-14 max-lg:grid-cols-10 max-md:grid-cols-6 max-sm:grid-cols-2",
};

const gapClasses: Record<LayoutGridGap, string> = {
  site: "site-grid-gap",
  sml: "gap-3",
  med: "gap-6",
  lrg: "gap-8",
};

const paddingClasses: Record<LayoutGridPadding, string> = {
  none: "",
  sml: "section-space-sml",
  med: "section-space-med",
  lrg: "section-space-lrg",
};

const frameClasses: Record<LayoutGridFrame, string> = {
  site: "site-grid-frame",
  none: "",
};

const minHeightClasses: Record<LayoutGridMinHeight, string> = {
  default: "",
  none: "section-min-none",
  tiny: "section-min-tiny",
  short: "section-min-short",
  medium: "section-min-medium",
  tall: "section-min-tall",
  screen: "section-min-screen",
  story: "section-min-story",
};

const alignXClasses: Record<LayoutGridAlignX, string> = {
  left: "justify-items-start text-left",
  center: "justify-items-center text-center",
  right: "justify-items-end text-right",
  stretch: "justify-items-stretch text-left",
};

const alignYClasses: Record<LayoutGridAlignY, string> = {
  top: "content-start self-start",
  middle: "content-center self-center",
  bottom: "content-end self-end",
  stretch: "content-stretch self-stretch",
};

const measureClasses: Record<LayoutGridMeasure, string> = {
  none: "",
  caption: "measure-caption",
  copy: "measure-copy",
  copyWide: "measure-copy-wide",
  lead: "measure-lead",
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function LayoutGrid({
  children,
  className,
  columns = 7,
  frame = "site",
  gap = "site",
  minHeight = "default",
  padding = "none",
  style,
}: LayoutGridProps) {
  return (
    <div
      className={cx(
        "grid",
        columnClasses[columns],
        frameClasses[frame],
        minHeightClasses[minHeight],
        gapClasses[gap],
        paddingClasses[padding],
        className,
      )}
      data-layout-grid={columns}
      style={style}
    >
      {children}
    </div>
  );
}

export function LayoutGridItem({
  alignX = "left",
  alignY = "top",
  children,
  className,
  measure = "none",
}: LayoutGridItemProps) {
  return (
    <div
      className={cx(
        "grid w-full min-w-0 [&>*]:min-w-0 [&>*]:w-full",
        alignXClasses[alignX],
        alignYClasses[alignY],
        measureClasses[measure],
        className,
      )}
    >
      {children}
    </div>
  );
}
