
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

type EducationFieldsProps = {
  control: Control<any>;
};

const EducationFields = ({ control }: EducationFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="qualification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Highest Qualification</FormLabel>
            <FormControl>
              <Input 
                placeholder="E.g., Bachelor's in Computer Science" 
                {...field} 
                onChange={(e) => {
                  // Only allow letters, spaces, and common punctuation
                  if (/^[a-zA-Z\s\.\,\-\']*$/.test(e.target.value) || e.target.value === '') {
                    field.onChange(e.target.value);
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="interestedSubjects"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Interested Subjects</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="List your interests separated by commas (e.g., AI, Web Development, Cloud Computing)" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              These will help tailor career suggestions to your interests
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default EducationFields;
