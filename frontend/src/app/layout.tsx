import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zenflow",
  description: "Generate agent skills for your AI assistant.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Forces dynamic rendering so proxy.ts's per-request CSP nonce can reach
  // the inline scripts Next injects — see content-security-policy.md.
  await connection();

  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
