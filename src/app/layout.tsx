import type { Metadata } from "next";
import { Montserrat, Rosario } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/AuthContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const rosario = Rosario({
  variable: "--font-rosario",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ian McDonald — Build Real Apps Without a CS Degree | Launchbox",
  description: "From barely making rent to building an AI platform with 1,500+ active users. I teach others to build their dreams the same way I built mine. No jargon, no fluff—just real apps.",
  keywords: ["Ian McDonald", "Launchbox", "Launch Box", "AI for Business", "AI product builder", "build without CS degree", "practical AI", "AI training", "no-code AI", "ChatterCard", "Disruptiv Solutions"],
  authors: [{ name: "Ian McDonald" }],
  openGraph: {
    title: "Ian McDonald — Build Real Apps Without a CS Degree",
    description: "From barely making rent to building an AI platform with 1,500+ active users. Join Launchbox and build your first app in 30 days.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth snap-y overscroll-y-contain" style={{ scrollPaddingTop: '65px' }}>
      <body
        className={`${montserrat.variable} ${rosario.variable} antialiased bg-black text-white`}
      >
        <GoogleAnalytics />
        <AuthProvider>
          <NavigationWrapper />
          <main className="relative">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
