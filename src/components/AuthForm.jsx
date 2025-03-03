import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthForm = ({ isLoginMode: defaultLoginMode = true }) => {
  const [isLoginMode, setIsLoginMode] = useState(defaultLoginMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccessMessage('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    
    // For signup, validate password confirmation
    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      if (isLoginMode) {
        // Login flow
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (data?.user) {
          navigate('/dashboard');
        } else {
          throw new Error('Login failed - no user returned');
        }
      } else {
        // Sign up flow
        const { data, error } = await signUp(email, password);
        
        if (error) throw error;
        
        if (data?.user) {
          if (data.session) {
            // User is automatically signed in
            navigate('/dashboard');
          } else {
            // Email confirmation required
            setSuccessMessage(
              'Account created successfully! ' + 
              (data.user.email_confirmed_at 
                ? 'You can now log in.' 
                : 'Please check your email to confirm your account.')
            );
            setIsLoginMode(true);
            setPassword('');
            setConfirmPassword('');
          }
        } else {
          throw new Error('Signup failed - no user returned');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card rounded-xl p-8 shadow-lg">
        <div className="text-center mb-6">
          <img src="/logo.svg" alt="ZenMix Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold gradient-text">
            {isLoginMode ? 'Sign In to ZenMix' : 'Create Your ZenMix Account'}
          </h1>
          <p className="text-gray-400 mt-2">
            {isLoginMode 
              ? 'Access your personalized meditation experience' 
              : 'Start your journey to mindfulness'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-900/20 border border-green-900 text-green-200 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={isLoginMode ? "Your password" : "Create a password"}
              required
            />
          </div>
          
          {!isLoginMode && (
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full gradient-button py-3 mb-4 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLoginMode ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              isLoginMode ? 'Sign In' : 'Create Account'
            )}
          </button>
          
          <div className="text-center">
            <button 
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setSuccessMessage('');
              }}
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

export default AuthForm;