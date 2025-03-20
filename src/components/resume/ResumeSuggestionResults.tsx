
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useResumeStore } from '@/store/resumeStore';
import SectionHeader from './SuggestionSections/SectionHeader';
import StrengthsSection from './SuggestionSections/StrengthsSection';
import WeaknessesSection from './SuggestionSections/WeaknessesSection';
import SuggestionsSection from './SuggestionSections/SuggestionsSection';
import RecommendedSkillsSection from './SuggestionSections/RecommendedSkillsSection';
import CareerPathSection from './SuggestionSections/CareerPathSection';

const ResumeSuggestionResults = () => {
  const { suggestion } = useResumeStore();
  
  if (!suggestion) return null;
  
  return (
    <Card className="shadow-sm border-gray-100">
      <SectionHeader />
      <CardContent className="space-y-8">
        <StrengthsSection strengths={suggestion.strengths} />
        <WeaknessesSection weaknesses={suggestion.weaknesses} />
        <SuggestionsSection suggestions={suggestion.improvementSuggestions} />
        <RecommendedSkillsSection skills={suggestion.recommendedSkills} />
        <CareerPathSection recommendation={suggestion.careerPathRecommendation} />
      </CardContent>
    </Card>
  );
};

export default ResumeSuggestionResults;
