import React from 'react';

const FeatureComparisonModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-white/10 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold gradient-text">Feature Comparison</h3>
          <button 
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-left w-1/3">Feature</th>
                  <th className="py-4 px-4 text-center">Free</th>
                  <th className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-t-lg">Premium</th>
                  <th className="py-4 px-4 text-center">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Sound Library</td>
                  <td className="py-4 px-4 text-center">Basic (20 sounds)</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Full (100+ sounds)</td>
                  <td className="py-4 px-4 text-center">Full + Exclusive (150+ sounds)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Audio Mixing</td>
                  <td className="py-4 px-4 text-center">Basic (2 tracks)</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Advanced (5 tracks)</td>
                  <td className="py-4 px-4 text-center">Advanced (Unlimited tracks)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Meditation Timer</td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Advanced</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">EQ Controls</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">10-band EQ</td>
                  <td className="py-4 px-4 text-center">10-band EQ + Presets</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">AI Recommendations</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Basic</td>
                  <td className="py-4 px-4 text-center">Advanced</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Binaural Beats</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Preset Frequencies</td>
                  <td className="py-4 px-4 text-center">Custom Frequencies</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Offline Mode</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Cloud Sync</td>
                  <td className="py-4 px-4 text-center">Limited (1 device)</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Full (5 devices)</td>
                  <td className="py-4 px-4 text-center">Full (Unlimited devices)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Custom Mixes</td>
                  <td className="py-4 px-4 text-center">Save up to 3</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Save up to 20</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-gray-300">Customer Support</td>
                  <td className="py-4 px-4 text-center">Email</td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">Email & Chat</td>
                  <td className="py-4 px-4 text-center">Priority Support</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Early Access to New Features</td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center bg-gradient-to-r from-purple-900/10 to-blue-900/10">
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="gradient-button px-8 py-3">
              Get Premium - £5.99/month
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full border border-white/10 transition-all duration-300">
              Get Pro - £7.99/month
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">Annual plans available with up to 44% savings</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureComparisonModal;
