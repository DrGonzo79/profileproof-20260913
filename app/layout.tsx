import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "ProfileProof — Candidate-controlled social self-audit", description: "A fictional, explainable demo for reviewing social posts before a job search." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
