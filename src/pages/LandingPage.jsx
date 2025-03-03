import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import AdvancedFeaturesSection from '../components/landing/AdvancedFeaturesSection';
import AboutSection from '../components/landing/AboutSection';
import ExperienceSection from '../components/landing/ExperienceSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  const handleSignupClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header 
        onLoginClick={handleLoginClick} 
        isLoggedIn={!!user}
      />
      <main>
        <HeroSection 
          handleLoginClick={handleLoginClick} 
          handleSignupClick={handleSignupClick} 
        />
        <div id="features">
          <FeaturesSection />
          <AdvancedFeaturesSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
        <div id="experience">
          <ExperienceSection handleSignupClick={handleSignupClick} />
        </div>
        <div id="pricing">
          <CTASection handleSignupClick={handleSignupClick} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;