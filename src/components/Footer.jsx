import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
              <span className="text-white font-semibold text-xl">
                ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span>
              </span>
            </div>
            <p className="text-gray-400 mt-2 max-w-xs">
              Transform your meditation practice with custom audio mixing and personalized soundscapes.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><a href="privacy.html" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="terms.html" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="cookies.html" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex justify-center">
          <p className="text-gray-500 text-sm">
            &copy; 2025 Medit8 Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;