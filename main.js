import './style.css';

// Header component
function Header() {
  return `
    <header class="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#" class="flex items-center space-x-2">
          <img src="/logo.svg" alt="ZenMix Logo" class="h-8 w-8">
          <span class="text-white font-semibold text-xl">ZenMix<span class="text-xs text-gray-400 ml-1">by Medit8</span></span>
        </a>
        <nav class="hidden md:flex space-x-8">
          <a href="#features" class="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#about-section" class="text-gray-300 hover:text-white transition-colors">About</a>
          <a href="#experience-section" class="text-gray-300 hover:text-white transition-colors">Experience</a>
        </nav>
        <div>
          <button id="login-btn" class="bg-transparent hover:bg-primary/10 text-white px-4 py-1.5 rounded-full border border-primary transition-all duration-300">Sign In</button>
        </div>
      </div>
    </header>
  `;
}

// Hero component
function Hero() {
  return `
    <section class="relative pt-32 pb-20 overflow-hidden">
      <div class="glow top-40 left-20"></div>
      <div class="glow bottom-20 right-20"></div>
      
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 gradient-text">Transform Your Meditation</h1>
        <h2 class="text-3xl md:text-4xl font-bold mb-6 gradient-text-reversed">With Custom Audio Mixing</h2>
        
        <p class="text-gray-300 max-w-2xl mx-auto mb-8">
          ZenMix by Medit8 helps you create the perfect meditation experience
          with customizable audio mixing, EQ controls, and background sounds.
        </p>
        
        <button id="start-journey-btn" class="gradient-button mb-8">Start Your Journey</button>
        
        <p class="text-sm text-gray-400 mb-6">Available on all platforms</p>
        
        <div class="flex justify-center space-x-6 mb-16">
          <a href="#" class="store-button app-store">
            <div class="flex items-center">
              <div class="mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.0349 12.9779C17.0199 10.3479 19.2799 9.1179 19.3649 9.0679C18.1899 7.3379 16.3149 7.0979 15.6549 7.0779C14.0999 6.9179 12.5949 8.0179 11.8049 8.0179C10.9999 8.0179 9.75488 7.0979 8.43488 7.1279C6.74988 7.1579 5.17488 8.1379 4.29988 9.6879C2.49988 12.8379 3.79988 17.4979 5.52988 19.9779C6.39988 21.1979 7.42488 22.5679 8.77488 22.5079C10.0949 22.4479 10.5849 21.6679 12.1649 21.6679C13.7349 21.6679 14.1949 22.5079 15.5649 22.4679C16.9749 22.4479 17.8649 21.2379 18.6999 20.0079C19.6999 18.5979 20.0999 17.2179 20.1149 17.1579C20.0849 17.1479 17.0549 15.9679 17.0349 12.9779Z" fill="white"/>
                  <path d="M14.7549 5.6379C15.4549 4.7879 15.9149 3.6379 15.7649 2.4679C14.7649 2.5179 13.5149 3.1679 12.7849 3.9979C12.1449 4.7379 11.5849 5.9179 11.7549 7.0679C12.8749 7.1479 14.0249 6.4779 14.7549 5.6379Z" fill="white"/>
                </svg>
              </div>
              <div class="text-left">
                <div class="text-xs">Download on the</div>
                <div class="text-lg font-semibold">App Store</div>
              </div>
            </div>
          </a>
          <a href="#" class="store-button play-store">
            <div class="flex items-center">
              <div class="mr-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.07992 21.2301C3.75992 21.0801 3.49992 20.8201 3.32992 20.5001C3.14992 20.1801 3.05992 19.8101 3.05992 19.4301V4.57012C3.05992 4.19012 3.14992 3.82012 3.32992 3.50012C3.49992 3.18012 3.75992 2.92012 4.07992 2.77012L13.0599 12.0001L4.07992 21.2301Z" fill="#EA4335"/>
                  <path d="M17.0599 15.9999L5.05992 22.9999C5.32992 23.0599 5.60992 23.0599 5.88992 22.9999C6.16992 22.9399 6.43992 22.8199 6.67992 22.6499L17.9399 16.3799L17.0599 15.9999Z" fill="#FBBC04"/>
                  <path d="M20.9399 11.9999C20.9399 11.5599 20.8199 11.1299 20.5899 10.7599C20.3599 10.3899 20.0299 10.0899 19.6399 9.89988L17.9399 8.99988L16.9399 9.99988L17.9399 10.9999L6.67992 4.72988C6.43992 4.55988 6.16992 4.43988 5.88992 4.37988C5.60992 4.31988 5.32992 4.31988 5.05992 4.37988L17.0599 11.3799L20.5899 13.2399C20.9799 13.0499 21.3099 12.7499 21.5399 12.3799C21.7699 12.0099 21.8899 11.5799 21.8899 11.1399C21.8899 11.0899 21.8899 11.0399 21.8899 10.9999C21.8899 11.0399 21.8899 11.0899 21.8899 11.1399C21.8899 11.5799 21.7699 12.0099 21.5399 12.3799C21.3099 12.7499 20.9799 13.0499 20.5899 13.2399L17.0599 11.3799L13.0599 11.9999L17.0599 12.6199L19.6399 14.0999C20.0299 13.9099 20.3599 13.6099 20.5899 13.2399C20.8199 12.8699 20.9399 12.4399 20.9399 11.9999Z" fill="#4285F4"/>
                  <path d="M5.05992 4.37988C4.78992 4.43988 4.52992 4.55988 4.29992 4.72988C4.06992 4.89988 3.86992 5.11988 3.71992 5.36988L13.0599 11.9999L17.0599 11.3799L5.05992 4.37988Z" fill="#34A853"/>
                </svg>
              </div>
              <div class="text-left">
                <div class="text-xs">GET IT ON</div>
                <div class="text-lg font-semibold">Google Play</div>
              </div>
            </div>
          </a>
        </div>
        
        <div class="relative max-w-xl mx-auto">
          <div class="app-preview rounded-xl overflow-hidden aspect-video flex items-center justify-center">
            <div class="text-center">
              <div class="flex justify-center mb-2">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="20" fill="#646cff" fill-opacity="0.2"/>
                  <circle cx="20" cy="20" r="10" fill="#646cff" fill-opacity="0.6"/>
                </svg>
              </div>
              <p class="text-sm text-gray-400">App interface preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Features component
function Features() {
  return `
    <section id="features" class="py-20 relative">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-4 gradient-text">Elevate Your Meditation</h2>
        <p class="text-gray-300 text-center max-w-2xl mx-auto mb-16">
          Discover features designed to transform your meditation practice and create a deeply
          personalized experience.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <!-- Feature 1 -->
          <div class="feature-card p-6 rounded-xl">
            <div class="flex items-start space-x-4">
              <div class="bg-primary/10 p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fill-opacity="0.2"/>
                  <path d="M10 8L16 12L10 16V8Z" fill="#646cff"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Custom Audio Mixing</h3>
                <p class="text-gray-400">
                  Mix multiple meditation tracks with a library of ambient sounds and music to create
                  your perfect soundscape.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div class="feature-card p-6 rounded-xl">
            <div class="flex items-start space-x-4">
              <div class="bg-primary/10 p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fill-opacity="0.2"/>
                  <path d="M8 12H16M12 8V16" stroke="#646cff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Built-In Equalizer</h3>
                <p class="text-gray-400">
                  Fine-tune your audio experience with a full-featured equalizer that helps you achieve
                  the perfect balance.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Feature 3 -->
          <div class="feature-card p-6 rounded-xl">
            <div class="flex items-start space-x-4">
              <div class="bg-primary/10 p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fill-opacity="0.2"/>
                  <path d="M12 8V12L15 15" stroke="#646cff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">Custom Timers</h3>
                <p class="text-gray-400">
                  Set timers to control the guided meditation and background sounds to transition
                  smoothly through your practice.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Feature 4 -->
          <div class="feature-card p-6 rounded-xl">
            <div class="flex items-start space-x-4">
              <div class="bg-primary/10 p-2 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="#646cff" fill-opacity="0.2"/>
                  <path d="M12 8V16M8 10L16 14" stroke="#646cff" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">AI Sound Recommendations</h3>
                <p class="text-gray-400">
                  Receive personalized sound combinations based on your mood, goals, and previous
                  meditation sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// About section component
function AboutSection() {
  return `
    <section id="about-section" class="py-20 relative bg-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8 gradient-text">About ZenMix</h2>
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-gray-300 mb-6">
            ZenMix by Medit8 was created by a team of meditation enthusiasts and audio engineers who wanted to bring
            a new level of personalization to meditation practice.
          </p>
          <p class="text-gray-300 mb-6">
            Our mission is to help people find their perfect meditation soundscape, allowing for deeper focus,
            relaxation, and mindfulness through customized audio experiences.
          </p>
          <p class="text-gray-300">
            With ZenMix, you're in control of your meditation journey, with tools designed to enhance your practice
            and help you achieve your wellness goals.
          </p>
        </div>
      </div>
    </section>
  `;
}

// Experience section component
function ExperienceSection() {
  return `
    <section id="experience-section" class="py-20 relative">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8 gradient-text">The ZenMix Experience</h2>
        
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="text-center">
              <div class="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold">1</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">Choose Your Sounds</h3>
              <p class="text-gray-400">Select from our library of ambient sounds, music, and guided meditations.</p>
            </div>
            
            <div class="text-center">
              <div class="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold">2</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">Mix & Customize</h3>
              <p class="text-gray-400">Adjust volumes, EQ settings, and timers to create your perfect mix.</p>
            </div>
            
            <div class="text-center">
              <div class="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl font-bold">3</span>
              </div>
              <h3 class="text-xl font-semibold mb-2">Save & Share</h3>
              <p class="text-gray-400">Save your favorite mixes and share them with the ZenMix community.</p>
            </div>
          </div>
          
          <div class="text-center">
            <button id="experience-btn" class="gradient-button">Experience ZenMix Today</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Footer component
function Footer() {
  return `
    <footer class="bg-dark py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <div class="flex items-center space-x-2">
              <img src="/logo.svg" alt="ZenMix Logo" class="h-8 w-8">
              <span class="text-white font-semibold text-xl">ZenMix<span class="text-xs text-gray-400 ml-1">by Medit8</span></span>
            </div>
            <p class="text-gray-400 mt-2 max-w-xs">
              Transform your meditation practice with custom audio mixing and personalized soundscapes.
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 class="text-white font-semibold mb-4">Product</h3>
              <ul class="space-y-2">
                <li><a href="#features" class="text-gray-400 hover:text-primary">Features</a></li>
                <li><a href="#" class="text-gray-400 hover:text-primary">Pricing</a></li>
                <li><a href="#" class="text-gray-400 hover:text-primary">Download</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-white font-semibold mb-4">Company</h3>
              <ul class="space-y-2">
                <li><a href="#about-section" class="text-gray-400 hover:text-primary">About</a></li>
                <li><a href="#" class="text-gray-400 hover:text-primary">Blog</a></li>
                <li><a href="#" class="text-gray-400 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="text-white font-semibold mb-4">Legal</h3>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-primary">Privacy</a></li>
                <li><a href="#" class="text-gray-400 hover:text-primary">Terms</a></li>
                <li><a href="#" class="text-gray-400 hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; 2025 Medit8 Technologies. All rights reserved.
          </p>
          
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" class="text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Auth modal component
function AuthModal() {
  return `
    <div id="auth-modal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 hidden">
      <div class="bg-card rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button id="close-modal" class="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="text-center mb-6">
          <img src="/logo.svg" alt="ZenMix Logo" class="h-12 w-12 mx-auto mb-4">
          <h2 class="text-2xl font-bold" id="auth-title">Sign In</h2>
        </div>
        
        <div id="auth-error" class="bg-red-900/20 border border-red-900 text-red-200 px-4 py-2 rounded-lg mb-4 hidden">
          Error message will appear here
        </div>
        
        <form id="auth-form">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" id="email" class="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input type="password" id="password" class="w-full px-4 py-2 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          
          <button type="submit" id="auth-submit" class="w-full gradient-button py-3">Sign In</button>
          
          <div class="mt-4 text-center">
            <button type="button" id="auth-toggle" class="text-primary hover:text-primary-dark text-sm">
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Initialize the app
function initApp() {
  const app = document.querySelector('#app');
  
  // Render components
  app.innerHTML = `
    ${Header()}
    <main>
      ${Hero()}
      ${Features()}
      ${AboutSection()}
      ${ExperienceSection()}
    </main>
    ${Footer()}
    ${AuthModal()}
  `;
  
  // Add event listeners
  const loginBtn = document.getElementById('login-btn');
  const startJourneyBtn = document.getElementById('start-journey-btn');
  const experienceBtn = document.getElementById('experience-btn');
  const authModal = document.getElementById('auth-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const authToggle = document.getElementById('auth-toggle');
  const authTitle = document.getElementById('auth-title');
  const authSubmit = document.getElementById('auth-submit');
  
  let isLoginMode = true;
  
  // Show auth modal
  const showAuthModal = () => {
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  
  // Hide auth modal
  const hideAuthModal = () => {
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
  };
  
  // Toggle between login and signup
  const toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
    authSubmit.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
    authToggle.textContent = isLoginMode 
      ? 'Don\'t have an account? Sign Up' 
      : 'Already have an account? Sign In';
  };
  
  // Event listeners
  if (loginBtn) loginBtn.addEventListener('click', showAuthModal);
  if (startJourneyBtn) startJourneyBtn.addEventListener('click', showAuthModal);
  if (experienceBtn) experienceBtn.addEventListener('click', showAuthModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', hideAuthModal);
  if (authToggle) authToggle.addEventListener('click', toggleAuthMode);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === authModal) {
      hideAuthModal();
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);