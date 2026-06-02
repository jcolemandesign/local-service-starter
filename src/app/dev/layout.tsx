import { notFound } from "next/navigation";

type DevLayoutProps = {
  children: React.ReactNode;
};

export default function DevLayout({ children }: DevLayoutProps) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    notFound();
  }

  return children;
}
