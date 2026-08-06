"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";

import {
  backgroundBlendModes,
  backgroundNodeColors,
  buildBackgroundConfigStyle,
  defaultBackgroundConfig,
  maxBackgroundNodes,
  resolveBackgroundNodeColor,
  type BackgroundBlendMode,
  type BackgroundConfig,
  type BackgroundNode,
} from "@/content/background-config";
import {
  backgroundPresets,
  getBackgroundPreset,
} from "@/content/background-presets";

/**
 * The tuning panel for a section's gradient background.
 *
 * Nodes are placed by dragging a dot across a live preview of the gradient
 * itself rather than by typing coordinates. The preview paints through exactly
 * the same custom properties the real section does - `buildBackgroundConfigStyle`
 * is the single source for both - so what is dragged here is what renders, and
 * the two cannot drift apart the way a hand-drawn approximation would.
 *
 * Editing a node writes a whole new config upward rather than mutating one in
 * place: the builder's section stack is React state, and a mutated nested
 * object would not re-render the canvas.
 */

const paletteEntries = Object.entries(backgroundNodeColors) as [
  keyof typeof backgroundNodeColors,
  string,
][];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SliderRow({
  label,
  max,
  min,
  onChange,
  value,
  valueLabel,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
  valueLabel: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="flex items-center justify-between gap-3">
        <span className="type-caption font-semibold text-current">{label}</span>
        <span className="type-caption tabular-nums text-current/70">
          {valueLabel}
        </span>
      </span>
      <input
        className="w-full"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={1}
        type="range"
        value={value}
      />
    </label>
  );
}

