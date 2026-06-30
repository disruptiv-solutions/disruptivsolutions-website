import type { Metadata } from 'next';
import SupplierReadinessBuilder from '@/components/workshop-kits/SupplierReadinessBuilder';

export const metadata: Metadata = {
  title: 'AI Supplier Readiness Builder | Ian McDonald AI',
  description:
    'A practical AI workshop kit for HMSDC MBE Leadership Academy participants to organize business knowledge, generate prompts, and draft their Capstone deliverables.',
};

export default function SupplierReadinessBuilderPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F1E8] text-[#0B0F14] antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(11,15,20,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(11,15,20,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed right-0 top-0 h-[480px] w-[min(100vw,720px)] rounded-full bg-[#FF7A2F]/16 blur-[120px]"
      />
      <SupplierReadinessBuilder />
    </div>
  );
}
