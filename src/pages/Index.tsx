
import React from 'react';
import Navbar from '@/components/Navbar';
import CareerForm from '@/components/CareerForm';
import CareerSuggestion from '@/components/CareerSuggestion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-4 md:p-8 lg:p-12">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Career Guidance</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Fill out the form below to receive personalized career suggestions based on your profile
            </p>
          </div>
          
          <Card className="mb-10 shadow-sm border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-medium">Your Information</CardTitle>
              <CardDescription>
                Tell us about yourself to get tailored career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CareerForm />
            </CardContent>
          </Card>
          
          <CareerSuggestion />
        </div>
      </div>
    </div>
  );
};

export default Index;
