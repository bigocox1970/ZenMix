import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DashboardStats = ({ sessions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate stats
  const totalMinutes = sessions.reduce((sum, session) => {
    const duration = parseInt(session.duration) || 0;
    return sum + duration;
  }, 0);

  const sessionsCompleted = sessions.length;
  const averageMinutes = sessionsCompleted > 0 ? Math.round(totalMinutes / sessionsCompleted) : 0;

  // Calculate favorite sound
  const soundCounts = {};
  sessions.forEach(session => {
    if (session.sounds) {
      session.sounds.forEach(sound => {
        soundCounts[sound.name] = (soundCounts[sound.name] || 0) + 1;
      });
    }
  });
  const favoriteSound = Object.entries(soundCounts).reduce((a, b) => 
    (a[1] > b[1] ? a : b), ['None', 0])[0];

  return (
    <div className="bg-card rounded-xl p-6 mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold">Meditation Stats</h2>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-dark/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Recent Sessions</h3>
              <span className="text-primary text-sm">{sessionsCompleted} total</span>
            </div>
            <div className="text-3xl font-bold">{sessionsCompleted}</div>
            <div className="text-gray-400 text-sm">
              Last session: {sessions.length > 0 
                ? new Date(sessions[0].created_at).toLocaleDateString() 
                : 'Never'}
            </div>
          </div>
          
          <div className="bg-dark/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Meditation Time</h3>
              <span className="text-primary text-sm">This week</span>
            </div>
            <div className="text-3xl font-bold">{totalMinutes}m</div>
            <div className="text-gray-400 text-sm">
              Average: {averageMinutes} minutes per session
            </div>
          </div>
          
          <div className="bg-dark/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-sm">Favorite Sound</h3>
              <span className="text-primary text-sm">Most used</span>
            </div>
            <div className="text-3xl font-bold">{favoriteSound}</div>
            <div className="text-gray-400 text-sm">
              Used in {soundCounts[favoriteSound] || 0} sessions
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;