/**
 * Tunable ground backgrounds.
 *
 * The gradient treatments used to be two hardcoded radial washes in the accent
 * colour at a fixed 18% opacity, with no way to move, recolour or restyle them.
 * This turns that into data: a list of nodes, each with a colour, a position, a
 * radius and a falloff, plus a section-level strength and animation.
 *
 * The rendered value reaches the stylesheet as inline custom properties rather
 * than as a `background-image` declaration, which is the same mechanism
 * `--section-background-image` already uses. That matters for three reasons:
 * bands keep working (the wrapper carries the properties for the whole run),
 * the exporter needs no new concept, and `globals.css` keeps every fallback in
 * one place - a section with no config resolves to the original two washes and
 * renders exactly as it did before this existed.
 *
 * Values are clamped and colours allowlisted rather than escaped, following
 * `resolveBackgroundImage`: these land inside a CSS `url()`/gradient that React
 * never parses and therefore never escapes, so anything unrecognised is dropped
 * instead of being passed through.
 */

/** Palette entries a node may name, mapped to the token that paints them. */
export const backgroundNodeColors = {
  accent: "var(--color-service-accent)",
  highlight: "var(--color-accent)",
  ink: "var(--color-service-ink)",
  surface: "var(--color-service-surface)",
  raised: "var(--color-surface-raised)",
  page: "var(--color-bg-page)",
  dark: "var(--color-bg-dark)",
} as const;

export type BackgroundNodeColor = keyof typeof backgroundNodeColors;

export const backgroundBlendModes = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "plus-lighter",
] as const;

export type BackgroundBlendMode = (typeof backgroundBlendModes)[number];

export type BackgroundNode = {
  /** A `backgroundNodeColors` key, or a literal `#rgb`/`#rrggbb`/`#rrggbbaa`. */
  color: string;
  /** Horizontal centre, as a percentage of the painted box. */
  x: number;
  /** Vertical centre, as a percentage of the painted box. */
  y: number;
  /** Radius, as a percentage of the box. Over 100 lets a wash run off-edge. */
  size: number;
  /** Where the wash reaches full transparency, as a percentage of its radius. */
  fade: number;
};

export type BackgroundConfig = {
  nodes: BackgroundNode[];
  /** Layer opacity, 0-100. The old hardcoded value was 18. */
  strength: number;
  animate: boolean;
  /**
   * Motion rate as a percentage of the 20s base cycle, so 100 is 20s and 200
   * is 10s. Expressed as speed rather than duration because that is the way
   * round it reads on a slider - right is faster.
   */
  speed: number;
  blend: BackgroundBlendMode;
};

/** One full cycle at speed 100, in seconds. */
const baseAnimationSeconds = 20;

/**
 * The two washes the stylesheet has always drawn, expressed in the new model.
 *
 * Not the resolver's fallback - an absent config deliberately resolves to
 * `null` so the CSS keeps its own literal default and untouched sections are
 * provably unchanged. This is the starting point the editor hands you when you
 * first open the controls, so "tune it" begins from what is already on screen.
 */
export const defaultBackgroundConfig: BackgroundConfig = {
  nodes: [
    { color: "accent", x: 12, y: 0, size: 110, fade: 62 },
    { color: "accent", x: 88, y: 100, size: 95, fade: 45 },
  ],
  strength: 18,
  animate: false,
  speed: 100,
  blend: "normal",
};

export const maxBackgroundNodes = 6;

/** `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa`. Nothing else may reach CSS. */
const safeHexColor = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function clamp(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

/**
 * The CSS colour a node paints, or `null` if it names nothing recognised.
 *
 * Token keys win over hex so a palette name can never be shadowed by a literal,
 * and an unrecognised value drops the whole node rather than silently painting
 * a colour nobody chose.
 */
export function resolveBackgroundNodeColor(color: unknown): string | null {
  if (typeof color !== "string") {
    return null;
  }

  const trimmed = color.trim();

  if (trimmed in backgroundNodeColors) {
    return backgroundNodeColors[trimmed as BackgroundNodeColor];
  }

  return safeHexColor.test(trimmed) ? trimmed : null;
}

function resolveNode(node: unknown): BackgroundNode | null {
  if (!node || typeof node !== "object") {
    return null;
  }

  const candidate = node as Partial<BackgroundNode>;

  if (!resolveBackgroundNodeColor(candidate.color)) {
    return null;
  }

  return {
    color: (candidate.color as string).trim(),
    x: clamp(candidate.x, 0, 100, 50),
    y: clamp(candidate.y, 0, 100, 50),
    size: clamp(candidate.size, 10, 200, 100),
    fade: clamp(candidate.fade, 5, 100, 60),
  };
}

/**
 * A stored config, sanitised - or `null` when there is nothing usable, which is
 * the signal for "leave the stylesheet's own default alone".
 */
export function resolveBackgroundConfig(
  config: unknown,
): BackgroundConfig | null {
  if (!config || typeof config !== "object") {
    return null;
  }

  const candidate = config as Partial<BackgroundConfig>;
  const nodes = Array.isArray(candidate.nodes)
    ? candidate.nodes
        .map(resolveNode)
        .filter((node): node is BackgroundNode => node !== null)
        .slice(0, maxBackgroundNodes)
    : [];

  if (nodes.length === 0) {
    return null;
  }

  return {
    nodes,
    strength: clamp(candidate.strength, 0, 100, defaultBackgroundConfig.strength),
    animate: Boolean(candidate.animate),
    // Floored well above zero: speed 0 would divide into an infinite duration
    // and the layer would freeze mid-cycle rather than simply moving slowly.
    speed: clamp(candidate.speed, 10, 300, defaultBackgroundConfig.speed),
    blend: backgroundBlendModes.includes(candidate.blend as BackgroundBlendMode)
      ? (candidate.blend as BackgroundBlendMode)
      : "normal",
  };
}

/** One `radial-gradient()` per node, in the order the editor lists them. */
export function buildBackgroundLayers(config: BackgroundConfig): string {
  return config.nodes
    .map((node) => {
      const color = resolveBackgroundNodeColor(node.color);

      return `radial-gradient(${node.size}% ${node.size}% at ${node.x}% ${node.y}%, ${color}, transparent ${node.fade}%)`;
    })
    .join(", ");
}

/**
 * The inline custom properties a config paints through.
 *
 * `--section-background-size` is pinned to `100% 100%` because the stylesheet
 * default of `140% 140%` exists to give the two fixed washes room to sit
 * off-edge; a node already expresses that through its own position and radius,
 * so scaling the paint area again would double it.
 *
 * The animation is always written, never left to fall through. The stylesheet's
 * drift keyframes name a background-position per layer and so assume exactly
 * two of them - with any other node count the values repeat and the extra
 * layers sit still. Generated layers therefore animate by transform, which is
 * node-count independent, and an unanimated config states `none` outright
 * rather than inheriting drift's default.
 */
export function buildBackgroundConfigStyle(
  config: BackgroundConfig,
): Record<string, string> {
  return {
    "--section-background-layers": buildBackgroundLayers(config),
    "--section-background-size": "100% 100%",
    "--section-background-strength": String(config.strength / 100),
    "--section-background-blend": config.blend,
    // Longhands rather than the `animation` shorthand - see the note in
    // globals.css: a shorthand whose whole value is one variable is fragile
    // through a pipeline that re-serialises shorthands, and silently produced
    // no motion at all.
    "--section-background-animation-name": config.animate
      ? "section-background-float"
      : "none",
    "--section-background-animation-duration": `${(
      (baseAnimationSeconds * 100) /
      config.speed
    ).toFixed(1)}s`,
  };
}
