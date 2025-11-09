import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Constitutional Market Harmonics",
  description: "Real-time market analysis and AI insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
