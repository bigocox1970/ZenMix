import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import './index.css'

// Initialize Supabase client
const supabaseUrl = 'https://avrtzsptvuknahqkzqie.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cnR6c3B0dnVrbmFocWt6cWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDg0NzYsImV4cCI6MjA1NjQyNDQ3Nn0.K6XCgkIqbPn1txPaPdPU6U4OkQ7j0u63RXTNJYNLD-0'
const supabase = createClient(supabaseUrl, supabaseKey)

// Create Auth Context
const AuthContext = React.createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user || null)
      } catch (error) {
        console.error('Error checking auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session)
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Auth functions
  const signUp = async (email, password) => {
    console.log('AuthContext: signUp called with email:', email)
    try {
      console.log('AuthContext: Calling supabase.auth.signUp')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      console.log('AuthContext: signUp response:', { data, error })
      
      if (error) {
        console.error('AuthContext: Supabase signUp error:', error)
        throw error
      }
      
      // If successful, check if profile exists, if not create one
      if (data?.user) {
        console.log('AuthContext: User created, checking/creating profile for user ID:', data.user.id)
        try {
          // First check if profile exists
          const { data: profileData, error: profileCheckError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
            
          if (profileCheckError && profileCheckError.code !== 'PGRST116') {
            // If error is not "no rows returned", log it
            console.error('AuthContext: Error checking profile:', profileCheckError)
          }
          
          if (!profileData) {
            // Profile doesn't exist, create one
            console.log('AuthContext: No profile found, creating one')
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([{ id: data.user.id, email: email }])
            
            if (profileError) {
              // If error is duplicate key, that's fine - profile already exists
              if (profileError.code === '23505') {
                console.log('AuthContext: Profile already exists (created by trigger)')
              } else {
                console.error('AuthContext: Error creating profile:', profileError)
              }
            } else {
              console.log('AuthContext: Profile created successfully')
            }
          } else {
            console.log('AuthContext: Profile already exists:', profileData)
          }
        } catch (profileErr) {
          console.error('AuthContext: Exception handling profile:', profileErr)
        }
      } else {
        console.log('AuthContext: No user in signUp response data:', data)
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('AuthContext: Exception in signUp:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    console.log('AuthContext: signIn called with email:', email)
    try {
      console.log('AuthContext: Calling supabase.auth.signInWithPassword')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      console.log('AuthContext: signIn response:', { data, error })
      
      if (error) {
        console.error('AuthContext: Supabase signIn error:', error)
        throw error
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('AuthContext: Exception in signIn:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    supabase
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Auth hook
function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Header component
function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
          <span className="text-white font-semibold text-xl">ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span></span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <a href="/#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="/#about-section" className="text-gray-300 hover:text-white transition-colors">About</a>
          <a href="/#experience-section" className="text-gray-300 hover:text-white transition-colors">Experience</a>
        </nav>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-transparent hover:bg-primary/10 text-white px-4 py-1.5 rounded-full border border-primary transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-transparent hover:bg-primary/10 text-white px-4 py-1.5 rounded-full border border-primary transition-all duration-300">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

// Footer component
function Footer() {
  return (
    <footer className="bg-dark py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="ZenMix Logo" className="h-8 w-8" />
              <span className="text-white font-semibold text-xl">ZenMix<span className="text-xs text-gray-400 ml-1">by Medit8</span></span>
            </Link>
            <p className="text-gray-400 mt-2 max-w-xs">
              Transform your meditation practice with custom audio mixing and personalized soundscapes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/#features" className="text-gray-400 hover:text-primary">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/#about-section" className="text-gray-400 hover:text-primary">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-primary">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-primary">Terms</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; 2025 Medit8 Technologies. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Landing Page component
function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLoginClick = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }
  
  const handleSignupClick = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/signup')
    }
  }

  // Hero component
  const Hero = () => {
    return (
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
              onClick={handleSignupClick}
              className="gradient-button"
            >
              Start Your Journey
            </button>
            
            <button 
              onClick={handleLoginClick}
              className="bg-transparent hover:bg-primary/10 text-white px-6 py-2 rounded-full border border-primary transition-all duration-300"
            >
              Sign In
            </button>
          </div>
          
          <p className="text-sm text-gray-400 mb-6">Available on all platforms</p>
          
          <div className="flex justify-center space-x-6 mb-16">
            <a href="#" className="store-button app-store">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.0349 12.9779C17.0199 10.3479 19.2799 9.1179 19.3649 9.0679C18.1899 7.3379 16.3149 7.0979 15.6549 7.0779C14.0999 6.9179 12.5949 8.0179 11.8049 8.0179C10.9999 8.0179 9.75488 7.0979 8.43488 7.1279C6.74988 7.1579 5.17488 8.1379 4.29988 9.6879C2.49988 12.8379 3.79988 17.4979 5.52988 19.9779C6.39988 21.1979 7.42488 22.5679 8.77488 22.5079C10.0949 22.4479 10.5849 21.6679 12.1649 21.6679C13.7349 21.6679 14.1949 22.5079 15.5649 22.4679C16.9749 22.4479 17.8649 21.2379 18.6999 20.0079C19.6999 18.5979 20.0999 17.2179 20.1149 17.1579C20.0849 17.1479 17.0549 15.9679 17.0349 12.9779Z" fill="white"/>
                    <path d="M14.7549 5.6379C15.4549 4.7879 15.9149 3.6379 15.7649 2.4679C14.7649 2.5179 13.5149 3.1679 12.7849 3.9979C12.1449 4.7379 11.5849 5.9179 11.7549 7.0679C12.8749 7.1479 14.0249 6.4779 14.7549 5.6379Z" fill="white"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </div>
            </a>
            <a href="#" className="store-button play-store">
              <div className="flex items-center">
                <div className="mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.07992 21.2301C3.75992 21.0801 3.49992 20.8201 3.32992 20.5001C3.14992 20.1801 3.05992 19.8101 3.05992 19.4301V4.57012C3.05992 4.19012 3.14992 3.82012 3.32992 3.50012C3.49992 3.18012 3.75992 2.92012 4.07992 2.77012L13.0599 12.0001L4.07992 21.2301Z" fill="#EA4335"/>
                    <path d="M17.0599 15.9999L5.05992 22.9999C5.32992 23.0599 5.60992 23.0599 5.88992 22.9999C6.16992 22.9399 6.43992 22.8199 6.67992 22.6499L17.9399 16.3799L17.0599 15.9999Z" fill="#FBBC04"/>
                    <path d="M20.9399 11.9999C20.9399 11.5599 20.8199 11.1299 20.5899 10.7599C20.3599 10.3899 20.0299 10.0899 19.6399 9.89988L17.9399 8.99988L16.9399 9.99988L17.9399 10.9999L6.67992 4.72988C6.43992 4.55988 6.16992 4.43988 5.88992 4.37988C5.60992 4.31988 5.32992 4.31988 5.05992 4.37988L17.0599 11.3799L20.5899 13.2399C20.9799 13.0499 21.3099 12.7499 21.5399 12.3799C21.7699 12.0099 21.8899 11.5799 21.8899 11.1399C21.8899 11.0899 21.8899 11.0399 21.8899 10.9999C21.8899 11.0399 21.8899 11.0899 21.8899 11.1399C21.8899 11.5799 21.7699 12.0099 21.5399 12.3799C21.3099 12.7499 20.9799 13.0499 20.5899 13.2399L17.0599 11.3799L13.0599 11.9999L17.0599 12.6199L19.6399 14.0999C20.0299 13.9099 20.3599 13.6099 20.5899 13.2399C20.8199 12.8699 20.9399 12.4399 20.9399 11.9999Z" fill="#4285F4"/>
                    <path d="M5.05992 4.37988C4.78992 4.43988 4.52992 4.55988 4.29992 4.72988C4.06992 4.89988 3.86992 5.11988 3.71992 5.36988L13.0599 11.9999L17.0599 11.3799L5.05992 4.37988Z" fill="#34A853"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </div>
            </a>
          </div>
          
          <div className="relative max-w-xl mx-auto">
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
    )
  }

  // Features component
  const Features = () => {
    return (
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Elevate Your Meditation</h2>
          <p className="text-gray-300 text-center max-w-2xl mx-auto mb-16">
            Discover features designed to transform your meditation practice and create a deeply
            personalized experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="feature-card p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                    <path d="M10 8L16 12L10 16V8Z" fill="#646cff"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Custom Audio Mixing</h3>
                  <p className="text-gray-400">
                    Mix multiple meditation tracks with a library of ambient sounds and music to create
                    your perfect soundscape.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                    <path d="M8 12H16M12 8V16" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Built-In Equalizer</h3>
                  <p className="text-gray-400">
                    Fine-tune your audio experience with a full-featured equalizer that helps you achieve
                    the perfect balance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  )
}

// Auth Page component
function AuthPage() {
  const location = useLocation()
  const [isLoginMode, setIsLoginMode] = React.useState(location.pathname !== '/signup')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState('')
  
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  
  // Update login mode if URL changes
  React.useEffect(() => {
    setIsLoginMode(location.pathname !== '/signup')
  }, [location.pathname])
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset messages
    setError('')
    setSuccessMessage('')
    
    console.log('Form submitted', { isLoginMode, email, password })
    
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
    
    setLoading(true)
    
    try {
      if (isLoginMode) {
        // Login flow
        console.log('Attempting to sign in with:', email)
        const { data, error } = await signIn(email, password)
        console.log('Sign in result:', { data, error })
        
        if (error) throw error
        
        if (data?.user) {
          console.log('Login successful, navigating to dashboard')
          navigate('/dashboard')
        } else {
          console.log('Login response had no user:', data)
          setError('Login failed - no user returned')
        }
      } else {
        // Sign up flow
        console.log('Attempting to sign up with:', email)
        const { data, error } = await signUp(email, password)
        console.log('Sign up result:', { data, error })
        
        if (error) throw error
        
        if (data?.user) {
          console.log('Signup successful, user created:', data.user.id)
          
          // Check if email confirmation is required
          if (data.session) {
            // User is automatically signed in, redirect to dashboard
            console.log('User is automatically signed in, redirecting to dashboard')
            navigate('/dashboard')
          } else {
            // Email confirmation required
            console.log('Email confirmation may be required')
            setSuccessMessage(
              'Account created successfully! ' + 
              (data.user.email_confirmed_at 
                ? 'You can now log in.' 
                : 'Please check your email to confirm your account.')
            )
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
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <img src="/logo.svg" alt="ZenMix Logo" className="h-16 w-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold gradient-text">
                  {isLoginMode ? 'Sign In to ZenMix' : 'Create Your ZenMix Account'}
                </h1>
                <p className="text-
