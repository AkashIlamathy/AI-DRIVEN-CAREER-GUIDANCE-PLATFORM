
import React from 'react';
import { Compass } from 'lucide-react';

interface CareerPathSectionProps {
  recommendation: string;
}

const CareerPathSection = ({ recommendation }: CareerPathSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 p-2 rounded-full">
          <Compass className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-800">Career Path Recommendation</h3>
      </div>
      <p className="text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-2 border-purple-200">
        {recommendation}
      </p>
    </div>
  );
};

export default CareerPathSection;
