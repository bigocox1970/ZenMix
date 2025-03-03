import React from 'react';

const SimpleAbout = () => {
  return (
    <section id="about" className="py-24 relative bg-gradient-to-b from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('/public/about-bg-pattern.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
              <img
                src="/screen-shots/Capture9.JPG"
                alt="ZenMix Sound Players"
                className="rounded-2xl border border-white/10 shadow-2xl w-full"
              />
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6 gradient-text">About ZenMix</h2>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg">
                ZenMix by Medit8 was created by a team of meditation enthusiasts and audio engineers who wanted to bring
                a new level of personalization to meditation practice.
              </p>
              <p className="text-gray-300 text-lg">
                Our mission is to help people find their perfect meditation soundscape, allowing for deeper focus,
                relaxation, and mindfulness through customized audio experiences.
              </p>
              <p className="text-gray-300 text-lg">
                With ZenMix, you're in control of your meditation journey, with tools designed to enhance your practice
                and help you achieve your wellness goals.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <span className="text-lg font-semibold gradient-text">10,000+</span>
                <span className="text-gray-400 ml-2">Active Users</span>
              </div>
              <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <span className="text-lg font-semibold gradient-text">500+</span>
                <span className="text-gray-400 ml-2">Sound Samples</span>
              </div>
              <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10">
                <span className="text-lg font-semibold gradient-text">4.8/5</span>
                <span className="text-gray-400 ml-2">User Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleAbout;