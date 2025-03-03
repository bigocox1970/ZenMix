import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const TermsPage = () => {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Terms of Service</h1>
            
            <div className="bg-card rounded-xl p-8 mb-8">
              <p className="text-gray-300 mb-6">
                Last updated: June 1, 2025
              </p>
              
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-300 mb-6">
                Welcome to ZenMix by Medit8. These Terms of Service ("Terms") govern your use of our website and mobile application (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">2. Accounts</h2>
              <p className="text-gray-300 mb-6">
                When you create an account with us, you guarantee that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
              </p>
              <p className="text-gray-300 mb-6">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">3. Intellectual Property</h2>
              <p className="text-gray-300 mb-6">
                The Service and its original content, features, and functionality are and will remain the exclusive property of ZenMix by Medit8 and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ZenMix by Medit8.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">4. Subscription</h2>
              <p className="text-gray-300 mb-6">
                Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select. At the end of each period, your subscription will automatically renew under the exact same conditions unless you cancel it or ZenMix by Medit8 cancels it.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-gray-300 mb-6">
                In no event shall ZenMix by Medit8, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
              <p className="text-gray-300 mb-6">
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </div>
            
            <div className="text-center">
              <Link to="/" className="gradient-button inline-block">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsPage;
