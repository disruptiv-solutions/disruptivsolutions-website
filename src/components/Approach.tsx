'use client';

import React from 'react';

const Approach: React.FC = () => {
  return (
    <section 
      id="approach"
      className="min-h-screen flex items-center justify-center bg-black snap-start"
    >
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10">
          How I Build
        </h2>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Start Messy</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Don't wait for perfect. Start with a messy version. Launch fast, learn fast.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Iterate Quickly</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Each version is better than the last. Small improvements compound fast.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Ship Real Value</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Build features people use in the real world. Focus on practical outcomes.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Keep Going</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Momentum matters. Keep stacking wins one after the other.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;

