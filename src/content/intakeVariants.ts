export type IntakeVariantKey =
  | "home-services"
  | "contractors"
  | "property-services"
  | "appointment-based";

export type IntakeVariant = {
  key: IntakeVariantKey;
  label: string;
  description: string;
  examples: string;
  serviceOptions: string[];
  priorityServicesLabel: string;
  helperText: {
    services: string;
    serviceArea: string;
    leadFlow: string;
    assets: string;
  };
  customerQuestionPlaceholders: [string, string, string];
};

export const intakeVariants: Record<IntakeVariantKey, IntakeVariant> = {
  "home-services": {
    key: "home-services",
    label: "Home Service / Repair",
    description: "For repair-first local businesses that respond to service calls.",
    examples: "HVAC, plumbing, electrical, appliance repair, pest control",
    serviceOptions: [
      "Repair",
      "Installation",
      "Replacement",
      "Maintenance",
      "Emergency service",
      "Inspection / diagnosis",
      "Tune-up / seasonal service",
      "Financing available",
    ],
    priorityServicesLabel:
      "Which services do you want more calls or quote requests for?",
    helperText: {
      services: "Choose the services customers already ask for most often.",
      serviceArea: "List the places where you can realistically respond well.",
      leadFlow: "This helps the website route urgent and normal requests clearly.",
      assets: "Service photos, trucks, team shots, and review screenshots are all useful.",
    },
    customerQuestionPlaceholders: [
      "How quickly can you come out?",
      "Do you offer emergency service?",
      "Do you repair or replace this type of system?",
    ],
  },
  contractors: {
    key: "contractors",
    label: "Project-Based Contractors",
    description: "For businesses that sell estimates, projects, and larger jobs.",
    examples: "Roofing, remodeling, concrete, fencing, painting, flooring",
    serviceOptions: [
      "New installation",
      "Repair",
      "Replacement",
      "Inspection / estimate",
      "Storm / damage repair",
      "Insurance-related work",
      "Residential projects",
      "Commercial projects",
    ],
    priorityServicesLabel:
      "Which project types are most valuable to your business?",
    helperText: {
      services: "Think in terms of the project types you want better leads for.",
      serviceArea: "Use this to steer the site toward the markets worth pursuing.",
      leadFlow: "This helps separate quick estimate requests from more complex jobs.",
      assets: "Before/after photos, project galleries, and estimate process notes matter here.",
    },
    customerQuestionPlaceholders: [
      "Do you offer free estimates?",
      "How long does a project usually take?",
      "Do you help with insurance claims?",
    ],
  },
  "property-services": {
    key: "property-services",
    label: "Property / Recurring Services",
    description: "For businesses built around upkeep, visits, and repeat service.",
    examples: "Cleaning, landscaping, lawn care, pressure washing, pool service",
    serviceOptions: [
      "One-time service",
      "Recurring service",
      "Seasonal service",
      "Deep clean / cleanup",
      "Maintenance plan",
      "Residential service",
      "Commercial service",
      "Emergency / rush service",
    ],
    priorityServicesLabel:
      "Which services or packages do you most want to promote?",
    helperText: {
      services: "Pick the packages and service rhythms that fit how you operate.",
      serviceArea: "Recurring routes, travel limits, and ideal neighborhoods are useful here.",
      leadFlow: "This helps the site push one-time, recurring, and rush requests correctly.",
      assets: "Route photos, before/after examples, equipment, and recurring package details help.",
    },
    customerQuestionPlaceholders: [
      "Do you bring your own supplies or equipment?",
      "Can I book recurring service?",
      "What areas do you service?",
    ],
  },
  "appointment-based": {
    key: "appointment-based",
    label: "Appointment-Based Local Business",
    description: "For businesses where the website should drive bookings or visits.",
    examples: "Med spa, salon, wellness, dental, fitness, repair shop",
    serviceOptions: [
      "Consultation",
      "First appointment",
      "Ongoing service",
      "Treatment / session",
      "Membership / package",
      "Product purchase",
      "Follow-up appointment",
      "Gift card / promo",
    ],
    priorityServicesLabel:
      "Which appointments, services, or offers should the website push first?",
    helperText: {
      services: "Focus on the bookings, treatments, and offers that should be easiest to choose.",
      serviceArea: "Mention nearby markets, parking realities, or who typically visits you.",
      leadFlow: "This helps the site emphasize calls, booking links, messages, or callbacks.",
      assets: "Interior photos, team photos, treatment examples, promos, and booking links help.",
    },
    customerQuestionPlaceholders: [
      "How do I book an appointment?",
      "What should I expect at the first visit?",
      "Do you offer packages or memberships?",
    ],
  },
};

export const intakeVariantList = Object.values(intakeVariants);

export function isIntakeVariantKey(value: string): value is IntakeVariantKey {
  return value in intakeVariants;
}
