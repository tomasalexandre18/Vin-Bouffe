import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WineCore",
  description: "Search for a wine and discover perfectly matching dishes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
