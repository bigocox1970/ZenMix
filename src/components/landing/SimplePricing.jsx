import React, { useState } from 'react';
import FeatureComparisonModal from './FeatureComparisonModal';

const SimplePricing = () => {
  const handleSignupClick = (e) => {
    e.preventDefault();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  
  return (
    <section id="pricing" className="py-24 relative bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10"></div>
      <div className="glow top-20 left-1/4 opacity-40"></div>
      <div className="glow bottom-20 right-1/4 opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-6 gradient-text">Simple, Transparent Pricing</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Choose the plan that fits your meditation journey. All plans include access to our core features.
          </p>
          
          <div className="inline-flex items-center bg-white/5 p-1 rounded-full mb-8">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingPeriod === 'annual' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setBillingPeriod('annual')}
            >
              Annual <span className="text-green-400 ml-1">Save 44%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-bold">£0</span>
                <span className="text-gray-400 ml-1">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Basic sound library</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Simple audio mixing</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Basic meditation timer</span>
              </li>
              <li className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Advanced EQ controls</span>
              </li>
              <li className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>AI recommendations</span>
              </li>
            </ul>
            
            <a 
              href="/auth.html?login=true"
              className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-full border border-white/10 transition-all duration-300 inline-block text-center"
            >
              Get Started
            </a>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-purple-500/30 shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 transform scale-105">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="text-center mb-6 relative">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="flex justify-center items-baseline">
                {billingPeriod === 'monthly' ? (
                  <>
                    <span className="text-5xl font-bold gradient-text">£5.99</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-bold gradient-text">£39.99</span>
                    <span className="text-gray-400 ml-1">/year</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-400 line-through">
                {billingPeriod === 'monthly' ? 'Was £7.99/month' : 'Was £71.88/year'}
              </div>
              {billingPeriod === 'annual' && (
                <div className="text-sm text-green-400 mt-1">Save over 44%</div>
              )}
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Full sound library</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Advanced audio mixing</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Advanced meditation timer</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">10-band EQ controls</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">AI recommendations</span>
              </li>
            </ul>
            
            <a 
              href="/auth.html?login=true"
              className="w-full gradient-button py-3 inline-block text-center"
            >
              Start Free Trial
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">14-day free trial, cancel anytime</p>
          </div>
          
          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="flex justify-center items-baseline">
                {billingPeriod === 'monthly' ? (
                  <>
                    <span className="text-5xl font-bold">£7.99</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-bold">£59.99</span>
                    <span className="text-gray-400 ml-1">/year</span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-400 line-through">
                {billingPeriod === 'monthly' ? 'Was £11.99/month' : 'Was £143.88/year'}
              </div>
              {billingPeriod === 'annual' && (
                <div className="text-sm text-green-400 mt-1">Save over 37%</div>
              )}
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Everything in Premium</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Exclusive Pro sounds</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Custom binaural beats</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Priority support</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-300">Early access to new features</span>
              </li>
            </ul>
            
            <a 
              href="/auth.html?login=true"
              className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-full border border-white/10 transition-all duration-300 inline-block text-center"
            >
              Start Free Trial
            </a>
            <p className="text-xs text-center text-gray-400 mt-2">14-day free trial, cancel anytime</p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">
            All plans include access on all devices, cloud sync, and customer support.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-purple-400 hover:text-purple-300 transition-colors underline cursor-pointer"
          >
            View full feature comparison
          </button>
          
          <FeatureComparisonModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      </div>
    </section>
  );
};

export default SimplePricing;
