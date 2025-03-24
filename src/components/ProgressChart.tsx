
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

// Mock data - in a real app, this would come from the user's run history
const mockData = [
  { day: 'Mon', distance: 5.2 },
  { day: 'Tue', distance: 2.1 },
  { day: 'Wed', distance: 0 },
  { day: 'Thu', distance: 6.4 },
  { day: 'Fri', distance: 3.8 },
  { day: 'Sat', distance: 8.1 },
  { day: 'Sun', distance: 4.5 },
];

interface ProgressChartProps {
  data?: Array<{ day: string; distance: number }>;
  timeRange?: 'week' | 'month' | 'year';
  className?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  data = mockData,
  timeRange = 'week',
  className,
}) => {
  return (
    <div className={cn('w-full glass-panel p-4', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Running Progress</h3>
        <p className="text-sm text-gray-500">Distance over time</p>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888888' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888888' }}
              unit=" km"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '8px'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="distance" 
              stroke="#0EA5E9" 
              fillOpacity={1} 
              fill="url(#colorDistance)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
