
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ExpertForm from '@/components/experts/ExpertForm';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { getExpertProfile } from '@/lib/expertApi';
import { toast } from '@/hooks/use-toast';

const ExpertProfileEdit = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const { data: expertProfile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['expertProfile', user?.id],
    queryFn: () => getExpertProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your expert profile.',
        variant: 'destructive',
      });
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { state: { from: '/expert-profile/edit' } });
    }
  }, [loading, user, navigate]);
  
  useEffect(() => {
    if (!loading && !profileLoading && !expertProfile && !error) {
      toast({
        title: 'No Profile Found',
        description: 'You need to create an expert profile first.',
      });
      navigate('/expert-registration');
    }
  }, [loading, profileLoading, expertProfile, error, navigate]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Edit Your Expert Profile</h1>
          {expertProfile && <ExpertForm existingProfile={expertProfile} />}
        </div>
      </main>
    </div>
  );
};

export default ExpertProfileEdit;
