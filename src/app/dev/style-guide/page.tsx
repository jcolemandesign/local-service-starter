import type { Metadata } from "next";
import {
  Button,
  Card,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { StyleGuideLiveSurface } from "@/components/sections/StyleGuideLiveSurface";
import { StyleGuideRadiusControls } from "@/components/sections/StyleGuideRadiusControls";
import { StyleGuideSectionMinControl } from "@/components/sections/StyleGuideSectionMinControl";
import { StyleGuideGridTokenControl } from "@/components/sections/StyleGuideGridTokenControl";
import { StyleGuideSemanticSpacingControl } from "@/components/sections/StyleGuideSemanticSpacingControl";
import {
  StyleGuideResetFontButton,
  StyleGuideTypeSample,
  StyleGuideTypeSpec,
  StyleGuideTypographyControls,
} from "@/components/sections/StyleGuideTypographyControls";
import {
  FAQSectionV3,
  ServicesThreeCardsRightSectionV3,
  TrustBarSectionV3,
} from "@/components/sections";
import { StyleGuideGapCard } from "@/components/sections/StyleGuideGapCard";
import { StyleGuideColorSwatch } from "@/components/sections/StyleGuideColorSwatch";
import { StyleGuideColorResetButton } from "@/components/sections/StyleGuideColorResetButton";
import { StyleGuidePromoteTokensButton } from "@/components/sections/StyleGuidePromoteTokensButton";
import { StyleGuideResetButton } from "@/components/sections/StyleGuideResetButton";
import { StyleGuideCloseAllButton } from "@/components/sections/StyleGuideCloseAllButton";
import { StyleGuideButtonControls } from "@/components/sections/StyleGuideButtonControls";
import { StyleGuideSurfaceControls } from "@/components/sections/StyleGuideSurfaceControls";
import { sectionLibraryV3Content } from "@/content/section-library-v3";

export const metadata: Metadata = {
  title: "Style Guide",
  description:
    "Internal live reference for current v3 seven-column design tokens.",
};

const typeTokens = [
  {
    name: "type-display-xl",
    role: "Largest display",
    typeClass: "type-display-xl",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "Emergency repairs without the runaround",
  },
  {
    name: "type-display-lg",
    role: "Display heading",
    typeClass: "type-display-lg",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "Fast HVAC service when the house will not wait",
  },
  {
    name: "type-heading-xl",
    role: "Large section title",
    typeClass: "type-heading-xl",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "Clear service from request to resolved",
  },
  {
    name: "type-heading-lg",
    role: "Editorial heading",
    typeClass: "type-heading-lg",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "Repairs explained before work begins",
  },
  {
    name: "type-heading-md",
    role: "Subsection heading",
    typeClass: "type-heading-md",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "What happens after you request service",
  },
  {
    name: "type-heading-sm",
    role: "Card heading",
    typeClass: "type-heading-sm",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "Same-day repair support",
  },
  {
    name: "type-text-xl",
    role: "Lead copy",
    typeClass: "type-text-xl",
    measureClass: undefined,
    wrapClass: "wrap-pretty",
    sample:
      "Lead copy gives important pages a little more voice while keeping the line length readable across screens.",
  },
  {
    name: "type-text-lg",
    role: "Intro copy",
    typeClass: "type-text-lg",
    measureClass: undefined,
    wrapClass: "wrap-pretty",
    sample:
      "Use this for short section introductions, service summaries, and supporting copy that needs more presence than body text.",
  },
  {
    name: "type-text-md",
    role: "Body copy",
    typeClass: "type-text-md",
    measureClass: undefined,
    wrapClass: "wrap-pretty",
    sample:
      "Request service online, describe the issue, and get a fast response from a local technician. Every submission is organized so fewer leads slip through the cracks.",
  },
  {
    name: "type-text-sm",
    role: "Small body",
    typeClass: "type-text-sm",
    measureClass: undefined,
    wrapClass: "wrap-pretty",
    sample:
      "Useful for supporting details, captions inside cards, and compact text that still needs enough room to breathe.",
  },
  {
    name: "type-text-xs",
    role: "Microcopy",
    typeClass: "type-text-xs",
    measureClass: undefined,
    wrapClass: "wrap-pretty",
    sample:
      "Most appointment windows are confirmed by phone or email before the technician arrives.",
  },
  {
    name: "type-caption",
    role: "Caption",
    typeClass: "type-caption",
    measureClass: undefined,
    wrapClass: "wrap-pretty",
    sample: "Preview image, service area, or review attribution text.",
  },
  {
    name: "type-label / type-eyebrow",
    role: "Label",
    typeClass: "type-label",
    measureClass: undefined,
    wrapClass: undefined,
    sample: "Emergency HVAC Repair",
  },
];

const colors = [
  {
    name: "service-ink",
    controlKey: "serviceInk",
    value: "#17211d",
    surface: "bg-service-ink",
    text: "text-white",
    muted: "text-white/68",
    border: "border-white/18",
    accent: "bg-surface-raised text-service-ink",
    usage: "Primary dark for headings, inverse sections, and strong structure",
  },
  {
    name: "service-muted",
    controlKey: "serviceMuted",
    value: "#5f6f68",
    surface: "bg-service-muted",
    text: "text-white",
    muted: "text-white/76",
    border: "border-white/22",
    accent: "bg-surface-raised text-service-muted",
    usage: "Secondary text color and subdued support surfaces",
  },
  {
    name: "service-accent",
    controlKey: "serviceAccent",
    value: "#1f7a5a",
    surface: "bg-service-accent",
    text: "text-white",
    muted: "text-white/78",
    border: "border-white/24",
    accent: "bg-surface-raised text-service-accent",
    usage: "Core service brand accent and primary action color",
  },
  {
    name: "service-surface",
    controlKey: "serviceSurface",
    value: "#f4f7f3",
    surface: "bg-service-surface",
    text: "text-service-ink",
    muted: "text-service-muted",
    border: "border-service-border",
    accent: "bg-service-accent text-white",
    usage: "Quiet section backgrounds and soft panels",
  },
  {
    name: "surface-raised",
    controlKey: "surfaceRaised",
    value: "#fafcf9",
    surface: "bg-surface-raised",
    text: "text-service-ink",
    muted: "text-service-muted",
    border: "border-service-border",
    accent: "bg-service-accent text-white",
    usage: "Focused forms, inputs, and nested reading surfaces",
  },
  {
    name: "service-border",
    controlKey: "serviceBorder",
    value: "#dfe7e1",
    surface: "bg-service-border",
    text: "text-service-ink",
    muted: "text-service-muted",
    border: "border-service-muted/25",
    accent: "bg-service-ink text-white",
    usage: "Dividers, card borders, placeholder fields",
  },
  {
    name: "bg-page",
    controlKey: "bgPage",
    value: "#fbfaf6",
    surface: "bg-bg-page",
    text: "text-text-main",
    muted: "text-text-muted",
    border: "border-border-default",
    accent: "bg-accent text-white",
    usage: "Default page background",
  },
  {
    name: "bg-dark",
    controlKey: "bgDark",
    value: "#10141b",
    surface: "bg-bg-dark",
    text: "text-text-inverse",
    muted: "text-white/68",
    border: "border-white/18",
    accent: "bg-surface-raised text-bg-dark",
    usage: "Neutral dark background for non-brand dark sections",
  },
  {
    name: "accent",
    controlKey: "accent",
    value: "#c45a2c",
    surface: "bg-accent",
    text: "text-white",
    muted: "text-white/78",
    border: "border-white/24",
    accent: "bg-surface-raised text-accent",
    usage: "Warm highlight accent for contrast moments",
  },
] as const;

const radii = [
  ["radius-none", "0"],
  ["radius-tiny", "2px"],
  ["radius-sm / radius-4", "4px"],
  ["radius-md / radius-medium", "8px"],
  ["radius-lg / radius-large", "24px"],
  ["radius-xl / radius-extra-large", "40px"],
  ["radius-round", "9999px"],
] as const;

const spacing = [
  ["section-space-vsml", "2rem desktop / 2rem mobile"],
  ["section-space-sml", "4rem desktop / 4rem mobile"],
  ["section-space-med", "6rem desktop / 4rem mobile"],
  ["section-space-lrg", "8rem desktop / 4rem mobile"],
] as const;

const sectionSpacing = spacing.filter(([name]) => name.startsWith("section"));

const sectionPaddingOptions = [
  {
    label: "Compact padding",
    lrg: "5rem",
    lrgMobile: "3rem",
    lrgTablet: "4.5rem",
    med: "4rem",
    medMobile: "3rem",
    medTablet: "3.75rem",
    name: "section-padding-compact",
    sml: "3rem",
    smlMobile: "2.75rem",
    smlTablet: "3rem",
    vsml: "1.5rem",
    vsmlMobile: "1.5rem",
    vsmlTablet: "1.5rem",
  },
  {
    label: "Default padding",
    lrg: "8rem",
    lrgMobile: "4rem",
    lrgTablet: "6rem",
    med: "6rem",
    medMobile: "4rem",
    medTablet: "5rem",
    name: "section-padding-default",
    sml: "4rem",
    smlMobile: "4rem",
    smlTablet: "3.5rem",
    vsml: "2rem",
    vsmlMobile: "2rem",
    vsmlTablet: "2rem",
  },
  {
    label: "Open padding",
    lrg: "10rem",
    lrgMobile: "5rem",
    lrgTablet: "7rem",
    med: "7.5rem",
    medMobile: "4.75rem",
    medTablet: "6rem",
    name: "section-padding-open",
    sml: "5rem",
    smlMobile: "4.5rem",
    smlTablet: "4.5rem",
    vsml: "2.5rem",
    vsmlMobile: "2rem",
    vsmlTablet: "2.25rem",
  },
  {
    label: "Max padding",
    lrg: "14rem",
    lrgMobile: "6rem",
    lrgTablet: "9rem",
    med: "10rem",
    medMobile: "5.5rem",
    medTablet: "7.5rem",
    name: "section-padding-max",
    sml: "6.5rem",
    smlMobile: "5.5rem",
    smlTablet: "5.5rem",
    vsml: "3.25rem",
    vsmlMobile: "2.75rem",
    vsmlTablet: "2.75rem",
  },
] as const;

const siteGridFrameOptions = [
  {
    block: "clamp(1.5rem, 3vw, 5rem)",
    inline: "clamp(0.375rem, 2vw, 4rem)",
    label: "Compact spacing",
    name: "body-spacing-compact",
    previewBlock: "0.75rem",
    previewInline: "0.75rem",
  },
  {
    block: "clamp(2rem, 4vw, 7rem)",
    inline: "clamp(0.5rem, 3vw, 6rem)",
    label: "Default spacing",
    name: "body-spacing-default",
    previewBlock: "1.25rem",
    previewInline: "1.5rem",
  },
  {
    block: "clamp(2.5rem, 5vw, 8rem)",
    inline: "clamp(0.75rem, 4vw, 8rem)",
    label: "Open spacing",
    name: "body-spacing-open",
    previewBlock: "2rem",
    previewInline: "2.5rem",
  },
  {
    block: "clamp(3rem, 6vw, 10rem)",
    inline: "clamp(1rem, 5vw, 10rem)",
    label: "Wide spacing",
    name: "body-spacing-wide",
    previewBlock: "3rem",
    previewInline: "4rem",
  },
] as const;

const contentFrameOptions = [
  {
    label: "Compact spacing",
    name: "content-spacing-compact",
    previewValue: "0.625rem",
    value: "clamp(1rem, 2vw, 1.25rem)",
  },
  {
    label: "Default spacing",
    name: "content-spacing-default",
    previewValue: "1.25rem",
    value: "clamp(1.5rem, 3vw, 2.5rem)",
  },
  {
    label: "Open spacing",
    name: "content-spacing-open",
    previewValue: "2.5rem",
    value: "clamp(2rem, 4vw, 3.5rem)",
  },
  {
    label: "Wide spacing",
    name: "content-spacing-wide",
    previewValue: "3rem",
    value: "clamp(2.25rem, 5vw, 4rem)",
  },
] as const;

const siteGridGapOptions = [
  {
    label: "Tight gutter",
    name: "site-grid-gap-tight",
    previewValue: "0.1875rem",
    value: "clamp(0.375rem, 0.55vw, 0.75rem)",
  },
  {
    label: "Default gutter",
    name: "site-grid-gap-default",
    previewValue: "0.875rem",
    value: "clamp(0.75rem, 1vw, 1.5rem)",
  },
  {
    label: "Open gutter",
    name: "site-grid-gap-open",
    previewValue: "1.75rem",
    value: "clamp(1rem, 1.35vw, 2rem)",
  },
  {
    label: "Max gutter",
    name: "site-grid-gap-max",
    previewValue: "4rem",
    value: "clamp(1.5rem, 2.15vw, 3.5rem)",
  },
] as const;

const columnNicknameExamples = [
  {
    name: "thumb",
    span: "1 col",
    spanClass: "col-span-1",
    rowClass: "row-start-1",
    allowOverflow: true,
    examples: "thumbnails, icons, side links, small vertical cards",
  },
  {
    name: "rail",
    span: "2 cols",
    spanClass: "col-span-2",
    rowClass: "row-start-2",
    allowOverflow: true,
    examples: "editorial rail, pull quote, important idea, link list",
  },
  {
    name: "condensed",
    span: "3 cols",
    spanClass: "col-span-3",
    rowClass: "row-start-3",
    allowOverflow: true,
    examples: "article preview, condensed content, vertical image panel",
  },
  {
    name: "content",
    span: "4 cols",
    spanClass: "col-span-4",
    rowClass: "row-start-4",
    allowOverflow: false,
    examples: "default content size, image/text card, main copy group",
  },
  {
    name: "large",
    span: "5 cols",
    spanClass: "col-span-5",
    rowClass: "row-start-5",
    allowOverflow: false,
    examples: "story/photo layouts, content with a sidebar",
  },
  {
    name: "panel",
    span: "6 cols",
    spanClass: "col-span-6",
    rowClass: "row-start-6",
    allowOverflow: false,
    examples: "large graphics, storytelling panels, immersive previews",
  },
  {
    name: "full",
    span: "7 cols",
    spanClass: "col-span-7",
    rowClass: "row-start-7",
    allowOverflow: false,
    examples: "full-width media, complete section bands",
  },
] as const;

const sectionMinTokens = [
  {
    colorClass: "border-service-muted/45 bg-service-muted/10",
    name: "section-min-none",
    ratio: 0,
    value: "0",
  },
  {
    colorClass: "border-service-muted/45 bg-service-muted/10",
    name: "section-min-tiny",
    ratio: 18 / 140,
    value: "18rem",
  },
  {
    colorClass: "border-service-accent/45 bg-service-accent/14",
    name: "section-min-short",
    ratio: 36 / 140,
    value: "36rem",
  },
  {
    colorClass: "border-service-ink/35 bg-service-ink/10",
    name: "section-min-medium",
    ratio: 54 / 140,
    value: "54rem",
  },
  {
    colorClass: "border-accent/45 bg-accent/16",
    name: "section-min-tall",
    ratio: 72 / 140,
    value: "72rem",
  },
  {
    colorClass: "border-service-accent/70 bg-service-accent/22",
    name: "section-min-screen",
    ratio: 100 / 140,
    value: "100svh",
  },
  {
    colorClass: "border-service-ink/60 bg-service-ink/18",
    name: "section-min-story",
    ratio: 1,
    value: "140svh",
  },
];

const relationshipSpacing = [
  {
    title: "Compact Card Header",
    description: "label -> heading-sm -> text-sm -> text link",
    tokens: [
      ["mt-eyebrow-heading-sm", "0.5rem"],
      ["mt-heading-body-sm", "0.75rem"],
      ["mt-body-actions-sm", "1.25rem"],
    ],
    kind: "compact",
  },
  {
    title: "Default Section Header",
    description: "label -> heading-xl -> text-lg -> button row",
    tokens: [
      ["mt-eyebrow-heading-lg", "1.25rem"],
      ["mt-heading-body-lg", "1.5rem"],
      ["mt-body-actions-md", "2rem"],
    ],
    kind: "default",
  },
  {
    title: "Hero / Display Header",
    description: "label -> display-lg -> text-xl -> primary actions",
    tokens: [
      ["mt-eyebrow-display", "1.5rem"],
      ["mt-display-body", "1.75rem"],
      ["mt-body-actions-lg", "2.5rem"],
    ],
    kind: "hero",
  },
  {
    title: "Editorial Flow",
    description: "paragraph -> paragraph -> subheading -> paragraph",
    tokens: [
      ["mt-paragraph-paragraph", "1rem"],
      ["mt-paragraph-heading-md", "2.25rem"],
      ["mt-heading-body-md", "1rem"],
    ],
    kind: "editorial",
  },
];

const gapTokens = [
  {
    group: "Inline gaps",
    description: "Secondary helper for small clusters inside a grid item.",
    items: [
      ["inline-gap-sml", "0.5rem"],
      ["inline-gap-med", "1rem"],
      ["inline-gap-lrg", "1.75rem"],
      ["inline-gap-xlrg", "2.25rem"],
    ],
    kind: "inline",
  },
  {
    group: "Card/list gaps",
    description: "Secondary helper for repeated cards inside a grid item.",
    items: [
      ["card-grid-gap-sml", "0.5rem"],
      ["card-grid-gap-med", "1rem"],
      ["card-grid-gap-lrg", "1.75rem"],
      ["card-grid-gap-xlrg", "2.25rem"],
    ],
    kind: "card",
  },
  {
    group: "Nested layout gaps",
    description: "Secondary helper for sub-layouts after the seven-column frame.",
    items: [
      ["layout-gap-sml", "0.5rem"],
      ["layout-gap-med", "1rem"],
      ["layout-gap-lrg", "1.75rem"],
      ["layout-gap-xlrg", "2.25rem"],
    ],
    kind: "layout",
  },
] as const;

const colorRoleCombinations = [
  {
    name: "Default page",
    surfaceClass: "bg-bg-page",
    textClass: "text-text-main",
    mutedClass: "text-text-muted",
    borderClass: "border-border-default",
    actionClass: "bg-service-accent text-white",
  },
  {
    name: "Soft service",
    surfaceClass: "bg-service-surface",
    textClass: "text-service-ink",
    mutedClass: "text-service-muted",
    borderClass: "border-service-border",
    actionClass: "bg-service-ink text-white",
  },
  {
    name: "Brand accent",
    surfaceClass: "bg-service-accent",
    textClass: "text-white",
    mutedClass: "text-white/78",
    borderClass: "border-white/24",
    actionClass: "bg-surface-raised text-service-accent",
  },
  {
    name: "Inverse ink",
    surfaceClass: "bg-service-ink",
    textClass: "text-white",
    mutedClass: "text-white/70",
    borderClass: "border-white/18",
    actionClass: "bg-surface-raised text-service-ink",
  },
  {
    name: "Neutral dark",
    surfaceClass: "bg-bg-dark",
    textClass: "text-text-inverse",
    mutedClass: "text-white/68",
    borderClass: "border-white/18",
    actionClass: "bg-surface-raised text-service-ink",
  },
  {
    name: "Warm action",
    surfaceClass: "bg-accent",
    textClass: "text-white",
    mutedClass: "text-white/78",
    borderClass: "border-white/24",
    actionClass: "bg-surface-raised text-accent",
  },
];

const surfaceTypeSpecimens = [
  {
    name: "Page default",
    semantic: "bg-bg-page / text-text-main / text-text-muted",
    headingClassName: "type-display-lg",
    bodyClassName: "type-text-xl",
    surfaceClass: "bg-bg-page",
    frameClass: "border-border-default",
    eyebrowClass: "text-service-accent",
    headingClass: "text-text-main",
    bodyClass: "text-text-muted",
    insetClass: "border-border-default bg-bg-surface",
    insetHeadingClass: "text-text-main",
    insetBodyClass: "text-text-muted",
    actionClass: "bg-service-accent text-white",
  },
  {
    name: "Soft service section",
    semantic: "bg-service-surface / text-service-ink / text-service-muted",
    headingClassName: "type-heading-xl",
    bodyClassName: "type-text-lg",
    surfaceClass: "bg-service-surface",
    frameClass: "border-service-border",
    eyebrowClass: "text-service-accent",
    headingClass: "text-service-ink",
    bodyClass: "text-service-muted",
    insetClass: "border-service-border bg-surface-raised",
    insetHeadingClass: "text-service-ink",
    insetBodyClass: "text-service-muted",
    actionClass: "bg-service-ink text-white",
  },
  {
    name: "Raised card on quiet surface",
    semantic: "bg-surface-raised / text-service-ink / text-service-muted",
    headingClassName: "type-heading-lg",
    bodyClassName: "type-text-md",
    surfaceClass: "bg-surface-raised",
    frameClass: "border-service-border",
    eyebrowClass: "text-service-accent",
    headingClass: "text-service-ink",
    bodyClass: "text-service-muted",
    insetClass: "border-service-border bg-service-surface",
    insetHeadingClass: "text-service-ink",
    insetBodyClass: "text-service-muted",
    actionClass: "bg-service-accent text-white",
  },
  {
    name: "Ink inverse",
    semantic: "bg-service-ink / text-white / text-white/72",
    headingClassName: "type-display-lg",
    bodyClassName: "type-text-lg",
    surfaceClass: "bg-service-ink",
    frameClass: "border-white/18",
    eyebrowClass: "text-white/68",
    headingClass: "text-white",
    bodyClass: "text-white/72",
    insetClass: "border-white/14 bg-surface-raised/8",
    insetHeadingClass: "text-white",
    insetBodyClass: "text-white/68",
    actionClass: "bg-surface-raised text-service-ink",
  },
  {
    name: "Accent inverse",
    semantic: "bg-service-accent / text-white / text-white/80",
    headingClassName: "type-heading-xl",
    bodyClassName: "type-text-xl",
    surfaceClass: "bg-service-accent",
    frameClass: "border-white/24",
    eyebrowClass: "text-white/78",
    headingClass: "text-white",
    bodyClass: "text-white/80",
    insetClass: "border-white/20 bg-surface-raised/10",
    insetHeadingClass: "text-white",
    insetBodyClass: "text-white/72",
    actionClass: "bg-surface-raised text-service-accent",
  },
  {
    name: "Neutral dark",
    semantic: "bg-bg-dark / text-text-inverse / text-white/70",
    headingClassName: "type-heading-lg",
    bodyClassName: "type-text-md",
    surfaceClass: "bg-bg-dark",
    frameClass: "border-white/18",
    eyebrowClass: "text-white/68",
    headingClass: "text-text-inverse",
    bodyClass: "text-white/70",
    insetClass: "border-white/14 bg-surface-raised/8",
    insetHeadingClass: "text-white",
    insetBodyClass: "text-white/66",
    actionClass: "bg-surface-raised text-service-ink",
  },
  {
    name: "Warm offer",
    semantic: "bg-accent / text-white / text-white/78",
    headingClassName: "type-heading-md",
    bodyClassName: "type-text-sm",
    surfaceClass: "bg-accent",
    frameClass: "border-white/24",
    eyebrowClass: "text-white/76",
    headingClass: "text-white",
    bodyClass: "text-white/78",
    insetClass: "border-white/18 bg-surface-raised/10",
    insetHeadingClass: "text-white",
    insetBodyClass: "text-white/70",
    actionClass: "bg-surface-raised text-accent",
  },
  {
    name: "Muted proof panel",
    semantic: "bg-service-border / text-service-ink / text-service-muted",
    headingClassName: "type-heading-sm",
    bodyClassName: "type-caption",
    surfaceClass: "bg-service-border",
    frameClass: "border-service-muted/25",
    eyebrowClass: "text-service-accent",
    headingClass: "text-service-ink",
    bodyClass: "text-service-muted",
    insetClass: "border-service-muted/20 bg-surface-raised",
    insetHeadingClass: "text-service-ink",
    insetBodyClass: "text-service-muted",
    actionClass: "bg-service-ink text-white",
  },
];

const styleGuideToc = [
  { href: "#spacing", label: "Spacing" },
  { href: "#typography", label: "Type" },
  { href: "#color-system", label: "Color" },
  { href: "#shape", label: "Shape" },
  { href: "#buttons", label: "Buttons" },
  { href: "#styles-in-context", label: "Context" },
];

const styleGuidePreviewPages = [
  {
    href: "/dev/style-guide/previews/hvac-service",
    label: "HVAC flow",
  },
];

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function LayoutSystemControlLab() {
  const tokenLabels = [
    "site-grid-frame",
    "section-space-med",
    "site-grid-gap",
    "content-frame",
    "inline-gap-med",
  ];

  return (
    <div className="radius-medium overflow-hidden border border-service-border bg-bg-page">
      <div className="content-frame border-b border-service-border bg-service-surface">
        <div className="fluid-type-frame">
          <p className="type-label text-service-accent">Live control lab</p>
          <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
            Stress test the active layout tokens
          </h3>
          <p className="type-text-sm mt-heading-body-sm text-service-muted">
            This preview uses the same section frame, grid gutter, content
            inset, card gap, and radius tokens a production section would use.
          </p>
        </div>
      </div>

      <section
        className="section-min-active section-space-med bg-bg-page"
        style={{ minHeight: "min(var(--section-min-active), 44rem)" }}
      >
        <SevenColumnGrid minHeight="none" padding="none">
          <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <article className="content-frame fluid-type-frame radius-medium grid h-full content-between border border-service-border bg-service-surface shadow-service">
              <div>
                <p className="type-label text-service-accent">Columns 1-3</p>
                <h4 className="type-heading-lg mt-eyebrow-heading-sm text-service-ink">
                  Primary copy block
                </h4>
                <p className="type-text-sm mt-heading-body-sm text-service-muted">
                  Increase section padding for taller bands, adjust body spacing
                  for the outer frame, then tune content spacing to see this
                  card breathe without changing its markup.
                </p>
              </div>
              <div className="layout-gap-med mt-8 grid grid-cols-2 max-md:grid-cols-1">
                <div className="radius-small border border-service-border bg-surface-raised p-4">
                  <p className="type-label text-service-muted">Frame</p>
                  <p className="type-text-sm mt-2 text-service-ink">
                    Body spacing controls the page inset around this whole lab.
                  </p>
                </div>
                <div className="radius-small border border-service-border bg-surface-raised p-4">
                  <p className="type-label text-service-muted">Inset</p>
                  <p className="type-text-sm mt-2 text-service-ink">
                    Content spacing controls the padding inside each panel.
                  </p>
                </div>
              </div>
            </article>
          </SevenColumnGridItem>

          <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <div
              className="site-grid-gap grid h-full content-start"
              style={{ rowGap: "var(--site-grid-gap)" }}
            >
              <article className="content-frame radius-medium border border-service-border bg-surface-raised">
                <div className="fluid-type-frame">
                  <p className="type-label text-service-accent">Columns 4-7</p>
                  <h4 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                    Gutter rhythm check
                  </h4>
                  <p className="type-text-sm mt-heading-body-sm text-service-muted">
                    The distance between the left card and this stack follows
                    site-grid-gap. The vertical stack and the two-card split use
                    that same gutter so one control tests both directions.
                  </p>
                </div>
              </article>

              <div
                className="site-grid-gap grid grid-cols-2 max-md:grid-cols-1"
                style={{ rowGap: "var(--site-grid-gap)" }}
              >
                {["Compact card", "Wide card"].map((label) => (
                  <article
                    className="content-frame radius-medium min-h-40 border border-service-border bg-service-surface"
                    key={label}
                  >
                    <p className="type-label text-service-accent">{label}</p>
                    <p className="type-heading-sm mt-label-heading-sm text-service-ink">
                      Same shell, different column pressure
                    </p>
                    <p className="type-text-sm mt-heading-body-sm text-service-muted">
                      Watch text, padding, and corners stay tied to shared
                      tokens as the layout gets tighter.
                    </p>
                  </article>
                ))}
              </div>

              <article className="content-frame radius-medium grid min-h-36 grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border border-service-border bg-service-ink text-white max-md:grid-cols-1">
                <div className="fluid-type-frame">
                  <p className="type-label text-white/68">Wide action block</p>
                  <h4 className="type-heading-sm mt-eyebrow-heading-sm">
                    One strong next step can span the remaining track
                  </h4>
                  <p className="type-text-sm mt-heading-body-sm text-white/72">
                    This wider block tests a different content pressure without
                    introducing a second spacing system.
                  </p>
                </div>
                <span className="radius-button border border-white/18 bg-surface-raised/10 px-4 py-2 text-sm font-semibold">
                  Request service
                </span>
              </article>

              <div className="inline-gap-med flex flex-wrap">
                {tokenLabels.map((label) => (
                  <code
                    className="radius-small border border-service-border bg-service-surface px-3 py-2 text-xs font-semibold text-service-muted"
                    key={label}
                  >
                    {label}
                  </code>
                ))}
              </div>
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>

        <SevenColumnGrid
          minHeight="none"
          padding="none"
          style={{ marginTop: "var(--site-grid-gap)" }}
        >
          <SevenColumnGridItem className="col-span-5 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <article className="content-frame radius-medium fluid-type-frame min-h-48 border border-service-border bg-surface-raised">
              <p className="type-label text-service-accent">Wide system block</p>
              <h4 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Larger blocks stay in the same gutter rhythm
              </h4>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">
                The primary grid handles alignment between differently sized
                blocks. Use a nested gap only when a compact group lives inside
                one of those blocks.
              </p>
            </article>
          </SevenColumnGridItem>
          <SevenColumnGridItem className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <article className="content-frame radius-medium grid min-h-48 content-between border border-service-border bg-service-surface">
              <p className="type-label text-service-accent">Proof rail</p>
              <div>
                <p className="type-heading-sm text-service-ink">2-column support</p>
                <p className="type-text-sm mt-heading-body-sm text-service-muted">
                  A compact block belongs to the same outer system.
                </p>
              </div>
            </article>
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </section>
    </div>
  );
}

function FrameVisualAid({
  block,
  inline,
  label,
  previewBlock,
  previewInline,
}: {
  block: string;
  inline: string;
  label: string;
  previewBlock: string;
  previewInline: string;
}) {
  return (
    <div className="radius-medium border border-service-border bg-surface-raised p-4">
      <p className="type-caption font-semibold text-service-ink">{label}</p>
      <p className="type-caption mt-1 text-service-muted">
        inline {inline} / block {block}
      </p>
      <div
        className="radius-medium mt-4 border border-service-border bg-service-surface"
        style={{ padding: `${previewBlock} ${previewInline}` }}
      >
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              className="radius-4 h-10 bg-surface-raised shadow-service"
              key={`${label}-frame-aid-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentFrameVisualAid({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="radius-medium border border-service-border bg-surface-raised p-4">
      <p className="type-caption font-semibold text-service-ink">{label}</p>
      <p className="type-caption mt-1 text-service-muted">
        container gutter {value}
      </p>
      <div
        className="radius-medium mt-4 min-h-60 border border-service-border bg-service-surface"
        style={{ padding: value }}
      >
        <div className="radius-4 grid h-full min-h-20 content-between gap-3 border border-service-border bg-surface-raised p-3 shadow-service">
          <div className="grid grid-cols-3 gap-2">
            <span className="radius-4 h-8 bg-service-surface" />
            <span className="radius-4 h-8 bg-service-surface" />
            <span className="radius-4 h-8 bg-service-surface" />
          </div>
          <div className="grid gap-2">
            <span className="radius-4 h-2 bg-service-border" />
            <span className="radius-4 h-2 w-2/3 bg-service-border" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GapVisualAid({
  label,
  previewValue,
  value,
}: {
  label: string;
  previewValue: string;
  value: string;
}) {
  return (
    <div className="radius-medium border border-service-border bg-surface-raised p-4">
      <p className="type-caption font-semibold text-service-ink">{label}</p>
      <p className="type-caption mt-1 text-service-muted">{value}</p>
      <div className="radius-medium mt-4 border border-service-border bg-service-surface p-4">
        <div className="grid grid-cols-5" style={{ gap: previewValue }}>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              className="radius-4 h-16 bg-surface-raised shadow-service"
              key={`${label}-gap-aid-${index}`}
            />
          ))}
        </div>
        <div className="mt-4 h-1 rounded-full bg-service-border">
          <div
            className="h-full rounded-full bg-service-accent"
            style={{ width: previewValue }}
          />
        </div>
      </div>
    </div>
  );
}

function RadiusVisualAid({ name, value }: { name: string; value: string }) {
  const radiusStyle = { borderRadius: value };

  return (
    <div className="radius-medium border border-service-border bg-surface-raised p-4">
      <div
        className="border border-service-border bg-service-surface p-3 shadow-service"
        style={radiusStyle}
      >
        <div
          className="relative aspect-[5/3] overflow-hidden border border-service-accent/25 bg-surface-raised"
          style={radiusStyle}
        >
          <div className="absolute inset-4 border border-dashed border-service-accent/35" />
          <div
            className="absolute bottom-4 right-4 size-16 border border-service-border bg-service-surface"
            style={radiusStyle}
          />
        </div>
      </div>
      <p className="type-caption mt-4 font-semibold text-service-ink">{name}</p>
      <p className="type-caption mt-1 text-service-muted">{value}</p>
    </div>
  );
}

function NestedGapVisualAid({
  kind,
  name,
  value,
}: {
  kind: "card" | "inline" | "layout";
  name: string;
  value: string;
}) {
  return (
    <div className="radius-medium border border-service-border bg-surface-raised p-4">
      <p className="type-caption font-semibold text-service-ink">{name}</p>
      <p className="type-caption mt-1 text-service-muted">{value}</p>

      {kind === "inline" ? (
        <div className="mt-4 flex flex-wrap" style={{ gap: value }}>
          <span className="radius-4 bg-service-accent px-3 py-2 text-sm font-semibold text-white">
            Primary
          </span>
          <span className="radius-4 border border-service-border px-3 py-2 text-sm font-semibold text-service-ink">
            Secondary
          </span>
          <span className="radius-4 border border-service-border px-3 py-2 text-sm font-semibold text-service-muted">
            Tertiary
          </span>
        </div>
      ) : null}

      {kind === "card" ? (
        <div className="mt-4 grid grid-cols-3" style={{ gap: value }}>
          <div className="radius-4 h-16 bg-service-surface" />
          <div className="radius-4 h-16 bg-service-border" />
          <div className="radius-4 h-16 bg-service-accent/20" />
        </div>
      ) : null}

      {kind === "layout" ? (
        <div
          className="mt-4 grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
          style={{ gap: value }}
        >
          <div className="radius-4 min-h-20 bg-service-surface p-4">
            <p className="type-caption text-service-muted">Content column</p>
          </div>
          <div className="radius-4 min-h-20 bg-service-border p-4">
            <p className="type-caption text-service-muted">Media column</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GuideSection({
  id,
  eyebrow,
  title,
  titleAs = "h2",
  body,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  titleAs?: "h1" | "h2" | "h3";
  body?: string;
  children: React.ReactNode;
}) {
  const Title = titleAs;
  const defaultOpen = titleAs === "h1";

  return (
    <section className="scroll-mt-12 border-t border-service-border" id={id}>
      <details
        className="group [&[open]_.guide-section-icon]:rotate-45"
        data-style-guide-accordion
        open={defaultOpen}
      >
        <summary className="list-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-service-accent [&::-webkit-details-marker]:hidden">
          <SevenColumnGrid minHeight="none" padding="med">
            <SevenColumnGridItem className="col-span-7">
              <div className="fluid-type-frame flex items-start justify-between gap-8">
                <div className="max-w-5xl">
                  <p className="type-label text-service-accent">{eyebrow}</p>
                  <Title
                    className={cx(
                      "mt-4 text-service-ink",
                      titleAs === "h3" ? "type-heading-lg" : "type-heading-xl",
                    )}
                  >
                    {title}
                  </Title>
                  {body ? (
                    <p className="type-text-lg wrap-pretty mt-5 text-service-muted">
                      {body}
                    </p>
                  ) : null}
                </div>
                <span
                  aria-hidden="true"
                  className="guide-section-icon mt-2 grid size-11 shrink-0 place-items-center rounded-full border border-service-border bg-surface-raised text-2xl leading-none text-service-ink transition-transform duration-200 max-sm:size-9 max-sm:text-xl"
                >
                  +
                </span>
              </div>
            </SevenColumnGridItem>
          </SevenColumnGrid>
        </summary>
        <SevenColumnGrid
          className="px-[var(--site-grid-inset-inline)] pb-[var(--site-grid-inset-block)]"
          frame="none"
          minHeight="none"
          padding="none"
        >
          <SevenColumnGridItem className="col-span-7">
            {children}
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </details>
    </section>
  );
}

function TokenMeta({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <code className="rounded bg-service-surface px-2 py-1 text-xs font-semibold text-service-ink">
        {name}
      </code>
      <span className="type-caption text-service-muted">{value}</span>
    </div>
  );
}

function StyleGuideListControlSamples() {
  const checklistItems = [
    "Use semantic type utilities for every list item and option label.",
    "Keep list rhythm tied to shared gap tokens instead of local spacing.",
    "Use the same control card treatment for checkbox and radio groups.",
  ];

  return (
    <SevenColumnGrid minHeight="none" padding="none">
      <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
        <div className="radius-medium grid h-full gap-6 border border-service-border bg-surface-raised p-6">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Text lists</p>
            <h3 className="type-heading-sm mt-label-heading-sm text-service-ink">
              Standard content list
            </h3>
            <p className="type-text-sm mt-heading-body-sm text-service-muted">
              Use these classes for organic bullets in service copy, FAQs, and
              content blocks.
            </p>
          </div>

          <ul className="grid card-grid-gap-sml">
            {checklistItems.map((item) => (
              <li
                className="type-text-sm flex gap-3 text-service-ink"
                key={item}
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-service-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </SevenColumnGridItem>

      <SevenColumnGridItem className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
        <div className="radius-medium grid h-full gap-6 border border-service-border bg-surface-raised p-6">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Ordered lists</p>
            <h3 className="type-heading-sm mt-label-heading-sm text-service-ink">
              Process rhythm
            </h3>
          </div>

          <ol className="grid card-grid-gap-sml">
            {["Confirm scope", "Collect assets", "Write first pass"].map(
              (item, index) => (
                <li className="flex gap-3" key={item}>
                  <span className="type-caption radius-4 flex size-8 shrink-0 items-center justify-center bg-service-surface font-semibold text-service-accent">
                    {index + 1}
                  </span>
                  <span className="type-text-sm pt-1 font-semibold text-service-ink">
                    {item}
                  </span>
                </li>
              ),
            )}
          </ol>
        </div>
      </SevenColumnGridItem>

      <SevenColumnGridItem className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
        <div className="radius-medium grid h-full gap-6 border border-service-border bg-surface-raised p-6">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">Input lists</p>
            <h3 className="type-heading-sm mt-label-heading-sm text-service-ink">
              Checkbox cards
            </h3>
          </div>

          <div className="grid gap-2">
            {["Call now", "Request a quote", "Book online"].map(
              (item, index) => (
                <label
                  className={cx(
                    "type-text-sm radius-button flex min-h-12 cursor-pointer items-center gap-3 border px-3 py-2 font-semibold transition-colors",
                    index === 0
                      ? "border-service-accent bg-service-accent text-white"
                      : "border-service-border bg-surface-raised text-service-ink hover:border-service-accent hover:text-service-accent",
                  )}
                  key={item}
                >
                  <input
                    checked={index === 0}
                    className="size-4 accent-service-accent"
                    readOnly
                    type="checkbox"
                  />
                  <span>{item}</span>
                </label>
              ),
            )}
          </div>
        </div>
      </SevenColumnGridItem>
    </SevenColumnGrid>
  );
}

export default function StyleGuidePage() {
  return (
    <StyleGuideLiveSurface>
      <main className="bg-bg-page text-service-ink">
      <StyleGuideCloseAllButton />
      <nav
        aria-label="Style guide table of contents"
        className="inline-gap-lrg sticky top-0 z-40 flex w-full items-center overflow-x-auto border-b border-service-border bg-bg-page/92 px-[var(--site-grid-inset-inline)] py-2 text-service-muted backdrop-blur"
      >
        <div className="inline-gap-lrg flex shrink-0 items-center">
          {styleGuideToc.map((item) => (
            <a
              className="type-text-xs max-w-none shrink-0 font-semibold transition-colors hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 border-l border-service-border pl-5">
          <StyleGuideResetButton />
          <StyleGuidePromoteTokensButton />
          <span className="type-caption font-semibold uppercase text-service-muted">
            Preview pages
          </span>
          {styleGuidePreviewPages.map((item) => (
            <a
              className="type-text-xs max-w-none shrink-0 font-semibold text-service-ink underline decoration-service-accent decoration-1 underline-offset-4 transition-colors hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={item.href}
              key={item.href}
              rel="noreferrer"
              target="_blank"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <GuideSection
        eyebrow="Type + Grid"
        id="typography"
        title="Typography"
        titleAs="h1"
        body="Live hierarchy specimens and content patterns. Select any specimen to tune its role in the controls beside it."
      >
        <SevenColumnGrid minHeight="none" padding="none">
          <SevenColumnGridItem className="sticky top-16 col-span-2 self-start max-lg:col-span-5 max-md:col-span-3 max-sm:static max-sm:col-span-1">
            <StyleGuideTypographyControls />
          </SevenColumnGridItem>

          <SevenColumnGridItem className="col-span-5 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <div className="grid gap-3">
              {typeTokens.map((token) => (
                <div
                  className="fluid-type-frame grid grid-cols-7 gap-4 border-t border-service-border py-6 max-lg:grid-cols-5 max-md:grid-cols-3 max-sm:grid-cols-1"
                  key={`grid-row-${token.name}`}
                >
                  <div className="col-span-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
                    <code className="radius-4 inline-flex bg-service-surface px-2 py-1 text-xs font-semibold text-service-ink">
                      {token.name}
                    </code>
                    <p className="type-caption mt-2 text-service-muted">
                      {token.role}
                    </p>
                    <p className="type-caption mt-2 font-semibold text-service-muted">
                      <StyleGuideTypeSpec tokenName={token.name} />
                    </p>
                    <StyleGuideResetFontButton tokenName={token.name} />
                  </div>
                  <StyleGuideTypeSample
                    className={cx(
                      token.typeClass,
                      token.measureClass,
                      token.wrapClass,
                      "col-span-6 text-service-ink max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
                    )}
                    tokenName={token.name}
                  >
                    {token.sample}
                  </StyleGuideTypeSample>
                </div>
              ))}
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>
        <section className="mt-12 border-t border-service-border pt-10">
          <div className="fluid-type-frame max-w-3xl">
            <p className="type-label text-service-accent">Typography subsection</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-sm text-service-ink">
              Lists and controls
            </h2>
            <p className="type-text-md mt-heading-body-md text-service-muted">
              Lists, steps, and inputs inherit the active type roles. Use this
              lab to check hierarchy in denser, task-oriented content.
            </p>
          </div>
          <div className="mt-7">
            <StyleGuideListControlSamples />
          </div>
        </section>
      </GuideSection>

      <GuideSection
        eyebrow="Spacing"
        id="spacing"
        title="Spacing System"
        body="Use this one lab to tune the page frame, section rhythm, panel inset, grid gutter, local gaps, and optional minimum section presence."
      >
        <div className="grid gap-7">
          <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
            <StyleGuideGridTokenControl kind="body-spacing" options={siteGridFrameOptions} />
            <StyleGuideGridTokenControl kind="section-spacing" options={sectionPaddingOptions} />
            <StyleGuideSectionMinControl tokens={sectionMinTokens} variant="controls" />
            <StyleGuideGridTokenControl kind="content-spacing" options={contentFrameOptions} />
            <StyleGuideGridTokenControl kind="gap" options={siteGridGapOptions} />
            <StyleGuideSemanticSpacingControl />
            <StyleGuideGridTokenControl
              kind="inline-gap"
              options={gapTokens[0].items.map(([name, value]) => ({ label: name, name, value }))}
            />
            <StyleGuideGridTokenControl
              kind="card-gap"
              options={gapTokens[1].items.map(([name, value]) => ({ label: name, name, value }))}
            />
            <StyleGuideGridTokenControl
              kind="layout-gap"
              options={gapTokens[2].items.map(([name, value]) => ({ label: name, name, value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-1">
            <div className="style-guide-control-panel radius-medium border p-6">
              <p className="type-label text-service-accent">Hierarchy</p>
              <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">What controls what</h3>
              <ol className="type-text-sm mt-heading-body-sm grid gap-2 text-service-muted">
                <li>Page frame sets the global canvas inset.</li>
                <li>Section padding sets vertical page rhythm.</li>
                <li>Section min adds presence only where a section opts in.</li>
              </ol>
            </div>
            <div className="style-guide-control-panel radius-medium border p-6">
              <p className="type-label text-service-accent">Inside a section</p>
              <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">Use the smallest scope</h3>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">Content padding gives a card breathing room. Grid gutter aligns columns and rows. Semantic rhythm handles the relationships within a copy group.</p>
            </div>
            <div className="style-guide-control-panel radius-medium border p-6">
              <p className="type-label text-service-accent">Usage</p>
              <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">Avoid double spacing</h3>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">Reach for section padding between bands, content padding inside panels, and local gaps only for compact clusters or repeated content.</p>
            </div>
          </div>

          <LayoutSystemControlLab />

          <section className="border-t border-service-border pt-10">
            <div className="fluid-type-frame max-w-3xl">
              <p className="type-label text-service-accent">Applied sections</p>
              <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Section library in the same spacing system
              </h3>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">
                These real library sections show where the outer grid gutter,
                section spacing, and locally scoped card gaps each belong.
              </p>
            </div>
            <div className="mt-7 grid overflow-hidden rounded border border-service-border bg-service-surface">
              <TrustBarSectionV3 {...sectionLibraryV3Content.trustBar} />
              <ServicesThreeCardsRightSectionV3
                {...sectionLibraryV3Content.servicesThreeCardsRight}
              />
              <FAQSectionV3 {...sectionLibraryV3Content.faq} />
            </div>
          </section>
        </div>
      </GuideSection>

      {false && (
        <>
      <GuideSection
        eyebrow="Layout"
        id="seven-column-grid"
        title="Layout System"
        body="SevenColumnGrid is the current section frame. It keeps column count stable while frame inset, gap, vertical padding, item alignment, and copy measures move through tokens."
      >
        <div className="grid gap-5">
          <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
            <div className="col-span-4 max-xl:col-span-2 max-md:col-span-1">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">Layout controls</p>
                <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  Spacing controls
                </h2>
                <p className="type-text-sm mt-heading-body-sm text-service-muted">
                  Adjust the live page spacing, content inset, and grid gutter
                  tokens used by the examples below.
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <StyleGuideGridTokenControl
                kind="body-spacing"
                options={siteGridFrameOptions}
              />
            </div>

            <div className="min-w-0">
              <StyleGuideGridTokenControl
                kind="section-spacing"
                options={sectionPaddingOptions}
              />
            </div>

            <div className="min-w-0">
              <StyleGuideGridTokenControl
                kind="content-spacing"
                options={contentFrameOptions}
              />
            </div>

            <div className="min-w-0">
              <StyleGuideGridTokenControl
                kind="gap"
                options={siteGridGapOptions}
              />
            </div>
          </div>

          <LayoutSystemControlLab />

          <div className="radius-medium overflow-visible border border-service-border bg-service-surface p-4">
            <SevenColumnGrid minHeight="none" padding="none">
              {columnNicknameExamples.map((item) => (
                <SevenColumnGridItem
                  className={cx(
                    item.spanClass,
                    item.rowClass,
                    "overflow-visible max-lg:row-auto max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
                  )}
                  key={item.name}
                >
                  <div className="radius-medium min-h-12 overflow-visible border border-service-border bg-surface-raised">
                    <div
                      className={cx(
                        "flex min-h-12 items-center gap-3 px-4 py-3",
                        item.allowOverflow
                          ? "w-max max-w-none flex-nowrap whitespace-nowrap max-lg:w-auto max-lg:flex-wrap max-lg:whitespace-normal"
                          : "max-md:flex-wrap",
                      )}
                    >
                      <span className="type-label shrink-0 text-service-accent">
                        {item.name}
                      </span>
                      <span className="type-caption shrink-0 font-semibold text-service-ink">
                        {item.span}
                      </span>
                      <span className="type-caption min-w-0 text-service-muted">
                        {item.examples}
                      </span>
                    </div>
                  </div>
                </SevenColumnGridItem>
              ))}
            </SevenColumnGrid>
          </div>

          <SevenColumnGrid minHeight="none" padding="none">
            <SevenColumnGridItem className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
              <StyleGuideSectionMinControl
                tokens={sectionMinTokens}
                variant="controls"
              />
            </SevenColumnGridItem>

            <SevenColumnGridItem className="col-span-5 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
              <StyleGuideSectionMinControl
                tokens={sectionMinTokens}
                variant="graphic"
              />
            </SevenColumnGridItem>
          </SevenColumnGrid>

          <div className="radius-medium overflow-hidden border border-service-border bg-service-surface">
            <SevenColumnGrid
              className="section-min-active items-stretch"
              minHeight="none"
              padding="med"
              style={{
                minHeight: "min(var(--section-min-active), 42rem)",
              }}
            >
              <SevenColumnGridItem className="col-span-2 max-lg:col-span-7">
                <div className="content-frame radius-medium grid h-full content-between border border-service-border bg-surface-raised">
                  <div>
                    <p className="type-label text-service-accent">Columns 1-2</p>
                    <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                      Planning rail
                    </h3>
                    <p className="type-text-sm mt-heading-body-sm text-service-muted">
                      Small side columns hold labels, notes, proof, or navigation
                      without stealing the main reading track.
                    </p>
                  </div>
                  <code className="radius-medium mt-8 bg-service-surface px-2 py-1 text-xs font-semibold text-service-muted">
                    col-span-2
                  </code>
                </div>
              </SevenColumnGridItem>
              <SevenColumnGridItem
                className="col-span-3 max-lg:col-span-7"
                measure="copy"
              >
                <div className="content-frame radius-medium grid h-full content-center border border-service-border bg-surface-raised">
                  <p className="type-label text-service-accent">Columns 3-5</p>
                  <h3 className="type-heading-lg mt-eyebrow-heading-sm text-service-ink">
                    Main copy track with editorial texture
                  </h3>
                  <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                    The center span is where a service page can slow down just
                    enough to explain the offer. A good paragraph has room for
                    texture, but it should still resolve quickly: what changed,
                    why it matters, and what the visitor can do next.
                  </p>
                  <p className="type-text-sm wrap-pretty mt-paragraph-paragraph text-service-muted">
                    Here the grid span gives the passage structure, while the
                    text role measure keeps the line length comfortable.
                  </p>
                </div>
              </SevenColumnGridItem>
              <SevenColumnGridItem className="col-span-2 max-lg:col-span-7">
                <div className="content-frame radius-medium grid h-full content-between border border-service-border bg-service-ink text-white">
                  <div>
                    <p className="type-label text-white/70">Columns 6-7</p>
                    <h3 className="type-heading-sm mt-eyebrow-heading-sm">
                      Action or proof rail
                    </h3>
                    <p className="type-text-sm mt-heading-body-sm text-white/70">
                      Use this rail for compact conversion support, ratings,
                      service areas, or one strong next step.
                    </p>
                  </div>
                  <div className="mt-8 grid gap-2">
                    <span className="type-caption rounded-sm border border-white/18 bg-surface-raised/10 px-3 py-2 font-semibold text-white/80">
                      4.9 local rating
                    </span>
                    <span className="type-caption rounded-sm border border-white/18 bg-surface-raised/10 px-3 py-2 font-semibold text-white/80">
                      Same-day dispatch
                    </span>
                  </div>
                </div>
              </SevenColumnGridItem>
            </SevenColumnGrid>
          </div>

          <div className="radius-medium overflow-hidden border border-service-border bg-service-surface">
            <SevenColumnGrid minHeight="none" padding="med">
              <SevenColumnGridItem className="col-span-2 row-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
                <div className="fluid-type-frame h-full">
                  <p className="type-label text-service-accent">rail / 2 cols</p>
                  <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                    Header plus three repeated cards
                  </h3>
                </div>
              </SevenColumnGridItem>
              {[
                [
                  "Repair",
                  "condensed / 2 cols",
                  "Urgent calls, diagnostics, and clear approval points.",
                  "col-span-2 col-start-2 row-start-2",
                ],
                [
                  "Maintenance",
                  "condensed / 2 cols",
                  "Seasonal tune-ups that keep small issues visible.",
                  "col-span-2 col-start-4 row-start-2",
                ],
                [
                  "Replace",
                  "condensed / 2 cols",
                  "Options when repair no longer makes sense.",
                  "col-span-2 col-start-6 row-start-2",
                ],
              ].map(([title, semantic, body, spanClass]) => (
                <SevenColumnGridItem
                  className={cx(
                    spanClass,
                    "max-lg:col-start-1 max-lg:row-auto max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1",
                  )}
                  key={title}
                >
                  <Card className="content-frame h-full shadow-none">
                    <p className="type-label text-service-accent">{semantic}</p>
                    <p className="type-heading-sm text-service-ink">{title}</p>
                    <p className="type-text-sm mt-heading-body-sm text-service-muted">
                      {body}
                    </p>
                  </Card>
                </SevenColumnGridItem>
              ))}
            </SevenColumnGrid>
          </div>

          <div className="radius-medium overflow-hidden border border-service-border bg-surface-raised">
            <SevenColumnGrid minHeight="none" padding="med">
              <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
                <div className="content-frame radius-medium aspect-[4/3] h-full min-h-80 border border-service-border bg-service-surface">
                  <div className="grid h-full content-between">
                    <p className="type-label text-service-accent">4 / 3 media</p>
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: 8 }, (_, index) => (
                        <span
                          className="radius-4 h-12 bg-surface-raised"
                          key={`layout-media-${index}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SevenColumnGridItem>
              <SevenColumnGridItem
                className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                alignY="middle"
              >
                <div className="content-frame fluid-type-frame">
                  <p className="type-label text-service-accent">Image / text split</p>
                  <h3 className="type-heading-lg mt-eyebrow-heading-sm text-service-ink">
                    A common proof section can stay aligned without custom widths
                  </h3>
                  <p className="type-text-md mt-heading-body-md text-service-muted">
                    The media occupies four columns, the text occupies three,
                    and the selected gutter controls the relationship between
                    them.
                  </p>
                  <div className="mt-body-actions-md flex flex-wrap gap-3">
                    <Button href="#">View services</Button>
                    <Button href="#" variant="secondary">
                      See process
                    </Button>
                  </div>
                </div>
              </SevenColumnGridItem>
            </SevenColumnGrid>
          </div>

          <div className="radius-medium overflow-hidden border border-service-border bg-service-ink text-white">
            <SevenColumnGrid minHeight="none" padding="med">
              <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
                <div className="content-frame fluid-type-frame">
                  <p className="type-label text-white/68">Conversion</p>
                  <h3 className="type-heading-xl mt-eyebrow-heading-lg">
                    Ready for a faster service request flow?
                  </h3>
                  <p className="type-text-lg mt-heading-body-lg text-white/72">
                    A conversion row should feel anchored to the same page
                    system, not pasted on after the layout is finished.
                  </p>
                </div>
              </SevenColumnGridItem>
              <SevenColumnGridItem
                className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                alignY="middle"
              >
                <div className="content-frame radius-medium border border-white/18 bg-surface-raised/8">
                  <p className="type-heading-sm">Book the next visit</p>
                  <p className="type-text-sm mt-heading-body-sm text-white/70">
                    Keep form, phone, and trust cues close enough to scan as one
                    decision.
                  </p>
                  <div className="mt-body-actions-md flex flex-wrap gap-3">
                    <Button
                      className="border-white bg-surface-raised text-service-ink hover:bg-service-surface"
                      href="#"
                      variant="secondary"
                    >
                      Schedule now
                    </Button>
                  </div>
                </div>
              </SevenColumnGridItem>
            </SevenColumnGrid>
          </div>

          <Card className="p-6 shadow-none">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">Visual aids</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Body spacing, content spacing, and gutter references
              </h2>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">
                Body Spacing controls page side padding and section vertical padding.
                Content Spacing controls inner content padding. The examples
                below explain the available token sizes without acting as
                controls.
              </p>
            </div>

            <SevenColumnGrid className="mt-6" minHeight="none" padding="none">
              <SevenColumnGridItem className="col-span-7">
                <p className="type-label text-service-muted">Body Spacing</p>
              </SevenColumnGridItem>
              {siteGridFrameOptions.map((option) => (
                <SevenColumnGridItem
                  className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                  key={option.name}
                >
                  <FrameVisualAid
                    block={option.block}
                    inline={option.inline}
                    label={option.label}
                    previewBlock={option.previewBlock}
                    previewInline={option.previewInline}
                  />
                </SevenColumnGridItem>
              ))}

              <SevenColumnGridItem className="col-span-7 mt-3">
                <p className="type-label text-service-muted">Content Spacing</p>
              </SevenColumnGridItem>
              {contentFrameOptions.map((option) => (
                <SevenColumnGridItem
                  className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                  key={option.name}
                >
                  <ContentFrameVisualAid
                    label={option.label}
                    value={option.value}
                  />
                </SevenColumnGridItem>
              ))}

              <SevenColumnGridItem className="col-span-7 mt-3">
                <p className="type-label text-service-muted">site-grid-gap</p>
              </SevenColumnGridItem>
              {siteGridGapOptions.map((option) => (
                <SevenColumnGridItem
                  className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                  key={option.name}
                >
                  <GapVisualAid
                    label={option.label}
                    previewValue={option.previewValue}
                    value={option.value}
                  />
                </SevenColumnGridItem>
              ))}
            </SevenColumnGrid>
          </Card>

        </div>
      </GuideSection>
        </>
      )}

      <GuideSection
        eyebrow="Color"
        id="color-system"
        title="Color System"
        body="Palette tokens, semantic color roles, and live surface/type relationships in one place. The color inputs on these swatches update the cards directly."
      >
        <div className="mb-6 flex flex-wrap items-center justify-end inline-gap-sml">
          <StyleGuideColorResetButton />
        </div>

        <div className="grid grid-cols-2 card-grid-gap-med max-lg:grid-cols-1">
          {colors.map((color) => (
            <StyleGuideColorSwatch color={color} key={color.name} />
          ))}
        </div>

        <SevenColumnGrid className="mt-6" minHeight="none" padding="none">
          {colorRoleCombinations.map((combo) => (
            <SevenColumnGridItem
              className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
              key={combo.name}
            >
              <div
                className={cx(
                  combo.surfaceClass,
                  combo.textClass,
                  combo.borderClass,
                  "fluid-type-frame h-full rounded border p-6",
                )}
              >
                <p className="type-label opacity-75">{combo.name}</p>
                <h3 className="type-heading-md mt-eyebrow-heading-md">
                  Semantic role relationship
                </h3>
                <p className={cx(combo.mutedClass, "type-text-sm wrap-pretty mt-heading-body-md")}>
                  {combo.surfaceClass} / {combo.textClass} / {combo.mutedClass}
                </p>
                <div className={cx(combo.borderClass, "mt-5 rounded border p-4")}>
                  <p className="type-caption opacity-80">
                    Border role: {combo.borderClass}
                  </p>
                </div>
                <span
                  className={cx(
                    combo.actionClass,
                    "mt-body-actions-sm inline-flex min-h-10 items-center rounded-sm px-4 text-sm font-semibold",
                  )}
                >
                  {combo.actionClass}
                </span>
              </div>
            </SevenColumnGridItem>
          ))}
        </SevenColumnGrid>

        <SevenColumnGrid className="mt-6" minHeight="none" padding="none">
          {surfaceTypeSpecimens.map((specimen) => (
            <SevenColumnGridItem
              className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
              key={specimen.name}
            >
              <article
                className={cx(
                  specimen.surfaceClass,
                  specimen.frameClass,
                  "fluid-type-frame radius-medium grid min-h-[30rem] border p-6 shadow-service",
                )}
              >
                <div className="grid content-between gap-8">
                  <div>
                    <p className={cx("type-label", specimen.eyebrowClass)}>
                      {specimen.name}
                    </p>
                    <p className={cx("type-caption mt-2", specimen.bodyClass)}>
                      {specimen.semantic}
                    </p>
                    <h3
                      className={cx(
                        specimen.headingClassName,
                        "mt-eyebrow-heading-lg",
                        specimen.headingClass,
                      )}
                    >
                      Fast repairs with clear options before work begins
                    </h3>
                    <p
                      className={cx(
                        specimen.bodyClassName,
                        "wrap-pretty mt-heading-body-lg",
                        specimen.bodyClass,
                      )}
                    >
                      This paragraph shows whether the muted text can carry real
                      service detail without feeling faint, muddy, or too close to
                      the heading color.
                    </p>
                  </div>

                  <div
                    className={cx(
                      specimen.insetClass,
                      "radius-4 border p-4",
                    )}
                  >
                    <p
                      className={cx(
                        "type-heading-sm",
                        specimen.insetHeadingClass,
                      )}
                    >
                      Estimate window
                    </p>
                    <p
                      className={cx(
                        "type-caption mt-heading-body-sm",
                        specimen.insetBodyClass,
                      )}
                    >
                      Same-day scheduling, arrival notes, and approval before
                      paid repair work.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={cx(
                        specimen.actionClass,
                        "radius-4 type-label inline-flex min-h-11 items-center px-4",
                      )}
                    >
                      Request service
                    </span>
                    <span className={cx("type-caption", specimen.bodyClass)}>
                      4.9 rating / local team
                    </span>
                  </div>
                </div>
              </article>
            </SevenColumnGridItem>
          ))}
        </SevenColumnGrid>

        <SevenColumnGrid className="mt-6" minHeight="none" padding="none">
          <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <div className="fluid-type-frame radius-medium border border-service-border bg-surface-raised p-8 shadow-service max-md:p-6">
              <p className="type-label text-service-accent">Hierarchy waterfall</p>
              <h3 className="type-display-lg mt-eyebrow-display text-service-ink">
                Emergency help, calm communication, clean closeout notes
              </h3>
              <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
                This larger specimen makes font scale, heading weight, body
                leading, and color contrast visible in one normal homepage-style
                block.
              </p>
              <div className="mt-body-actions-lg grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <div className="radius-4 border border-service-border bg-service-surface p-4">
                  <p className="type-heading-sm text-service-ink">42 min</p>
                  <p className="type-caption mt-2 text-service-muted">
                    Average response window
                  </p>
                </div>
                <div className="radius-4 border border-service-border bg-service-surface p-4">
                  <p className="type-heading-sm text-service-ink">2,400+</p>
                  <p className="type-caption mt-2 text-service-muted">
                    Completed visits
                  </p>
                </div>
                <div className="radius-4 border border-service-border bg-service-surface p-4">
                  <p className="type-heading-sm text-service-ink">4.9</p>
                  <p className="type-caption mt-2 text-service-muted">
                    Review average
                  </p>
                </div>
              </div>
            </div>
          </SevenColumnGridItem>

          <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <div className="fluid-type-frame radius-medium border border-white/18 bg-service-ink p-8 text-white shadow-service max-md:p-6">
              <p className="type-label text-white/68">Inverse check</p>
              <h3 className="type-heading-xl mt-eyebrow-heading-lg">
                When the palette turns dark, the hierarchy should stay calm.
              </h3>
              <p className="type-text-lg wrap-pretty mt-heading-body-lg text-white/72">
                Use this to judge whether inverse copy has enough presence beside
                bright actions, muted labels, and card borders.
              </p>
              <div className="mt-body-actions-md rounded-sm border border-white/14 bg-surface-raised/8 p-5">
                <p className="type-heading-sm">Ready for dispatch</p>
                <p className="type-caption mt-heading-body-sm text-white/66">
                  The nested panel should feel distinct without turning chalky.
                </p>
              </div>
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </GuideSection>

      <GuideSection
        eyebrow="Shape"
        id="shape"
        title="Radius, Borders, And Shadows"
      >
        <div className="grid gap-5">
          <Card className="p-5 shadow-none">
            <SevenColumnGrid minHeight="none" padding="none">
              <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
                <StyleGuideRadiusControls options={radii} />
              </SevenColumnGridItem>

              <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
                <StyleGuideSurfaceControls />
              </SevenColumnGridItem>
            </SevenColumnGrid>
          </Card>

          <Card className="p-5 shadow-none">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">Visual aids</p>
              <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                Radius reference
              </h2>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">
                Compare the active token against the rest of the corner scale
                without leaving the control area.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
              {radii.map(([name, value]) => (
                <RadiusVisualAid key={name} name={name} value={value} />
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-none">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">Applied shape</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Radius, border, and shadow context
              </h2>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">
                The selected radius, border, and shadow tokens are easier to
                judge when they appear on nested surfaces, buttons, and media
                placeholders.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-5 max-lg:grid-cols-1">
              <div className="radius-surface border border-service-border bg-service-surface p-5 shadow-service [border-width:var(--border-surface-width-token)]">
                <div className="radius-surface border border-service-border bg-surface-raised p-5 [border-width:var(--border-surface-width-token)]">
                  <p className="type-label text-service-accent">Card shell</p>
                  <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                    Active surface recipe on nested content
                  </h3>
                  <p className="type-text-sm mt-heading-body-sm text-service-muted">
                    Borders and shadows should still feel composed as the
                    radius moves from square to extra rounded.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="radius-surface border border-service-border bg-service-surface p-4 [border-width:var(--border-surface-width-token)]">
                  <div className="radius-surface h-24 border border-service-border bg-surface-raised [border-width:var(--border-surface-width-token)]" />
                </div>
                <div className="radius-surface border border-service-border bg-service-ink p-4 [border-width:var(--border-surface-width-token)]">
                  <div className="radius-surface h-24 border border-white/18 bg-surface-raised/10 [border-width:var(--border-surface-width-token)]" />
                </div>
              </div>
            </div>
          </Card>

        </div>
      </GuideSection>

      {false && (
        <GuideSection
          eyebrow="Spacing"
          id="legacy-spacing"
          title="Legacy Spacing System"
          body="Legacy reference retained while the focused spacing lab replaces its controls and visual aids."
        >
        <div className="grid gap-8">
          <SevenColumnGrid minHeight="none" padding="none">
            <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
              <StyleGuideSemanticSpacingControl />
            </SevenColumnGridItem>
            <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
              <StyleGuideGridTokenControl
                kind="section-spacing"
                options={sectionPaddingOptions}
              />
            </SevenColumnGridItem>
          </SevenColumnGrid>

          <SevenColumnGrid minHeight="none" padding="none">
            {sectionSpacing.map(([name, value]) => (
              <SevenColumnGridItem
                className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                key={name}
              >
              <Card className="h-full overflow-hidden shadow-none">
                <div className={cx(name, "bg-service-surface px-6")}>
                  <div className="fluid-type-frame rounded border border-service-border bg-surface-raised p-6">
                    <p className="type-label text-service-accent">Section sample</p>
                    <h3 className="type-heading-sm mt-4 text-service-ink">
                      Padding around a real content group
                    </h3>
                    <p className="type-text-sm wrap-pretty mt-3 text-service-muted">
                      The empty area above and below this raised box is the section
                      spacing token in action.
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <TokenMeta name={name} value={value} />
                </div>
              </Card>
              </SevenColumnGridItem>
            ))}
          </SevenColumnGrid>

          <SevenColumnGrid minHeight="none" padding="none">
            {relationshipSpacing.map((example) => (
              <SevenColumnGridItem
                className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                key={example.title}
              >
              <Card className="h-full p-6 shadow-none">
                <div className="mb-6">
                  <h3 className="type-heading-sm text-service-ink">
                    {example.title}
                  </h3>
                  <p className="type-caption mt-2 text-service-muted">
                    {example.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {example.tokens.map(([name, value]) => (
                      <TokenMeta key={name} name={name} value={value} />
                    ))}
                  </div>
                </div>

                {example.kind === "compact" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-surface p-6">
                    <p className="type-label text-service-accent">Maintenance</p>
                    <h4 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                      Seasonal tune-ups before the busy months
                    </h4>
                    <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                      A compact service card should feel tight and scannable
                      without collapsing the relationship between title and copy.
                    </p>
                    <a
                      className="type-label mt-body-actions-sm inline-block text-service-accent"
                      href="#"
                    >
                      View service
                    </a>
                  </div>
                ) : null}

                {example.kind === "default" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-surface p-6">
                    <p className="type-label text-service-accent">
                      Emergency HVAC Repair
                    </p>
                    <h4 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                      Same-day repairs when your system quits
                    </h4>
                    <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
                      Get fast help from licensed technicians serving
                      Huntersville, Cornelius, Davidson, and North Charlotte.
                    </p>
                    <div className="mt-body-actions-md flex flex-wrap gap-3">
                      <Button href="#">Schedule Now</Button>
                      <Button href="#" variant="secondary">
                        Call Today
                      </Button>
                    </div>
                  </div>
                ) : null}

                {example.kind === "hero" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-ink p-6 text-white">
                    <p className="type-label text-white/70">Ready when you are</p>
                    <h4 className="type-display-lg mt-eyebrow-display">
                      Turn the next visit into a booked service call
                    </h4>
                    <p className="type-text-xl wrap-pretty mt-display-body text-white/75">
                      A display group needs more breathing room because the
                      headline scale creates a stronger visual event.
                    </p>
                    <div className="mt-body-actions-lg flex flex-wrap gap-3">
                      <Button
                        className="border-white bg-surface-raised text-service-ink hover:bg-service-surface"
                        href="#"
                        variant="secondary"
                      >
                        Start a request
                      </Button>
                    </div>
                  </div>
                ) : null}

                {example.kind === "editorial" ? (
                  <div className="fluid-type-frame rounded border border-service-border bg-service-surface p-6">
                    <p className="type-text-md wrap-pretty text-service-muted">
                      When a heating system quits on a cold morning, the customer
                      is not looking for a brand manifesto. They are trying to
                      understand whether someone can come soon.
                    </p>
                    <p className="type-text-md wrap-pretty mt-paragraph-paragraph text-service-muted">
                      The page should answer that quickly, then make the next
                      step feel obvious without flattening the tone.
                    </p>
                    <h4 className="type-heading-lg mt-paragraph-heading-md text-service-ink">
                      Clear next steps matter more than decoration
                    </h4>
                    <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                      Editorial spacing should make the copy feel intentional
                      while still supporting a service page rhythm.
                    </p>
                  </div>
                ) : null}
              </Card>
              </SevenColumnGridItem>
            ))}
          </SevenColumnGrid>

          <div className="border-t border-service-border pt-8">
            <div className="fluid-type-frame mb-6">
              <p className="type-label text-service-accent">Nested helpers</p>
              <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Nested Gap Helpers
              </h3>
              <p className="type-text-sm mt-heading-body-sm text-service-muted">
                Use the seven-column grid first for alignment. These
                lower-priority gap helpers are for small clusters, repeated
                cards, and sub-layouts inside a SevenColumnGridItem.
              </p>
            </div>

            <div className="grid gap-5">
              <SevenColumnGrid minHeight="none" padding="none">
                {gapTokens.map((group) => (
                  <SevenColumnGridItem
                    className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                    key={group.group}
                  >
                    <Card className="h-full p-5 shadow-none">
                      <h4 className="type-heading-sm text-service-ink">
                        {group.group}
                      </h4>
                      <div className="mt-4 grid gap-2">
                        {group.items.map(([name, value]) => (
                          <StyleGuideGapCard
                            key={name}
                            kind={group.kind}
                            name={name}
                            value={value}
                          />
                        ))}
                      </div>
                    </Card>
                  </SevenColumnGridItem>
                ))}
              </SevenColumnGrid>

              <Card className="p-6 shadow-none">
                <div className="fluid-type-frame">
                  <p className="type-label text-service-accent">Visual aids</p>
                  <h4 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                    Nested gap references
                  </h4>
                  <p className="type-text-sm mt-heading-body-sm text-service-muted">
                    These show how each lower-priority gap token behaves inside
                    a grid item. The buttons above choose values.
                  </p>
                </div>
                <SevenColumnGrid className="mt-6" minHeight="none" padding="none">
                  {gapTokens.flatMap((group) =>
                    group.items.map(([name, value]) => (
                      <SevenColumnGridItem
                        className="col-span-2 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
                        key={`${group.kind}-${name}`}
                      >
                        <NestedGapVisualAid
                          kind={group.kind}
                          name={name}
                          value={value}
                        />
                      </SevenColumnGridItem>
                    )),
                  )}
                </SevenColumnGrid>
              </Card>
            </div>
          </div>
        </div>
        </GuideSection>
      )}

      <GuideSection
        eyebrow="Buttons"
        id="buttons"
        title="Button System"
        body="Shared CTA primitives, standard variants, and special treatments from the sections page gathered into one place."
      >
        <StyleGuideButtonControls />
      </GuideSection>

      {false && <StyleGuideListControlSamples />}

      <GuideSection
        eyebrow="Composition"
        id="styles-in-context"
        title="Shared Styles In Context"
        titleAs="h3"
        body="These previews use the same global tokens a production section would compose."
      >
        <SevenColumnGrid minHeight="none" padding="none">
          <SevenColumnGridItem className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <Card className="fluid-type-frame h-full p-8 shadow-none max-md:p-6">
              <p className="type-label text-service-accent">Emergency HVAC Repair</p>
              <h3 className="type-heading-xl mt-5 text-service-ink">
                Same-day repairs when your system quits
              </h3>
              <p className="type-text-lg wrap-pretty mt-6 text-service-muted">
                Get fast help from licensed technicians serving Huntersville,
                Cornelius, Davidson, and North Charlotte.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#">Schedule Now</Button>
                <Button href="#" variant="secondary">
                  Call Today
                </Button>
              </div>
            </Card>
          </SevenColumnGridItem>

          <SevenColumnGridItem className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <div className="grid gap-6">
              <Card className="fluid-type-frame p-7 shadow-none">
                <h3 className="type-heading-sm text-service-ink">
                  Preventive maintenance
                </h3>
                <p className="type-text-sm wrap-pretty mt-4 text-service-muted">
                  Seasonal tune-ups help catch small issues before they become
                  expensive repairs.
                </p>
                <a className="type-label mt-6 inline-block text-service-accent" href="#">
                  View service
                </a>
              </Card>

              <Card className="fluid-type-frame p-7 shadow-none">
                <h3 className="type-heading-sm text-service-ink">
                  Do you provide estimates before work begins?
                </h3>
                <p className="type-text-md wrap-pretty mt-4 text-service-muted">
                  Yes. Customers receive a clear scope and approval point before
                  paid work starts.
                </p>
              </Card>
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>

      </GuideSection>

      </main>
    </StyleGuideLiveSurface>
  );
}
