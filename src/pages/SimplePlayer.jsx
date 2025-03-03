import React, { useState, useEffect } from 'react';

const SimplePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3');
    setAudioElement(audio);
    
    // Cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ marginBottom: '30px', fontSize: '2rem' }}>Simple Audio Player</h1>
      
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        padding: '30px', 
        borderRadius: '10px',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        </div>
        
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Rain Sounds</h2>
        
        <button 
          onClick={togglePlay}
          style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        <p style={{ marginTop: '20px', color: '#a0a0a0' }}>
          Click the button to play/pause the rain sounds
        </p>
      </div>
    </div>
  );
};

export default SimplePlayer;
