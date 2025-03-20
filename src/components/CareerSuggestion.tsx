import React from 'react';
import { useCareerStore } from '@/store/careerStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const CareerSuggestion = () => {
  const { suggestion, isLoading, error } = useCareerStore();

  const convertToRupees = (dollarAmount: string) => {
    try {
      const matches = dollarAmount.match(/\$?([\d,]+)/g);
      if (!matches) return dollarAmount;
      const rupeesValues = matches.map(match => `₹${(parseInt(match.replace(/\$|,/g, '')) * 75).toLocaleString('en-IN')}`);
      return rupeesValues.length === 2 ? `${rupeesValues[0]} - ${rupeesValues[1]} per annum` : `${rupeesValues[0]} per annum`;
    } catch {
      return dollarAmount;
    }
  };

  if (error) return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;

  if (isLoading) return <Skeleton className="h-20 w-full" />;

  if (!suggestion) return <Card><CardHeader><CardTitle>Career Suggestions</CardTitle><CardDescription>No data available. Try submitting the form again.</CardDescription></CardHeader></Card>;

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader>
        <CardTitle>Your Career Suggestions</CardTitle>
        <CardDescription>Based on your profile and industry trends</CardDescription>
      </CardHeader>
      <CardContent>
        <p><strong>Job Role:</strong> {suggestion.suggestedJobRole}</p>
        <p><strong>Career Path:</strong> {suggestion.careerPath}</p>
        <p><strong>Certifications:</strong> {suggestion.certificationsRequired}</p>
        <p><strong>Expected Salary:</strong> {convertToRupees(suggestion.expectedSalary)}</p>
      </CardContent>
    </Card>
  );
};

export default CareerSuggestion;
