import React from 'react';

const AdvancedFeaturesSection = () => {
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

export default AdvancedFeaturesSection;
