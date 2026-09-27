import type { Metadata } from "next";
import { DocsView } from "@/components/DocsView";

export const metadata: Metadata = {
  title: "API Reference — resumlyse",
  description:
    "Complete REST API specification and data schemas for the Resumlyse backend engine. Integrate resume parsing, scoring, and PDF export.",
};

export default function DocsPage() {
  return <DocsView />;
}
