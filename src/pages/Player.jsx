import React, { useState } from 'react';
import Header from '../components/Header.jsx';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const tracks = [
    { id: 1, title: 'Rain Sounds', category: 'Nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
    { id: 2, title: 'Forest Birds', category: 'Nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
    { id: 3, title: 'Ocean Waves', category: 'Nature', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' },
    { id: 4, title: 'Gentle Piano', category: 'Music', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sad-piano-loop-565.mp3' }
  ];
  
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  
  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Get the audio element and play it
    const audioElement = document.getElementById('audio-player');
    if (audioElement) {
      audioElement.play();
    }
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    
    // Get the audio element and pause it
    const audioElement = document.getElementById('audio-player');
    if (audioElement) {
      audioElement.pause();
    }
  };
  
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Audio Player</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Track List */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Tracks</h2>
              <div className="space-y-2">
                {tracks.map(track => (
                  <div 
                    key={track.id}
                    className={`p-3 rounded cursor-pointer ${currentTrack.id === track.id ? 'bg-purple-900/30 border border-purple-500/30' : 'bg-gray-800 hover:bg-gray-700'}`}
                    onClick={() => handlePlay(track)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">
                        {currentTrack.id === track.id && isPlaying ? (
                          <button onClick={(e) => { e.stopPropagation(); handlePause(); }} className="text-purple-400 hover:text-purple-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        ) : (
                          <button className="text-green-400 hover:text-green-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{track.title}</div>
                        <div className="text-sm text-gray-400">{track.category}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Player */}
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                <p className="text-gray-400">{currentTrack.category}</p>
              </div>
              
              <div className="mb-8">
                <audio 
                  id="audio-player"
                  className="w-full" 
                  controls 
                  src={currentTrack.url}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full"
                  onClick={() => {
                    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
                    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
                    handlePlay(tracks[prevIndex]);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {isPlaying ? (
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full"
                    onClick={handlePause}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full"
                    onClick={() => handlePlay(currentTrack)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                
                <button 
                  className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full"
                  onClick={() => {
                    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
                    const nextIndex = (currentIndex + 1) % tracks.length;
                    handlePlay(tracks[nextIndex]);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Player;
