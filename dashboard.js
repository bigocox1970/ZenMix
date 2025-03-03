import './style.css';
import { supabase, signOut, getCurrentUser, getUserSessions, getAudioTracks } from './src/supabase.js';
import { Howl } from 'howler';

// Dashboard components
function DashboardHeader(user) {
  return `
    <header class="bg-dark border-b border-gray-800">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" class="flex items-center space-x-2">
          <img src="/logo.svg" alt="ZenMix Logo" class="h-8 w-8">
          <span class="text-white font-semibold text-xl">ZenMix<span class="text-xs text-gray-400 ml-1">by MindBit</span></span>
        </a>
        <div class="flex items-center space-x-4">
          <span class="text-gray-300">${user?.email || 'User'}</span>
          <button id="logout-btn" class="bg-transparent hover:bg-primary/10 text-white px-4 py-1.5 rounded-full border border-primary transition-all duration-300">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  `;
}

function DashboardSidebar() {
  return `
    <aside class="w-64 bg-dark border-r border-gray-800 h-screen fixed top-16 left-0 overflow-y-auto">
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <a href="#" class="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>My Sessions</span>
            </a>
          </li>
          <li>
            <a href="#mixer" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
              <span>Audio Mixer</span>
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  `;
}

function DashboardContent(user, sessions = []) {
  return `
    <main class="ml-64 pt-16 min-h-screen">
      <div class="container mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold mb-6">Welcome back!</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-card rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium">Recent Sessions</h3>
              <span class="text-primary text-sm">${sessions.length} total</span>
            </div>
            <div class="text-3xl font-bold">${sessions.length}</div>
            <div class="text-gray-400 text-sm">Last session: ${sessions.length > 0 ? new Date(sessions[0].created_at).toLocaleDateString() : 'Never'}</div>
          </div>
          
          <div class="bg-card rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium">Meditation Time</h3>
              <span class="text-primary text-sm">This week</span>
            </div>
            <div class="text-3xl font-bold">2h 15m</div>
            <div class="text-gray-400 text-sm">+15% from last week</div>
          </div>
          
          <div class="bg-card rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium">Favorite Sound</h3>
              <span class="text-primary text-sm">Most used</span>
            </div>
            <div class="text-3xl font-bold">Rain</div>
            <div class="text-gray-400 text-sm">Used in 8 sessions</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-card rounded-xl p-6">
            <h3 class="text-xl font-semibold mb-4">Recent Sessions</h3>
            ${sessions.length > 0 ? 
              `<div class="space-y-4">
                ${sessions.slice(0, 3).map(session => `
                  <div class="flex items-center justify-between p-3 bg-dark rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="bg-primary/20 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 class="font-medium">${session.name || 'Meditation Session'}</h4>
                        <p class="text-sm text-gray-400">${new Date(session.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div class="text-gray-400">${session.duration || '10:00'}</div>
                  </div>
                `).join('')}
              </div>
              <button class="mt-4 text-primary text-sm hover:underline">View all sessions</button>
              ` : 
              `<div class="text-center py-8">
                <div class="bg-dark/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                </div>
                <p class="text-gray-400 mb-4">You haven't created any meditation sessions yet.</p>
                <a href="#mixer" class="btn-primary inline-block">Create Your First Session</a>
              </div>`
            }
          </div>
          
          <div class="bg-card rounded-xl p-6">
            <h3 class="text-xl font-semibold mb-4">Recommended for You</h3>
            <div class="space-y-4">
              <div class="p-4 bg-dark rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium">Morning Calm</h4>
                  <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">10:00</span>
                </div>
                <p class="text-sm text-gray-400 mb-3">Start your day with this calming meditation mix featuring gentle rain and soft piano.</p>
                <button class="text-primary text-sm hover:underline">Load this mix</button>
              </div>
              
              <div class="p-4 bg-dark rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium">Deep Focus</h4>
                  <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">15:00</span>
                </div>
                <p class="text-sm text-gray-400 mb-3">Enhance your concentration with this mix of white noise and alpha wave binaural beats.</p>
                <button class="text-primary text-sm hover:underline">Load this mix</button>
              </div>
              
              <div class="p-4 bg-dark rounded-lg">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium">Evening Wind Down</h4>
                  <span class="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">20:00</span>
                </div>
                <p class="text-sm text-gray-400 mb-3">Prepare for sleep with this relaxing combination of ocean waves and gentle breathing guidance.</p>
                <button class="text-primary text-sm hover:underline">Load this mix</button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="mixer" class="bg-card rounded-xl p-6 mb-8">
          <h3 class="text-xl font-semibold mb-6">Audio Mixer</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div class="bg-dark rounded-xl p-6 mb-6">
                <h4 class="text-lg font-medium mb-4">Sound Library</h4>
                <div class="space-y-4" id="sound-library">
                  <!-- Sound library items will be populated here -->
                  <div class="animate-pulse">
                    <div class="h-10 bg-gray-700/30 rounded mb-4"></div>
                    <div class="h-10 bg-gray-700/30 rounded mb-4"></div>
                    <div class="h-10 bg-gray-700/30 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div class="bg-dark rounded-xl p-6">
                <h4 class="text-lg font-medium mb-4">Equalizer</h4>
                <div class="grid grid-cols-5 gap-4">
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-gray-400 mb-2">60Hz</span>
                    <input type="range" min="0" max="100" value="50" class="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" orient="vertical">
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-gray-400 mb-2">250Hz</span>
                    <input type="range" min="0" max="100" value="60" class="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" orient="vertical">
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-gray-400 mb-2">1kHz</span>
                    <input type="range" min="0" max="100" value="70" class="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" orient="vertical">
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-gray-400 mb-2">4kHz</span>
                    <input type="range" min="0" max="100" value="65" class="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" orient="vertical">
                  </div>
                  <div class="flex flex-col items-center">
                    <span class="text-xs text-gray-400 mb-2">12kHz</span>
                    <input type="range" min="0" max="100" value="55" class="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" orient="vertical">
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div class="bg-dark rounded-xl p-6 mb-6">
                <h4 class="text-lg font-medium mb-4">Active Sounds</h4>
                <div id="active-sounds" class="space-y-4">
                  <p class="text-gray-400 text-center py-4">No sounds active. Add sounds from the library.</p>
                </div>
              </div>
              
              <div class="bg-dark rounded-xl p-6">
                <div class="flex items-center justify-between mb-6">
                  <h4 class="text-lg font-medium">Meditation Controls</h4>
                  <div class="text-sm text-gray-400" id="timer-display">00:00</div>
                </div>
                
                <div class="flex justify-center space-x-4 mb-6">
                  <button id="play-btn" class="bg-primary hover:bg-primary-dark text-white p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <button id="pause-btn" class="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  </button>
                  <button id="stop-btn" class="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="6" width="12" height="12"></rect>
                    </svg>
                  </button>
                </div>
                
                <div class="mb-6">
                  <label for="meditation-timer" class="block text-sm font-medium text-gray-300 mb-2">Session Timer</label>
                  <div class="flex space-x-2">
                    <button class="timer-preset px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm" data-time="5">5m</button>
                    <button class="timer-preset px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm" data-time="10">10m</button>
                    <button class="timer-preset px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm" data-time="15">15m</button>
                    <button class="timer-preset px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm" data-time="20">20m</button>
                    <button class="timer-preset px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm" data-time="30">30m</button>
                  </div>
                </div>
                
                <div>
                  <label for="session-name" class="block text-sm font-medium text-gray-300 mb-2">Session Name</label>
                  <input type="text" id="session-name" placeholder="My Meditation Session" class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                </div>
                
                <button id="save-session" class="mt-4 w-full btn-primary py-2">Save Session</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

// Audio player state
let activeSounds = {};
let timerInterval = null;
let sessionTime = 0;
let isPlaying = false;

// Initialize the dashboard
async function initDashboard() {
  const app = document.querySelector('#app');
  app.innerHTML = '<div class="flex justify-center items-center h-screen"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>';
  
  try {
    // Check if user is logged in
    const { user, error } = await getCurrentUser();
    
    if (error || !user) {
      // Redirect to login page if not logged in
      window.location.href = '/';
      return;
    }
    
    // Get user sessions
    const { sessions } = await getUserSessions(user.id);
    
    // Render dashboard
    app.innerHTML = `
      ${DashboardHeader(user)}
      ${DashboardSidebar()}
      ${DashboardContent(user, sessions)}
    `;
    
    // Add event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Initialize audio mixer
    initAudioMixer(user.id);
    
  } catch (error) {
    console.error('Error initializing dashboard:', error);
    app.innerHTML = `
      <div class="flex flex-col items-center justify-center h-screen">
        <h2 class="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
        <p class="text-gray-400 mb-6">${error.message || 'An unexpected error occurred.'}</p>
        <button id="retry-btn" class="btn-primary">Retry</button>
        <button id="logout-btn" class="mt-4 text-primary hover:underline">Sign Out</button>
      </div>
    `;
    
    document.getElementById('retry-btn').addEventListener('click', () => {
      window.location.reload();
    });
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
  }
}

// Handle logout
async function handleLogout() {
  try {
    await signOut();
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
    alert('Error signing out. Please try again.');
  }
}

// Initialize audio mixer
async function initAudioMixer(userId) {
  try {
    // Get available audio tracks
    const { tracks, error } = await getAudioTracks();
    
    if (error) throw error;
    
    // Sample tracks if none are available from the database
    const sampleTracks = [
      { id: 'rain', name: 'Rain', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
      { id: 'forest', name: 'Forest', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
      { id: 'waves', name: 'Ocean Waves', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
      { id: 'fire', name: 'Crackling Fire', category: 'nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3' },
      { id: 'piano', name: 'Gentle Piano', category: 'music', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3' },
      { id: 'meditation', name: 'Guided Meditation', category: 'voice', url: 'https://assets.mixkit.co/sfx/preview/mixkit-ethereal-fairy-win-sound-2019.mp3' },
      { id: 'binaural', name: 'Binaural Beats', category: 'beats', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3' },
    ];
    
    const availableTracks = tracks && tracks.length > 0 ? tracks : sampleTracks;
    
    // Populate sound library
    const soundLibrary = document.getElementById('sound-library');
    soundLibrary.innerHTML = availableTracks.map(track => `
      <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="bg-primary/20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </div>
          <span>${track.name}</span>
        </div>
        <button class="add-sound-btn bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-full transition-colors" data-id="${track.id}" data-name="${track.name}" data-url="${track.url}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    `).join('');
    
    // Add event listeners for sound library
    document.querySelectorAll('.add-sound-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const url = btn.dataset.url;
        addActiveSound(id, name, url);
      });
    });
    
    // Add event listeners for meditation controls
    document.getElementById('play-btn').addEventListener('click', playMeditation);
    document.getElementById('pause-btn').addEventListener('click', pauseMeditation);
    document.getElementById('stop-btn').addEventListener('click', stopMeditation);
    document.getElementById('save-session').addEventListener('click', () => saveSession(userId));
    
    // Add event listeners for timer presets
    document.querySelectorAll('.timer-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.time);
        setTimer(minutes);
        
        // Update active class
        document.querySelectorAll('.timer-preset').forEach(b => b.classList.remove('bg-primary', 'hover:bg-primary-dark'));
        btn.classList.add('bg-primary', 'hover:bg-primary-dark');
      });
    });
    
  } catch (error) {
    console.error('Error initializing audio mixer:', error);
    const soundLibrary = document.getElementById('sound-library');
    soundLibrary.innerHTML = `
      <div class="text-center py-4">
        <p class="text-red-400 mb-2">Error loading sound library</p>
        <button id="retry-library-btn" class="text-primary hover:underline">Retry</button>
      </div>
    `;
    
    document.getElementById('retry-library-btn').addEventListener('click', () => {
      initAudioMixer(userId);
    });
  }
}

// Add active sound
function addActiveSound(id, name, url) {
  if (activeSounds[id]) return;
  
  // Create Howl instance
  const sound = new Howl({
    src: [url],
    loop: true,
    volume: 0.5,
  });
  
  // Add to active sounds
  activeSounds[id] = {
    id,
    name,
    url,
    sound,
    volume: 0.5,
  };
  
  // Update UI
  updateActiveSoundsUI();
}

// Update active sounds UI
function updateActiveSoundsUI() {
  const activeSoundsContainer = document.getElementById('active-sounds');
  
  if (Object.keys(activeSounds).length === 0) {
    activeSoundsContainer.innerHTML = `<p class="text-gray-400 text-center py-4">No sounds active. Add sounds from the library.</p>`;
    return;
  }
  
  activeSoundsContainer.innerHTML = Object.values(activeSounds).map(sound => `
    <div class="p-3 bg-gray-800 rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-3">
          <div class="bg-primary/20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </div>
          <span>${sound.name}</span>
        </div>
        <button class="remove-sound-btn text-gray-400 hover:text-red-400 transition-colors" data-id="${sound.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div>
        <input type="range" min="0" max="100" value="${sound.volume * 100}" class="volume-slider w-full accent-primary" data-id="${sound.id}">
      </div>
    </div>
  `).join('');
  
  // Add event listeners for volume sliders
  document.querySelectorAll('.volume-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const id = e.target.dataset.id;
      const volume = parseInt(e.target.value) / 100;
      
      if (activeSounds[id]) {
        activeSounds[id].volume = volume;
        activeSounds[id].sound.volume(volume);
      }
    });
  });
  
  // Add event listeners for remove buttons
  document.querySelectorAll('.remove-sound-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      removeActiveSound(id);
    });
  });
}

