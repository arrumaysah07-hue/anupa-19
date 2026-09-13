import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anupa · Chapter 19",
  description: "A tiny corner of the internet dedicated to Anupa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}