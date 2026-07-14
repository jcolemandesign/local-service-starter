import type { StrategyWorkspaceFields } from "@/utils/strategy-workspace";

export type CopywritingPersonalityId =
  | "good-neighbor"
  | "straight-talking-expert"
  | "protective-professional"
  | "master-craftsperson"
  | "calm-authority"
  | "modern-challenger";

export type CopywritingLeverId =
  | "warmth"
  | "authority"
  | "energy"
  | "polish"
  | "personalityPresence"
  | "humor"
  | "urgency";

export type CopywritingLeverDefinition = {
  fieldKey: keyof StrategyWorkspaceFields;
  highLabel: string;
  id: CopywritingLeverId;
  label: string;
  lowLabel: string;
};

export type CopywritingPersonalityPacket = {
  archetypeBlend: string;
  authorityMethod: string[];
  avoidedPhrases: string[];
  bestFitIndustries: string[];
  bodyCopyRules: string[];
  coreImpression: string;
  ctaStyle: string[];
  defaultLevers: Record<CopywritingLeverId, number>;
  headlinePatterns: string[];
  id: CopywritingPersonalityId;
  name: string;
  poorFitIndustries: string[];
  preferredPhrases: string[];
  risk: string;
  voiceTraits: string[];
  writingBehavior: string[];
};

export type CopywritingSettings = {
  levers: Record<CopywritingLeverId, number>;
  personalityId: CopywritingPersonalityId;
};

export const copywritingLeverDefinitions: CopywritingLeverDefinition[] = [
  {
    fieldKey: "copywritingWarmth",
    highLabel: "Very friendly",
    id: "warmth",
    label: "Warmth",
    lowLabel: "Reserved",
  },
  {
    fieldKey: "copywritingAuthority",
    highLabel: "Expert-led",
    id: "authority",
    label: "Authority",
    lowLabel: "Conversational",
  },
  {
    fieldKey: "copywritingEnergy",
    highLabel: "Punchy",
    id: "energy",
    label: "Energy",
    lowLabel: "Calm",
  },
  {
    fieldKey: "copywritingPolish",
    highLabel: "Refined",
    id: "polish",
    label: "Polish",
    lowLabel: "Plainspoken",
  },
  {
    fieldKey: "copywritingPersonalityPresence",
    highLabel: "Personality-forward",
    id: "personalityPresence",
    label: "Personality presence",
    lowLabel: "Service-first",
  },
  {
    fieldKey: "copywritingHumor",
    highLabel: "Lightly playful",
    id: "humor",
    label: "Humor",
    lowLabel: "None",
  },
  {
    fieldKey: "copywritingUrgency",
    highLabel: "Action-oriented",
    id: "urgency",
    label: "Urgency",
    lowLabel: "Low-pressure",
  },
];

