
import React, { useState, useEffect } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchJobTrends } from '@/lib/jobMarketApi';
import { useToast } from '@/hooks/use-toast';

const config = {
  technology: { color: "#4f46e5" },
  healthcare: { color: "#06b6d4" },
  finance: { color: "#10b981" },
  education: { color: "#f59e0b" },
  manufacturing: { color: "#ef4444" },
  retail: { color: "#8b5cf6" },
};

const JobTrendsChart = () => {
  const { toast } = useToast();
  const [retry, setRetry] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['jobTrends', retry],
    queryFn: fetchJobTrends,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      // Set a timeout to handle stuck loading state
      timeout = setTimeout(() => {
        console.log("JobTrendsChart loading timeout reached, forcing retry");
        setRetry(prev => !prev);
      }, 10000); // 10 second timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  if (error) {
    console.error("Job trends data fetch error:", error);
    return (
      <div className="text-red-500 py-4 flex flex-col items-center">
        <p className="mb-3">Failed to load job trends data</p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-amber-500 py-4">No job trends data available at this time</div>;
  }

  return (
    <div className="h-[400px] w-full">
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 70,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[0, 'dataMax + 5']}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload?.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="font-medium mb-2">{label}</div>
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>{`Growth: ${entry.value}%`}</span>
                        </div>
                      ))}
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="growth" fill="#4f46e5" name="Growth Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default JobTrendsChart;
