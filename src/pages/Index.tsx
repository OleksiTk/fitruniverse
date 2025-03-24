import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { ArrowRight, ChevronDown } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { pushValueState } from "@/state/state.slice";

const Index = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<[number, number] | null>(null);
  useEffect(() => {
    // Перевірка, чи підтримує браузер геолокацію
    if (navigator.geolocation) {
      // Запит геолокації
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Отримуємо координати
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          dispatch(pushValueState({ latitude, longitude }));
          console.log("succes", latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  return (
    <div className="relative min-h-screen bg-white">
      {/* Hero Section Background */}
      {/* <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-fitness-secondary to-white" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCA1NiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTU2IDI4VjBIMFYyOEgxN0MxNy4yNjUyIDI4IDI4LjA3NzkgMjggMjguMDc3OSAyOEMyOC4wNzc5IDI4IDM4LjcwOTkgMjggMzkgMjhINTZaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] bg-bottom bg-repeat-x opacity-60" />
      </div> */}
      {/* <Header transparent={true} />  це шапка*/}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 md:pt-40 md:pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span>Track Your Runs.</span>
              <br />
              <span>Achieve Your Goals.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The ultimate running companion that helps you track your progress,
              set new personal records, and connect with other runners.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Explore Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
      </section>
      {/* Features Section */}

      {/* CTA Section */}

      {/* Footer */}
    </div>
  );
};

export default Index;
