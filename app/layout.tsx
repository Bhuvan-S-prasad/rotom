import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { NavbarWrapper } from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { Providers } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rotom",
  description: "AI powered Web builder Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black relative selection:bg-blue-100/50`}
      >
        {/* Global Background Elements */}
        <div className="fixed inset-0 bg-grid-black/50 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] z-[-1]" />
        <div className="fixed inset-0 bg-linear-to-tr from-blue-50/50 via-white to-white pointer-events-none z-[-1]" />

        {/* Global Ambient Gradient Orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none mix-blend-multiply z-[-1]" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none mix-blend-multiply z-[-1]" />

        <Providers>
          <NavbarWrapper />
          <main>
            {children}
          </main>
          <FooterWrapper />
        </Providers>
      </body>
    </html>
  );
}
