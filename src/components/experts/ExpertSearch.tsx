
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { searchExperts } from '@/lib/expertApi';
import { IndustryExpert, ExpertSearchParams } from '@/types/expertTypes';
import { useNavigate } from 'react-router-dom';

const ExpertSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<ExpertSearchParams>({});
  const [nameQuery, setNameQuery] = useState('');
  const [orgQuery, setOrgQuery] = useState('');
  const [roleQuery, setRoleQuery] = useState('');

  const { data: experts, isLoading, error, refetch } = useQuery({
    queryKey: ['experts', searchParams],
    queryFn: () => searchExperts(searchParams),
    enabled: Object.keys(searchParams).length > 0,
  });

  const handleSearch = () => {
    const params: ExpertSearchParams = {};
    if (nameQuery) params.name = nameQuery;
    if (orgQuery) params.organization = orgQuery;
    if (roleQuery) params.role = roleQuery;
    
    setSearchParams(params);
  };

  const handleExpertSelect = (expert: IndustryExpert) => {
    navigate(`/experts/${expert.id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Industry Experts</CardTitle>
          <CardDescription>
            Search for industry experts by name, organization, or role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1 block">
                Expert Name
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="organization" className="text-sm font-medium mb-1 block">
                Organization
              </label>
              <Input
                id="organization"
                placeholder="Google, Microsoft, etc."
                value={orgQuery}
                onChange={(e) => setOrgQuery(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="role" className="text-sm font-medium mb-1 block">
                Role
              </label>
              <Input
                id="role"
                placeholder="Software Engineer, Product Manager, etc."
                value={roleQuery}
                onChange={(e) => setRoleQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSearch} className="w-full">
            <Search className="mr-2 h-4 w-4" /> Search Experts
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[150px] w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-lg">
          An error occurred while searching for experts. Please try again.
        </div>
      )}

      {!isLoading && experts && experts.length === 0 && (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">No experts found</h3>
          <p className="text-gray-500 mt-2">
            Try broadening your search criteria or check back later.
          </p>
        </div>
      )}

      {!isLoading && experts && experts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experts.map((expert) => (
              <Card key={expert.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleExpertSelect(expert)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <CardDescription>{expert.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mb-2">
                    <span className="font-medium">Organization:</span> {expert.organization}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {expert.bio}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleExpertSelect(expert)}>
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertSearch;
