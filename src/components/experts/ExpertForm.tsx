
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createExpertProfile, updateExpertProfile } from '@/lib/expertApi';
import { IndustryExpert } from '@/types/expertTypes';

const expertFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  organization: z.string().min(2, { message: 'Organization name is required' }),
  role: z.string().min(2, { message: 'Role is required' }),
  bio: z.string().min(30, { message: 'Bio should be at least 30 characters' }).max(500, { message: 'Bio should not exceed 500 characters' }),
  is_available: z.boolean().default(true),
});

type ExpertFormSchema = z.infer<typeof expertFormSchema>;

type ExpertFormProps = {
  existingProfile?: IndustryExpert;
};

const ExpertForm = ({ existingProfile }: ExpertFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!existingProfile;

  const form = useForm<ExpertFormSchema>({
    resolver: zodResolver(expertFormSchema),
    defaultValues: existingProfile ? {
      name: existingProfile.name,
      organization: existingProfile.organization,
      role: existingProfile.role,
      bio: existingProfile.bio || '',
      is_available: existingProfile.is_available
    } : {
      name: '',
      organization: '',
      role: '',
      bio: '',
      is_available: true
    },
  });

  const onSubmit = async (values: ExpertFormSchema) => {
    try {
      if (isEditing && existingProfile) {
        await updateExpertProfile(existingProfile.id, values);
        toast({
          title: 'Profile Updated',
          description: 'Your expert profile has been updated successfully.',
        });
      } else {
        await createExpertProfile({
          name: values.name,
          organization: values.organization,
          role: values.role,
          bio: values.bio,
          is_available: values.is_available
        });
        toast({
          title: 'Profile Created',
          description: 'Your expert profile has been created successfully.',
        });
      }
      navigate('/expert-dashboard');
    } catch (error) {
      console.error('Expert profile submission error:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Your Expert Profile' : 'Register as an Industry Expert'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your profile information to help job seekers find you.'
            : 'Complete this form to register as an industry expert and help job seekers get referrals.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your full name as it appears professionally.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Company or Organization" {...field} />
                  </FormControl>
                  <FormDescription>
                    The company or organization you currently work for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Senior Software Engineer" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your current professional role or title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your professional background, expertise, and areas you can provide referrals for..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A brief professional bio highlighting your expertise and experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available for Referrals</FormLabel>
                    <FormDescription>
                      Uncheck this if you're temporarily not accepting referral requests.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isEditing ? 'Update Profile' : 'Create Expert Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpertForm;
