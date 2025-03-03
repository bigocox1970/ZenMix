import React from 'react';

const SoundLibrary = ({ tracks, onAddSound }) => {
  return (
    <div className="bg-dark rounded-xl p-6 mb-6">
      <h4 className="text-lg font-medium mb-4">Sound Library</h4>
      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </div>
              <span>{track.name}</span>
            </div>
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-full transition-colors"
              onClick={() => onAddSound(track.id, track.name, track.url)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundLibrary;