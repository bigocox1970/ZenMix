import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

const DashboardSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAdmin } = useAdmin();
  
  const isActive = (path) => {
    return currentPath === path;
  };
  
  return (
    <aside 
      className={`fixed top-16 left-0 bottom-0 bg-dark border-r border-gray-800 z-40 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 bg-dark border border-gray-800 rounded-full p-1 text-gray-400 hover:text-white"
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        )}
      </button>

      <nav className="p-4 overflow-y-auto h-full">
        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-semibold px-3 ${isCollapsed ? 'hidden' : ''}`}>Main</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center p-3 rounded-lg ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/library" 
                className={`flex items-center p-3 rounded-lg ${isActive('/library') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Meditation Library</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/analytics" 
                className={`flex items-center p-3 rounded-lg ${isActive('/analytics') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Analytics</span>
              </Link>
            </li>
          </ul>
        </div>
        
        {isAdmin && (
          <div className="mb-6">
            <h3 className={`text-xs uppercase text-gray-500 font-semibold px-3 ${isCollapsed ? 'hidden' : ''}`}>Admin</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link 
                  to="/admin" 
                  className={`flex items-center p-3 rounded-lg ${isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Admin Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
        
        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-semibold px-3 ${isCollapsed ? 'hidden' : ''}`}>Create</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link 
                to="/ai-generator" 
                className={`flex items-center p-3 rounded-lg ${isActive('/ai-generator') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                  <path d="M20 2a10 10 0 1 0-10 10h10V2z"></path>
                  <circle cx="12" cy="12" r="6"></circle>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>AI Generator</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/test-player" 
                className={`flex items-center p-3 rounded-lg ${isActive('/test-player') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Test Player</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/simple-player" 
                className={`flex items-center p-3 rounded-lg ${isActive('/simple-player') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Simple Player</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className={`text-xs uppercase text-gray-500 font-semibold px-3 ${isCollapsed ? 'hidden' : ''}`}>Social</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link 
                to="/community" 
                className={`flex items-center p-3 rounded-lg ${isActive('/community') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Community</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className={`text-xs uppercase text-gray-500 font-semibold px-3 ${isCollapsed ? 'hidden' : ''}`}>Account</h3>
          <ul className="mt-2 space-y-1">
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center p-3 rounded-lg ${isActive('/profile') ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Profile</span>
              </Link>
            </li>
            <li>
              <Link 
                to="#settings" 
                className="flex items-center p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span className={`ml-3 ${isCollapsed ? 'hidden' : ''}`}>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;