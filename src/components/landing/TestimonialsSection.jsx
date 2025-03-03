import React from 'react';

const TestimonialsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Testimonial 1 */}
          <div className="bg-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">S</span>
              </div>
              <div>
                <h3 className="font-semibold">Sarah K.</h3>
                <p className="text-sm text-gray-400">Premium User</p>
              </div>
            </div>
            <p className="text-gray-300">
              "ZenMix has transformed my meditation practice. The ability to customize my soundscape has helped me achieve deeper focus than ever before."
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Testimonial 2 */}
          <div className="bg-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">M</span>
              </div>
              <div>
                <h3 className="font-semibold">Michael T.</h3>
                <p className="text-sm text-gray-400">Pro User</p>
              </div>
            </div>
            <p className="text-gray-300">
              "As a meditation instructor, I use ZenMix to create custom sessions for my clients. The EQ controls and timer features are absolutely essential for my work."
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Testimonial 3 */}
          <div className="bg-card p-6 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">J</span>
              </div>
              <div>
                <h3 className="font-semibold">Jamie L.</h3>
                <p className="text-sm text-gray-400">Premium User</p>
              </div>
            </div>
            <p className="text-gray-300">
              "The AI recommendations feature is incredible. It somehow knows exactly what sounds I need based on my mood. I've discovered combinations I never would have tried."
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
