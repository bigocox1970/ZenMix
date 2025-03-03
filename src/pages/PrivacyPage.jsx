import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const PrivacyPage = () => {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Privacy Policy</h1>
            
            <div className="bg-card rounded-xl p-8 mb-8">
              <p className="text-gray-300 mb-6">
                Last updated: June 1, 2025
              </p>
              
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-300 mb-6">
                At ZenMix by Medit8 ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website or use our application and tell you about your privacy rights and how the law protects you.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">2. The Data We Collect</h2>
              <p className="text-gray-300 mb-6">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-6">
                <li className="mb-2">Identity Data includes first name, last name, username or similar identifier.</li>
                <li className="mb-2">Contact Data includes email address and telephone numbers.</li>
                <li className="mb-2">Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li className="mb-2">Usage Data includes information about how you use our website and application.</li>
                <li>Marketing and Communications Data includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Data</h2>
              <p className="text-gray-300 mb-6">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-6">
                <li className="mb-2">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li className="mb-2">Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-gray-300 mb-6">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">5. Your Legal Rights</h2>
              <p className="text-gray-300 mb-6">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-6">
                <li className="mb-2">Request access to your personal data.</li>
                <li className="mb-2">Request correction of your personal data.</li>
                <li className="mb-2">Request erasure of your personal data.</li>
                <li className="mb-2">Object to processing of your personal data.</li>
                <li className="mb-2">Request restriction of processing your personal data.</li>
                <li className="mb-2">Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@zenmix.com.
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

export default PrivacyPage;
