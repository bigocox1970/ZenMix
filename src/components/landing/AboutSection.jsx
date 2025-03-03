import React from 'react';

const AboutSection = () => {
  return (
    <section id="about-section" className="py-20 relative bg-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">About ZenMix</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-300 mb-6">
            ZenMix by Medit8 was created by a team of meditation enthusiasts and audio engineers who wanted to bring
            a new level of personalization to meditation practice.
          </p>
          <p className="text-gray-300 mb-6">
            Our mission is to help people find their perfect meditation soundscape, allowing for deeper focus,
            relaxation, and mindfulness through customized audio experiences.
          </p>
          <p className="text-gray-300">
            With ZenMix, you're in control of your meditation journey, with tools designed to enhance your practice
            and help you achieve your wellness goals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
