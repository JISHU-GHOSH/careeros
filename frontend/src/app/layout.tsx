import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerOS — Your Personal Career GPS & Skill Growth Hub",
  description:
    "Interactive career trajectory mapping, personalized skill-gap diagnostics, and milestone learning pathways.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
