import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import MobileNavigation from '../components/MobileNavigation.jsx';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('User is already logged in');
    }
  }, [user]);

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
    );
  };

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
            
            {/* Feature 3 */}
            <div className="feature-card p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                    <path d="M12 8V12L15 15" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Custom Timers</h3>
                  <p className="text-gray-400">
                    Set timers to control the guided meditation and background sounds to transition
                    smoothly through your practice.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="feature-card p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                    <path d="M12 8V16M8 10L16 14" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Sound Recommendations</h3>
                  <p className="text-gray-400">
                    Receive personalized sound combinations based on your mood, goals, and previous
                    meditation sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Advanced Features section
  const AdvancedFeatures = () => {
    return (
      <section className="py-20 relative bg-dark">
        <div className="glow top-20 left-1/4"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold mb-6">Powerful Audio Tools for Deeper Meditation</h2>
              <p className="text-gray-300 mb-8">
                Our advanced audio mixing and EQ features give you complete control over your meditation experience. Tailor guided meditations with customizable voice levels, background sounds, and binaural beats to create the perfect environment for your mindfulness.
              </p>
              
              <div className="space-y-6">
                {/* Advanced Feature 1 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z" fill="#646cff"/>
                      <path d="M12 8V12L15 15" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Advanced Equalizer</h3>
                    <p className="text-gray-400">Precisely adjust a 10-band equalizer to create the perfect balance for your meditation soundscape.</p>
                  </div>
                </div>
                
                {/* Advanced Feature 2 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                      <path d="M8 12H16M12 8V16" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Custom Audio Mixing</h3>
                    <p className="text-gray-400">Independently control your choice of ambient sounds with precise volume adjustments.</p>
                  </div>
                </div>
                
                {/* Advanced Feature 3 */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                      <path d="M12 8V16M8 10L16 14" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Binaural Beats</h3>
                    <p className="text-gray-400">Access scientifically designed binaural beats to enhance focus and deepen your meditation state.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-purple-700/30 rounded-full w-64 h-64 flex items-center justify-center animate-pulse-slow">
                  <div className="bg-purple-700/50 rounded-full w-48 h-48 flex items-center justify-center">
                    <div className="bg-purple-700 rounded-full w-32 h-32 flex items-center justify-center text-white">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="white" fillOpacity="0.2"/>
                        <path d="M10 8L16 12L10 16V8Z" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-lg">
                  <div className="text-center">
                    <h4 className="font-medium text-white">Morning Calm</h4>
                    <p className="text-xs text-gray-400">Meditation • 10:30</p>
                  </div>
                  <div className="mt-2">
                    <div className="h-1 bg-gray-700 rounded-full w-full">
                      <div className="h-1 bg-primary rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>3:10</span>
                      <span>10:30</span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button className="bg-primary/20 hover:bg-primary/30 p-2 rounded-full transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                        <path d="M10 8L16 12L10 16V8Z" fill="#646cff"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // About section component
  const AboutSection = () => {
    return (
      <section id="about-section" className="py-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">About ZenMix</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-300 mb-6">
              ZenMix by Medit8 was created by a team of meditation enthusiasts and audio engineers who wanted to bring
              a new level of personalization to meditation practice.
            </p>
            <p className="text-gray-300 mb-6">
              Our mission is to help people find their perfect meditation soundscape, allowing for deeper focus,
              relaxation, and mindfulness through customized audio experiences.
            </p>
            <p className="text-gray-300">
              With ZenMix, you're in control of your meditation journey, with tools designed to enhance your practice
              and help you achieve your wellness goals.
            </p>
          </div>
        </div>
      </section>
    );
  };

  // Experience section component
  const ExperienceSection = () => {
    return (
      <section id="experience-section" className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text">The ZenMix Experience</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Sounds</h3>
                <p className="text-gray-400">Select from our library of ambient sounds, music, and guided meditations.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Mix & Customize</h3>
                <p className="text-gray-400">Adjust volumes, EQ settings, and timers to create your perfect mix.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
                <p className="text-gray-400">Save your favorite mixes and share them with the ZenMix community.</p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleSignupClick}
                className="gradient-button"
              >
                Experience ZenMix Today
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Begin Your Meditation Journey Today section
  const JourneySection = () => {
    return (
      <section className="py-20 relative bg-gradient-to-b from-dark to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Begin Your Meditation Journey Today</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Experience meditation like never before with ZenMix custom audio mixing, advanced EQ controls, and personalized recommendations.
          </p>
          <button 
            onClick={handleSignupClick}
            className="gradient-button text-lg px-8 py-3"
          >
            Start Free Trial
          </button>
          <p className="text-sm text-gray-400 mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </section>
    );
  };

  // Testimonials section
  const TestimonialsSection = () => {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">S</span>
                </div>
                <div>
                  <h3 className="font-semibold">Sarah K.</h3>
                  <p className="text-sm text-gray-400">Premium User</p>
                </div>
              </div>
              <p className="text-gray-300">
                "ZenMix has transformed my meditation practice. The ability to customize my soundscape has helped me achieve deeper focus than ever before."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-card p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">M</span>
                </div>
                <div>
                  <h3 className="font-semibold">Michael T.</h3>
                  <p className="text-sm text-gray-400">Pro User</p>
                </div>
              </div>
              <p className
