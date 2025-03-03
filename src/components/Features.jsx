import React from 'react';

const Features = () => {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Elevate Your Meditation</h2>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-16">
          Discover features designed to transform your meditation practice and create a deeply
          personalized experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Feature 1 */}
          <div className="feature-card p-6 rounded-xl">
            <div className="flex items-start space-x-4">
              <img src="/feature-audio.svg" alt="Audio Mixing" className="w-10 h-10" />
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
              <img src="/feature-equalizer.svg" alt="Equalizer" className="w-10 h-10" />
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
              <img src="/feature-timer.svg" alt="Timer" className="w-10 h-10" />
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
              <img src="/feature-ai.svg" alt="AI" className="w-10 h-10" />
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

export default Features;