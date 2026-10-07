import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "aurora mood",
  description: "Write how you feel — AI paints a living aurora and picks the lo-fi to match.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