// Remove active sound
function removeActiveSound(id) {
  if (!activeSounds[id]) return;
  
  // Stop and unload sound
  activeSounds[id].sound.stop();
  activeSounds[id].sound.unload();
  
  // Remove from active sounds
  delete activeSounds[id];
  
  // Update UI
  updateActiveSoundsUI();
}

// Set timer
function setTimer(minutes) {
  sessionTime = minutes * 60;
  updateTimerDisplay();
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer-display').textContent = formattedTime;
}

// Play meditation
function playMeditation() {
  if (isPlaying) return;
  
  // Check if there are active sounds
  if (Object.keys(activeSounds).length === 0) {
    alert('Please add at least one sound to your meditation mix.');
    return;
  }
  
  // Check if timer is set
  if (sessionTime <= 0) {
    alert('Please set a timer for your meditation session.');
    return;
  }
  
  // Play all active sounds
  Object.values(activeSounds).forEach(sound => {
    sound.sound.play();
  });
  
  // Start timer
  timerInterval = setInterval(() => {
    sessionTime--;
    updateTimerDisplay();
    
    if (sessionTime <= 0) {
      stopMeditation();
    }
  }, 1000);
  
  // Update UI
  isPlaying = true;
  document.getElementById('play-btn').classList.add('hidden');
  document.getElementById('pause-btn').classList.remove('hidden');
}

