import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerOS — Intelligent Career Navigation & Skill Gap Diagnostics",
  description:
    "Dynamic graph-based competency mapping, confidence-weighted skill-gap diagnostics, and milestone learning acceleration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary-foreground">
        {children}
      </body>
    </html>
  );
}
