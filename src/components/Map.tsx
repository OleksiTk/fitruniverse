
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Compass, MapPin } from 'lucide-react';

// Mock route data - in a real app, this would come from GPS tracking
const mockRoute = [
  { lat: 40.712776, lng: -74.005974 }, // NYC
  { lat: 40.713776, lng: -74.004974 },
  { lat: 40.714776, lng: -74.003974 },
  { lat: 40.715776, lng: -74.003574 },
  { lat: 40.716776, lng: -74.003974 },
  { lat: 40.717776, lng: -74.004974 },
];

interface MapProps {
  route?: Array<{ lat: number; lng: number }>;
  currentPosition?: { lat: number; lng: number };
  isTracking?: boolean;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  route = mockRoute,
  currentPosition = mockRoute[mockRoute.length - 1],
  isTracking = false,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with actual map implementation (e.g., Google Maps, Mapbox)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={cn(
        "w-full relative rounded-2xl overflow-hidden bg-gray-100 shadow-md",
        className
      )}
      style={{ height: '400px' }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* This would be replaced with an actual map component */}
          <div ref={mapRef} className="bg-fitness-secondary w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm">
                Map Visualization (mock)
                <br />
                In a real implementation, this would use Google Maps or Mapbox
              </p>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="bg-white rounded-full p-2 shadow-md">
              <Compass className="h-5 w-5 text-fitness-primary" />
            </button>
          </div>

          {/* Current Position Marker - would be animated in real implementation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <MapPin className="h-8 w-8 text-fitness-primary" />
              {isTracking && (
                <div className="absolute inset-0 bg-fitness-primary rounded-full opacity-30 animate-ping"></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
