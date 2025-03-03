import React from 'react';
import SimpleHeader from '../components/landing/SimpleHeader';
import SimpleHero from '../components/landing/SimpleHero';
import SimpleFeatures from '../components/landing/SimpleFeatures';
import SimpleAdvancedFeatures from '../components/landing/SimpleAdvancedFeatures';
import SimpleAbout from '../components/landing/SimpleAbout';
import SimpleExperience from '../components/landing/SimpleExperience';
import SimpleTestimonials from '../components/landing/SimpleTestimonials';
import SimplePricing from '../components/landing/SimplePricing';
import SimpleCTA from '../components/landing/SimpleCTA';
import SimpleFooter from '../components/landing/SimpleFooter';

const SimpleLandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <SimpleHeader />
      <main>
        <SimpleHero />
        <SimpleFeatures />
        <SimpleAdvancedFeatures />
        <SimpleAbout />
        <SimpleExperience />
        <SimpleTestimonials />
        <SimplePricing />
        <SimpleCTA />
      </main>
      <SimpleFooter />
    </div>
  );
};

export default SimpleLandingPage;
