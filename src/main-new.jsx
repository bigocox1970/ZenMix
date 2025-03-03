import React from 'react'
import ReactDOM from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import './index.css'

// Initialize Supabase client
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDg0NzYsImV4cCI6MjA1NjQyNDQ3Nn0.K6XCgkIqbPn1txPaPdPU6U4OkQ7j0u63RXTNJYNLD-0'
const supabase = createClient(supabaseUrl, supabaseKey)

// Simple App component
function App() {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState(null)
  const [isLoginMode, setIsLoginMode] = React.useState(true)
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState(null)

  // Check if user is already logged in
  React.useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
      
      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('Auth state changed:', event, session)
          setUser(session?.user || null)
        }
      )
      
      return () => {
        authListener?.subscription.unsubscribe()
      }
    }
    
    getUser()
  }, [])

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
      if (isLoginMode) {
        // Login flow
        console.log('Attempting to sign in with:', email)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        console.log('Sign in result:', { data, error })
        
        if (error) throw error
        
        if (data?.user) {
          console.log('Login successful')
          setSuccessMessage('Login successful!')
        } else {
          console.log('Login response had no user:', data)
          setError('Login failed - no user returned')
        }
      } else {
        // Sign up flow
        console.log('Attempting to sign up with:', email)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        console.log('Sign up result:', { data, error })
        
        if (error) throw error
        
        if (data?.user) {
          console.log('Signup successful, user created:', data.user.id)
          
          // Create profile for the user
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, email: email }])
            
            if (profileError && profileError.code !== '23505') {
              console.error('Error creating profile:', profileError)
            } else {
              console.log('Profile created successfully or already exists')
            }
          } catch (profileErr) {
            console.error('Exception creating profile:', profileErr)
          }
          
          // Check if email confirmation is required
          if (data.session) {
            // User is automatically signed in
            console.log('User is automatically signed in')
            setSuccessMessage('Account created and logged in successfully!')
          } else {
            // Email confirmation required
            console.log('Email confirmation may be required')
            setSuccessMessage(
              'Account created successfully! ' + 
              (data.user.email_confirmed_at 
                ? 'You can now log in.' 
                : 'Please check your email to confirm your account.')
            )
            
            // Switch to login mode
            setIsLoginMode(true)
            setPassword('')
            setConfirmPassword('')
          }
        } else {
          console.log('Signup response had no user:', data)
          setError('Signup failed - no user returned')
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message || 'Authentication failed')
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // User is logged in
  if (user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-card rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-4 gradient-text">Welcome!</h1>
          <p className="mb-4">You are logged in as: {user.email}</p>
          <p className="mb-4">User ID: {user.id}</p>
          <button 
            onClick={handleSignOut}
            className="w-full gradient-button py-3"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  // Auth form
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
                  setIsLoginMode(!isLoginMode)
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
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
