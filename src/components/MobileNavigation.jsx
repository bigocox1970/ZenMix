import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Music2, Library, User, Shield } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

const MobileNavigation = () => {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const currentPath = location.pathname;

  // Only show mobile navigation for logged in users
  if (!user) {
    return null;
  }

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-container">
        <div className="mobile-nav-items">
          <Link 
            to="/dashboard" 
            className={`mobile-nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}
          >
            <Home className="h-6 w-6" />
            <span>Home</span>
          </Link>
          
          <Link 
            to="/mixer" 
            className={`mobile-nav-item ${currentPath === '/mixer' ? 'active' : ''}`}
          >
            <Music2 className="h-6 w-6" />
            <span>Mixer</span>
          </Link>
          
          <Link 
            to="/library" 
            className={`mobile-nav-item ${currentPath === '/library' ? 'active' : ''}`}
          >
            <Library className="h-6 w-6" />
            <span>Library</span>
          </Link>
          
          <Link 
            to="/profile" 
            className={`mobile-nav-item ${currentPath === '/profile' ? 'active' : ''}`}
          >
            <User className="h-6 w-6" />
            <span>Profile</span>
          </Link>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`mobile-nav-item ${currentPath === '/admin' ? 'active' : ''}`}
            >
              <Shield className="h-6 w-6" />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;