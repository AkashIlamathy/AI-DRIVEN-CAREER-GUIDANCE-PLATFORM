
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LightbulbIcon } from 'lucide-react';

interface SuggestionsSectionProps {
  suggestions: string[];
}

const SuggestionsSection = ({ suggestions }: SuggestionsSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <LightbulbIcon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-800">Suggestions</h3>
      </div>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Tip
            </Badge>
            <span className="text-gray-700">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionsSection;
