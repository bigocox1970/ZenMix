export function Hero() {
  return `
    <section class="relative pt-32 pb-20 overflow-hidden">
      <div class="glow top-40 left-20"></div>
      <div class="glow bottom-20 right-20"></div>
      
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Transform Your Meditation</h1>
        <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6">With Custom Audio Mixing</h2>
        
        <p class="text-gray-300 max-w-2xl mx-auto mb-8">
          ZenMix by MindBit helps you create the perfect meditation experience
          with customizable audio mixing, EQ controls, and background sounds.
        </p>
        
        <button id="start-journey-btn" class="btn-primary mb-8">Start Your Journey</button>
        
        <p class="text-sm text-gray-400 mb-6">Available on all platforms</p>
        
        <div class="flex justify-center space-x-6 mb-16">
          <div class="flex items-center space-x-2">
            <input type="radio" id="app-store" name="platform" checked class="accent-primary">
            <label for="app-store" class="text-sm text-gray-300">App Store</label>
          </div>
          <div class="flex items-center space-x-2">
            <input type="radio" id="play-store" name="platform" class="accent-primary">
            <label for="play-store" class="text-sm text-gray-300">Play Store</label>
          </div>
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