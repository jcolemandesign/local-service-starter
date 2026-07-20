import type { ThankYouConfirmationSectionV3Props } from "@/components/sections/ThankYouConfirmationSectionV3";

export const thankYouPageContent = {
  eyebrow: "Request received",
  title: "Thank you. Your service request has been sent.",
  body: "A team member will review the details and follow up using the contact information you provided.",
  nextStepsTitle: "What happens next",
  nextSteps: [
    {
      title: "We review your request",
      body: "The team checks the service details, location, and preferred contact information.",
    },
    {
      title: "We follow up",
      body: "A team member reaches out to clarify the request and discuss current availability.",
    },
    {
      title: "We confirm the next step",
      body: "Scheduling and service expectations are confirmed before a visit is finalized.",
    },
  ],
  note: "For urgent heating or cooling issues, call the business directly to discuss current availability.",
  primaryActionLabel: "Back to home",
  primaryActionHref: "/",
  secondaryActionLabel: "View services",
  secondaryActionHref: "/services",
} satisfies ThankYouConfirmationSectionV3Props;
