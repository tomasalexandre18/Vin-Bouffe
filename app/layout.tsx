import "./globals.css";
import { Outfit, Fraunces } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });
const fraunces = Fraunces({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={outfit.className}>
        <div className="app">
          {children}
        </div>
      </body>
    </html>
  );
}