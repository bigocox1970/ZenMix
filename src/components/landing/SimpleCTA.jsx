import React from 'react';

const SimpleCTA = () => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="py-24 relative bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-30"></div>
      <div className="glow top-20 left-1/3 opacity-40"></div>
      <div className="glow bottom-20 right-1/3 opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border border-white/10 shadow-2xl max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-2/3">
              <h2 className="text-4xl font-bold mb-6 gradient-text">Ready to Transform Your Meditation?</h2>
              <p className="text-gray-300 text-lg mb-8">
                Join thousands of meditators who have elevated their practice with ZenMix.
                Start your journey today and experience the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#pricing" 
                  onClick={(e) => scrollToSection(e, 'pricing')}
                  className="gradient-button text-lg px-8 py-3 inline-block text-center"
                >
                  Get Started for Free
                </a>
                <a 
                  href="#pricing" 
                  onClick={(e) => scrollToSection(e, 'pricing')}
                  className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full border border-white/20 transition-all duration-300 inline-block text-center"
                >
                  View Pricing
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
            </div>
            
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full w-48 h-48 flex items-center justify-center p-4 border border-white/10">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full w-full h-full flex items-center justify-center">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="white" fillOpacity="0.1"/>
                      <path d="M10 8L16 12L10 16V8Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleCTA;
