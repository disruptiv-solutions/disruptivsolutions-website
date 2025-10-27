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
              <span className="text-red-600">D</span>isruptiv
            </span>
            <p className="text-gray-500 text-sm mt-1">
              Building AI solutions that matter
            </p>
          </div>

          {/* Links */}
          <div className="flex space-x-8 text-gray-400 text-sm">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            © {currentYear} Disruptiv Solutions. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



