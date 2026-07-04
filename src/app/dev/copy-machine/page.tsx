import type { Metadata } from "next";
import { CopyMachineSection } from "@/components/sections/CopyMachineSection";

export const metadata: Metadata = {
  title: "Copy Machine | Local Service Starter",
  description: "Internal prompt library for packet-based website copy workflows.",
};

export default function CopyMachinePage() {
  return (
    <main>
      <CopyMachineSection />
    </main>
  );
}
