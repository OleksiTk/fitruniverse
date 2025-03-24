
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Map from '@/components/Map';
import RunMetrics from '@/components/RunMetrics';
import { Play, Pause, StopCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useRunTracking } from '@/hooks/useRunTracking';

const Training = () => {
  const navigate = useNavigate();
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  const { 
    isRunning, 
    metrics, 
    startRun, 
    stopRun, 
    currentLocation 
  } = useRunTracking();

  const [isPaused, setIsPaused] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);

  // Start run when component mounts (for demo purposes)
  useEffect(() => {
    // For demo, we automatically start the run
    if (!isRunning) {
      const timer = setTimeout(() => {
        handleStartRun();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  const handleStartRun = () => {
    startRun();
    toast.success('Run started. Good luck!');
  };

  const handlePauseRun = () => {
    setIsPaused(!isPaused);
    toast(isPaused ? 'Run resumed' : 'Run paused');
    // In a real app, we would pause location tracking and timer
  };

  const handleStopRun = () => {
    if (!confirmStop) {
      setConfirmStop(true);
      toast('Tap "Stop" again to end your run', {
        duration: 3000,
      });
      return;
    }
    
    const runData = stopRun();
    // Store run data in localStorage for the summary page
    localStorage.setItem('lastRunData', JSON.stringify(runData));
    
    // Navigate to summary page
    navigate('/run-summary');
  };

  const toggleMetricsView = () => {
    setShowFullMetrics(!showFullMetrics);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-24">
        {/* Map Section */}
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <Map isTracking={isRunning && !isPaused} className="h-full" />
          
          {/* Overlay at the bottom of the map */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/70 to-transparent" />
        </div>
        
        {/* Metrics Section */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Current Run</h2>
              <button 
                onClick={toggleMetricsView}
                className="flex items-center text-sm text-gray-600"
              >
                {showFullMetrics ? (
                  <>
                    <span>Collapse</span>
                    <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            
            {/* Run Metrics */}
            <div className="animate-fade-in">
              <RunMetrics 
                distance={metrics.distance}
                duration={metrics.duration}
                pace={metrics.pace}
                speed={metrics.speed}
                calories={metrics.calories}
                cadence={metrics.cadence}
                elevation={metrics.elevation}
                compact={!showFullMetrics}
              />
            </div>
          </div>
        </div>
        
        {/* Control Panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
          <div className="container mx-auto flex justify-between items-center">
            {isRunning ? (
              <>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-1/3"
                  onClick={handleStopRun}
                >
                  <StopCircle className="h-6 w-6 text-red-500" />
                  <span className="ml-2">Stop</span>
                </Button>
                
                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-1/3"
                  onClick={handlePauseRun}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-6 w-6" />
                      <span className="ml-2">Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-6 w-6" />
                      <span className="ml-2">Pause</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                size="lg"
                className="w-full"
                onClick={handleStartRun}
              >
                <Play className="h-6 w-6" />
                <span className="ml-2">Start Run</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
