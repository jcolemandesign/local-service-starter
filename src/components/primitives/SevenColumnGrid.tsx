import { LayoutGrid, type LayoutGridProps } from "./LayoutGrid";

type SevenColumnGridProps = Omit<LayoutGridProps, "columns">;

export function SevenColumnGrid({
  children,
  className,
  frame = "site",
  gap = "site",
  minHeight = "default",
  padding = "none",
  style,
}: SevenColumnGridProps) {
  return (
    <LayoutGrid
      className={className}
      columns={7}
      frame={frame}
      gap={gap}
      minHeight={minHeight}
      padding={padding}
      style={style}
    >
      {children}
    </LayoutGrid>
  );
}

export { LayoutGridItem as SevenColumnGridItem } from "./LayoutGrid";
