import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Play, Pause, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { pushValueState } from "@/state/state.slice";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";
import L from "leaflet";
import RunMetrics from "@/components/RunMetrics";

// Haversine formula for distance calculation between two points (latitude, longitude)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert degrees to radians

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c * 1000; // Distance in meters
};

// Function to calculate speed in km/h
const calculateSpeed = (distance, time) => {
  if (distance < 0 && time > 0) {
    return (distance / time) * 3.6; // speed in km/h (converted from m/s)
  }
  return 0;
};

// Function to calculate calories based on distance
const calculateCalories = (distance, weight = 70) => {
  const caloriesPerKm = 0.9; // Rough estimate for a person of average weight (70kg)
  return (distance / 1000) * caloriesPerKm * (weight / 70); // distance in km
};

const Training = () => {
  const dispatch = useDispatch();
  const longitude = useSelector((state: any) => state.checkPosition.longitude);
  const latitude = useSelector((state: any) => state.checkPosition.latitude);
  const [location, setLocation] = useState([latitude, longitude]);
  const [path, setPath] = useState([location]); // Track path
  const [isRunningF, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [calories, setCalories] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);

  const customIcon = new L.Icon({
    iconUrl: "/person.png",
    iconSize: [32, 32],
    iconAnchor: location,
    popupAnchor: [0, -32],
  });

  // Track previous distance to detect movement
  const [prevDistance, setPrevDistance] = useState(0);

  // Using useRef for timer to avoid reset on re-renders
  const timerRef = useRef(0); // Keeps track of time elapsed across re-renders

  useEffect(() => {
    let interval;

    if (isRunningF) {
      interval = setInterval(() => {
        timerRef.current += 1; // Increment timer every second
        setElapsedTime(timerRef.current); // Update state with timer value

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation([latitude, longitude]);
              dispatch(pushValueState({ latitude, longitude }));

              // Calculate distance if there is movement
              const lastPosition = path[path.length - 1];
              const dist = calculateDistance(
                lastPosition[0],
                lastPosition[1],
                latitude,
                longitude
              );

              if (dist >= 1) {
                // Only update if there's movement greater than or equal to 1 meter
                setPath((prevPath) => [...prevPath, [latitude, longitude]]);
                setDistance((prev) => prev + dist);
              }

              // Only calculate speed if distance has changed
              if (dist > 0) {
                const timeElapsedInHours = timerRef.current / 3600; // Convert time from seconds to hours
                const newSpeed = calculateSpeed(distance, timeElapsedInHours);
                setSpeed(newSpeed);

                // Update calories
                setCalories(calculateCalories(distance));
              }
            },
            (error) => {
              console.error("Error getting geolocation:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }, 1000); // Update every second
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunningF, path, distance]);

  const handleStartRun = () => {
    setDistance(0);
    setSpeed(0);
    setCalories(0);
    setElapsedTime(0);
    timerRef.current = 0; // Reset the timer when starting the run
    setIsRunning(true);
    toast.success("Run started. Good luck!");
  };

  const handlePauseRun = () => {
    setIsPaused(!isPaused);
    toast(isPaused ? "Run resumed" : "Run paused");
  };

  const handleStopRun = () => {
    if (!confirmStop) {
      setConfirmStop(true);
      toast('Tap "Stop" again to end your run', {
        duration: 3000,
      });
      return;
    }

    // Save run data
    // Navigate to summary page
    navigate("/run-summary");
  };

  const toggleMetricsView = () => {
    setShowFullMetrics(!showFullMetrics);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 pb-24">
        {/* Map Section */}
        <div className="relative w-full h-[50vh] md:h-[50vh]">
          <MapContainer center={location} zoom={18} className="map-container">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={location} icon={customIcon}>
              <Popup>I'm running here!</Popup>
            </Marker>
            <Polyline positions={path} className="map-path" />
          </MapContainer>
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
                  <span>Collapse</span>
                ) : (
                  <span>Show More</span>
                )}
              </button>
            </div>

            <RunMetrics
              distance={distance}
              duration={elapsedTime}
              pace={speed}
              speed={speed}
              calories={calories}
              cadence={0} // Example placeholder for cadence
              elevation={0} // Example placeholder for elevation
              compact={!showFullMetrics}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
          <div className="container mx-auto flex justify-between items-center">
            {isRunningF ? (
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
