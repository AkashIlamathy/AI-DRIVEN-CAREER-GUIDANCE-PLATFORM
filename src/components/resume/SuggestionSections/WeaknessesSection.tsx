
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';

interface WeaknessesSectionProps {
  weaknesses: string[];
}

const WeaknessesSection = ({ weaknesses }: WeaknessesSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <XCircle className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-medium text-gray-800">Areas for Improvement</h3>
      </div>
      <ul className="space-y-2">
        {weaknesses.map((weakness, index) => (
          <li key={index} className="flex items-start gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Improve
            </Badge>
            <span className="text-gray-700">{weakness}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WeaknessesSection;
