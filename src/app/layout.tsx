import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import BackgroundAnimation from "@/components/ui/BackgroundAnimation";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Buildify - Drag and Drop Website Builder",
  description: "Build websites in minutes. No code. Just drag.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden">
        <BackgroundAnimation />
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
