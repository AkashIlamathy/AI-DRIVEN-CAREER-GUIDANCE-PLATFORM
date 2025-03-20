
import React from 'react';
import Navbar from '@/components/Navbar';
import ExpertSearch from '@/components/experts/ExpertSearch';

const ExpertsSearch = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Find Industry Experts</h1>
          <p className="text-center text-gray-600 mb-8">
            Connect with professionals from top companies who can provide referrals for your job applications
          </p>
          <ExpertSearch />
        </div>
      </main>
    </div>
  );
};

export default ExpertsSearch;
