import type { Metadata } from "next";
import { Manrope, Inter, Geist_Mono } from "next/font/google";
import { JsonLd } from "@/components/shared/json-ld";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";
import React from "react";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ziporter — Enterprise Logistics. Simplified.",
    template: "%s | Ziporter",
  },
  description:
    "Ziporter is the courier aggregation platform for Indian enterprises — one API and one dashboard to allocate, ship, track, and reconcile every order across XX+ carriers.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ziporter",
  description:
    "Enterprise courier aggregation and logistics orchestration platform for Indian businesses.",
  url: "https://ziporter.example.com",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={organizationJsonLd} />
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