export function BackgroundNodeEditor({
  config,
  onChange,
}: {
  /** The section's saved config, or null when it has never been tuned. */
  config: BackgroundConfig | null;
  onChange: (config: BackgroundConfig) => void;
}) {
  // An untuned section edits from the stylesheet's own two washes, so opening
  // the panel starts from what is already on screen rather than from nothing.
  const value = config ?? defaultBackgroundConfig;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const activeNode = value.nodes[selectedIndex] ?? value.nodes[0];

  function updateNode(index: number, patch: Partial<BackgroundNode>) {
    onChange({
      ...value,
      nodes: value.nodes.map((node, nodeIndex) =>
        nodeIndex === index ? { ...node, ...patch } : node,
      ),
    });
  }

  /**
   * Drag handling lives on the preview rather than the dot so a pointer that
   * outruns the dot keeps dragging it. `setPointerCapture` is what makes that
   * survive leaving the element entirely.
   */
  function handlePointerMove(event: PointerEvent<Element>, index: number) {
    const bounds = previewRef.current?.getBoundingClientRect();

    if (!bounds || bounds.width === 0 || bounds.height === 0) {
      return;
    }

    updateNode(index, {
      x: Math.round(clamp(((event.clientX - bounds.left) / bounds.width) * 100, 0, 100)),
      y: Math.round(clamp(((event.clientY - bounds.top) / bounds.height) * 100, 0, 100)),
    });
  }

  function addNode() {
    if (value.nodes.length >= maxBackgroundNodes) {
      return;
    }

    onChange({
      ...value,
      nodes: [
        ...value.nodes,
        { color: "accent", x: 50, y: 50, size: 90, fade: 55, opacity: 100 },
      ],
    });
    setSelectedIndex(value.nodes.length);
  }

  function removeNode(index: number) {
    // The last node never goes: an empty list resolves to null, which silently
    // reverts the section to the stylesheet default instead of showing nothing.
    if (value.nodes.length <= 1) {
      return;
    }

    onChange({
      ...value,
      nodes: value.nodes.filter((_, nodeIndex) => nodeIndex !== index),
    });
    setSelectedIndex(0);
  }

  return (
    <div className="grid gap-3">
      {/* Presets are copied onto the section, not linked. A section that stayed
          tied to its preset would repaint every time the preset was retuned,
          including on pages already approved - the same reason promotion
          severs the tie everywhere else in this pipeline. */}
      <label className="grid gap-1">
        <span className="type-caption font-semibold text-current">
          Start from
        </span>
        <select
          className="token-chrome-select min-h-8 w-full rounded-[var(--chrome-radius-control)] border px-2 text-xs font-semibold outline-none"
          onChange={(event) => {
            const preset = getBackgroundPreset(event.target.value);

            if (preset) {
              // Deep-copied: the nodes array is handed to a section that will
              // mutate it through updateNode, and the preset is a module
              // constant shared by every section that ever picks it.
              onChange({
                ...preset.config,
                nodes: preset.config.nodes.map((node) => ({ ...node })),
              });
              setSelectedIndex(0);
            }
          }}
          value=""
        >
          <option value="">Preset…</option>
          {backgroundPresets.map((preset) => (
            <option key={preset.id} title={preset.hint} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>

      <div
        className="relative h-32 w-full overflow-hidden rounded-[var(--chrome-radius-control)] border border-current/25 bg-white"
        ref={previewRef}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={
            {
              ...buildBackgroundConfigStyle(value),
              backgroundImage: "var(--section-background-layers)",
              backgroundSize: "var(--section-background-size)",
              backgroundRepeat: "no-repeat",
              mixBlendMode: value.blend,
              opacity: value.strength / 100,
            } as CSSProperties
          }
        />

        {value.nodes.map((node, index) => (
          <button
            aria-label={`Background node ${index + 1}`}
            className={`absolute size-5 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 shadow-service active:cursor-grabbing ${
              index === selectedIndex
                ? "border-white ring-2 ring-black/70"
                : "border-white/80"
            }`}
            key={index}
            onPointerDown={(event) => {
              event.preventDefault();
              setSelectedIndex(index);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                handlePointerMove(event, index);
              }
            }}
            style={{
              backgroundColor:
                resolveBackgroundNodeColor(node.color) ?? "transparent",
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            type="button"
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {value.nodes.map((_, index) => (
          <button
            className={`min-h-8 rounded-[var(--chrome-radius-control)] border px-2 text-xs font-semibold ${
              index === selectedIndex
                ? "token-chrome-card-active"
                : "token-chrome-card"
            }`}
            key={index}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            {index + 1}
          </button>
        ))}
        <button
          className="token-chrome-card min-h-8 rounded-[var(--chrome-radius-control)] border px-2 text-xs font-semibold disabled:opacity-40"
          disabled={value.nodes.length >= maxBackgroundNodes}
          onClick={addNode}
          type="button"
        >
          + Node
        </button>
        <button
          className="token-chrome-card min-h-8 rounded-[var(--chrome-radius-control)] border px-2 text-xs font-semibold disabled:opacity-40"
          disabled={value.nodes.length <= 1}
          onClick={() => removeNode(selectedIndex)}
          type="button"
        >
          Remove
        </button>
      </div>

      {activeNode ? (
        <div className="grid gap-2 border-t border-current/15 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            {paletteEntries.map(([name, token]) => (
              <button
                aria-label={name}
                aria-pressed={activeNode.color === name}
                className={`size-6 rounded-full border-2 ${
                  activeNode.color === name
                    ? "border-current"
                    : "border-current/30"
                }`}
                key={name}
                onClick={() => updateNode(selectedIndex, { color: name })}
                style={{ backgroundColor: token }}
                type="button"
              />
            ))}
            <input
              aria-label="Custom node colour"
              className="size-6 cursor-pointer border-0 bg-transparent p-0"
              onChange={(event) =>
                updateNode(selectedIndex, { color: event.target.value })
              }
              type="color"
              value={
                activeNode.color.startsWith("#") ? activeNode.color : "#000000"
              }
            />
          </div>

          <SliderRow
            label="Size"
            max={200}
            min={10}
            onChange={(size) => updateNode(selectedIndex, { size })}
            value={activeNode.size}
            valueLabel={`${activeNode.size}%`}
          />
          <SliderRow
            label="Falloff"
            max={100}
            min={5}
            onChange={(fade) => updateNode(selectedIndex, { fade })}
            value={activeNode.fade}
            valueLabel={`${activeNode.fade}%`}
          />
          <SliderRow
            label="Intensity"
            max={100}
            min={0}
            onChange={(opacity) => updateNode(selectedIndex, { opacity })}
            value={activeNode.opacity}
            valueLabel={`${activeNode.opacity}%`}
          />
        </div>
      ) : null}

      <div className="grid gap-2 border-t border-current/15 pt-3">
        {/* Named for the whole layer, since it moves every node together -
            per-node tuning is the Intensity slider above. */}
        <SliderRow
          label="Overall strength"
          max={100}
          min={0}
          onChange={(strength) => onChange({ ...value, strength })}
          value={value.strength}
          valueLabel={`${value.strength}%`}
        />

        <label className="flex items-center justify-between gap-3">
          <span className="type-caption font-semibold text-current">Blend</span>
          <select
            className="token-chrome-select min-h-8 rounded-[var(--chrome-radius-control)] border px-2 text-xs font-semibold outline-none"
            onChange={(event) =>
              onChange({
                ...value,
                blend: event.target.value as BackgroundBlendMode,
              })
            }
            value={value.blend}
          >
            {backgroundBlendModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between gap-3">
          <span className="type-caption font-semibold text-current">
            Animate
          </span>
          <input
            checked={value.animate}
            onChange={(event) =>
              onChange({ ...value, animate: event.target.checked })
            }
            type="checkbox"
          />
        </label>

        {value.animate ? (
          <SliderRow
            label="Speed"
            max={300}
            min={10}
            onChange={(speed) => onChange({ ...value, speed })}
            value={value.speed}
            valueLabel={`${((20 * 100) / value.speed).toFixed(1)}s`}
          />
        ) : null}
      </div>
    </div>
  );
}
