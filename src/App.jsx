import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import CookiesPage from './pages/CookiesPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import AIGeneratorPage from './pages/AIGeneratorPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import PlayerPage from './pages/PlayerPage.jsx';
import AudioPlayerPage from './pages/AudioPlayerPage.jsx';
import SimplePlayer from './pages/SimplePlayer.jsx';
import TestPlayer from './pages/TestPlayer.jsx';
import TestUpload from './pages/TestUpload.jsx';
import MixerPage from './pages/MixerPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage isLoginMode={true} />} />
          <Route path="/signup" element={<AuthPage isLoginMode={false} />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-generator" 
            element={
              <ProtectedRoute>
                <AIGeneratorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mixer" 
            element={
              <ProtectedRoute>
                <MixerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/player" 
            element={
              <ProtectedRoute>
                <PlayerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/audio-player" 
            element={
              <ProtectedRoute>
                <AudioPlayerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/simple-player" 
            element={
              <ProtectedRoute>
                <SimplePlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test-player" 
            element={
              <ProtectedRoute>
                <TestPlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test-upload" 
            element={
              <ProtectedRoute>
                <TestUpload />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </SupabaseProvider>
  );
}

export default App;