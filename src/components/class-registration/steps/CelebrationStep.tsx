import React, { useEffect, useState } from 'react';

export const CelebrationStep: React.FC = () => {
  const [showCelebration, setShowCelebration] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show "You just did that!" for 3 seconds, then fade out
    const timer = setTimeout(() => {
      setShowCelebration(false);
      // After fade out completes, show main content
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full px-4 md:px-8 relative min-h-[70vh] flex items-center justify-center">
      {/* Animated "You just did that!" message */}
      {showCelebration && (
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
            showCelebration ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white text-center animate-fade-in">
            You just did that! 🎉
          </h2>
        </div>
      )}

      {/* Main content - appears after celebration fades */}
      {showContent && (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Now you can share your site
            </h2>
            <p className="text-base md:text-lg text-gray-300">
              You've seen how easy it is to build something real. Here's what's next.
            </p>
          </div>

          <div className="space-y-4">
            {/* Motivational content */}
            <div className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="space-y-3 text-gray-200">
                <p className="text-lg md:text-xl leading-relaxed">
                  You just built a website in minutes. Think about what that means for you.
                </p>
                
                <div className="space-y-3 text-base">
                  <div className="flex items-start gap-2.5">
                    <span className="text-red-400 text-xl mt-0.5">→</span>
                    <div>
                      <p className="text-white font-semibold mb-0.5 text-base">Get the wheels turning</p>
                      <p className="text-gray-300 text-sm">
                        You've proven to yourself that building with AI is possible. Use this momentum to keep learning and building.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-red-400 text-xl mt-0.5">→</span>
                    <div>
                      <p className="text-white font-semibold mb-0.5 text-base">Build sites for others</p>
                      <p className="text-gray-300 text-sm">
                        Local businesses need websites. You now have the skills to help them. Start with friends, family, or small businesses in your area.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-red-400 text-xl mt-0.5">→</span>
                    <div>
                      <p className="text-white font-semibold mb-0.5 text-base">Dive deeper into AI app development</p>
                      <p className="text-gray-300 text-sm">
                        This is just the beginning. There's so much more to learn about building AI-powered applications, automation, and tools that solve real problems.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




