'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Consulting from '@/components/Consulting';

export default function ConsultingPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black">
        <Consulting />
      </div>
    </>
  );
}

