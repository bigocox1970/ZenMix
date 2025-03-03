import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [timeRange, setTimeRange] = useState('week');
  
  // Sample data for demo purposes
  const weeklyData = [
    { day: 'Mon', minutes: 15, mood: 'calm' },
    { day: 'Tue', minutes: 20, mood: 'focused' },
    { day: 'Wed', minutes: 10, mood: 'tired' },
    { day: 'Thu', minutes: 15, mood: 'calm' },
    { day: 'Fri', minutes: 0, mood: null },
    { day: 'Sat', minutes: 30, mood: 'relaxed' },
    { day: 'Sun', minutes: 25, mood: 'energized' }
  ];
  
  const monthlyData = [
    { week: 'Week 1', minutes: 85, sessions: 5 },
    { week: 'Week 2', minutes: 120, sessions: 7 },
    { week: 'Week 3', minutes: 95, sessions: 6 },
    { week: 'Week 4', minutes: 150, sessions: 8 }
  ];
  
  const yearlyData = [
    { month: 'Jan', minutes: 320, sessions: 20 },
    { month: 'Feb', minutes: 420, sessions: 24 },
    { month: 'Mar', minutes: 380, sessions: 22 },
    { month: 'Apr', minutes: 450, sessions: 28 },
    { month: 'May', minutes: 520, sessions: 30 },
    { month: 'Jun', minutes: 480, sessions: 28 },
    { month: 'Jul', minutes: 600, sessions: 35 },
    { month: 'Aug', minutes: 550, sessions: 32 },
    { month: 'Sep', minutes: 500, sessions: 30 },
    { month: 'Oct', minutes: 580, sessions: 34 },
    { month: 'Nov', minutes: 620, sessions: 36 },
    { month: 'Dec', minutes: 400, sessions: 25 }
  ];
  
  // Calculate stats based on time range
  const calculateStats = () => {
    if (timeRange === 'week') {
      const totalMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);
      const sessionsCompleted = weeklyData.filter(day => day.minutes > 0).length;
      const averageMinutes = totalMinutes / sessionsCompleted || 0;
      const streak = calculateStreak(weeklyData);
      
      return {
        totalMinutes,
        sessionsCompleted,
        averageMinutes: Math.round(averageMinutes),
        streak
      };
    } else if (timeRange === 'month') {
      const totalMinutes = monthlyData.reduce((sum, week) => sum + week.minutes, 0);
      const sessionsCompleted = monthlyData.reduce((sum, week) => sum + week.sessions, 0);
      const averageMinutes = totalMinutes / sessionsCompleted || 0;
      
      return {
        totalMinutes,
        sessionsCompleted,
        averageMinutes: Math.round(averageMinutes),
        streak: 3 // Hardcoded for demo
      };
    } else {
      const totalMinutes = yearlyData.reduce((sum, month) => sum + month.minutes, 0);
      const sessionsCompleted = yearlyData.reduce((sum, month) => sum + month.sessions, 0);
      const averageMinutes = totalMinutes / sessionsCompleted || 0;
      
      return {
        totalMinutes,
        sessionsCompleted,
        averageMinutes: Math.round(averageMinutes),
        streak: 3 // Hardcoded for demo
      };
    }
  };
  
  // Calculate current streak
  const calculateStreak = (data) => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].minutes > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };
  
  const stats = calculateStats();
  
  // Get max value for chart scaling
  const getMaxValue = () => {
    if (timeRange === 'week') {
      return Math.max(...weeklyData.map(d => d.minutes)) * 1.2;
    } else if (timeRange === 'month') {
      return Math.max(...monthlyData.map(d => d.minutes)) * 1.2;
    } else {
      return Math.max(...yearlyData.map(d => d.minutes)) * 1.2;
    }
  };
  
  const maxValue = getMaxValue();
  
  // Get chart data based on time range
  const getChartData = () => {
    if (timeRange === 'week') {
      return weeklyData;
    } else if (timeRange === 'month') {
      return monthlyData;
    } else {
      return yearlyData;
    }
  };
  
  const chartData = getChartData();
  
  // Get labels for chart
  const getChartLabels = () => {
    if (timeRange === 'week') {
      return weeklyData.map(d => d.day);
    } else if (timeRange === 'month') {
      return monthlyData.map(d => d.week);
    } else {
      return yearlyData.map(d => d.month);
    }
  };
  
  const chartLabels = getChartLabels();
  
  // Get values for chart
  const getChartValues = () => {
    if (timeRange === 'week') {
      return weeklyData.map(d => d.minutes);
    } else if (timeRange === 'month') {
      return monthlyData.map(d => d.minutes);
    } else {
      return yearlyData.map(d => d.minutes);
    }
  };
  
  const chartValues = getChartValues();
  
  // Sample achievements
  const achievements = [
    {
      id: 1,
      title: '7-Day Streak',
      description: 'Meditate for 7 consecutive days',
      progress: 100,
      completed: true,
      icon: '🔥'
    },
    {
      id: 2,
      title: 'Mindfulness Master',
      description: 'Complete 10 mindfulness meditations',
      progress: 80,
      completed: false,
      icon: '🧠'
    },
    {
      id: 3,
      title: 'Early Bird',
      description: 'Meditate before 8am for 5 days',
      progress: 60,
      completed: false,
      icon: '🌅'
    },
    {
      id: 4,
      title: 'Deep Diver',
      description: 'Complete a 30-minute meditation session',
      progress: 100,
      completed: true,
      icon: '🌊'
    },
    {
      id: 5,
      title: 'Explorer',
      description: 'Try 5 different types of meditations',
      progress: 40,
      completed: false,
      icon: '🧭'
    }
  ];
  
  // Recent sessions
  const recentSessions = [
    {
      id: 1,
      title: 'Morning Calm',
      date: 'Today, 7:30 AM',
      duration: 15,
      mood: 'energized'
    },
    {
      id: 2,
      title: 'Deep Sleep',
      date: 'Yesterday, 10:15 PM',
      duration: 20,
      mood: 'relaxed'
    },
    {
      id: 3,
      title: 'Stress Relief',
      date: 'Mar 28, 2:45 PM',
      duration: 10,
      mood: 'calm'
    },
    {
      id: 4,
      title: 'Focus & Clarity',
      date: 'Mar 27, 8:00 AM',
      duration: 15,
      mood: 'focused'
    }
  ];
  
  // Mood emoji mapping
  const moodEmoji = {
    energized: '⚡',
    relaxed: '😌',
    calm: '😊',
    focused: '🧐',
    tired: '😴'
  };
  
  return (
    <>
      <Header isLoggedIn={!!user} />
      <main className="pt-24 pb-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 gradient-text">Your Meditation Journey</h1>
            <p className="text-gray-300 mb-8">
              Track your progress, view your stats, and earn achievements as you develop your meditation practice.
            </p>
            
            {/* Time Range Selector */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-card rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setTimeRange('week')}
                >
                  Week
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setTimeRange('month')}
                >
                  Month
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                  onClick={() => setTimeRange('year')}
                >
                  Year
                </button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Total Time</h3>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats.totalMinutes}</span>
                  <span className="text-gray-400 ml-1 mb-1">minutes</span>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Sessions</h3>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats.sessionsCompleted}</span>
                  <span className="text-gray-400 ml-1 mb-1">completed</span>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Average Session</h3>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats.averageMinutes}</span>
                  <span className="text-gray-400 ml-1 mb-1">minutes</span>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400 text-sm">Current Streak</h3>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{stats.streak}</span>
                  <span className="text-gray-400 ml-1 mb-1">days</span>
                </div>
              </div>
            </div>
            
            {/* Chart */}
            <div className="bg-card rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Meditation Minutes</h2>
              <div className="h-64 flex items-end space-x-2">
                {chartValues.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary/30 hover:bg-primary/50 rounded-t-sm transition-all"
                      style={{ 
                        height: `${(value / maxValue) * 100}%`,
                        minHeight: value > 0 ? '4px' : '0'
                      }}
                    ></div>
                    <div className="text-xs text-gray-400 mt-2">{chartLabels[index]}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Achievements */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Achievements</h2>
                <div className="space-y-4">
                  {achievements.map(achievement => (
                    <div key={achievement.id} className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${achievement.completed ? 'bg-primary/20' : 'bg-gray-800'}`}>
                        {achievement.icon}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{achievement.title}</h3>
                          <span className="text-sm text-gray-400">{achievement.progress}%</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{achievement.description}</p>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${achievement.completed ? 'bg-primary' : 'bg-primary/50'}`}
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Recent Sessions */}
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Recent Sessions</h2>
                <div className="space-y-4">
                  {recentSessions.map(session => (
                    <div key={session.id} className="flex items-center p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                        {moodEmoji[session.mood] || '😐'}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{session.title}</h3>
                          <span className="text-sm text-gray-400">{session.duration} min</span>
                        </div>
                        <p className="text-sm text-gray-400">{session.date}</p>
                      </div>
                      <button className="text-primary hover:text-primary-dark ml-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => navigate('/library')}
                    className="w-full text-center text-primary hover:text-primary-dark text-sm mt-4"
                  >
                    View All Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AnalyticsPage;
