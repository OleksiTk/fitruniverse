
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Map from '@/components/Map';
import RunMetrics from '@/components/RunMetrics';
import { Share2, Award, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

interface RunData {
  distance: number;
  duration: number;
  pace: number;
  speed: number;
  calories: number;
  cadence: number;
  elevation: number;
  route: Array<{ lat: number; lng: number }>;
  splits: Array<{ distance: number; time: number; pace: number }>;
}

const RunSummary = () => {
  const navigate = useNavigate();
  const [runData, setRunData] = useState<RunData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<{ title: string; description: string }[]>([]);

  useEffect(() => {
    // Get run data from localStorage
    const storedRunData = localStorage.getItem('lastRunData');
    
    if (storedRunData) {
      const parsedData = JSON.parse(storedRunData);
      setRunData(parsedData);
      
      // Determine if user earned any achievements
      const newAchievements = [];
      
      if (parsedData.distance >= 5) {
        newAchievements.push({
          title: 'First 5K',
          description: 'Completed your first 5 kilometer run!'
        });
      }
      
      if (parsedData.pace < 5) {
        newAchievements.push({
          title: 'Speed Demon',
          description: 'Ran at a pace under 5:00 min/km!'
        });
      }
      
      if (parsedData.calories > 300) {
        newAchievements.push({
          title: 'Calorie Crusher',
          description: 'Burned over 300 calories in a single run!'
        });
      }
      
      setAchievements(newAchievements);
    } else {
      // If no run data, create mock data for the demo
      setRunData({
        distance: 5.24,
        duration: 1852,
        pace: 5.9,
        speed: 10.2,
        calories: 384,
        cadence: 162,
        elevation: 48,
        route: [],
        splits: [
          { distance: 1, time: 352, pace: 5.87 },
          { distance: 2, time: 368, pace: 6.13 },
          { distance: 3, time: 371, pace: 6.18 },
          { distance: 4, time: 358, pace: 5.97 },
          { distance: 5, time: 348, pace: 5.8 },
          { distance: 5.24, time: 55, pace: 5.51 }
        ]
      });
      
      setAchievements([
        {
          title: 'First 5K',
          description: 'Completed your first 5 kilometer run!'
        }
      ]);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleSaveRun = () => {
    // In a real app, this would save run data to a database
    toast.success('Run saved to your history');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleShareRun = () => {
    toast.success('Sharing options would open here');
  };

  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
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
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Run Summary Header */}
              <div className="glass-panel p-6">
                <h1 className="text-2xl font-bold mb-2">Run Summary</h1>
                <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                
                {achievements.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className="bg-fitness-success bg-opacity-20 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        <Award className="h-4 w-4 mr-1" />
                        {achievement.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Map Section */}
              <Map route={runData?.route} className="h-64 md:h-80" />
              
              {/* Metrics Section */}
              <div className="glass-panel p-6">
                <h2 className="text-xl font-medium mb-4">Run Details</h2>
                {runData && (
                  <RunMetrics 
                    distance={runData.distance}
                    duration={runData.duration}
                    pace={runData.pace}
                    speed={runData.speed}
                    calories={runData.calories}
                    cadence={runData.cadence}
                    elevation={runData.elevation}
                  />
                )}
              </div>
              
              {/* Splits Section */}
              {runData?.splits && runData.splits.length > 0 && (
                <div className="glass-panel p-6">
                  <h2 className="text-xl font-medium mb-4">Split Times</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="pb-2 font-medium text-gray-600">Kilometer</th>
                          <th className="pb-2 font-medium text-gray-600">Split Time</th>
                          <th className="pb-2 font-medium text-gray-600">Pace</th>
                        </tr>
                      </thead>
                      <tbody>
                        {runData.splits.map((split, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3">{split.distance.toFixed(1)} km</td>
                            <td className="py-3">{formatTime(split.time)}</td>
                            <td className="py-3">{formatPace(split.pace)} /km</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* New Achievements Section */}
              {achievements.length > 0 && (
                <div className="glass-panel p-6 bg-fitness-success bg-opacity-10">
                  <h2 className="text-xl font-medium mb-4">Achievements Unlocked</h2>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Award className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Actions Section */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  leftIcon={<Check className="h-5 w-5" />}
                  onClick={handleSaveRun}
                >
                  Save Run
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  leftIcon={<Share2 className="h-5 w-5" />}
                  onClick={handleShareRun}
                >
                  Share Run
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RunSummary;
