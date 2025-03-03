import React from 'react';

const CTASection = ({ handleSignupClick }) => {
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

export default CTASection;
