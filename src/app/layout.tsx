import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "সহজ উপায় (Sohoj Upai) - জরুরি সার্ভিস প্ল্যাটফর্ম",
  description: "হাইপার-লোকাল ইলেকট্রিক, প্লাম্বিং, এসি মেকানিক সার্ভিসের জরুরি বুকিং সিস্টেম",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