export const copywritingPersonalityPackets: CopywritingPersonalityPacket[] = [
  {
    archetypeBlend: "Everyman + Caregiver",
    authorityMethod: [
      "Responsiveness",
      "Plain explanation",
      "Local familiarity",
      "Specific next steps",
    ],
    avoidedPhrases: [
      "Your trusted local experts",
      "We treat you like family",
      "Quality service you can count on",
      "For all your needs",
    ],
    bestFitIndustries: [
      "Owner-operated home services",
      "Cleaning",
      "Landscaping",
      "Pest control",
      "Salons",
      "Family businesses",
    ],
    bodyCopyRules: [
      "Use we and you naturally.",
      "Explain what happens next without lecturing.",
      "Mention local people, community, and real team details only when supported.",
      "Keep the customer feeling guided, not sold to.",
    ],
    coreImpression:
      "Friendly, down-to-earth, local, and reassuring. The people behind the company are allowed to show through.",
    ctaStyle: [
      "Use easy, low-friction labels like Request a Quote, Call Now, or Ask a Question.",
      "Supporting CTA copy should feel helpful rather than forceful.",
    ],
    defaultLevers: {
      authority: 3,
      energy: 3,
      humor: 2,
      personalityPresence: 3,
      polish: 2,
      urgency: 2,
      warmth: 5,
    },
    headlinePatterns: [
      "Clear help for [customer/problem]",
      "[Service] from local people you can call",
      "A simpler way to handle [service need]",
      "Help with [problem], without making it harder",
      "[Outcome]. Clear answers. Local service.",
    ],
    id: "good-neighbor",
    name: "Good Neighbor",
    poorFitIndustries: ["High-ticket legal", "Complex medical", "Luxury work"],
    preferredPhrases: [
      "We will take a look",
      "Here is what to expect",
      "Clear next step",
      "Local help",
      "Without making the process harder",
    ],
    risk:
      "Can become bland friendly-local-service copy unless the business has real character, stories, or specific phrasing.",
    voiceTraits: [
      "friendly",
      "approachable",
      "plainspoken",
      "reassuring",
      "local",
    ],
    writingBehavior: [
      "Use short to medium conversational sentences.",
      "Use everyday vocabulary and contractions.",
      "Let personality show through lightly, especially in transitions and CTAs.",
      "Avoid corporate polish, jargon, and inflated expertise claims.",
    ],
  },
  {
    archetypeBlend: "Sage + Everyman",
    authorityMethod: [
      "Clear explanation",
      "Practical tradeoffs",
      "Careful diagnosis",
      "Specific process details",
    ],
    avoidedPhrases: [
      "Best in class",
      "Unmatched quality",
      "We do it all",
      "Your one-stop shop",
    ],
    bestFitIndustries: [
      "HVAC",
      "Plumbing",
      "Electrical",
      "Mechanics",
      "Appliance repair",
      "Dental",
      "Financial services",
      "Technical services",
    ],
    bodyCopyRules: [
      "Answer the customer's question directly.",
      "Make choices, tradeoffs, and next steps easy to understand.",
      "Use specificity instead of hype.",
      "Keep educational copy useful and concise.",
    ],
    coreImpression:
      "Knowledgeable without acting superior. Clear, practical, and honest.",
    ctaStyle: [
      "Use direct labels like Request a Quote, Schedule Service, Discuss Options, or Call Now.",
      "Supporting copy should clarify what happens next.",
    ],
    defaultLevers: {
      authority: 4,
      energy: 3,
      humor: 1,
      personalityPresence: 2,
      polish: 3,
      urgency: 3,
      warmth: 3,
    },
    headlinePatterns: [
      "Practical [service] guidance based on what [system/customer] actually needs",
      "Clear options for [service decision]",
      "[Service] explained before you decide",
      "Straightforward help with [problem]",
      "Know what is going on before you move forward",
    ],
    id: "straight-talking-expert",
    name: "Straight-Talking Expert",
    poorFitIndustries: ["Highly emotional hospitality", "Playful lifestyle brands"],
    preferredPhrases: [
      "Practical options",
      "Clear explanation",
      "Based on what makes sense",
      "After a careful look",
      "What to expect",
    ],
    risk:
      "Can become dry if every section sounds like an instruction manual.",
    voiceTraits: [
      "clear",
      "practical",
      "honest",
      "knowledgeable",
      "steady",
    ],
    writingBehavior: [
      "Use readable sentences with a mix of short and medium rhythm.",
      "Use precise but familiar vocabulary.",
      "Show expertise through explanation, not self-praise.",
      "Avoid vague quality claims and category cliches.",
    ],
  },
  {
    archetypeBlend: "Caregiver + Hero",
    authorityMethod: [
      "Readiness",
      "Safety awareness",
      "Clear urgent paths",
      "Competent action",
    ],
    avoidedPhrases: [
      "Do not wait until it is too late",
      "Protect your family now",
      "Disaster could strike",
      "Guaranteed emergency response",
    ],
    bestFitIndustries: [
      "Emergency repair",
      "Restoration",
      "Roofing",
      "HVAC",
      "Plumbing",
      "Electrical",
      "Security",
      "Healthcare",
    ],
    bodyCopyRules: [
      "Start with the customer's problem when urgency matters.",
      "Reassure with process, qualifications, and next steps.",
      "Make call paths clear for urgent needs.",
      "Avoid fear tactics and unsupported availability promises.",
    ],
    coreImpression:
      "Responsive, capable, and reassuring. The company solves stressful problems and helps customers regain control.",
    ctaStyle: [
      "Use clear action labels like Call Now, Request Urgent Help, or Start a Repair Request.",
      "Qualify availability wherever emergency response is not guaranteed.",
    ],
    defaultLevers: {
      authority: 4,
      energy: 4,
      humor: 1,
      personalityPresence: 2,
      polish: 3,
      urgency: 5,
      warmth: 4,
    },
    headlinePatterns: [
      "When [problem] happens, get a clear next step",
      "Help for [urgent problem] when you need answers",
      "Restore [outcome] with qualified [service]",
      "Take control of [problem]",
      "Fast-moving help without scare tactics",
    ],
    id: "protective-professional",
    name: "Protective Professional",
    poorFitIndustries: ["Purely aesthetic services", "Low-stakes lifestyle offers"],
    preferredPhrases: [
      "Clear next step",
      "Qualified team",
      "Restore reliable service",
      "Call directly",
      "Current availability",
    ],
    risk:
      "Can drift into scare tactics, fake urgency, or unsupported heroic claims.",
    voiceTraits: [
      "responsive",
      "capable",
      "reassuring",
      "direct",
      "protective",
    ],
    writingBehavior: [
      "Use strong action verbs and clear sequencing.",
      "Use a slightly more urgent rhythm without exaggeration.",
      "Balance emotional reassurance with practical process detail.",
      "Avoid jokes in urgent or safety-sensitive sections.",
    ],
  },
  {
    archetypeBlend: "Creator + Ruler",
    authorityMethod: [
      "Craft",
      "Materials",
      "Preparation",
      "Standards",
      "Project examples",
    ],
    avoidedPhrases: [
      "Built to perfection",
      "Obsessed with quality",
      "Luxury craftsmanship at affordable prices",
      "We never cut corners",
    ],
    bestFitIndustries: [
      "Remodeling",
      "Custom construction",
      "Painting",
      "Flooring",
      "Fencing",
      "Cabinetry",
      "Landscaping",
      "Premium contractors",
    ],
    bodyCopyRules: [
      "Highlight planning, preparation, materials, and finishing details.",
      "Let process and project specifics carry the proof.",
      "Use confident quality language without sounding precious.",
      "Minimize speed-first or bargain-first framing.",
    ],
    coreImpression:
      "Detailed, meticulous, and quality-focused. The work is presented as something built properly rather than merely completed.",
    ctaStyle: [
      "Use considered labels like Plan Your Project, Request an Estimate, or Discuss the Work.",
      "Supporting copy can invite a thoughtful conversation.",
    ],
    defaultLevers: {
      authority: 4,
      energy: 2,
      humor: 1,
      personalityPresence: 2,
      polish: 4,
      urgency: 2,
      warmth: 3,
    },
    headlinePatterns: [
      "[Service] planned carefully and built to hold up",
      "Thoughtful [project type] from preparation to finish",
      "Better results start before the work begins",
      "Detail-driven [service] for [customer/location]",
      "Workmanship you can see in the details",
    ],
    id: "master-craftsperson",
    name: "Master Craftsperson",
    poorFitIndustries: ["Emergency-first repair", "Budget commodity services"],
    preferredPhrases: [
      "Careful preparation",
      "Thoughtful planning",
      "Workmanship",
      "Materials",
      "Details that hold up",
    ],
    risk:
      "Can sound expensive, pretentious, or too craft-obsessed when customers mostly want speed and affordability.",
    voiceTraits: [
      "deliberate",
      "meticulous",
      "confident",
      "quality-focused",
      "composed",
    ],
    writingBehavior: [
      "Use a more deliberate sentence rhythm.",
      "Use refined but readable vocabulary.",
      "Use fewer casual phrases and fewer contractions.",
      "Demonstrate expertise through standards, process, and visible results.",
    ],
  },
  {
    archetypeBlend: "Sage + Ruler",
    authorityMethod: [
      "Credentials",
      "Defined process",
      "Evidence",
      "Risk reduction",
      "Clear decision structure",
    ],
    avoidedPhrases: [
      "The best",
      "Elite service",
      "Unrivaled expertise",
      "World-class",
    ],
    bestFitIndustries: [
      "Law",
      "Dental",
      "Medical",
      "Financial",
      "Commercial contractors",
      "High-ticket services",
      "Established operators",
    ],
    bodyCopyRules: [
      "Lead with process, credentials, and decision clarity.",
      "Keep emotional language controlled.",
      "Use evidence, proof points, and safeguards before enthusiasm.",
      "Avoid unsupported superlatives.",
    ],
    coreImpression:
      "Established, controlled, and highly credible. The expertise and process lead the voice.",
    ctaStyle: [
      "Use professional labels like Request a Consultation, Schedule an Appointment, or Contact the Office.",
      "Supporting copy should set expectations and reduce uncertainty.",
    ],
    defaultLevers: {
      authority: 5,
      energy: 2,
      humor: 1,
      personalityPresence: 1,
      polish: 5,
      urgency: 2,
      warmth: 2,
    },
    headlinePatterns: [
      "Experienced [service] guided by clear recommendations",
      "A defined process for [customer decision]",
      "Professional guidance for [high-stakes need]",
      "Clear options, careful counsel, and steady support",
      "[Service] with structure, evidence, and accountability",
    ],
    id: "calm-authority",
    name: "Calm Authority",
    poorFitIndustries: ["Casual owner-led brands", "Playful appointment businesses"],
    preferredPhrases: [
      "Experienced guidance",
      "Clearly defined options",
      "Professional support",
      "Evidence-based",
      "Straightforward process",
    ],
    risk:
      "Can feel cold, generic, or corporate if it does not include specific proof.",
    voiceTraits: [
      "credible",
      "controlled",
      "structured",
      "professional",
      "measured",
    ],
    writingBehavior: [
      "Use structured, confident headlines.",
      "Use formal but accessible vocabulary.",
      "Use minimal joking and minimal personal aside.",
      "Show authority through specificity, clarity, and proof.",
    ],
  },
  {
    archetypeBlend: "Explorer + Creator, with light Outlaw",
    authorityMethod: [
      "Category contrast",
      "Transparent process",
      "Simplification",
      "Modern experience",
    ],
    avoidedPhrases: [
      "Disrupting the industry",
      "Game-changing",
      "Revolutionary",
      "Not your average",
    ],
    bestFitIndustries: [
      "Younger operators",
      "Design-led contractors",
      "Med spas",
      "Fitness",
      "Modern dental",
      "Cleaning",
      "Landscaping",
      "Businesses replacing stale category experiences",
    ],
    bodyCopyRules: [
      "Name category frustrations only when the business can credibly solve them.",
      "Use sharper framing and more active rhythm.",
      "Position the process as simpler, clearer, or more transparent.",
      "Avoid startup jargon and empty rebellion.",
    ],
    coreImpression:
      "Independent, energetic, and noticeably different from stale competitors while still credible enough to hire.",
    ctaStyle: [
      "Use confident labels like Get Started, Plan the Project, See Your Options, or Request a Quote.",
      "Supporting copy can contrast the easier process with the usual runaround.",
    ],
    defaultLevers: {
      authority: 3,
      energy: 5,
      humor: 2,
      personalityPresence: 4,
      polish: 3,
      urgency: 3,
      warmth: 3,
    },
    headlinePatterns: [
      "[Service] without the pressure, confusion, or runaround",
      "A simpler way to handle [service decision]",
      "Clearer [service] for customers tired of [category frustration]",
      "Modern [service] with fewer surprises",
      "Less runaround. More clarity. Better next steps.",
    ],
    id: "modern-challenger",
    name: "Modern Challenger",
    poorFitIndustries: ["Traditional high-trust professions", "Emergency safety work"],
    preferredPhrases: [
      "Without the runaround",
      "Simpler process",
      "Transparent options",
      "No pressure",
      "A clearer way",
    ],
    risk:
      "Can become obnoxious, overly clever, or fake-disruptive if the contrast is not grounded.",
    voiceTraits: [
      "sharp",
      "energetic",
      "modern",
      "direct",
      "transparent",
    ],
    writingBehavior: [
      "Use punchier sentences and more active verbs.",
      "Use distinctive headlines without over-clever wordplay.",
      "Allow light personality in category contrasts.",
      "Keep credibility intact with concrete process and proof.",
    ],
  },
];

