import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    // If we're not on the homepage, navigate there first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 80; // Height of the fixed header
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAuthClick = (type) => {
    setMobileMenuOpen(false);
    navigate(`/${type}`);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center space-x-2">
          <img src="/logo.svg" alt="ZenMix Logo" className="h-9 w-9" />
          <span className="text-white font-semibold text-xl">
            ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span>
          </span>
        </button>
        
        <nav className="hidden md:flex space-x-10">
          <a 
            href="#features" 
            onClick={(e) => scrollToSection(e, 'features')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a 
            href="#about" 
            onClick={(e) => scrollToSection(e, 'about')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </a>
          <a 
            href="#experience" 
            onClick={(e) => scrollToSection(e, 'experience')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => scrollToSection(e, 'pricing')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </a>
        </nav>
        
        {/* Desktop buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => handleAuthClick('login')}
            className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full border border-white/10 transition-all duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => handleAuthClick('signup')}
            className="gradient-button px-5 py-2"
          >
            Get Started
          </button>
        </div>
        
        {/* Mobile hamburger button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 bg-black transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div ref={menuRef} className="flex flex-col h-full bg-black">
          {/* Menu content */}
          <div className="flex flex-col flex-grow bg-black">
            {/* Top padding to account for header */}
            <div className="h-[72px]"></div>
            
            <nav className="flex flex-col space-y-6 text-center p-8 bg-black">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, 'features')}
                className="text-xl text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => scrollToSection(e, 'about')}
                className="text-xl text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#experience"
                onClick={(e) => scrollToSection(e, 'experience')}
                className="text-xl text-gray-300 hover:text-white transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                className="text-xl text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </a>
            </nav>
          </div>
          
          {/* Bottom buttons section */}
          <div className="p-8 bg-black border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleAuthClick('login')}
                className="bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-full border border-white/10 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="gradient-button px-5 py-3"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;