// Pause meditation
function pauseMeditation() {
  if (!isPlaying) return;
  
  // Pause all active sounds
  Object.values(activeSounds).forEach(sound => {
    sound.sound.pause();
  });
  
  // Pause timer
  clearInterval(timerInterval);
  
  // Update UI
  isPlaying = false;
  document.getElementById('play-btn').classList.remove('hidden');
  document.getElementById('pause-btn').classList.add('hidden');
}

// Stop meditation
function stopMeditation() {
  // Stop all active sounds
  Object.values(activeSounds).forEach(sound => {
    sound.sound.stop();
  });
  
  // Stop timer
  clearInterval(timerInterval);
  
  // Update UI
  isPlaying = false;
  document.getElementById('play-btn').classList.remove('hidden');
  document.getElementById('pause-btn').classList.add('hidden');
}

// Save session
async function saveSession(userId) {
  try {
    const sessionName = document.getElementById('session-name').value || 'Meditation Session';
    
    // Check if there are active sounds
    if (Object.keys(activeSounds).length === 0) {
      alert('Please add at least one sound to your meditation mix.');
      return;
    }
    
    // Prepare session data
    const sessionData = {
      user_id: userId,
      name: sessionName,
      duration: document.getElementById('timer-display').textContent,
      sounds: Object.values(activeSounds).map(sound => ({
        id: sound.id,
        name: sound.name,
        volume: sound.volume
      })),
      created_at: new Date().toISOString()
    };
    
    // Save to database
    const { data, error } = await saveMeditationSession(sessionData);
    
    if (error) throw error;
    
    alert('Session saved successfully!');
    
    // Refresh the page to update the sessions list
    window.location.reload();
    
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Error saving session. Please try again.');
  }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);