const defaultPersonalityId: CopywritingPersonalityId =
  "straight-talking-expert";

export function getCopywritingPersonalityPacket(
  id: string | undefined,
): CopywritingPersonalityPacket {
  return (
    copywritingPersonalityPackets.find((packet) => packet.id === id) ??
    copywritingPersonalityPackets.find(
      (packet) => packet.id === defaultPersonalityId,
    ) ??
    copywritingPersonalityPackets[0]
  );
}

export function normalizeCopywritingSettings(
  fields: StrategyWorkspaceFields,
): CopywritingSettings {
  const packet = getCopywritingPersonalityPacket(
    fields.copywritingPersonalityId,
  );
  const levers = Object.fromEntries(
    copywritingLeverDefinitions.map((lever) => [
      lever.id,
      clampLeverValue(fields[lever.fieldKey], packet.defaultLevers[lever.id]),
    ]),
  ) as Record<CopywritingLeverId, number>;

  return {
    levers,
    personalityId: packet.id,
  };
}

export function getCopywritingLeverInstruction(
  lever: CopywritingLeverDefinition,
  value: number,
) {
  const posture =
    value <= 1
      ? `strongly ${lever.lowLabel.toLowerCase()}`
      : value === 2
        ? `slightly ${lever.lowLabel.toLowerCase()}`
        : value === 3
          ? "balanced"
          : value === 4
            ? `slightly ${lever.highLabel.toLowerCase()}`
            : `strongly ${lever.highLabel.toLowerCase()}`;

  return `${lever.label}: ${posture}.`;
}

