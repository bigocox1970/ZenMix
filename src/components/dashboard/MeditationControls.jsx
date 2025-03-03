import React from 'react';

const MeditationControls = ({ 
  isPlaying, 
  sessionTime, 
  sessionName, 
  formatTime,
  onPlay, 
  onPause, 
  onStop, 
  onSetTimer, 
  onSessionNameChange,
  onSaveSession 
}) => {
  return (
    <div className="bg-dark rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-medium">Meditation Controls</h4>
        <div className="text-sm text-gray-400">{formatTime(sessionTime)}</div>
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        {!isPlaying ? (
          <button 
            onClick={onPlay}
            className="bg-primary hover:bg-primary-dark text-white p-3 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        ) : (
          <button 
            onClick={onPause}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
        )}
        <button 
          onClick={onStop}
          className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="12" height="12"></rect>
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Session Timer</label>
        <div className="flex space-x-2">
          {[5, 10, 15, 20, 30].map((minutes) => (
            <button 
              key={minutes}
              onClick={() => onSetTimer(minutes)}
              className={`px-3 py-1 rounded-lg text-sm ${
                sessionTime === minutes * 60 
                  ? 'bg-primary hover:bg-primary-dark' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {minutes}m
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="session-name" className="block text-sm font-medium text-gray-300 mb-2">Session Name</label>
        <input 
          type="text" 
          id="session-name" 
          value={sessionName}
          onChange={(e) => onSessionNameChange(e.target.value)}
          placeholder="My Meditation Session" 
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <button 
        onClick={onSaveSession}
        className="mt-4 w-full btn-primary py-2"
      >
        Save Session
      </button>
    </div>
  );
};

export default MeditationControls;