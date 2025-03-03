import React from 'react';

const SimpleHero = () => {
const scrollToSection = (e, sectionId) => {
  e.preventDefault();
  console.log('Scrolling to section:', sectionId);
  
  // Give the DOM a moment to ensure all elements are rendered
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    console.log('Found section:', section);
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      console.log('Scrolled to section');
    } else {
      console.log('Section not found');
      
      // Fallback: try to find the section by its class name or other attributes
      const fallbackSection = document.querySelector(`section[id="${sectionId}"]`);
      console.log('Fallback section:', fallbackSection);
      
      if (fallbackSection) {
        fallbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log('Scrolled to fallback section');
      } else {
        // If all else fails, just scroll down a bit
        window.scrollBy({
          top: window.innerHeight,
          behavior: 'smooth'
        });
        console.log('Fallback: scrolled down one page height');
      }
    }
  }, 100);
};
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-black to-gray-900">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/public/hero-bg-pattern.svg')] opacity-20"></div>
      <div className="glow top-40 left-20"></div>
      <div className="glow bottom-20 right-20"></div>
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-left mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text leading-tight">
            Transform Your Meditation Experience
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            ZenMix by Medit8 helps you create the perfect meditation environment with customizable audio mixing, 
            advanced EQ controls, and a library of ambient sounds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a 
              href="#pricing" 
              onClick={(e) => scrollToSection(e, 'pricing')} 
              className="gradient-button text-lg px-8 py-3 inline-block text-center"
            >
              Get Started Free
            </a>
            
            <a 
              href="#features" 
              onClick={(e) => scrollToSection(e, 'features')}
              className="gradient-button text-lg px-8 py-3 inline-block text-center"
            >
              Learn More
            </a>
          </div>
          
          <p className="text-sm text-gray-400">No credit card required • Cancel anytime</p>
        </div>
        
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"></div>
            
            <div className="app-preview rounded-xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
              <img
                src="/screen-shots/Capture3.PNG"
                alt="ZenMix App Interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;
