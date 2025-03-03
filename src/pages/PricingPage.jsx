import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (user) {
      // In a real app, this would redirect to a payment processor
      alert(`You selected the ${plan} plan. In a real app, this would redirect to payment.`);
    } else {
      navigate('/');
      // In a real app, this would open the auth modal with a callback to redirect back to pricing
    }
  };

  return (
    <>
      <Header 
        onLoginClick={() => user ? navigate('/dashboard') : navigate('/')} 
        isLoggedIn={!!user}
      />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Choose Your Plan</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Select the perfect plan for your meditation journey. All plans include access to our core features with different levels of customization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold mb-2">Free</h2>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm">Perfect for beginners</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">5 basic sounds</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Basic mixer</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Session timer</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-gray-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="text-gray-500">No saved sessions</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handleSubscribe('Free')}
                  className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-card rounded-xl overflow-hidden transform scale-105 shadow-lg border border-primary/30">
              <div className="bg-primary/10 p-2 text-center">
                <span className="text-primary text-sm font-medium">Most Popular</span>
              </div>
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold mb-2">Premium</h2>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">$9.99</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm">For dedicated meditators</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">All 50+ sounds</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Advanced mixer & EQ</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Unlimited saved sessions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">AI recommendations</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handleSubscribe('Premium')}
                  className="w-full py-2 px-4 gradient-button rounded-lg"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold mb-2">Pro</h2>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold">$19.99</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <p className="text-gray-400 text-sm">For meditation professionals</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Everything in Premium</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Custom sound uploads</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Client sharing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">Priority support</span>
                  </li>
                </ul>
                <button 
                  onClick={() => handleSubscribe('Pro')}
                  className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6 text-left">
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-300">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
              </div>
              
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Is there a free trial available?</h3>
                <p className="text-gray-300">Yes, we offer a 7-day free trial for our Premium plan so you can experience all the features before committing.</p>
              </div>
              
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-300">We accept all major credit cards, PayPal, and Apple Pay for subscription payments.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;
