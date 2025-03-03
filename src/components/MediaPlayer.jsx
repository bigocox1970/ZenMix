import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

const MediaPlayer = ({ track, onClose, isFullscreen = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(isFullscreen);
  
  const soundRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize or update Howl instance when track changes
  useEffect(() => {
    if (!track?.url) {
      setError('No audio source provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Stop and unload previous sound
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }

      // Create new Howl instance
      soundRef.current = new Howl({
        src: [track.url],
        html5: true,
        format: ['mp3', 'wav', 'ogg', 'm4a'],
        volume: volume,
        onload: () => {
          setDuration(soundRef.current.duration());
          setIsLoading(false);
          setError(null);
          initializeVisualization();
        },
        onloaderror: (id, err) => {
          console.error('Error loading audio:', err);
          setError('Failed to load audio file. Please try again.');
          setIsPlaying(false);
          setIsLoading(false);
        },
        onplayerror: (id, err) => {
          console.error('Error playing audio:', err);
          setError('Failed to play audio file. Please try again.');
          setIsPlaying(false);
        },
        onend: () => {
          setIsPlaying(false);
          setCurrentTime(0);
          cancelAnimationFrame(animationRef.current);
        }
      });

      return () => {
        if (soundRef.current) {
          soundRef.current.unload();
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (err) {
      console.error('Error initializing audio:', err);
      setError('Failed to initialize audio player');
      setIsLoading(false);
    }
  }, [track?.url]);

  // Update volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  // Initialize visualization
  const initializeVisualization = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawVisualization = () => {
      if (!isPlaying) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Create a simple visualization
      const time = Date.now() / 1000;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.3;

      ctx.beginPath();
      ctx.strokeStyle = '#646cff';
      ctx.lineWidth = 2;

      for (let i = 0; i < 360; i += 5) {
        const angle = (i * Math.PI) / 180;
        const amplitude = Math.sin(time * 2 + i / 30) * 20;
        const x = centerX + (radius + amplitude) * Math.cos(angle);
        const y = centerY + (radius + amplitude) * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.closePath();
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawVisualization);
    };

    drawVisualization();
  };

  // Play/Pause
  const togglePlay = () => {
    if (!soundRef.current || isLoading) return;
    
    try {
      if (isPlaying) {
        soundRef.current.pause();
        cancelAnimationFrame(animationRef.current);
      } else {
        setError(null);
        soundRef.current.play();
        initializeVisualization();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error('Error toggling play:', err);
      setError('Failed to play audio');
      setIsPlaying(false);
    }
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setShowFullscreen(!showFullscreen);
  };

  const playerContent = (
    <div className={`${showFullscreen ? 'fixed inset-0 bg-black z-50' : 'fixed bottom-20 left-0 right-0 bg-black border-t border-gray-800 p-4 z-50'}`}>
      {showFullscreen && (
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setShowFullscreen(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className={`${showFullscreen ? 'h-full flex flex-col' : 'max-w-3xl mx-auto'}`}>
        {showFullscreen && (
          <div className="flex-1 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="max-w-full max-h-full"
            />
          </div>
        )}

        <div className={`${showFullscreen ? 'p-8' : 'flex items-center justify-between'}`}>
          <div className="flex items-center">
            <div 
              className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3 cursor-pointer"
              onClick={toggleFullscreen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <div className="font-medium">{track?.name || track?.title || 'Unknown Track'}</div>
              <div className="text-sm text-gray-400">{formatTime(currentTime)} / {formatTime(duration)}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-primary"
              />
            </div>
            
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="gradient-button px-4 py-2"
            >
              {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
            </button>
            
            {onClose && !showFullscreen && (
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return playerContent;
};

export default MediaPlayer;