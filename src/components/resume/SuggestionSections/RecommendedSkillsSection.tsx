
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookIcon } from 'lucide-react';

interface RecommendedSkillsSectionProps {
  skills: string[];
}

const RecommendedSkillsSection = ({ skills }: RecommendedSkillsSectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <BookIcon className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-medium text-gray-800">Recommended Skills</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSkillsSection;
