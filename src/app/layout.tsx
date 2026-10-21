import type { Metadata } from "next";
import { Montserrat, Rosario } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import SiteFrame from "@/components/site/SiteFrame";
import "./editorial.css";
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
  metadataBase: new URL("https://www.ianmcdonald.ai"),
  title: "Ian McDonald — Builder, Founder & Practical AI Speaker",
  description: "Practical AI, built from experience. Keynotes and workshops with Ian McDonald, notes from the workbench, and help building through Disruptiv Solutions.",
  keywords: ["Ian McDonald", "Launchbox", "Launch Box", "AI for Business", "AI product builder", "build without CS degree", "practical AI", "AI training", "no-code AI", "ChatterCard", "Disruptiv Solutions"],
  authors: [{ name: "Ian McDonald" }],
  icons: {
    icon: [
      { url: "/DS-Logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/DS-Logo.svg",
    apple: "/DS-Logo.svg",
  },
  openGraph: {
    title: "Ian McDonald — Builder, Founder & Practical AI Speaker",
    description: "Practical AI, built from experience. Speaking, workshops, and real lessons from building products and businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" style={{ scrollPaddingTop: '65px' }} suppressHydrationWarning>
      <head>
        <Script id="google-analytics" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          gtag('set', 'linker', {domains: ['ianmcdonald.ai', 'disruptiv.solutions'], accept_incoming: true});
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', new URLSearchParams(window.location.search).has('analytics_test') ? {debug_mode: true} : {});
        `}</Script>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${montserrat.variable} ${rosario.variable} antialiased bg-black text-white`}
      >
        <GoogleAnalytics />
        <AuthProvider>
          <SiteFrame>{children}</SiteFrame>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
