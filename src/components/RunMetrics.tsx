
import React from 'react';
import { Clock, Navigation, Map, Flame, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RunMetricsProps {
  distance: number;
  duration: number;
  pace: number;
  speed: number;
  calories: number;
  cadence: number;
  elevation: number;
  compact?: boolean;
  className?: string;
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatPace = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.floor((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const RunMetrics: React.FC<RunMetricsProps> = ({
  distance,
  duration,
  pace,
  speed,
  calories,
  cadence,
  elevation,
  compact = false,
  className
}) => {
  const metrics = [
    {
      label: 'Distance',
      value: distance.toFixed(2),
      unit: 'km',
      icon: <Map className="h-5 w-5 text-fitness-primary" />,
    },
    {
      label: 'Time',
      value: formatDuration(duration),
      unit: '',
      icon: <Clock className="h-5 w-5 text-fitness-primary" />,
    },
    {
      label: 'Pace',
      value: formatPace(pace),
      unit: '/km',
      icon: <Navigation className="h-5 w-5 text-fitness-primary" />,
    },
    {
      label: 'Speed',
      value: speed.toFixed(1),
      unit: 'km/h',
      icon: <Navigation className="h-5 w-5 text-fitness-primary" />,
    },
    {
      label: 'Calories',
      value: calories.toFixed(0),
      unit: 'kcal',
      icon: <Flame className="h-5 w-5 text-fitness-primary" />,
    },
    {
      label: 'Cadence',
      value: cadence.toFixed(0),
      unit: 'spm',
      icon: <Activity className="h-5 w-5 text-fitness-primary" />,
    },
    {
      label: 'Elevation',
      value: elevation.toFixed(0),
      unit: 'm',
      icon: <TrendingUp className="h-5 w-5 text-fitness-primary" />,
    },
  ];

  return (
    <div className={cn('w-full', className)}>
      {compact ? (
        <div className="flex flex-nowrap overflow-x-auto pb-4 gap-3 hide-scrollbar">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex-shrink-0 glass-panel p-3 min-w-[100px]">
              <div className="flex items-center justify-between mb-1">
                {metric.icon}
                <span className="text-xs text-gray-500">{metric.label}</span>
              </div>
              <div className="font-medium">
                {metric.value}
                <span className="text-xs text-gray-500 ml-1">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <div className="flex items-center justify-center mb-2">
                {metric.icon}
                <span className="text-sm text-gray-500 ml-2">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold">
                {metric.value}
                <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RunMetrics;
