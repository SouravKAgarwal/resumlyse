import type { Metadata } from "next";
import { AnalysisView } from "@/components/AnalysisView";

export const metadata: Metadata = {
  title: "Resume Analysis Results — resumlyse",
  description:
    "Review your detailed ATS score, category breakdown, critical improvements, and section audit.",
};

export default function AnalysisPage() {
  return <AnalysisView />;
}
