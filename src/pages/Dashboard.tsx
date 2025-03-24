
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';
import ProgressChart from '@/components/ProgressChart';
import AchievementCard from '@/components/AchievementCard';
import { Play, Calendar, Award, Trophy, TrendingUp } from 'lucide-react';

interface UserProfile {
  profileImage: string | null;
  name: string;
  fitnessGoal: string;
}

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Latest runs data (mock)
  const latestRuns = [
    { id: 1, date: 'Today', title: 'Morning Run', distance: 5.2, duration: 1620, pace: 5.2 },
    { id: 2, date: 'Yesterday', title: 'Evening Jog', distance: 3.7, duration: 1200, pace: 5.4 },
    { id: 3, date: '2 days ago', title: 'Hill Training', distance: 4.5, duration: 1800, pace: 6.7 },
  ];

  // Achievement data (mock)
  const achievements = [
    { 
      id: 1, 
      title: 'First 5K', 
      description: 'Complete your first 5 kilometer run',
      type: 'distance' as const,
      value: '5 km',
      unlocked: true, 
      date: '2 days ago' 
    },
    { 
      id: 2, 
      title: 'Speed Demon', 
      description: 'Run at a pace under 5:00 min/km',
      type: 'pace' as const,
      value: '4:52 min/km',
      unlocked: true, 
      date: 'Yesterday' 
    },
    { 
      id: 3, 
      title: '10K Milestone', 
      description: 'Complete your first 10 kilometer run',
      type: 'milestone' as const,
      value: '10 km',
      unlocked: false, 
      progress: 52 
    },
    { 
      id: 4, 
      title: 'Streak Master', 
      description: 'Run for 7 consecutive days',
      type: 'streak' as const,
      value: '7 days',
      unlocked: false, 
      progress: 30 
    }
  ];

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      // Check for stored user profile
      const storedProfile = localStorage.getItem('userProfile');
      const userEmail = localStorage.getItem('userEmail');
      
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile({
          profileImage: parsedProfile.profileImage,
          name: parsedProfile.name || 'Runner',
          fitnessGoal: parsedProfile.fitnessGoal || 'Improve fitness'
        });
      } else {
        // Demo user if no profile exists
        setUserProfile({
          profileImage: null,
          name: userEmail ? userEmail.split('@')[0] : 'Runner',
          fitnessGoal: 'Improve fitness'
        });
      }
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format pace (min/km)
  const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.floor((pace - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* User Welcome Section */}
            <div className="glass-panel p-6 mb-8 animate-fade-in">
              <div className="flex items-center">
                <div className="mr-4">
                  {userProfile?.profileImage ? (
                    <img 
                      src={userProfile.profileImage} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-fitness-secondary flex items-center justify-center text-fitness-primary text-xl font-bold">
                      {userProfile?.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">Welcome, {userProfile?.name}</h1>
                  <p className="text-gray-600">Goal: {userProfile?.fitnessGoal || 'Improve fitness'}</p>
                </div>
                <div className="ml-auto">
                  <Link to="/training">
                    <Button
                      variant="primary"
                      leftIcon={<Play className="h-5 w-5" />}
                    >
                      Start Run
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Weekly Summary & Start Run */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Weekly Stats */}
              <div className="col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <ProgressChart className="h-full" />
              </div>
              
              {/* Next Training */}
              <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-fitness-primary mr-2" />
                  <h2 className="text-lg font-medium">Your Weekly Goals</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-fitness-secondary bg-opacity-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Distance</span>
                      <span className="text-sm font-medium">15.4km / 25km</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-fitness-primary rounded-full h-2" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-fitness-secondary bg-opacity-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Runs</span>
                      <span className="text-sm font-medium">3 / 4</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-fitness-primary rounded-full h-2" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-fitness-secondary bg-opacity-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Time</span>
                      <span className="text-sm font-medium">2h 14m / 3h</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div className="bg-fitness-primary rounded-full h-2" style={{ width: '74%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link to="/training">
                    <Button variant="primary" fullWidth>
                      Start Next Run
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Recent Runs & Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Recent Runs */}
              <div className="col-span-2 glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-fitness-primary mr-2" />
                    <h2 className="text-lg font-medium">Recent Runs</h2>
                  </div>
                  <Link to="/progress" className="text-sm text-fitness-primary hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {latestRuns.map((run) => (
                    <div key={run.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{run.title}</h3>
                          <span className="text-sm text-gray-500">{run.date}</span>
                        </div>
                        <div className="bg-fitness-secondary text-fitness-primary text-sm font-medium px-3 py-1 rounded-full">
                          {run.distance.toFixed(1)} km
                        </div>
                      </div>
                      
                      <div className="flex space-x-6 mt-3">
                        <div>
                          <span className="text-xs text-gray-500 block">Time</span>
                          <span className="font-medium">{formatTime(run.duration)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Pace</span>
                          <span className="font-medium">{formatPace(run.pace)} /km</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 block">Calories</span>
                          <span className="font-medium">{Math.round(run.distance * 62)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link to="/progress">
                    <Button variant="outline" fullWidth>
                      See All Activity
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Achievements */}
              <div className="glass-panel p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center mb-6">
                  <Trophy className="h-5 w-5 text-fitness-primary mr-2" />
                  <h2 className="text-lg font-medium">Achievements</h2>
                </div>
                
                <div className="space-y-3">
                  {achievements.map((achievement) => (
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
                
                <div className="mt-6 text-center">
                  <Button 
                    variant="ghost"
                    leftIcon={<Award className="h-5 w-5" />}
                  >
                    View All Achievements
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
