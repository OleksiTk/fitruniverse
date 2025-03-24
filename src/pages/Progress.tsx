
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import ProgressChart from '@/components/ProgressChart';
import AchievementCard from '@/components/AchievementCard';
import { Calendar, TrendingUp, Award, Clock, Map, Navigation, BarChart2 } from 'lucide-react';

// Mock data for run history
const runHistoryData = [
  { id: 1, date: '2023-06-08', title: 'Morning Run', distance: 5.2, duration: 1620, pace: 5.2, calories: 330 },
  { id: 2, date: '2023-06-07', title: 'Evening Jog', distance: 3.7, duration: 1200, pace: 5.4, calories: 240 },
  { id: 3, date: '2023-06-05', title: 'Hill Training', distance: 4.5, duration: 1800, pace: 6.7, calories: 320 },
  { id: 4, date: '2023-06-04', title: 'Easy Recovery', distance: 2.8, duration: 1020, pace: 6.1, calories: 180 },
  { id: 5, date: '2023-06-02', title: 'Long Run', distance: 8.1, duration: 2580, pace: 5.3, calories: 520 },
  { id: 6, date: '2023-06-01', title: 'Tempo Run', distance: 5.6, duration: 1680, pace: 5.0, calories: 360 },
];

// Mock data for personal bests
const personalBestsData = [
  { category: 'Longest Run', value: '8.1km', date: 'June 2, 2023' },
  { category: 'Fastest 5K', value: '25:03', date: 'June 1, 2023' },
  { category: 'Best Pace', value: '5:00/km', date: 'June 1, 2023' },
  { category: 'Most Calories', value: '520 kcal', date: 'June 2, 2023' },
];

// Mock data for statistics
const statisticsData = {
  totalRuns: 12,
  totalDistance: 54.3,
  totalDuration: 16380, // in seconds
  avgPace: 5.4,
  totalCalories: 3450,
};

// Mock data for achievements
const achievementsData = [
  { 
    id: 1, 
    title: 'First Run', 
    description: 'Complete your first run with the app',
    type: 'milestone' as const,
    value: '1 Run',
    unlocked: true, 
    date: '2 weeks ago' 
  },
  { 
    id: 2, 
    title: '5K Finisher', 
    description: 'Complete a 5 kilometer run',
    type: 'distance' as const,
    value: '5 km',
    unlocked: true, 
    date: '1 week ago' 
  },
  { 
    id: 3, 
    title: 'Speed Demon', 
    description: 'Run at a pace under 5:00 min/km',
    type: 'pace' as const,
    value: '5:00 min/km',
    unlocked: true, 
    date: '4 days ago' 
  },
  { 
    id: 4, 
    title: '10K Milestone', 
    description: 'Complete your first 10 kilometer run',
    type: 'milestone' as const,
    value: '10 km',
    unlocked: false, 
    progress: 81
  },
  { 
    id: 5, 
    title: 'Weekly Warrior', 
    description: 'Run at least 3 times in a week',
    type: 'streak' as const,
    value: '3 runs/week',
    unlocked: true, 
    date: '2 days ago' 
  },
  { 
    id: 6, 
    title: 'Half Marathon Ready', 
    description: 'Complete a 21.1 kilometer run',
    type: 'distance' as const,
    value: '21.1 km',
    unlocked: false, 
    progress: 38
  },
];

