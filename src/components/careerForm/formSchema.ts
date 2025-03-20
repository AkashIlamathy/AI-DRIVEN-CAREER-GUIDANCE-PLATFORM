
import * as z from 'zod';

// Define form schema with validation
export const formSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .refine(val => /^[a-zA-Z\s\.\-\']*$/.test(val), { 
      message: 'Name can only contain letters, spaces, and basic punctuation.' 
    }),
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0 && num < 100;
  }, { message: 'Please enter a valid age between 1-99.' }),
  qualification: z.string()
    .min(2, { message: 'Please enter your qualification.' })
    .refine(val => /^[a-zA-Z\s\.\,\-\']*$/.test(val), { 
      message: 'Qualification can only contain letters, spaces, and basic punctuation.' 
    }),
  interestedSubjects: z.string().min(3, { message: 'Please enter at least one subject.' }),
  hackathonsAttended: z.string(),
  extraCoursesCompleted: z.string(),
  certifications: z.string(),
  workshops: z.string(),
  industryPreference: z.string().min(1, { message: 'Please select an industry preference.' }),
  preferredRole: z.enum(['management', 'technical'], { 
    required_error: 'Please select your preferred role.' 
  }),
});

export type FormValues = z.infer<typeof formSchema>;
