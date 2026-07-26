import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { requireBuilderPageAccess } from "@/utils/builder-access";

export default async function DevLayout({ children }: { children: ReactNode }) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    notFound();
  }

  await requireBuilderPageAccess("/dev");

  return children;
}
