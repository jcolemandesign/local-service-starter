import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientIntakeWizard } from "@/components/forms/ClientIntakeWizard";
import {
  intakeVariants,
  isIntakeVariantKey,
  type IntakeVariantKey,
} from "@/content/intakeVariants";

type ClientIntakeVariantPageProps = {
  params: Promise<{
    variant: string;
  }>;
};

export function generateStaticParams() {
  return Object.keys(intakeVariants).map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: ClientIntakeVariantPageProps): Promise<Metadata> {
  const { variant } = await params;

  if (!isIntakeVariantKey(variant)) {
    return {
      title: "Client Intake | Local Service Starter",
    };
  }

  return {
    title: `${intakeVariants[variant].label} Intake | Local Service Starter`,
    description: intakeVariants[variant].description,
  };
}

export default async function ClientIntakeVariantPage({
  params,
}: ClientIntakeVariantPageProps) {
  const { variant } = await params;

  if (!isIntakeVariantKey(variant)) {
    notFound();
  }

  return <ClientIntakeWizard variant={variant as IntakeVariantKey} />;
}
