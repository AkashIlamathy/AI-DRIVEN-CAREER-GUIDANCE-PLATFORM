
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, BriefcaseIcon, BuildingIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { IndustryExpert } from '@/types/expertTypes';
import ReferralRequestForm from './ReferralRequestForm';
import { toast } from '@/hooks/use-toast';

const ExpertProfile = () => {
  const { expertId } = useParams<{ expertId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showReferralForm, setShowReferralForm] = useState(false);
  
  const { data: expert, isLoading, error } = useQuery({
    queryKey: ['expert', expertId],
    queryFn: async () => {
      if (!expertId) return null;
      
      const { data, error } = await supabase
        .from('industry_experts')
        .select('*')
        .eq('id', expertId)
        .single();
        
      if (error) throw error;
      return data as IndustryExpert;
    },
    enabled: !!expertId,
  });

  const handleRequestReferral = () => {
    setShowReferralForm(true);
  };

  const handleCancelRequest = () => {
    setShowReferralForm(false);
  };

  const handleRequestSuccess = () => {
    setShowReferralForm(false);
    toast({
      title: 'Referral Request Sent',
      description: 'Your referral request has been submitted successfully.',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  if (error || !expert) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load the expert profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/experts')}>Back to Experts</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{expert.name}</CardTitle>
              <CardDescription className="text-base flex items-center mt-2">
                <BuildingIcon className="h-4 w-4 mr-1" />
                {expert.organization}
              </CardDescription>
              <div className="mt-1 flex items-center text-sm text-gray-600">
                <BriefcaseIcon className="h-4 w-4 mr-1" />
                {expert.role}
              </div>
            </div>
            <div>
              {expert.is_available ? (
                <Badge className="bg-green-500 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" /> Available for Referrals
                </Badge>
              ) : (
                <Badge variant="outline">Not Available for Referrals</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {expert.bio && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">About</h3>
              <p className="text-gray-800">{expert.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {user && expert.is_available && !showReferralForm && (
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">Interested in a referral from this expert? Submit a request with your resume and details.</p>
            <Button onClick={handleRequestReferral}>
              Request Referral
            </Button>
          </CardContent>
        </Card>
      )}

      {user && expert.is_available && showReferralForm && (
        <ReferralRequestForm 
          expertId={expert.id} 
          onCancel={handleCancelRequest} 
          onSuccess={handleRequestSuccess} 
        />
      )}

      {!user && expert.is_available && (
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">Sign in to request a referral from this expert.</p>
            <Button onClick={() => navigate('/login', { state: { from: `/experts/${expert.id}` } })}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {!expert.is_available && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">
              This expert is not currently accepting referral requests.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpertProfile;
