import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vincore",
  description: "Vincore select the best meal for your wines",
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
