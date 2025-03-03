import React from 'react';

// This is a placeholder component to fix the build error
// It appears Tailwind is looking for this file
const MixCard = ({ mix, onPlay }) => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-md">
      <h3 className="font-medium text-lg mb-2">{mix?.name || 'Unnamed Mix'}</h3>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {mix?.duration || 0} min • {mix?.tracks?.length || 0} tracks
        </div>
        {onPlay && (
          <button 
            onClick={() => onPlay(mix)}
            className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MixCard; 