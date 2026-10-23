import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Wavez",
  description: "Generate agent skills for your AI assistant.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Forces dynamic rendering so proxy.ts's per-request CSP nonce can reach
  // the inline scripts Next injects — see content-security-policy.md.
  await connection();

  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