export function buildCopywritingAgentInstructions(
  fields: StrategyWorkspaceFields,
) {
  const settings = normalizeCopywritingSettings(fields);
  const packet = getCopywritingPersonalityPacket(settings.personalityId);
  const lines = [
    "## Copywriting Voice Packet",
    "",
    `Selected personality: ${packet.name}`,
    `Archetype blend: ${packet.archetypeBlend}`,
    `Core impression: ${packet.coreImpression}`,
    "",
    "Preserve the selected personality first. Lever adjustments tune the voice; they do not replace the base personality or override verified facts, claim guardrails, template-fit limits, or legal/safety constraints.",
    "",
    "Voice traits:",
    ...toBulletList(packet.voiceTraits),
    "",
    "Writing behavior:",
    ...toBulletList(packet.writingBehavior),
    "",
    "Headline patterns:",
    ...toBulletList(packet.headlinePatterns),
    "",
    "Body-copy rules:",
    ...toBulletList(packet.bodyCopyRules),
    "",
    "CTA style:",
    ...toBulletList(packet.ctaStyle),
    "",
    "Authority should come from:",
    ...toBulletList(packet.authorityMethod),
    "",
    "Preferred phrasing territory:",
    ...toBulletList(packet.preferredPhrases),
    "",
    "Avoided phrases and cliches:",
    ...toBulletList(packet.avoidedPhrases),
    "",
    `Risk to avoid: ${packet.risk}`,
    "",
    "Adjustable levers:",
    ...copywritingLeverDefinitions.map((lever) =>
      `- ${getCopywritingLeverInstruction(lever, settings.levers[lever.id])}`,
    ),
  ];

  return lines.join("\n");
}

