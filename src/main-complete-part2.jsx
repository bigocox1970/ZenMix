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
                  <Link 
                    to={isLoginMode ? "/signup" : "/login"}
                    onClick={() => {
                      setError('')
                      setSuccessMessage('')
                    }}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    {isLoginMode 
                      ? "Don't have an account? Sign Up" 
                      : "Already have an account? Sign In"}
                  </Link>
                </div>
              </form>
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/" className="text-gray-400 hover:text-white text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

// Dashboard component
function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error signing out. Please try again.')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
          
          <div className="bg-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="mb-4">
              <p className="text-gray-300">Email: {user.email}</p>
              <p className="text-gray-300">User ID: {user.id}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="gradient-button py-2 px-4"
            >
              Sign Out
            </button>
          </div>
          
          <div className="bg-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Audio Mixer</h2>
            <div className="text-center py-8">
              <div className="bg-dark/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <p className="text-gray-400 mb-4">Audio mixer functionality is coming soon!</p>
              <p className="text-gray-400 mb-4">We're working to bring you an enhanced experience.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

// Main App component with routes
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
