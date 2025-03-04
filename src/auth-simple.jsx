import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import './index.css'

// Initialize Supabase client with environment variables or fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
// Log the Supabase configuration for debugging
console.log('Auth: Initializing Supabase with URL:', supabaseUrl)
console.log('Auth: Environment variables available:', !!import.meta.env.VITE_SUPABASE_URL)

// Create the Supabase client with additional options for Netlify deployment
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Simple App component with navigation
function App() {
  const [currentPage, setCurrentPage] = React.useState('landing') // 'landing', 'login', 'signup', 'dashboard'
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  // We'll use currentPage instead of isLoginMode
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState(null)

  // Check URL for signup or login parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const signupParam = urlParams.get('signup');
    const loginParam = urlParams.get('login');
    console.log('Auth: URL parameters -', { signup: signupParam, login: loginParam })
    if (signupParam === 'true') {
      setCurrentPage('signup');
    } else if (loginParam === 'true') {
      setCurrentPage('login');
    }
  }, []);

  // Check if user is already logged in
  React.useEffect(() => {
    async function getUser() {
      try {
        console.log('Auth: Checking for existing session')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth: Error getting session:', error)
          setLoading(false)
          return
        }
        
        console.log('Auth: Session data:', data)
        const currentUser = data.session?.user || null
        setUser(currentUser)
        
        // If user is logged in, redirect to dashboard
        if (currentUser && currentPage !== 'dashboard') {
          console.log('Auth: User is logged in, redirecting to dashboard')
          setCurrentPage('dashboard')
        }
        
        setLoading(false)
        
        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth: State changed:', event, session)
            const updatedUser = session?.user || null
            setUser(updatedUser)
            
            // Handle sign in and sign out events
            if (event === 'SIGNED_IN' && updatedUser) {
              setCurrentPage('dashboard')
            } else if (event === 'SIGNED_OUT') {
              setCurrentPage('landing')
            }
          }
        )
        
        return () => {
          authListener?.subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Auth: Unexpected error in getUser:', err)
        setLoading(false)
      }
    }
    
    getUser()
  }, [currentPage])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset messages
    setError(null)
    setSuccessMessage(null)
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all required fields')
      return
    }
    
    // For signup, validate password confirmation
    const isLoginMode = currentPage === 'login'
    if (!isLoginMode) {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
    }
    
    try {
      if (currentPage === 'login') {
        // Login flow
        console.log('Auth: Attempting to sign in with:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        console.log('Auth: Sign in result:', { data, error })
        
        if (error) throw error
        
        if (data?.user) {
          console.log('Auth: Login successful, redirecting to dashboard')
          setCurrentPage('dashboard')
        } else {
          console.log('Auth: Login response had no user:', data)
          setError('Login failed - no user returned')
        }
      } else {
        // Sign up flow
        console.log('Auth: Attempting to sign up with:', email)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Add the current site URL as a redirect URL
            emailRedirectTo: window.location.origin + '/auth.html?login=true'
          }
        })
        
        console.log('Auth: Sign up result:', { data, error })
        
        if (error) throw error
        
        if (data?.user) {
          console.log('Auth: Signup successful, user created:', data.user.id)
          
          // Create profile for the user
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, email: email }])
            
            if (profileError && profileError.code !== '23505') {
              console.error('Auth: Error creating profile:', profileError)
            } else {
              console.log('Auth: Profile created successfully or already exists')
            }
          } catch (profileErr) {
            console.error('Auth: Exception creating profile:', profileErr)
          }
          
          // Check if email confirmation is required
          if (data.session) {
            // User is automatically signed in
            console.log('Auth: User is automatically signed in, redirecting to dashboard')
            setCurrentPage('dashboard')
          } else {
            // Email confirmation required
            console.log('Auth: Email confirmation may be required')
            setSuccessMessage(
              'Account created successfully! ' + 
              (data.user.email_confirmed_at 
                ? 'You can now log in.' 
                : 'Please check your email to confirm your account.')
            )
            
            // Switch to login mode
            setCurrentPage('login')
            setPassword('')
            setConfirmPassword('')
          }
        } else {
          console.log('Auth: Signup response had no user:', data)
          setError('Signup failed - no user returned')
        }
      }
    } catch (err) {
      console.error('Auth: Error during authentication:', err)
      setError(err.message || 'Authentication failed')
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    console.log('Auth: Signing out')
    await supabase.auth.signOut()
    // Redirect to the new landing page
    window.location.href = '/'
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Navigation functions
  const goToLanding = () => setCurrentPage('landing')
  const goToLogin = () => setCurrentPage('login')
  const goToSignup = () => setCurrentPage('signup')

  // Dashboard page
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
              <span className="text-white font-semibold text-xl">ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">{user?.email}</span>
              <button 
                onClick={handleSignOut}
                className="bg-transparent hover:bg-primary/10 text-white px-4 py-1.5 rounded-full border border-primary transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Recent Sessions */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
                <div className="text-gray-400 text-center py-8">
                  <p>You haven't created any meditation sessions yet.</p>
                  <button className="gradient-button mt-4">Create Your First Mix</button>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                <div className="space-y-4">
                  <div className="bg-dark/50 p-4 rounded-lg">
                    <h3 className="font-medium">Morning Calm</h3>
                    <p className="text-gray-400 text-sm">Start your day with gentle sounds and guided breathing</p>
                  </div>
                  <div className="bg-dark/50 p-4 rounded-lg">
                    <h3 className="font-medium">Deep Focus</h3>
                    <p className="text-gray-400 text-sm">Ambient sounds designed to enhance concentration</p>
                  </div>
                  <div className="bg-dark/50 p-4 rounded-lg">
                    <h3 className="font-medium">Evening Wind Down</h3>
                    <p className="text-gray-400 text-sm">Prepare for sleep with calming tones</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Audio Mixer</h2>
              <div className="text-center py-8">
                <div className="bg-dark/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                </div>
                <p className="text-gray-400 mb-4">Audio mixer functionality is coming soon!</p>
                <p className="text-gray-400 mb-4">We're working to bring you an enhanced experience.</p>
                <button className="gradient-button">Get Notified When Ready</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Landing page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
              <span className="text-white font-semibold text-xl">ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span></span>
            </div>
            <div>
              <button 
                onClick={goToLogin}
                className="bg-transparent hover:bg-primary/10 text-white px-4 py-1.5 rounded-full border border-primary transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        </header>

        <main>
          <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="glow top-40 left-20"></div>
            <div className="glow bottom-20 right-20"></div>
            
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Transform Your Meditation</h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text-reversed">With Custom Audio Mixing</h2>
              
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                ZenMix by Medit8 helps you create the perfect meditation experience
                with customizable audio mixing, EQ controls, and background sounds.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button 
                  onClick={goToSignup}
                  className="gradient-button"
                >
                  Start Your Journey
                </button>
                
                <button 
                  onClick={goToLogin}
                  className="bg-transparent hover:bg-primary/10 text-white px-6 py-2 rounded-full border border-primary transition-all duration-300"
                >
                  Sign In
                </button>
              </div>
              
              <div className="relative max-w-xl mx-auto mt-12">
                <div className="app-preview rounded-xl overflow-hidden">
                  <img 
                    src="screen-shots/Capture3.PNG" 
                    alt="ZenMix App Interface" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

  // Auth form (login or signup)
  const isLoginMode = currentPage === 'login'
  return (
    <div className="container mx-auto px-4 py-8">
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
              className="w-full gradient-button py-3 mb-4"
            >
              {isLoginMode ? 'Sign In' : 'Create Account'}
            </button>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={() => {
                  setCurrentPage(isLoginMode ? 'signup' : 'login')
                  setError(null)
                  setSuccessMessage(null)
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
        
        <div className="mt-8 text-center">
          <a 
            href="/"
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
