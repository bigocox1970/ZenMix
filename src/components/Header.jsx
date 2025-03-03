import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onLoginClick, isLoggedIn }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use auth context if available, otherwise use prop
  const userIsLoggedIn = user ? true : isLoggedIn;

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    // If not on homepage, navigate there first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // Find the section and scroll to it
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 80; // Height of fixed header
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleAuthAction = () => {
    setMobileMenuOpen(false);
    if (userIsLoggedIn) {
      if (onLoginClick) {
        onLoginClick();
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If user is logged in, show a simplified header
  if (userIsLoggedIn) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
            <span className="text-white font-semibold text-xl">
              ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span>
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black border-t border-white/10">
            <nav className="container mx-auto px-4 py-4">
              <Link
                to="/profile"
                className="block py-2 text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left py-2 text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Original header for non-logged in users
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
            <span className="text-white font-semibold text-xl">
              ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#experience"
              onClick={(e) => handleNavClick(e, 'experience')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleAuthAction}
              className="gradient-button px-4 py-2"
            >
              {userIsLoggedIn ? 'Dashboard' : 'Sign In'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black border-t border-white/10 md:hidden">
            <nav className="flex flex-col py-4">
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, 'features')}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, 'about')}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                About
              </a>
              <a
                href="#experience"
                onClick={(e) => handleNavClick(e, 'experience')}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleNavClick(e, 'pricing')}
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Pricing
              </a>
              <div className="border-t border-white/10 mt-2 pt-2 px-4">
                <button
                  onClick={handleAuthAction}
                  className="w-full gradient-button py-2"
                >
                  {userIsLoggedIn ? 'Dashboard' : 'Sign In'}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;