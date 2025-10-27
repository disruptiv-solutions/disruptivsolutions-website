import type { Metadata } from "next";
import { Inter, Rosario } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const rosario = Rosario({
  variable: "--font-rosario",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ian McDonald — AI Product Builder | Launch Box, AI4B App, Disruptiv Solutions",
  description: "Ian McDonald ships practical AI platforms used by 1,300+ members and teaches non-technical builders inside Launch Box. See the work, join the community, or hire the studio.",
  keywords: ["Ian McDonald", "Disruptiv Solutions", "Launch Box", "AI4B App", "AI for Business", "AI product builder", "AI consulting", "practical AI", "AI training", "no-code AI"],
  authors: [{ name: "Ian McDonald" }],
  openGraph: {
    title: "Ian McDonald — AI Product Builder | Launch Box, AI4B App, Disruptiv Solutions",
    description: "Ian McDonald ships practical AI platforms used by 1,300+ members and teaches non-technical builders inside Launch Box.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth snap-y snap-mandatory">
      <body
        className={`${inter.variable} ${rosario.variable} antialiased bg-black text-white snap-start`}
      >
        <NavigationWrapper />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
