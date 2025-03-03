import React from 'react';

const ExperienceSection = ({ handleSignupClick }) => {
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

export default ExperienceSection;
