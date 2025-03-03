import React from 'react';

const HeroSection = ({ handleSignupClick, handleLoginClick }) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="glow top-40 left-20"></div>
      <div className="glow bottom-20 right-20"></div>
      
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Transform Your Meditation</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text-reversed">With Custom Audio Mixing</h2>
        
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          ZenMix by Medit8 helps you create the perfect meditation experience
          with customizable audio mixing, EQ controls, and background sounds.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button 
            onClick={handleSignupClick}
            className="gradient-button"
          >
            Start Your Journey
          </button>
          
          <button 
            onClick={handleLoginClick}
            className="bg-transparent hover:bg-primary/10 text-white px-6 py-2 rounded-full border border-primary transition-all duration-300"
          >
            Sign In
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-6">Available on all platforms</p>
        
        <div className="flex justify-center space-x-6 mb-16">
          <a href="#" className="store-button app-store">
            <div className="flex items-center">
              <div className="mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.0349 12.9779C17.0199 10.3479 19.2799 9.1179 19.3649 9.0679C18.1899 7.3379 16.3149 7.0979 15.6549 7.0779C14.0999 6.9179 12.5949 8.0179 11.8049 8.0179C10.9999 8.0179 9.75488 7.0979 8.43488 7.1279C6.74988 7.1579 5.17488 8.1379 4.29988 9.6879C2.49988 12.8379 3.79988 17.4979 5.52988 19.9779C6.39988 21.1979 7.42488 22.5679 8.77488 22.5079C10.0949 22.4479 10.5849 21.6679 12.1649 21.6679C13.7349 21.6679 14.1949 22.5079 15.5649 22.4679C16.9749 22.4479 17.8649 21.2379 18.6999 20.0079C19.6999 18.5979 20.0999 17.2179 20.1149 17.1579C20.0849 17.1479 17.0549 15.9679 17.0349 12.9779Z" fill="white"/>
                  <path d="M14.7549 5.6379C15.4549 4.7879 15.9149 3.6379 15.7649 2.4679C14.7649 2.5179 13.5149 3.1679 12.7849 3.9979C12.1449 4.7379 11.5849 5.9179 11.7549 7.0679C12.8749 7.1479 14.0249 6.4779 14.7549 5.6379Z" fill="white"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </div>
          </a>
          <a href="#" className="store-button play-store">
            <div className="flex items-center">
              <div className="mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.07992 21.2301C3.75992 21.0801 3.49992 20.8201 3.32992 20.5001C3.14992 20.1801 3.05992 19.8101 3.05992 19.4301V4.57012C3.05992 4.19012 3.14992 3.82012 3.32992 3.50012C3.49992 3.18012 3.75992 2.92012 4.07992 2.77012L13.0599 12.0001L4.07992 21.2301Z" fill="#EA4335"/>
                  <path d="M17.0599 15.9999L5.05992 22.9999C5.32992 23.0599 5.60992 23.0599 5.88992 22.9999C6.16992 22.9399 6.43992 22.8199 6.67992 22.6499L17.9399 16.3799L17.0599 15.9999Z" fill="#FBBC04"/>
                  <path d="M20.9399 11.9999C20.9399 11.5599 20.8199 11.1299 20.5899 10.7599C20.3599 10.3899 20.0299 10.0899 19.6399 9.89988L17.9399 8.99988L16.9399 9.99988L17.9399 10.9999L6.67992 4.72988C6.43992 4.55988 6.16992 4.43988 5.88992 4.37988C5.60992 4.31988 5.32992 4.31988 5.05992 4.37988L17.0599 11.3799L20.5899 13.2399C20.9799 13.0499 21.3099 12.7499 21.5399 12.3799C21.7699 12.0099 21.8899 11.5799 21.8899 11.1399C21.8899 11.0899 21.8899 11.0399 21.8899 10.9999C21.8899 11.0399 21.8899 11.0899 21.8899 11.1399C21.8899 11.5799 21.7699 12.0099 21.5399 12.3799C21.3099 12.7499 20.9799 13.0499 20.5899 13.2399L17.0599 11.3799L13.0599 11.9999L17.0599 12.6199L19.6399 14.0999C20.0299 13.9099 20.3599 13.6099 20.5899 13.2399C20.8199 12.8699 20.9399 12.4399 20.9399 11.9999Z" fill="#4285F4"/>
                  <path d="M5.05992 4.37988C4.78992 4.43988 4.52992 4.55988 4.29992 4.72988C4.06992 4.89988 3.86992 5.11988 3.71992 5.36988L13.0599 11.9999L17.0599 11.3799L5.05992 4.37988Z" fill="#34A853"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </div>
          </a>
        </div>
        
        <div className="relative max-w-xl mx-auto">
          <div className="app-preview rounded-xl overflow-hidden">
            <img 
              src="screen-shots/Capture3.PNG" 
              alt="ZenMix App Interface" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
