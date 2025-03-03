import React from 'react';

const SimpleAdvancedFeatures = () => {
  return (
    <section className="py-24 relative bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10"></div>
      <div className="glow top-20 left-1/4 opacity-40"></div>
      <div className="glow bottom-20 right-1/4 opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 mb-10 md:mb-0 order-2 md:order-1">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-medium text-white text-lg">Morning Calm</h4>
                    <p className="text-sm text-gray-400">Meditation • 10:30</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-full">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="white" fillOpacity="0.1"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="white"/>
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[40, 60, 75, 50, 65, 80, 45, 70, 55, 60].map((height, index) => (
                    <div key={index} className="flex items-end h-24">
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm" 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Rain</span>
                      <span className="text-sm text-gray-400">70%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Ocean Waves</span>
                      <span className="text-sm text-gray-400">50%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Binaural Beats</span>
                      <span className="text-sm text-gray-400">30%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Powerful Audio Tools for Deeper Meditation</h2>
            <p className="text-gray-300 text-lg mb-8">
              Our advanced audio mixing and EQ features give you complete control over your meditation experience. Tailor guided meditations with customizable voice levels, background sounds, and binaural beats.
            </p>
            
            <div className="space-y-8">
              {/* Advanced Feature 1 */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-xl">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z" fill="#646cff"/>
                    <path d="M12 8V12L15 15" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Equalizer</h3>
                  <p className="text-gray-400">Precisely adjust a 10-band equalizer to create the perfect balance for your meditation soundscape.</p>
                </div>
              </div>
              
              {/* Advanced Feature 2 */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-xl">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                    <path d="M8 12H16M12 8V16" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Custom Audio Mixing</h3>
                  <p className="text-gray-400">Independently control your choice of ambient sounds with precise volume adjustments.</p>
                </div>
              </div>
              
              {/* Advanced Feature 3 */}
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 rounded-xl">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fillOpacity="0.2"/>
                    <path d="M12 8V16M8 10L16 14" stroke="#646cff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Binaural Beats</h3>
                  <p className="text-gray-400">Access scientifically designed binaural beats to enhance focus and deepen your meditation state.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleAdvancedFeatures;
