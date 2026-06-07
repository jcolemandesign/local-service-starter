import type { ReactNode } from "react";

type SevenColumnGridFrame = "site" | "none";
type SevenColumnGridGap = "site" | "sml" | "med" | "lrg";
type SevenColumnGridMinHeight =
  | "default"
  | "none"
  | "short"
  | "medium"
  | "tall"
  | "screen"
  | "story";
type SevenColumnGridPadding = "none" | "sml" | "med" | "lrg";
type SevenColumnGridAlignX = "left" | "center" | "right" | "stretch";
type SevenColumnGridAlignY = "top" | "middle" | "bottom" | "stretch";
type SevenColumnGridMeasure = "none" | "caption" | "copy" | "copyWide" | "lead";

type SevenColumnGridProps = {
  children: ReactNode;
  className?: string;
  frame?: SevenColumnGridFrame;
  gap?: SevenColumnGridGap;
  minHeight?: SevenColumnGridMinHeight;
  padding?: SevenColumnGridPadding;
};

type SevenColumnGridItemProps = {
  alignX?: SevenColumnGridAlignX;
  alignY?: SevenColumnGridAlignY;
  children: ReactNode;
  className?: string;
  measure?: SevenColumnGridMeasure;
};

const gapClasses: Record<SevenColumnGridGap, string> = {
  site: "site-grid-gap",
  sml: "gap-3",
  med: "gap-6",
  lrg: "gap-8",
};

const paddingClasses: Record<SevenColumnGridPadding, string> = {
  none: "",
  sml: "section-space-sml",
  med: "section-space-med",
  lrg: "section-space-lrg",
};

const frameClasses: Record<SevenColumnGridFrame, string> = {
  site: "site-grid-frame",
  none: "",
};

const minHeightClasses: Record<SevenColumnGridMinHeight, string> = {
  default: "",
  none: "section-min-none",
  short: "section-min-short",
  medium: "section-min-medium",
  tall: "section-min-tall",
  screen: "section-min-screen",
  story: "section-min-story",
};

const alignXClasses: Record<SevenColumnGridAlignX, string> = {
  left: "justify-items-start text-left",
  center: "justify-items-center text-center",
  right: "justify-items-end text-right",
  stretch: "justify-items-stretch text-left",
};

const alignYClasses: Record<SevenColumnGridAlignY, string> = {
  top: "content-start self-start",
  middle: "content-center self-center",
  bottom: "content-end self-end",
  stretch: "content-stretch self-stretch",
};

const measureClasses: Record<SevenColumnGridMeasure, string> = {
  none: "",
  caption: "measure-caption",
  copy: "measure-copy",
  copyWide: "measure-copy-wide",
  lead: "measure-lead",
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SevenColumnGrid({
  children,
  className,
  frame = "site",
  gap = "site",
  minHeight = "default",
  padding = "none",
}: SevenColumnGridProps) {
  return (
    <div
      className={cx(
        "grid grid-cols-7",
        frameClasses[frame],
        minHeightClasses[minHeight],
        gapClasses[gap],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SevenColumnGridItem({
  alignX = "left",
  alignY = "top",
  children,
  className,
  measure = "none",
}: SevenColumnGridItemProps) {
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
