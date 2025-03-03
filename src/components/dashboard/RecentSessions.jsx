import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const RecentSessions = ({ sessions = [] }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDuration = (duration) => {
    if (!duration) return '0m';
    return `${duration}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-xl p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <h3 className="text-xl font-semibold">Recent Sessions</h3>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>

      {isExpanded && (
        <>
          {sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session, index) => (
                <div key={session.id || index} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">{session.name || 'Meditation Session'}</h4>
                      <p className="text-sm text-gray-400">{formatDate(session.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">{formatDuration(session.duration)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-dark/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <p className="text-gray-400 mb-4">You haven't created any meditation sessions yet.</p>
              <button 
                onClick={() => navigate('/mixer')}
                className="gradient-button"
              >
                Create Your First Mix
              </button>
            </div>
          )}

          {sessions.length > 0 && (
            <button 
              onClick={() => navigate('/library')}
              className="mt-4 text-primary text-sm hover:underline"
            >
              View all sessions
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default RecentSessions;