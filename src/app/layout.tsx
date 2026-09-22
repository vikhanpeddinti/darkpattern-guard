import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DarkPattern Guard | AI Deception Scanner & Wall of Shame",
  description:
    "Protecting consumers from deceptive UI designs, sneaky pre-checked boxes, hidden fees, and subscription roach motels using Gemini 1.5 Flash AI.",
  keywords: [
    "dark patterns",
    "deceptive UI",
    "consumer protection",
    "Gemini AI",
    "pre-checked boxes",
    "drip pricing",
    "roach motel",
    "hackathon",
  ],
  authors: [{ name: "DarkPattern Guard Team" }],
  openGraph: {
    title: "DarkPattern Guard | AI Deception Scanner",
    description: "Scan deceptive e-commerce checkouts and discover crowdsourced unethical web layouts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#070a13] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