export function buildGlobalCopywritingAgentInstructions() {
  return [
    "## Global Copywriting Rules",
    "",
    "Apply these rules to all website copy, regardless of the selected brand personality.",
    "",
    "1. Know the page goal. Every page and section should have one primary job.",
    "2. Write for the customer's situation. Lead with what they need, not the company biography.",
    "3. Make the offer obvious. Quickly establish what the business does, who it serves, where it works, and what visitors should do next.",
    "4. Choose clarity over cleverness. Personality may improve clear copy, but never replace it.",
    "5. Use specific language. Prefer concrete services, locations, processes, situations, and distinctions over generic claims.",
    "6. Never invent proof. Do not fabricate credentials, reviews, ratings, prices, guarantees, availability, experience, awards, or results.",
    "7. Demonstrate authority. Show expertise through clear explanations, useful distinctions, process, and supported evidence, not empty superlatives.",
    "8. Support benefits with substance. Explain the feature, behavior, or process that creates the claimed benefit.",
    "9. Answer real buying questions. Address fit, service area, timing, pricing process, trust, next steps, and common comparisons.",
    "10. Match customer awareness. Do not over-explain basics to visitors already ready to act.",
    "11. Give each section one job. A section should primarily orient, explain, prove, compare, reassure, support a decision, or prompt action.",
    "12. Lead with the strongest relevant information. Do not bury the primary reason to choose the business.",
    "13. Reduce friction before adding pressure. Clarify the offer, process, CTA, form, service area, and expectations before increasing urgency.",
    "14. Use one clear primary action. Secondary actions may exist, but should not compete equally with the main CTA.",
    "15. Explain what happens next. Make the result of calling, booking, or submitting a form clear.",
    "16. Use urgency honestly. Only use real deadlines, availability limits, seasonal timing, or customer-driven urgency.",
    "17. Remove interchangeable language. Replace phrases like quality service, trusted experts, and customer satisfaction with specific evidence or behavior.",
    "18. Sound human. Use natural syntax and recognizable language appropriate to the selected personality.",
    "19. Write for the template. Respect the required fields, semantic role, target length, visual balance, mobile layout, and component constraints.",
    "20. Earn every sentence. Each sentence should add information, relevance, differentiation, proof, reassurance, decision support, momentum, or genuine personality.",
    "",
    "Instruction priority:",
    "",
    "1. Factual guardrails decide what may be said.",
    "2. Template contract controls structure, fields, order, and length.",
    "3. Page strategy controls the page goal and messaging priorities within that structure.",
    "4. Global copywriting rules keep the copy clear, credible, specific, and useful.",
    "5. Personality packet controls sound, rhythm, warmth, authority, energy, polish, humor, and emotional posture.",
    "",
    "A personality packet may change how the copy sounds. It must not override factual boundaries, page goals, template requirements, or clarity.",
  ].join("\n");
}

function clampLeverValue(value: unknown, fallback: number) {
  const parsed =
    typeof value === "string" && value.trim() ? Number(value) : fallback;

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(5, Math.max(1, Math.round(parsed)));
}

function toBulletList(items: string[]) {
  return items.map((item) => `- ${item}`);
}
