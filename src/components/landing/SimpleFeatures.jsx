import React from 'react';

const SimpleFeatures = () => {
  return (
    <section id="features" className="py-24 relative bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">Elevate Your Meditation</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover features designed to transform your meditation practice and create a deeply
            personalized experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature cards */}
          <div className="feature-card rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
              <img src="/feature-audio.svg" alt="Audio Mixing" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Custom Audio Mixing</h3>
            <p className="text-gray-400">
              Mix and match from our library of ambient sounds to create your perfect meditation backdrop.
            </p>
          </div>
          
          <div className="feature-card rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
              <img src="/feature-equalizer.svg" alt="Equalizer" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Advanced Equalizer</h3>
            <p className="text-gray-400">
              Fine-tune your audio experience with our professional-grade equalizer controls.
            </p>
          </div>
          
          <div className="feature-card rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
              <img src="/feature-timer.svg" alt="Timer" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Meditation Timer</h3>
            <p className="text-gray-400">
              Set custom durations with gentle start and end bells to guide your practice.
            </p>
          </div>
          
          <div className="feature-card rounded-xl p-8 text-center hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full">
              <img src="/feature-ai.svg" alt="AI" className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
            <p className="text-gray-400">
              Receive personalized sound mix suggestions based on your preferences and goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleFeatures;