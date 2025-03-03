import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      // Show the cookie consent popup after a short delay
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    // In a real app, this would disable non-essential cookies
    localStorage.setItem('cookieConsent', 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark border-t border-gray-800 p-4 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-8">
            <p className="text-gray-300 text-sm md:text-base">
              We use cookies to enhance your experience on our website. By continuing to browse, you agree to our use of cookies.
              <Link to="/cookies" className="text-primary hover:underline ml-1">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={handleDecline}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={handleAccept}
              className="px-4 py-2 gradient-button text-sm rounded-lg"
            >
              Accept All Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;