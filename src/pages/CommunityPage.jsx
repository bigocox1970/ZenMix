import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const CommunityPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  
  // Sample discussions data for demo purposes
  const discussionsData = [
    {
      id: 1,
      author: {
        name: 'Sarah K.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        level: 'Advanced'
      },
      title: 'How do you maintain consistency in your practice?',
      content: 'I have been meditating for about 6 months now, but I still struggle with maintaining a consistent daily practice. Some days I am motivated, others not so much. What strategies have worked for you to keep a regular schedule?',
      likes: 24,
      comments: 18,
      timestamp: '2 hours ago',
      tags: ['Habits', 'Consistency']
    },
    {
      id: 2,
      author: {
        name: 'Michael T.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        level: 'Teacher'
      },
      title: 'Binaural beats - your experiences?',
      content: 'I have recently started experimenting with binaural beats during my meditation sessions. Has anyone else tried this? What frequencies do you find most effective for deep meditation states?',
      likes: 16,
      comments: 12,
      timestamp: '5 hours ago',
      tags: ['Techniques', 'Audio']
    },
    {
      id: 3,
      author: {
        name: 'Jamie L.',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        level: 'Beginner'
      },
      title: 'Meditation for anxiety - success stories?',
      content: 'I started meditating specifically to help with my anxiety. I would love to hear from others who have used meditation to manage anxiety - what approaches worked best for you? How long before you noticed improvements?',
      likes: 32,
      comments: 24,
      timestamp: '1 day ago',
      tags: ['Anxiety', 'Mental Health']
    },
    {
      id: 4,
      author: {
        name: 'Alex W.',
        avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
        level: 'Intermediate'
      },
      title: 'Morning vs. Evening meditation',
      content: 'I have always meditated in the evenings before bed, but I am considering switching to mornings. For those who have tried both, which do you prefer and why? Any tips for establishing a morning practice?',
      likes: 19,
      comments: 21,
      timestamp: '2 days ago',
      tags: ['Routine', 'Timing']
    }
  ];
  
  // Sample challenges data for demo purposes
  const challengesData = [
    {
      id: 1,
      title: '30-Day Mindfulness Challenge',
      description: 'Meditate for at least 10 minutes every day for 30 days straight.',
      participants: 1248,
      startDate: 'March 15, 2025',
      endDate: 'April 13, 2025',
      image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      status: 'active',
      progress: 60
    },
    {
      id: 2,
      title: 'Morning Ritual Challenge',
      description: 'Start each day with a 15-minute meditation before checking your phone.',
      participants: 856,
      startDate: 'March 1, 2025',
      endDate: 'March 31, 2025',
      image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      status: 'active',
      progress: 80
    },
    {
      id: 3,
      title: 'Stress Reduction Week',
      description: 'Practice stress-reduction techniques for 20 minutes daily for one week.',
      participants: 1502,
      startDate: 'April 10, 2025',
      endDate: 'April 17, 2025',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      status: 'upcoming',
      progress: 0
    },
    {
      id: 4,
      title: 'Gratitude Meditation Challenge',
      description: 'Focus on gratitude in your daily meditation practice for 14 days.',
      participants: 723,
      startDate: 'February 14, 2025',
      endDate: 'February 28, 2025',
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      status: 'completed',
      progress: 100
    }
  ];
  
  // Sample events data for demo purposes
  const eventsData = [
    {
      id: 1,
      title: 'Group Meditation Session',
      description: 'Join our weekly community meditation session led by experienced teachers.',
      date: 'Every Sunday',
      time: '10:00 AM - 11:00 AM',
      location: 'Online (Zoom)',
      attendees: 45,
      image: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 2,
      title: 'Mindfulness Workshop',
      description: 'A comprehensive workshop on integrating mindfulness into your daily life.',
      date: 'March 15, 2025',
      time: '2:00 PM - 4:00 PM',
      location: 'Online (Zoom)',
      attendees: 32,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 3,
      title: 'Q&A with Meditation Expert',
      description: 'Ask questions and get personalized advice from our meditation expert.',
      date: 'March 20, 2025',
      time: '7:00 PM - 8:00 PM',
      location: 'Online (Zoom)',
      attendees: 28,
      image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ];
  
  // Filter discussions based on search query
  const filteredDiscussions = discussionsData.filter(discussion => {
    if (!searchQuery) return true;
    
    return (
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  const handleLikePost = (id) => {
    // In a real app, this would update the like count in the database
    alert(`Liked post #${id}`);
  };
  
  const handleSubmitPost = (e) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) {
      alert('Please enter some content for your post');
      return;
    }
    
    // In a real app, this would add the new post to the database
    alert('Post submitted successfully!');
    setNewPostContent('');
    setShowNewPostForm(false);
  };
  
  const handleJoinChallenge = (id) => {
    // In a real app, this would add the user to the challenge participants
    alert(`Joined challenge #${id}`);
  };
  
  const handleRegisterForEvent = (id) => {
    // In a real app, this would register the user for the event
    alert(`Registered for event #${id}`);
  };
  
  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="pt-24 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 gradient-text">Meditation Community</h1>
            <p className="text-gray-300 mb-8">
              Connect with fellow meditators, share experiences, join challenges, and attend events.
            </p>
            
            {/* Tabs */}
            <div className="border-b border-gray-700 mb-8">
              <nav className="flex space-x-8">
                <button
                  className={`pb-4 px-1 ${activeTab === 'discussions' ? 'border-b-2 border-primary text-white font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('discussions')}
                >
                  Discussions
                </button>
                <button
                  className={`pb-4 px-1 ${activeTab === 'challenges' ? 'border-b-2 border-primary text-white font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('challenges')}
                >
                  Challenges
                </button>
                <button
                  className={`pb-4 px-1 ${activeTab === 'events' ? 'border-b-2 border-primary text-white font-medium' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('events')}
                >
                  Events
                </button>
              </nav>
            </div>
            
            {/* Discussions Tab */}
            {activeTab === 'discussions' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div className="w-full md:w-1/2">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="search"
                        className="block w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white"
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowNewPostForm(true)}
                    className="gradient-button"
                  >
                    Start New Discussion
                  </button>
                </div>
                
                {showNewPostForm && (
                  <div className="bg-card rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create New Discussion</h2>
                    <form onSubmit={handleSubmitPost}>
                      <div className="mb-4">
                        <label htmlFor="post-title" className="block text-gray-300 mb-2">Title</label>
                        <input
                          type="text"
                          id="post-title"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter a title for your discussion"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="post-content" className="block text-gray-300 mb-2">Content</label>
                        <textarea
                          id="post-content"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white h-32"
                          placeholder="Share your thoughts, questions, or experiences..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="post-tags" className="block text-gray-300 mb-2">Tags (comma separated)</label>
                        <input
                          type="text"
                          id="post-tags"
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                          placeholder="e.g., Beginner, Techniques, Mindfulness"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowNewPostForm(false)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="gradient-button"
                        >
                          Post Discussion
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="space-y-6">
                  {filteredDiscussions.length > 0 ? (
                    filteredDiscussions.map(discussion => (
                      <div key={discussion.id} className="bg-card rounded-xl p-6">
                        <div className="flex items-start mb-4">
                          <img 
                            src={discussion.author.avatar} 
                            alt={discussion.author.name} 
                            className="w-10 h-10 rounded-full mr-4"
                          />
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{discussion.author.name}</h3>
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">
                                {discussion.author.level}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{discussion.timestamp}</p>
                          </div>
                        </div>
                        
                        <h2 className="text-xl font-semibold mb-2">{discussion.title}</h2>
                        <p className="text-gray-300 mb-4">{discussion.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between border-t border-gray-700 pt-4">
                          <button 
                            onClick={() => handleLikePost(discussion.id)}
                            className="flex items-center text-gray-400 hover:text-primary"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {discussion.likes}
                          </button>
                          
                          <button className="flex items-center text-gray-400 hover:text-primary">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {discussion.comments}
                          </button>
                          
                          <button className="flex items-center text-gray-400 hover:text-primary">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="text-xl font-medium text-gray-400 mb-1">No discussions found</h3>
                      <p className="text-gray-500">Try adjusting your search or start a new discussion</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {challengesData.map(challenge => (
                    <div key={challenge.id} className="bg-card rounded-xl overflow-hidden">
                      <div className="relative h-40">
                        <img 
                          src={challenge.image} 
                          alt={challenge.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              challenge.status === 'active' ? 'bg-green-900/50 text-green-400' :
                              challenge.status === 'upcoming' ? 'bg-blue-900/50 text-blue-400' :
                              'bg-gray-800 text-gray-400'
                            }`}>
                              {challenge.status === 'active' ? 'Active' : 
                               challenge.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                            </span>
                            <span className="text-sm text-gray-300">{challenge.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">{challenge.title}</h2>
                        <p className="text-gray-300 mb-4">{challenge.description}</p>
                        
                        <div className="flex justify-between text-sm text-gray-400 mb-4">
                          <span>Starts: {challenge.startDate}</span>
                          <span>Ends: {challenge.endDate}</span>
                        </div>
                        
                        {challenge.status === 'active' && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Progress</span>
                              <span className="text-primary">{challenge.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${challenge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {challenge.status !== 'completed' && (
                          <button
                            onClick={() => handleJoinChallenge(challenge.id)}
                            className={`w-full py-2 rounded-lg flex items-center justify-center ${
                              challenge.status === 'active' ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'
                            }`}
                          >
                            {challenge.status === 'active' ? 'Join Challenge' : 'Get Notified'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {eventsData.map(event => (
                    <div key={event.id} className="bg-card rounded-xl overflow-hidden">
                      <div className="h-40">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                        <p className="text-gray-300 mb-4">{event.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-300">{event.date}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-300">{event.time}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-300">{event.location}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-gray-300">{event.attendees} attendees</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleRegisterForEvent(event.id)}
                          className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CommunityPage;
