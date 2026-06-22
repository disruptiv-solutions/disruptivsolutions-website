import type { Metadata } from 'next';
import AiAssessment from '@/components/AiAssessment';

export const metadata: Metadata = {
  title: 'Where Does AI Fit Your Business? — 2-Minute Snapshot | Ian McDonald',
  description:
    'Answer a few quick questions and get an instant AI snapshot for your business: your readiness stage, where AI pays off fastest, and one quick win you can do this week.',
};

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#040404] text-white antialiased">
      {/* Background */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(100vw,900px)] h-[400px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none"
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 sm:px-6 pt-[105px] pb-20">
        <div className="w-full max-w-2xl">
          <AiAssessment />
        </div>
      </main>
    </div>
  );
}
