import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">
              Ian McDonald
            </span>
            <p className="text-gray-500 text-sm mt-1">
              Disruptiv Solutions LLC
            </p>
            <p className="text-gray-500 text-sm">
              Building AI solutions that matter
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-gray-400 text-sm">
            <a href="#hero" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#mystory" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#launchbox" className="hover:text-white transition-colors">
              LaunchBox
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Contact Info */}
          <div className="text-gray-500 text-sm text-center md:text-right">
            <p>
              <a href="mailto:ian@ianmcdonald.ai" className="hover:text-white transition-colors">
                ian@ianmcdonald.ai
              </a>
            </p>
            <p className="mt-1">Pensacola, FL</p>
            <p className="text-gray-600 text-xs mt-2">
              © {currentYear} Disruptiv Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



