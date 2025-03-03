import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, isLoginMode, setIsLoginMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      if (isLoginMode) {
        // Login flow - simple and direct
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (data?.user) {
          onClose();
          navigate('/dashboard');
        } else {
          throw new Error('Login failed');
        }
      } else {
        // Sign up flow - simple and direct
        const { data, error } = await signUp(email, password);
        
        if (error) throw error;
        
        if (data?.user) {
          // Auto-login after signup
          const { data: signInData, error: signInError } = await signIn(email, password);
          
          if (!signInError && signInData?.user) {
            onClose();
            navigate('/dashboard');
          } else {
            setIsLoginMode(true);
            setEmail('');
            setPassword('');
            alert('Account created! Please sign in.');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <img src="/logo.svg" alt="ZenMix Logo" className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{isLoginMode ? 'Sign In' : 'Sign Up'}</h2>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-200 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full gradient-button py-3 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLoginMode ? 'Signing In...' : 'Signing Up...'}
              </span>
            ) : (
              isLoginMode ? 'Sign In' : 'Sign Up'
            )}
          </button>
          
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-primary hover:text-primary-dark text-sm"
            >
              {isLoginMode 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;