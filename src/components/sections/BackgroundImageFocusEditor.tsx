"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";

import {
  defaultBackgroundImageFocus,
  fitUsesFocalPoint,
  formatBackgroundImageFocus,
  parseBackgroundImageFocus,
  resolveBackgroundImageFit,
} from "@/content/background-image-config";

/**
 * Picks which part of a ground image survives its crop, by dragging a node
 * across a preview of the image itself.
 *
 * Deliberately the same interaction as `BackgroundNodeEditor`, which already
 * solved the two things that are easy to get wrong here: drag handling lives on
 * the preview rather than on the dot, so a pointer that outruns the dot keeps
 * dragging it, and `setPointerCapture` keeps that alive when the pointer leaves
 * the element entirely.
 *
 * Two mounts. The content editor passes the chosen asset and the node is placed
 * against the real photograph; pagebuilder usually has no image yet - it is
 * chosen per page - so it passes none and gets a placeholder plus a note. The
 * node still works there: the position is a section-level value, and framing it
 * blind against the box is occasionally what you want.
 */
export function BackgroundImageFocusEditor({
  fit,
  imageSrc,
  onChange,
  value,
}: {
  /** The section's fit id. `stretch` hides the control entirely. */
  fit: string | undefined;
  /** The chosen ground image, when the caller has one. */
  imageSrc?: string;
  onChange: (value: string) => void;
  /** Stored as `"<x> <y>"`; anything unparseable reads as centred. */
  value: string | undefined;
}) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const focus = parseBackgroundImageFocus(value) ?? defaultBackgroundImageFocus;

  // At `stretch` the image is sized to exactly the box, so there is no overflow
  // for a focal point to slide and `background-position` does nothing. A node
  // offered here would move and change nothing on the page.
  if (!fitUsesFocalPoint(fit)) {
    return (
      <p className="type-caption text-current/70">
        Stretch fills the box exactly, so there is nothing to reposition. Choose
        Fill or Fit to set a focal point.
      </p>
    );
  }

  function handlePointerMove(event: PointerEvent<Element>) {
    const bounds = previewRef.current?.getBoundingClientRect();

    if (!bounds || bounds.width === 0 || bounds.height === 0) {
      return;
    }

    onChange(
      formatBackgroundImageFocus({
        x: clamp(((event.clientX - bounds.left) / bounds.width) * 100),
        y: clamp(((event.clientY - bounds.top) / bounds.height) * 100),
      }),
    );
  }

  return (
    <div className="grid gap-2">
      {/* Square, matching the gradient node map: the focal point is a pair of
          percentages, so the box's aspect changes nothing that is stored, and a
          square gives the node room to be placed near the top or bottom of a
          tall section. The trade is that `cover` crops to this box rather than
          to the section's real shape, so the preview shows framing intent, not
          a literal crop. */}
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[var(--chrome-radius-control)] border border-current/25 bg-bg-muted"
        ref={previewRef}
      >
        {imageSrc ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-no-repeat"
            style={
              {
                backgroundImage: `url("${imageSrc}")`,
                // Painted through the same two values the section resolves, so
                // the placement being dragged is the placement that renders -
                // only the frame around it is squared off. Resolving the fit
                // some other way here would make every placement wrong.
                backgroundPosition: `${focus.x}% ${focus.y}%`,
                backgroundSize: resolveBackgroundImageFit(fit),
              } as CSSProperties
            }
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center px-3 text-center"
          >
            <span className="type-caption text-current/60">
              No image on this page yet — the node still sets the framing.
            </span>
          </div>
        )}

        <button
          aria-label="Image focal point"
          className="absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-white bg-black/40 shadow-service ring-2 ring-black/70 active:cursor-grabbing"
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              handlePointerMove(event);
            }
          }}
          style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
          type="button"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="type-caption text-current/70">
          x {focus.x}% · y {focus.y}%
        </span>
        <button
          className="token-chrome-card min-h-8 rounded-[var(--chrome-radius-control)] border px-2 text-xs font-semibold"
          onClick={() => onChange("")}
          type="button"
        >
          Center
        </button>
      </div>
    </div>
  );
}

function clamp(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)));
}
