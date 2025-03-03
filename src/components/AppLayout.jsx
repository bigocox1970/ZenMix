import React from 'react';
import DashboardHeader from './dashboard/DashboardHeader';
import MobileNavigation from './MobileNavigation';

const AppLayout = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Full width header with dark background */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4">
          <DashboardHeader user={user} onLogout={onLogout} />
        </div>
      </header>
      
      {/* Content container with proper spacing for fixed header */}
      <div className="mx-auto max-w-3xl bg-black min-h-screen relative pt-16">
        {children}
        <MobileNavigation />
      </div>
    </div>
  );
};

export default AppLayout;