
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from './useLocation';

interface RunMetrics {
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

interface UseRunTrackingProps {
  weight?: number; // in kg
  height?: number; // in cm
}

// Initial state values
const initialMetrics: RunMetrics = {
  distance: 0,
  duration: 0,
  pace: 0,
  speed: 0,
  calories: 0,
  cadence: 0,
  elevation: 0,
  route: [],
  splits: []
};

// Calculate calories burned based on weight, duration and speed
// This is a simplified formula and not fully accurate
const calculateCalories = (weightKg: number, durationHours: number, speedKmh: number): number => {
  // MET value varies based on running speed
  let met = 0;
  if (speedKmh < 8) met = 6; // light jogging
  else if (speedKmh < 10) met = 8; // jogging
  else if (speedKmh < 12) met = 10; // running
  else met = 12; // fast running
  
  // Calories = MET × weight (kg) × duration (hours)
  return met * weightKg * durationHours;
};

export const useRunTracking = ({ weight = 70, height = 175 }: UseRunTrackingProps = {}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<RunMetrics>(initialMetrics);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { 
    currentLocation, 
    locationHistory, 
    startTracking, 
    stopTracking, 
    isTracking 
  } = useLocation();

  // Start a new run
  const startRun = useCallback(() => {
    // Reset metrics
    setMetrics(initialMetrics);
    setStartTime(Date.now());
    setIsRunning(true);
    startTracking();
  }, [startTracking]);

  // Stop the current run
  const stopRun = useCallback(() => {
    setIsRunning(false);
    stopTracking();
    return { ...metrics };
  }, [metrics, stopTracking]);

  // Calculate pace from speed
  const calculatePace = useCallback((speedKmh: number): number => {
    if (speedKmh <= 0) return 0;
    // Convert km/h to min/km
    return 60 / speedKmh;
  }, []);

  // Update metrics during the run
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const calculateMetrics = () => {
      // Calculate duration in seconds
      const currentTime = Date.now();
      const durationSeconds = (currentTime - startTime) / 1000;
      const durationHours = durationSeconds / 3600;

      // Calculate distance from locationHistory
      // In a real app, this would use the Haversine formula to calculate accurate distances
      const routeLength = locationHistory.length;
      const distanceKm = routeLength > 1 ? routeLength * 0.01 : 0; // Simplified for demo

      // Calculate speed in km/h
      const speedKmh = durationHours > 0 ? distanceKm / durationHours : 0;

      // Calculate pace in min/km
      const paceMinPerKm = calculatePace(speedKmh);

      // Calculate calories based on weight, duration and speed
      const caloriesBurned = calculateCalories(weight, durationHours, speedKmh);

      // Calculate cadence (steps per minute)
      // In a real app, this would come from device sensors or be estimated from speed
      const cadence = speedKmh > 0 ? 150 + Math.random() * 20 : 0; // Mock value

      // Calculate elevation gain
      // In a real app, this would come from device sensors
      const elevationGain = distanceKm > 0 ? distanceKm * 5 + Math.random() * 10 : 0; // Mock value

      // Update metrics
      setMetrics({
        distance: distanceKm,
        duration: durationSeconds,
        pace: paceMinPerKm,
        speed: speedKmh,
        calories: caloriesBurned,
        cadence: cadence,
        elevation: elevationGain,
        route: [...locationHistory],
        splits: [] // Would be calculated based on each km completed
      });
    };

    // Update metrics every second
    const intervalId = setInterval(calculateMetrics, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning, startTime, locationHistory, weight, calculatePace]);

  return {
    isRunning,
    metrics,
    startRun,
    stopRun,
    currentLocation,
  };
};
