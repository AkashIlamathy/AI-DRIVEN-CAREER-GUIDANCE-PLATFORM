
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ReferralRequestCard from '@/components/experts/ReferralRequestCard';
import { getUserReferralRequests } from '@/lib/expertApi';
import { InboxIcon } from 'lucide-react';

const UserReferrals = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { 
    data: referralRequests, 
    isLoading: requestsLoading, 
    refetch: refetchRequests 
  } = useQuery({
    queryKey: ['userReferralRequests', user?.id],
    queryFn: getUserReferralRequests,
    enabled: !!user?.id,
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    navigate('/login', { state: { from: '/my-referrals' } });
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Referral Requests</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/experts')}
            >
              Find Experts
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
                <h2 className="text-xl font-semibold mb-3">Pending Requests</h2>
                <div className="space-y-4">
                  {referralRequests
                    .filter(req => req.status === 'pending')
                    .map(request => (
                      <ReferralRequestCard 
                        key={request.id} 
                        request={request} 
                        isExpert={false}
                        onStatusChange={() => refetchRequests()}
                      />
                    ))}
                  {referralRequests.filter(req => req.status === 'pending').length === 0 && (
                    <p className="text-gray-500 text-center py-4">No pending requests</p>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Processed Requests</h2>
                <div className="space-y-4">
                  {referralRequests
                    .filter(req => req.status !== 'pending')
                    .map(request => (
                      <ReferralRequestCard 
                        key={request.id} 
                        request={request} 
                        isExpert={false}
                        onStatusChange={() => refetchRequests()}
                      />
                    ))}
                  {referralRequests.filter(req => req.status !== 'pending').length === 0 && (
                    <p className="text-gray-500 text-center py-4">No processed requests</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">No Referral Requests Yet</CardTitle>
                <CardDescription className="text-center">
                  You haven't sent any referral requests to industry experts yet.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <InboxIcon className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-600 text-center mb-6">
                  Find industry experts and request referrals to boost your job applications.
                </p>
                <Button onClick={() => navigate('/experts')}>
                  Find Industry Experts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserReferrals;