// Format time (seconds to MM:SS)
const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Progress = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [statisticsTimeframe, setStatisticsTimeframe] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Progress</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Progress Chart */}
                <div className="glass-panel p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-fitness-primary mr-2" />
                      <h2 className="text-lg font-medium">Distance Overview</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className={`px-3 py-1 text-sm rounded-full ${statisticsTimeframe === 'week' ? 'bg-fitness-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setStatisticsTimeframe('week')}
                      >
                        Week
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm rounded-full ${statisticsTimeframe === 'month' ? 'bg-fitness-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setStatisticsTimeframe('month')}
                      >
                        Month
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm rounded-full ${statisticsTimeframe === 'all' ? 'bg-fitness-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setStatisticsTimeframe('all')}
                      >
                        All Time
                      </button>
                    </div>
                  </div>
                  <ProgressChart timeRange={statisticsTimeframe === 'week' ? 'week' : 'month'} />
                </div>
                
                {/* Statistics Overview */}
                <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center mb-4">
                    <BarChart2 className="h-5 w-5 text-fitness-primary mr-2" />
                    <h2 className="text-lg font-medium">Statistics</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <span className="text-sm text-gray-500 block mb-1">Total Runs</span>
                      <span className="text-2xl font-bold">{statisticsData.totalRuns}</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <span className="text-sm text-gray-500 block mb-1">Distance</span>
                      <span className="text-2xl font-bold">{statisticsData.totalDistance.toFixed(1)}<span className="text-sm text-gray-500 ml-1">km</span></span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <span className="text-sm text-gray-500 block mb-1">Time</span>
                      <span className="text-2xl font-bold">{formatTime(statisticsData.totalDuration)}</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <span className="text-sm text-gray-500 block mb-1">Avg. Pace</span>
                      <span className="text-2xl font-bold">{statisticsData.avgPace.toFixed(1)}<span className="text-sm text-gray-500 ml-1">min/km</span></span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <span className="text-sm text-gray-500 block mb-1">Calories</span>
                      <span className="text-2xl font-bold">{statisticsData.totalCalories}<span className="text-sm text-gray-500 ml-1">kcal</span></span>
                    </div>
                  </div>
                </div>
                
                {/* Personal Bests Section */}
                <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center mb-4">
                    <Award className="h-5 w-5 text-fitness-primary mr-2" />
                    <h2 className="text-lg font-medium">Personal Bests</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {personalBestsData.map((pb, index) => (
                      <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                        <span className="text-sm text-gray-500 block mb-1">{pb.category}</span>
                        <span className="text-2xl font-bold">{pb.value}</span>
                        <span className="text-xs text-gray-500 block mt-1">{pb.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tabs for History and Achievements */}
                <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'history' ? 'border-fitness-primary text-fitness-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('history')}
                    >
                      Run History
                    </button>
                    <button
                      className={`py-3 px-6 border-b-2 font-medium text-sm ${activeTab === 'achievements' ? 'border-fitness-primary text-fitness-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveTab('achievements')}
                    >
                      Achievements
                    </button>
                  </div>
                  
                  {activeTab === 'history' ? (
                    <div className="glass-panel p-6">
                      <h2 className="text-lg font-medium mb-4">Your Run History</h2>
                      <div className="space-y-4">
                        {runHistoryData.map((run) => (
                          <div key={run.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                            <div className="flex flex-wrap justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{run.title}</h3>
                                <span className="text-sm text-gray-500">{formatDate(run.date)}</span>
                              </div>
                              <div className="bg-fitness-secondary text-fitness-primary text-sm font-medium px-3 py-1 rounded-full">
                                {run.distance.toFixed(1)} km
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-3">
                              <div>
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Time</span>
                                </div>
                                <span className="font-medium">{formatTime(run.duration)}</span>
                              </div>
                              <div>
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <Navigation className="h-3 w-3 mr-1" />
                                  <span>Pace</span>
                                </div>
                                <span className="font-medium">{run.pace.toFixed(1)} min/km</span>
                              </div>
                              <div>
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <Map className="h-3 w-3 mr-1" />
                                  <span>Distance</span>
                                </div>
                                <span className="font-medium">{run.distance.toFixed(1)} km</span>
                              </div>
                              <div>
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  <span>Calories</span>
                                </div>
                                <span className="font-medium">{run.calories} kcal</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel p-6">
                      <h2 className="text-lg font-medium mb-4">Your Achievements</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {achievementsData.map((achievement) => (
                          <AchievementCard
                            key={achievement.id}
                            title={achievement.title}
                            description={achievement.description}
                            type={achievement.type}
                            value={achievement.value}
                            unlocked={achievement.unlocked}
                            progress={achievement.progress}
                            date={achievement.date}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
