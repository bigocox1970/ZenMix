import { supabase, signIn, signUp } from './supabase.js';

export function initAuth() {
  const loginBtn = document.getElementById('login-btn');
  const startJourneyBtn = document.getElementById('start-journey-btn');
  const authModal = document.getElementById('auth-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const authForm = document.getElementById('auth-form');
  const authToggle = document.getElementById('auth-toggle');
  const authTitle = document.getElementById('auth-title');
  const authSubmit = document.getElementById('auth-submit');
  const authError = document.getElementById('auth-error');
  
  let isLoginMode = true;
  
  // Show auth modal
  const showAuthModal = () => {
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  
  // Hide auth modal
  const hideAuthModal = () => {
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
    authError.classList.add('hidden');
    authForm.reset();
  };
  
  // Toggle between login and signup
  const toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
    authSubmit.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
    authToggle.textContent = isLoginMode 
      ? 'Don\'t have an account? Sign Up' 
      : 'Already have an account? Sign In';
    authError.classList.add('hidden');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }
    
    try {
      authSubmit.disabled = true;
      authSubmit.textContent = isLoginMode ? 'Signing In...' : 'Signing Up...';
      
      if (isLoginMode) {
        // Login flow
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (data) {
          hideAuthModal();
          window.location.href = '/dashboard.html';
        }
      } else {
        // Sign up flow
        const { data, error } = await signUp(email, password);
        
        if (error) throw error;
        
        if (data) {
          // Auto-login after signup
          const { data: signInData, error: signInError } = await signIn(email, password);
          
          if (!signInError && signInData) {
            hideAuthModal();
            window.location.href = '/dashboard.html';
          } else {
            // If auto-login fails, show success message and switch to login mode
            isLoginMode = true;
            authTitle.textContent = 'Sign In';
            authSubmit.textContent = 'Sign In';
            authToggle.textContent = 'Don\'t have an account? Sign Up';
            authForm.reset();
            showError('Account created! Please sign in.');
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      showError(error.message || 'Authentication failed');
    } finally {
      authSubmit.disabled = false;
      authSubmit.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
    }
  };
  
  // Show error message
  const showError = (message) => {
    authError.textContent = message;
    authError.classList.remove('hidden');
  };
  
  // Event listeners
  if (loginBtn) loginBtn.addEventListener('click', showAuthModal);
  if (startJourneyBtn) startJourneyBtn.addEventListener('click', showAuthModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', hideAuthModal);
  if (authToggle) authToggle.addEventListener('click', toggleAuthMode);
  if (authForm) authForm.addEventListener('submit', handleSubmit);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      hideAuthModal();
    }
  });
  
  // Check if user is already logged in
  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // User is logged in
        if (loginBtn) {
          loginBtn.textContent = 'Dashboard';
          loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/dashboard.html';
          });
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };
  
  checkAuth();
}