import type { Metadata } from "next";
import { UploadView } from "@/components/UploadView";

export const metadata: Metadata = {
  title: "Submit Resume for Evaluation — resumlyse",
  description:
    "Upload your resume to audit formatting structure, ATS compatibility, and compare keywords against job posting requirements.",
};

export default function UploadPage() {
  return <UploadView />;
}
