
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTopSkills } from '@/lib/jobMarketApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, TrendingUp, Check, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TopSkillsTable = () => {
  const [retry, setRetry] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['topSkills', retry],
    queryFn: fetchTopSkills,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      // Set a timeout to handle stuck loading state
      timeout = setTimeout(() => {
        console.log("TopSkillsTable loading timeout reached, forcing retry");
        setRetry(prev => !prev);
      }, 10000); // 10 second timeout
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error) {
    console.error("Top skills data fetch error:", error);
    return (
      <div className="text-red-500 py-4 flex flex-col items-center">
        <p className="mb-3">Failed to load top skills data</p>
        <Button 
          onClick={() => refetch()} 
          variant="outline"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-amber-500 py-4">No skills data available at this time</div>;
  }

  const getGrowthBadge = (growth: number) => {
    if (growth > 100) {
      return (
        <Badge className="bg-green-600">
          <TrendingUp className="mr-1 h-3 w-3" />
          High {growth}%
        </Badge>
      );
    } else if (growth > 50) {
      return (
        <Badge className="bg-blue-600">
          <ArrowUpRight className="mr-1 h-3 w-3" />
          Medium {growth}%
        </Badge>
      );
    } else {
      return (
        <Badge>
          <Check className="mr-1 h-3 w-3" />
          Stable {growth}%
        </Badge>
      );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Skill</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Growth Rate</TableHead>
          <TableHead>Demand Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((skill) => (
          <TableRow key={skill.id}>
            <TableCell className="font-medium">{skill.name}</TableCell>
            <TableCell>{skill.industry}</TableCell>
            <TableCell>{getGrowthBadge(skill.growthRate)}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${skill.demandLevel}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs">{skill.demandLevel}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TopSkillsTable;
