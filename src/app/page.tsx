import type { Metadata } from "next";
import HomeV2 from "@/components/home-v2/HomeV2";

export const metadata: Metadata = {
  title: "Ian McDonald — Practical AI Builder for Operators",
  description:
    "Ian McDonald builds practical AI products, platforms, and communities—and shows operators how to turn ideas into things people can use.",
  openGraph: {
    title: "Ian McDonald — Practical AI Builder for Operators",
    description:
      "Practical, self-taught, and evidence-led. Bring Ian to your event or see what he is building.",
    type: "website",
    images: ["/ian-stage.jpg"],
  },
};

export default function Home() {
  return <HomeV2 />;
}
