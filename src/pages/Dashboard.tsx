
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Award, FileText, MessageSquare, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Dashboard mounted, user state:", !!user);
    // Clean up any potential stuck loading states in stores
    return () => {
      console.log("Dashboard unmounted");
    };
  }, []);

  const features = [
    {
      title: "Resume Analysis",
      description: "Get personalized suggestions to improve your resume",
      icon: <FileText className="h-6 w-6" />,
      path: "/resume-analysis"
    },
    {
      title: "Job Market Insights",
      description: "Explore current trends and in-demand skills",
      icon: <TrendingUp className="h-6 w-6" />,
      path: "/job-market"
    },
    {
      title: "Mock Interview",
      description: "Practice with our AI-powered interview bot",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/interview-bot"
    },
    {
      title: "Career Recommendations",
      description: "Discover the best career path for your profile",
      icon: <Award className="h-6 w-6" />,
      path: "/"
    }
  ];

  const handleFeatureClick = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome{user ? `, ${user.email?.split('@')[0]}` : ''}!</h1>
            <p className="text-gray-600">
              Explore tools and resources to advance your career journey
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                What would you like to accomplish today?
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={() => navigate('/resume-analysis')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Analyze Your Resume
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/job-market')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Explore Job Market Trends
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
