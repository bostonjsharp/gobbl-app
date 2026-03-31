import type { Metadata } from "next";
import { Providers } from "@/components/ui/Providers";
import { NavBar } from "@/components/ui/NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gobbl - Talk Turkey. Build Bridges.",
  description: "Gamified civil discourse training powered by AI. Grow your turkey, earn feathers, and reduce polarization through practice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>
          <NavBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
