
import React from 'react';
import { cn } from '@/lib/utils';
import { Award, Medal, Clock, Navigation, Map } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  type: 'distance' | 'pace' | 'streak' | 'milestone';
  value: string;
  unlocked?: boolean;
  progress?: number;
  date?: string;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  type,
  value,
  unlocked = false,
  progress = 0,
  date,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'distance':
        return <Map className="h-6 w-6" />;
      case 'pace':
        return <Navigation className="h-6 w-6" />;
      case 'streak':
        return <Clock className="h-6 w-6" />;
      case 'milestone':
        return <Medal className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-xl transition-all duration-300',
        {
          'glass-panel hover:shadow-md': unlocked,
          'bg-gray-100 border border-gray-200': !unlocked,
        },
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            'p-2 rounded-lg',
            {
              'bg-fitness-secondary text-fitness-primary': unlocked,
              'bg-gray-200 text-gray-400': !unlocked
            }
          )}>
            {getIcon()}
          </div>
          {unlocked && date && (
            <span className="text-xs text-gray-500">{date}</span>
          )}
        </div>
        
        <h3 className={cn(
          'text-lg font-medium mb-1',
          { 'text-gray-400': !unlocked }
        )}>
          {title}
        </h3>
        
        <p className={cn(
          'text-sm mb-3',
          {
            'text-gray-600': unlocked,
            'text-gray-400': !unlocked
          }
        )}>
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-sm font-bold',
            {
              'text-fitness-primary': unlocked,
              'text-gray-400': !unlocked
            }
          )}>
            {value}
          </span>
          
          {!unlocked && progress > 0 && (
            <div className="w-1/2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-fitness-primary rounded-full h-2"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          )}
          
          {unlocked && (
            <Award className="h-5 w-5 text-fitness-accent" />
          )}
        </div>
      </div>
      
      {unlocked && (
        <div className="absolute top-0 right-0">
          <div className="w-16 h-16 bg-fitness-primary rotate-45 transform origin-bottom-left translate-y-[-50%] translate-x-[50%] opacity-10"></div>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
