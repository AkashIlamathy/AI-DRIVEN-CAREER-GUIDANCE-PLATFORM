
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ExpertProfile from '@/components/experts/ExpertProfile';

const ExpertDetails = () => {
  const { expertId } = useParams<{ expertId: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {expertId && <ExpertProfile />}
        </div>
      </main>
    </div>
  );
};

export default ExpertDetails;
