import React from 'react';

const WAITLIST_URL = 'https://www.ianmcdonald.ai/waitlist';
const NEWSLETTER_URL = 'https://www.ianmcdonald.ai/newsletter';
const COMMUNITY_URL = 'https://www.facebook.com/groups/2000295250823114';
const FACEBOOK_URL = 'https://www.facebook.com/ian.mcmonster/';
const LINKEDIN_URL = 'https://www.linkedin.com/in/ian-mcdonald-673225243/';
const INSTAGRAM_URL = 'https://www.instagram.com/disruptiv.solutions/';
const TIKTOK_URL = 'https://www.tiktok.com/@ianmcdonaldai';
const YOUTUBE_URL = 'https://www.youtube.com/@IansDisruptivSolutions/shorts';

const openLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const WhatsNextStep: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-4 pb-20 w-full">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          What's Next?
        </h2>
        <p className="text-base md:text-lg text-gray-300">
          Join the community, stay connected, and keep building.
        </p>
      </div>

      {/* Social Links & LaunchBox */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Launchbox Waitlist */}
        <div className="bg-gradient-to-br from-red-600/30 via-red-600/15 to-transparent border-2 border-red-500/50 rounded-2xl p-6 flex flex-col shadow-xl shadow-red-600/30">
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
              🚀 JOIN LAUNCHBOX WAITLIST
            </h3>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed text-center">
              The platform I'm building for creators who want to offer courses,
              community, and AI tools—all in one place. Be the first to know when it
              launches and get founder pricing.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => openLink(WAITLIST_URL)}
              className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/50 text-base"
            >
              Join Waitlist →
            </button>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="space-y-3">
          {/* Top row: Workshops and Community side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-4 flex flex-col space-y-3">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                📬 Get Future Workshops
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed flex-1">
                Never miss a class. Join my newsletter for workshop announcements,
                AI building tips, and new tools & resources.
              </p>
              <button
                type="button"
                onClick={() => openLink(NEWSLETTER_URL)}
                className="w-full px-4 py-2 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm mt-auto"
              >
                Subscribe →
              </button>
            </div>

            <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-4 flex flex-col space-y-3">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                👥 Join the Community
              </h4>
              <p className="text-gray-300 text-xs leading-relaxed flex-1">
                Learn with others inside the Idea to AI Facebook group. Share what
                you're building, get help when you're stuck, and connect with other
                builders.
              </p>
              <button
                type="button"
                onClick={() => openLink(COMMUNITY_URL)}
                className="w-full px-4 py-2 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition-all text-sm mt-auto"
              >
                Join Group →
              </button>
            </div>
          </div>

          {/* Bottom: Social Media Icons */}
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xl font-bold text-white flex items-center gap-2">
              🤝 Connect With Me
            </h4>
            <p className="text-gray-300 text-xs leading-relaxed">
              Follow me on social media for more AI building tips, updates, and behind-the-scenes content.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {/* Facebook */}
              <button
                type="button"
                onClick={() => openLink(FACEBOOK_URL)}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => openLink(LINKEDIN_URL)}
                className="w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>

              {/* Instagram */}
              <button
                type="button"
                onClick={() => openLink(INSTAGRAM_URL)}
                className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>

              {/* TikTok */}
              <button
                type="button"
                onClick={() => openLink(TIKTOK_URL)}
                className="w-12 h-12 bg-black hover:bg-gray-900 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </button>

              {/* YouTube */}
              <button
                type="button"
                onClick={() => openLink(YOUTUBE_URL)}
                className="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
