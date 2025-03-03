import React from 'react';

const SimpleExperience = () => {
  return (
    <section id="experience" className="py-24 relative bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10"></div>
      <div className="glow top-20 right-1/4 opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">The ZenMix Experience</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our intuitive platform makes it easy to create, save, and share your perfect meditation soundscapes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 shadow-xl text-center hover:translate-y-[-8px] transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold gradient-text">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Choose Your Sounds</h3>
            <p className="text-gray-400">
              Browse our extensive library of ambient sounds, music tracks, and guided meditations to find your perfect combination.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 shadow-xl text-center hover:translate-y-[-8px] transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold gradient-text">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Mix & Customize</h3>
            <p className="text-gray-400">
              Fine-tune your experience with our advanced audio tools. Adjust volumes, EQ settings, and meditation timers.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 shadow-xl text-center hover:translate-y-[-8px] transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold gradient-text">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-4">Save & Share</h3>
            <p className="text-gray-400">
              Save your favorite mixes to your personal library and share them with the ZenMix community or keep them private.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="#pricing" 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
            }}
            className="gradient-button text-lg px-8 py-3 inline-block"
          >
            Experience ZenMix Today
          </a>
          <p className="text-sm text-gray-400 mt-4">No credit card required • Free 14-day trial</p>
        </div>
      </div>
    </section>
  );
};

export default SimpleExperience;