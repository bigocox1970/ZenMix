import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const CookiesPage = () => {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 gradient-text">Cookie Policy</h1>
            
            <div className="bg-card rounded-xl p-8 mb-8">
              <p className="text-gray-300 mb-6">
                Last updated: June 1, 2025
              </p>
              
              <h2 className="text-xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="text-gray-300 mb-6">
                Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-300 mb-6">
                When you use and access the Service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-6">
                <li className="mb-2">To enable certain functions of the Service</li>
                <li className="mb-2">To provide analytics</li>
                <li className="mb-2">To store your preferences</li>
                <li>To enable advertisements delivery, including behavioral advertising</li>
              </ul>
              <p className="text-gray-300 mb-6">
                We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
              </p>
              <ul className="list-disc pl-6 text-gray-300 mb-6">
                <li className="mb-2">Essential cookies. We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
                <li className="mb-2">Preferences cookies. We may use preferences cookies to remember information that changes the way the Service behaves or looks, such as the "remember me" functionality of a registered user or a user's language preference.</li>
                <li className="mb-2">Analytics cookies. We may use analytics cookies to track information how the Service is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.</li>
                <li>Targeting cookies. These type of cookies remember your device has visited our website and help us to build up a profile of your interests. Targeting cookies may also be placed on your device by our third party service providers that remember you have visited our site in order to provide you with ads more relevant to you.</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">3. Third-Party Cookies</h2>
              <p className="text-gray-300 mb-6">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">4. What Are Your Choices Regarding Cookies</h2>
              <p className="text-gray-300 mb-6">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">5. Where Can You Find More Information About Cookies</h2>
              <p className="text-gray-300">
                You can learn more about cookies and the following third-party websites:
              </p>
              <ul className="list-disc pl-6 text-gray-300">
                <li className="mb-2">AllAboutCookies: <a href="http://www.allaboutcookies.org/" className="text-primary hover:underline">http://www.allaboutcookies.org/</a></li>
                <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/" className="text-primary hover:underline">http://www.networkadvertising.org/</a></li>
              </ul>
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

export default CookiesPage;
