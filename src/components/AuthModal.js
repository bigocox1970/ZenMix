export function AuthModal() {
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
          
          <button type="submit" id="auth-submit" class="w-full btn-primary py-3">Sign In</button>
          
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