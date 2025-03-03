import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useSupabase } from '../contexts/SupabaseContext.jsx';

const TestAuthPage = () => {
  const { user, signUp, signIn, signOut } = useAuth();
  const { supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSignUp = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      console.log('Test signup with:', testEmail);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'password123',
      });
      
      setResult({ action: 'Direct Supabase Signup', data, error });
    } catch (err) {
      setResult({ action: 'Direct Supabase Signup', error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleContextSignUp = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      console.log('Test context signup with:', testEmail);
      
      const { data, error } = await signUp(testEmail, 'password123');
      
      setResult({ action: 'Context Signup', data, error });
    } catch (err) {
      setResult({ action: 'Context Signup', error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Form signup with:', email);
      
      const { data, error } = await signUp(email, password);
      
      setResult({ action: 'Form Signup', data, error });
    } catch (err) {
      setResult({ action: 'Form Signup', error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Form signin with:', email);
      
      const { data, error } = await signIn(email, password);
      
      setResult({ action: 'Sign In', data, error });
    } catch (err) {
      setResult({ action: 'Sign In', error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { error } = await signOut();
      
      setResult({ action: 'Sign Out', error });
    } catch (err) {
      setResult({ action: 'Sign Out', error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  const checkSession = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      setResult({ action: 'Check Session', data, error });
    } catch (err) {
      setResult({ action: 'Check Session', error: err.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Auth Testing Page</h1>
      
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Current User</h2>
        {user ? (
          <div>
            <p>Logged in as: {user.email}</p>
            <p>User ID: {user.id}</p>
            <button 
              onClick={handleSignOut}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
              disabled={loading}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Direct Signup</h2>
          <button 
            onClick={handleSignUp}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            Create Test User (Direct Supabase)
          </button>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Context Signup</h2>
          <button 
            onClick={handleContextSignUp}
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={loading}
          >
            Create Test User (Context)
          </button>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Manual Form</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg"
                placeholder="Your password"
              />
            </div>
            
            <div className="flex space-x-4">
              <button 
                type="button"
                onClick={handleFormSignUp}
                className="px-4 py-2 bg-purple-600 text-white rounded"
                disabled={loading}
              >
                Sign Up
              </button>
              
              <button 
                type="button"
                onClick={handleSignIn}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={loading}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
        
        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Session</h2>
          <button 
            onClick={checkSession}
            className="px-4 py-2 bg-yellow-600 text-white rounded"
            disabled={loading}
          >
            Check Session
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-center">Loading...</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Result: {result.action}</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAuthPage;
