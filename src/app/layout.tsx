import type { Metadata } from "next";
import { Quicksand, Nunito_Sans } from "next/font/google";
import { Providers } from "@/components/ui/Providers";
import { NavBar } from "@/components/ui/NavBar";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-quicksand",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Gobbl - Talk Turkey. Build Bridges.",
  description: "Gamified civil discourse training powered by AI. Grow your turkey with XP, spend feathers in the Bazaar, and reduce polarization through practice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunitoSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased font-body">
        <Providers>
          <NavBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
