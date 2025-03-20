
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getExpertProfile, getExpertReferralRequests } from '@/lib/expertApi';
import ReferralRequestCard from '@/components/experts/ReferralRequestCard';
import { Skeleton } from '@/components/ui/skeleton';

const ExpertDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const { 
    data: expertProfile, 
    isLoading: profileLoading,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['expertProfile', user?.id],
    queryFn: () => getExpertProfile(user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: referralRequests,
    isLoading: requestsLoading,
    refetch: refetchRequests
  } = useQuery({
    queryKey: ['expertReferralRequests', user?.id],
    queryFn: getExpertReferralRequests,
    enabled: !!expertProfile,
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    navigate('/login', { state: { from: '/expert-dashboard' } });
    return null;
  }

  const handleCreateProfile = () => {
    navigate('/expert-registration');
  };

  const handleEditProfile = () => {
    navigate('/expert-profile/edit');
  };

  const getPendingRequestsCount = () => {
    if (!referralRequests) return 0;
    return referralRequests.filter(req => req.status === 'pending').length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Expert Dashboard</h1>
          
          {!profileLoading && !expertProfile ? (
            <Card>
              <CardHeader>
                <CardTitle>Become an Industry Expert</CardTitle>
                <CardDescription>
                  You haven't created an expert profile yet. Create one to start receiving referral requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCreateProfile}>Create Expert Profile</Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="profile">Your Profile</TabsTrigger>
                  <TabsTrigger value="requests" className="relative">
                    Referral Requests
                    {getPendingRequestsCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getPendingRequestsCount()}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="profile" className="space-y-6">
                {profileLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : expertProfile && (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl">{expertProfile.name}</CardTitle>
                          <CardDescription className="text-lg">{expertProfile.role} at {expertProfile.organization}</CardDescription>
                        </div>
                        <Button onClick={handleEditProfile} size="sm">Edit Profile</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                        <p>{expertProfile.is_available ? 'Available for referrals' : 'Not currently accepting referrals'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p className="text-gray-700">{expertProfile.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="requests" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Referral Requests</h2>
                  <Button variant="outline" size="sm" onClick={() => refetchRequests()}>
                    Refresh
                  </Button>
                </div>
                
                {requestsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                  </div>
                ) : referralRequests && referralRequests.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Pending Requests</h3>
                      <div className="space-y-4">
                        {referralRequests
                          .filter(req => req.status === 'pending')
                          .map(request => (
                            <ReferralRequestCard 
                              key={request.id} 
                              request={request} 
                              isExpert={true}
                              onStatusChange={refetchRequests}
                            />
                          ))}
                        {referralRequests.filter(req => req.status === 'pending').length === 0 && (
                          <p className="text-gray-500 text-center py-4">No pending requests</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Processed Requests</h3>
                      <div className="space-y-4">
                        {referralRequests
                          .filter(req => req.status !== 'pending')
                          .map(request => (
                            <ReferralRequestCard 
                              key={request.id} 
                              request={request} 
                              isExpert={true}
                              onStatusChange={refetchRequests}
                            />
                          ))}
                        {referralRequests.filter(req => req.status !== 'pending').length === 0 && (
                          <p className="text-gray-500 text-center py-4">No processed requests</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium">No Referral Requests Yet</h3>
                    <p className="text-gray-500 mt-2">
                      You haven't received any referral requests yet. When users send you requests, they'll appear here.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboard;
