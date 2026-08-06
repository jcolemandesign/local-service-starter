import {
  defaultBackgroundConfig,
  type BackgroundConfig,
} from "@/content/background-config";

/**
 * Named starting points for a tuned background.
 *
 * A preset is a plain `BackgroundConfig`, applied by copying it onto the
 * section rather than by reference. That is the same call the rest of this
 * pipeline makes - promotion severs the runtime tie, so editing a template does
 * not reach back into pages already staged from it - and it matters more here
 * than it looks: a section that stayed linked to its preset would silently
 * repaint every time the preset was retuned, on pages already approved.
 *
 * So "Hero mesh" is where a background starts, not what it is. Once applied it
 * is that section's own config and the nodes can be dragged freely.
 */

export type BackgroundPreset = {
  id: string;
  label: string;
  /** One line on when to reach for it, shown under the name in the builder. */
  hint: string;
  config: BackgroundConfig;
};

export const backgroundPresets: readonly BackgroundPreset[] = [
  {
    id: "default",
    label: "Two washes",
    hint: "The original pair of accent washes, corner to corner.",
    config: defaultBackgroundConfig,
  },
  {
    id: "hero-mesh",
    label: "Hero mesh",
    hint: "Four overlapping colours. Busy enough to carry a tall hero.",
    config: {
      nodes: [
        { color: "accent", x: 18, y: 12, size: 120, fade: 58, opacity: 100 },
        { color: "highlight", x: 82, y: 22, size: 105, fade: 52, opacity: 70 },
        { color: "ink", x: 68, y: 88, size: 130, fade: 60, opacity: 45 },
        { color: "accent", x: 8, y: 82, size: 95, fade: 48, opacity: 60 },
      ],
      strength: 26,
      animate: true,
      speed: 70,
      blend: "normal",
    },
  },
  {
    id: "corner-glow",
    label: "Corner glow",
    hint: "One bright corner. Good behind a left-aligned headline.",
    config: {
      nodes: [
        { color: "accent", x: 6, y: 8, size: 135, fade: 65, opacity: 100 },
      ],
      strength: 22,
      animate: false,
      speed: 100,
      blend: "normal",
    },
  },
  {
    id: "horizon",
    label: "Horizon",
    hint: "A wide low band, so the section reads as sitting on something.",
    config: {
      nodes: [
        { color: "accent", x: 50, y: 108, size: 180, fade: 70, opacity: 100 },
        { color: "highlight", x: 50, y: 118, size: 120, fade: 55, opacity: 55 },
      ],
      strength: 30,
      animate: false,
      speed: 100,
      blend: "normal",
    },
  },
  {
    id: "drift-slow",
    label: "Slow drift",
    hint: "Three faint washes on a long cycle. Ambient, not decorative.",
    config: {
      nodes: [
        { color: "accent", x: 22, y: 28, size: 140, fade: 62, opacity: 80 },
        { color: "highlight", x: 78, y: 62, size: 125, fade: 58, opacity: 55 },
        { color: "accent", x: 50, y: 96, size: 110, fade: 50, opacity: 40 },
      ],
      strength: 24,
      animate: true,
      speed: 40,
      blend: "normal",
    },
  },
];

export function getBackgroundPreset(id: string | undefined) {
  return backgroundPresets.find((preset) => preset.id === id);
}
