import React from 'react';

const ActiveSounds = ({ activeSounds, onRemoveSound, onUpdateVolume }) => {
  return (
    <div className="bg-dark rounded-xl p-6 mb-6">
      <h4 className="text-lg font-medium mb-4">Active Sounds</h4>
      <div className="space-y-4">
        {Object.keys(activeSounds).length === 0 ? (
          <p className="text-gray-400 text-center py-4">No sounds active. Add sounds from the library.</p>
        ) : (
          Object.values(activeSounds).map((sound) => (
            <div key={sound.id} className="p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  </div>
                  <span>{sound.name}</span>
                </div>
                <button 
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  onClick={() => onRemoveSound(sound.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sound.volume * 100} 
                  onChange={(e) => onUpdateVolume(sound.id, parseInt(e.target.value) / 100)}
                  className="w-full accent-primary" 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveSounds;