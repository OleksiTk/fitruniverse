import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import Map from "@/components/Map";
import RunMetrics from "@/components/RunMetrics";
import { Play, Pause, StopCircle, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useRunTracking } from "@/hooks/useRunTracking";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Не забудьте імпортувати стилі для Leaflet
import "../App.css";
import { LatLng } from "leaflet";
import { useDispatch, useSelector } from "react-redux";
import { pushValueState } from "@/state/state.slice";
import L from "leaflet";
const Training = () => {
  const dispatch = useDispatch();
  const longitude = useSelector((state: any) => state.checkPosition.longitude);
  const latitude = useSelector((state: any) => state.checkPosition.latitude);
  const [location, setLocation] = useState([latitude, longitude]); // Початкове місце (Київ)
  const [path, setPath] = useState([location]); // Стейт для шляху
  const [isRunningF, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const [showFullMetrics, setShowFullMetrics] = useState(false);
  const { isRunning, metrics, startRun, stopRun, currentLocation } =
    useRunTracking();

  const [isPaused, setIsPaused] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);
  const customIcon = new L.Icon({
    iconUrl: "/person.png", // Шлях до зображення маркера
    iconSize: [32, 32], // Розміри іконки
    iconAnchor: location, // Точка на іконці, яка буде прив'язана до координат
    popupAnchor: [0, -32], // Розташування попапу відносно маркера
  });
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        if (navigator.geolocation) {
          // Запит геолокації
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation([latitude, longitude]); // Оновлюємо місце
              dispatch(pushValueState({ latitude, longitude })); // Зберігаємо координати в Redux

              // Додаємо нові координати в масив шляху
              setPath((prevPath) => [...prevPath, [latitude, longitude]]);
              console.log("succes", latitude, longitude);
            },
            (error) => {
              console.error("Error getting geolocation:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }, 500); // Оновлюємо координати кожну секунду

      return () => clearInterval(interval); // Очищаємо interval при зупинці
    }
  }, [isRunning]); // Цей ефект працює, коли запускна активність (isRunning) змінюється

  const handleStartRun = () => {
    startRun();
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

    const runData = stopRun();
    // Store run data in localStorage for the summary page
    localStorage.setItem("lastRunData", JSON.stringify(runData));

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
          <MapContainer
            center={location}
            zoom={18}
            className="map-container" // Додаємо клас для контейнера карти
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Маркер на карті */}
            <Marker
              position={location}
              className="map-marker"
              icon={customIcon}
            >
              <Popup>I'm running here!</Popup>
            </Marker>
            {/* Шлях на карті */}
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
