import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "Philippine Christmas Countdown";
const description =
  "Counting down to September 1 — the day the world's longest Christmas season officially begins in the Philippines.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: "website" },
  icons: { icon: "/parol.svg" },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
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
