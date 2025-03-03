import React from 'react';

const FeaturesSection = () => {
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

export default FeaturesSection;
