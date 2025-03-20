
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import JobTrendsChart from '@/components/jobMarket/JobTrendsChart';
import TopSkillsTable from '@/components/jobMarket/TopSkillsTable';
import IndustryInsights from '@/components/jobMarket/IndustryInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const JobMarketDashboard = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Reset any lingering loading state on page load
    console.log("Job Market page loaded, checking connectivity");
    
    // Check if the user has network connectivity
    if (!navigator.onLine) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your internet connection and try again.",
      });
    }
    
    return () => {
      console.log("Job Market page unmounted");
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 md:p-8 lg:p-12">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Job Market Trends</h1>
            <p className="text-gray-500 max-w-3xl">
              Explore the latest job market trends, in-demand skills, and industry insights to help guide your career decisions.
            </p>
          </div>

          <Tabs defaultValue="trends" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="trends">Job Trends</TabsTrigger>
              <TabsTrigger value="skills">Top Skills</TabsTrigger>
              <TabsTrigger value="industries">Industry Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Job Growth Trends</CardTitle>
                  <CardDescription>
                    Job growth rates over the past 12 months across different sectors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobTrendsChart />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Most In-Demand Skills</CardTitle>
                  <CardDescription>
                    Skills with the highest growth in job postings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopSkillsTable />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="industries">
              <Card>
                <CardHeader>
                  <CardTitle>Industry Growth Insights</CardTitle>
                  <CardDescription>
                    Fastest growing industries and their projected outlook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IndustryInsights />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default JobMarketDashboard;
