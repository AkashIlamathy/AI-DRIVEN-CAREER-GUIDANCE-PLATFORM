
import React from 'react';
import Navbar from '@/components/Navbar';
import ExpertForm from '@/components/experts/ExpertForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ExpertRegistration = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/expert-registration' }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Become an Industry Expert</h1>
          <ExpertForm />
        </div>
      </main>
    </div>
  );
};

export default ExpertRegistration;
