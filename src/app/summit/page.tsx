import type { Metadata } from "next";
import SummitKit from "./SummitKit";

export const metadata: Metadata = {
  title: "AI & Automation for Small Business — Workshop Kit | Ian McDonald",
  description:
    "The take-home kit from the Small Business Diversity & Inclusion Summit workshop: the 2-minute AI Snapshot, the exact prompts, the checklist, and the free tools.",
};

export default function SummitPage() {
  return (
    <div className="min-h-screen bg-[#040404] text-white antialiased">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(100vw,900px)] h-[400px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none"
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center px-5 sm:px-6 pt-[90px] pb-16">
        <SummitKit />
      </main>
    </div>
  );
}
