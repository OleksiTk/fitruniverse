
import { useState, useEffect, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export const useLocation = () => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mock location for demo purposes
  // In a real app, this would use the browser's Geolocation API
  const mockLocation = useCallback((): Location => {
    const baseLocation = { lat: 40.712776, lng: -74.005974 }; // NYC
    
    if (!currentLocation) return baseLocation;
    
    // Create small random movement
    return {
      lat: currentLocation.lat + (Math.random() * 0.002 - 0.001),
      lng: currentLocation.lng + (Math.random() * 0.002 - 0.001),
      accuracy: Math.random() * 10 + 5,
      timestamp: Date.now()
    };
  }, [currentLocation]);

  // Start location tracking
  const startTracking = useCallback(() => {
    setIsTracking(true);
    setLocationHistory([]);
    
    // In a real app, this would request permission and start tracking real location
    const initialLocation = mockLocation();
    setCurrentLocation(initialLocation);
    setLocationHistory([initialLocation]);
  }, [mockLocation]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  // This would be replaced with real Geolocation API in a production app
  useEffect(() => {
    if (!isTracking) return;
    
    const intervalId = setInterval(() => {
      const newLocation = mockLocation();
      setCurrentLocation(newLocation);
      setLocationHistory(prev => [...prev, newLocation]);
    }, 2000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isTracking, mockLocation]);

  return {
    isTracking,
    currentLocation,
    locationHistory,
    startTracking,
    stopTracking,
    error
  };
};
