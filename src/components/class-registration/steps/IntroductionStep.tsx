import React from 'react';

export const IntroductionStep: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Top Section: Text + Photo */}
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Who's Teaching This?
          </h2>
          
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p className="text-2xl font-semibold text-white">
              Hi, I'm Ian McDonald
            </p>
            
            <p>
              I went from healthcare worker to self-taught app developer in 18 months.
            </p>
            
            <div>
              <p className="font-semibold text-white mb-2">I've built:</p>
              <ul className="space-y-2 ml-4">
                <li>• An AI platform with 1,500+ active users</li>
                <li>• Enterprise tools without a computer science degree</li>
                <li>• This workshop to prove you don't need to be "technical"</li>
              </ul>
            </div>
            
            <p>
              I'm not here to sell you a course. I'm here to show you what's possible when you just start building.
            </p>
            
            <p className="text-xl font-semibold text-red-400">
              Let's do this together.
            </p>
          </div>
        </div>

        {/* Photo */}
        <div className="w-full lg:w-auto lg:max-w-sm">
          <div className="aspect-square bg-zinc-800 rounded-2xl border-2 border-gray-700 flex items-center justify-center overflow-hidden">
            <img 
              src="/DS-Logo.svg" 
              alt="Ian McDonald"
              className="w-32 h-32 object-contain opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Quick Facts */}
      <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-8 lg:p-12">
        <h3 className="text-2xl font-bold text-white mb-6">Quick Facts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl">→</span>
            <span className="text-gray-300 text-lg">Self-taught developer (18 months)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl">→</span>
            <span className="text-gray-300 text-lg">Built apps serving 1,500+ users</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl">→</span>
            <span className="text-gray-300 text-lg">Healthcare background → Tech</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl">→</span>
            <span className="text-gray-300 text-lg">Currently building LaunchBox</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl">→</span>
            <span className="text-gray-300 text-lg">Teaching while building in public</span>
          </div>
        </div>
      </div>
    </div>
  );
};

