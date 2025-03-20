
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface StrengthsSectionProps {
  strengths: string[];
}

const StrengthsSection = ({ strengths }: StrengthsSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-gray-800">Strengths</h3>
      </div>
      <ul className="space-y-2">
        {strengths.map((strength, index) => (
          <li key={index} className="flex items-start gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Strength
            </Badge>
            <span className="text-gray-700">{strength}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StrengthsSection;
