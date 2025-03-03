import React, { useState, useRef, useEffect } from 'react';

const SimpleTestimonials = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Premium User',
      text: 'ZenMix has transformed my meditation practice. The ability to customize my soundscape has helped me achieve deeper focus than ever before.',
      rating: 5
    },
    {
      name: 'Michael T.',
      role: 'Meditation Teacher',
      text: 'As a meditation instructor, I use ZenMix to create custom sessions for my clients. The EQ controls and timer features are absolutely essential for my work.',
      rating: 5
    },
    {
      name: 'Jamie L.',
      role: 'Premium User',
      text: 'The AI recommendations feature is incredible. It somehow knows exactly what sounds I need based on my mood. I've discovered combinations I never would have tried.',
      rating: 5
    },
    {
      name: 'Alex W.',
      role: 'Pro User',
      text: 'Being able to save and share my meditation mixes with the community has been amazing. I love seeing how others adapt and build upon my combinations.',
      rating: 5
    },
    {
      name: 'Emma R.',
      role: 'Beginner',
      text: 'As someone new to meditation, ZenMix made it so much easier to get started. The guided sessions and ambient sounds helped me establish a regular practice.',
      rating: 5
    },
    {
      name: 'David P.',
      role: 'Wellness Coach',
      text: 'I recommend ZenMix to all my clients. The customization options and high-quality audio make it stand out from other meditation apps.',
      rating: 5
    },
    {
      name: 'Sophie M.',
      role: 'Premium User',
      text: 'The binaural beats feature has completely changed my meditation experience. I can achieve deep states of focus much faster now.',
      rating: 5
    },
    {
      name: 'Chris B.',
      role: 'Pro User',
      text: 'The sound quality is exceptional, and the mixing capabilities are professional grade. Worth every penny of the Pro subscription.',
      rating: 5
    }
  ];
  
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };
  
  return (
    <section id="testimonials" className="py-24 relative bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('/public/testimonials-bg-pattern.svg')] opacity-10"></div>
      <div className="glow bottom-20 left-1/4 opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 gradient-text">What Our Users Say</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Join thousands of meditators who have transformed their practice with ZenMix.
          </p>
        </div>
        
        <div className="relative max-w-[1200px] mx-auto">
          {showLeftArrow && (
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {showRightArrow && (
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 pt-2 px-4 snap-x scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style>
              {`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[350px] snap-center bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold gradient-text">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-lg mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {[0, 1, 2].map((dot) => (
                <button
                  key={dot}
                  onClick={() => {
                    if (scrollContainerRef.current) {
                      const scrollAmount = dot * (350 * 3); // Width of 3 testimonials
                      scrollContainerRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                    }
                  }}
                  className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/50 transition-all"
                  aria-label={`Go to testimonial group ${dot + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleTestimonials;