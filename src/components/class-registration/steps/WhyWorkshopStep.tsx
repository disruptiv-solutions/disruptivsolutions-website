import React from 'react';

export const WhyWorkshopStep: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
        Why This Workshop?
      </h2>
      
      <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-12 space-y-6 text-left">
        <p className="text-2xl text-white leading-relaxed">
          I learned by doing. No bootcamps. No CS degree. Just AI tools, curiosity, 
          and refusing to quit when it got tough.
        </p>
        
        <div className="pt-6 border-t border-gray-700">
          <p className="text-3xl font-bold text-white mb-4">
            If I can do it, you can too.
          </p>
          <p className="text-xl text-white">
            Today, you'll see exactly how AI makes app development accessible to anyone 
            willing to learn and experiment.
          </p>
        </div>
      </div>
    </div>
  );
};

