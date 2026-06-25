import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Outfit, Caveat } from "next/font/google";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import SmartTabBar from "./components/ui/SmartTabBar";


const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WineCore",
  description: "Search for a wine and discover perfectly matching dishes.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WineCore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${outfit.variable} ${caveat.variable}`}
    >
      <body className="h-dvh">
        <ServiceWorkerRegistration />
        <SmartTabBar />
        <div className="h-dvh overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
