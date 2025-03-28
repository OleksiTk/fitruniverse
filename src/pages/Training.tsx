import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { Play, Pause, StopCircle, ChevronUp, ChevronDown } from "lucide-react";
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
import "leaflet/dist/leaflet.css"; // Не забудьте імпортувати стилі для Leaflet
import "../App.css";
import L from "leaflet";
import RunMetrics from "@/components/RunMetrics";
import { createStatsProfile } from "../firebase.js";
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

// Function to calculate speed
const calculateSpeed = (distance, timeInSeconds) => {
  if (distance > 0 && timeInSeconds > 0) {
    // Correct speed calculation in km/h
    return distance / 1000 / (timeInSeconds / 3600); // speed in km/h
  }
  return 0;
};

// Function to calculate calories based on distance
const calculateCalories = (distance, weight = 70) => {
  const caloriesPerKm = 0.9; // Rough estimate for a person of average weight (70kg)
  return distance * caloriesPerKm * (weight / 70);
};

const Training = () => {
  const dispatch = useDispatch();
  const [run, setRun] = useState(false);
  const longitude = useSelector((state: any) => state.checkPosition.longitude);
  const latitude = useSelector((state: any) => state.checkPosition.latitude);
  const [location, setLocation] = useState([latitude, longitude]);
  const [path, setPath] = useState([location]); // Track path
  const [isRunningF, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  const [startTime, setStartTime] = useState(null);
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
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    let interval;
    let lastPosition = location; // Записуємо останню позицію для порівняння
    let stationaryTime = 0; // Лічильник часу, коли людина не рухається

    if (run) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1); // Інкрементуємо час кожну секунду

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation([latitude, longitude]);
              dispatch(pushValueState({ latitude, longitude }));

              // Перевірка, чи людина змістилася
              const threshold = 0.000045; // Поріг зміни координат для 5 метрів
              const isStationary =
                Math.abs(latitude - lastPosition[0]) < threshold &&
                Math.abs(longitude - lastPosition[1]) < threshold;

              if (isStationary) {
                // Якщо людина стоїть, збільшуємо лічильник часу без руху
                stationaryTime += 1;
              } else {
                // Якщо координати змінилися, скидаємо лічильник часу
                stationaryTime = 0;
              }

              // Якщо людина не рухається більше 5 секунд, не рахувати відстань і швидкість
              if (stationaryTime > 5) {
                return; // Якщо стоїть більше 5 секунд, не оновлюємо відстань і швидкість
              }

              // Якщо людина рухається, обчислюємо відстань та швидкість
              if (path.length > 1) {
                const lastPositionInPath = path[path.length - 1];
                const dist = calculateDistance(
                  lastPositionInPath[0],
                  lastPositionInPath[1],
                  latitude,
                  longitude
                );
                console.log(
                  lastPositionInPath[0],
                  lastPositionInPath[1],
                  latitude,
                  longitude
                );

                setDistance((prev) => prev + dist); // Додаємо нову відстань до загальної
              }

              // Додаємо нові координати до шляху
              setPath((prevPath) => [...prevPath, [latitude, longitude]]);

              // Обчислюємо швидкість та калорії
              setSpeed(calculateSpeed(distance, elapsedTime) || 0);
              setCalories(calculateCalories(distance) || 0);

              // Оновлюємо останню позицію
              lastPosition = [latitude, longitude];
            },
            (error) => {
              console.error("Error getting geolocation:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }, 1000); // Оновлюємо позицію кожну секунду
    }

    return () => clearInterval(interval);
  }, [run, path, elapsedTime, distance]);

  const handleStartRun = () => {
    if (!isRunningF) {
      setRun(true);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePauseRun = () => {
    if (isRunningF) {
      setRun(false);
      setSpeed(0);
      setIsPaused(true);
    }

    if (isPaused) {
      setRun(true);
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handleStopRun = () => {
    const metrics = {
      distance: distance.toFixed(2),
      time: formatDuration(elapsedTime),
      pace: speed.toFixed(1),
      speed: speed.toFixed(1),
      calories: calories.toFixed(0),
    };
    console.log(metrics);

    createStatsProfile(metrics);
    setConfirmStop(true);

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
            {/* Marker */}
            <Marker position={location} icon={customIcon}>
              <Popup>I'm running here!</Popup>
            </Marker>
            {/* Path */}
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

            <div className="animate-fade-in">
              <RunMetrics
                distance={
                  typeof distance === "number" && !isNaN(distance)
                    ? distance
                    : "0.00"
                }
                duration={elapsedTime}
                pace={
                  typeof speed === "number" && !isNaN(speed) ? speed : "0.00"
                }
                speed={
                  typeof speed === "number" && !isNaN(speed) ? speed : "0.00"
                }
                calories={
                  typeof calories === "number" && !isNaN(calories)
                    ? calories
                    : "0.00"
                }
                cadence={0} // Example placeholder for cadence
                elevation={0} // Example placeholder for elevation
                compact={!showFullMetrics}
              />
            </div>
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
