
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Control } from 'react-hook-form';

type ExperienceFieldsProps = {
  control: Control<any>;
};

const ExperienceFields = ({ control }: ExperienceFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="hackathonsAttended"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hackathons Attended</FormLabel>
              <FormControl>
                <Input placeholder="Number or description of hackathons" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="extraCoursesCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Courses Completed</FormLabel>
              <FormControl>
                <Input placeholder="List any extra courses you've taken" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List your certifications (e.g., AWS, Azure, Google Cloud)" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="workshops"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workshops</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List workshops you've attended" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ExperienceFields;
