
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIndustryInsights } from '@/lib/jobMarketApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const IndustryInsights = () => {
  const { toast } = useToast();
  const [retry, setRetry] = useState(false);
  const [loadingTimeoutReached, setLoadingTimeoutReached] = useState(false);
  
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ['industryInsights', retry],
    queryFn: fetchIndustryInsights,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      console.log("IndustryInsights loading started", new Date().toISOString());
      // Set a timeout to handle stuck loading state
      timeout = setTimeout(() => {
        console.log("IndustryInsights loading timeout reached, forcing retry", new Date().toISOString());
        setLoadingTimeoutReached(true);
        setRetry(prev => !prev);
        
        toast({
          title: "Loading timeout reached",
          description: "Attempting to refresh data automatically",
          variant: "destructive",
        });
      }, 8000); // 8 second timeout
    } else {
      console.log("IndustryInsights loading completed", new Date().toISOString());
      if (loadingTimeoutReached) {
        setLoadingTimeoutReached(false);
      }
    }
    
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        console.log("IndustryInsights clearing timeout on unmount");
      }
    };
  }, [isLoading, toast, loadingTimeoutReached]);

  // Force a refresh if error occurs
  useEffect(() => {
    if (isError && !loadingTimeoutReached) {
      console.error("Industry insights error detected, attempting auto-recovery");
      const recoveryTimeout = setTimeout(() => {
        refetch();
      }, 2000);
      
      return () => clearTimeout(recoveryTimeout);
    }
  }, [isError, refetch, loadingTimeoutReached]);

  if (isLoading && !loadingTimeoutReached) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (error || loadingTimeoutReached) {
    console.error("Industry insights data fetch error:", error);
    return (
      <div className="text-red-500 py-4 flex flex-col items-center">
        <p className="mb-3">Failed to load industry insights data</p>
        <Button 
          onClick={() => {
            setLoadingTimeoutReached(false);
            refetch();
          }} 
          variant="outline"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-amber-500 py-4">No industry data available at this time</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((industry) => (
        <Card key={industry.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{industry.name}</CardTitle>
              {industry.growthRate > 30 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-blue-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
              <div className="text-2xl font-bold">{industry.growthRate}%</div>
            </div>
            
            <div className="mb-3">
              <div className="text-sm text-gray-500 mb-1">Job Openings</div>
              <div className="text-lg">{industry.jobOpenings.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Top Skill</div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-amber-500" />
                <span>{industry.topSkill}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IndustryInsights;
