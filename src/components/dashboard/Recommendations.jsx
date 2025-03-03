import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Recommendations = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card rounded-xl p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h3 className="text-xl font-semibold">Recommended for You</h3>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div className="p-4 bg-dark rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Morning Calm</h4>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">10:00</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Start your day with this calming meditation mix featuring gentle rain and soft piano.</p>
            <button className="text-primary text-sm hover:underline">Load this mix</button>
          </div>
          
          <div className="p-4 bg-dark rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Deep Focus</h4>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">15:00</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Enhance your concentration with this mix of white noise and alpha wave binaural beats.</p>
            <button className="text-primary text-sm hover:underline">Load this mix</button>
          </div>
          
          <div className="p-4 bg-dark rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Evening Wind Down</h4>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">20:00</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">Prepare for sleep with this relaxing combination of ocean waves and gentle breathing guidance.</p>
            <button className="text-primary text-sm hover:underline">Load this mix</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;