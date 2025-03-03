import React from 'react';

const Equalizer = () => {
  return (
    <div className="bg-dark rounded-xl p-6">
      <h4 className="text-lg font-medium mb-4">Equalizer</h4>
      <div className="grid grid-cols-5 gap-4">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-2">60Hz</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="50" 
            className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-2">250Hz</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="60" 
            className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-2">1kHz</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="70" 
            className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-2">4kHz</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="65" 
            className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-2">12kHz</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            defaultValue="55" 
            className="h-24 appearance-none bg-gray-700 rounded-full w-2 accent-primary" 
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Equalizer;