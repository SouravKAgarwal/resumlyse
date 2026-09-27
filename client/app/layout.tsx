import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { DialogProvider } from "@/context/DialogContext";
import { ToastProvider } from "@/context/ToastContext";
import { AnalysisProvider } from "@/context/AnalysisContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "resumlyse — Resume ATS Compatibility & Quality Benchmark",
  description:
    "resumlyse provides comprehensive resume analysis, structural formatting checks, keyword density detection, and ATS compatibility benchmarking.",
  keywords: [
    "resume analyzer",
    "ATS compatibility",
    "resume review",
    "CV checker",
    "applicant tracking system",
    "career tools",
    "job benchmark",
  ],
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('resumlyse-theme');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`h-full antialiased ${dmSans.variable} ${lora.variable} min-h-full flex flex-col`}
      >
        <ThemeProvider>
          <DialogProvider>
            <ToastProvider>
              <AnalysisProvider>
                <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#121212] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-stone-200 dark:selection:bg-stone-800">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </AnalysisProvider>
            </ToastProvider>
          </DialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
