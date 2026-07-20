import type { Metadata } from "next";
import { ThankYouConfirmationSectionV3 } from "@/components/sections";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { thankYouPageContent } from "@/content/thank-you";

export const metadata: Metadata = {
  title: "Thank You | Local Service Starter",
  description: "Confirmation for a submitted service request.",
};

export default function ThankYouPage() {
  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-screen bg-bg-page text-service-ink">
        <ThankYouConfirmationSectionV3 {...thankYouPageContent} />
      </main>
    </StyleGuidePreviewSurface>
  );
}
