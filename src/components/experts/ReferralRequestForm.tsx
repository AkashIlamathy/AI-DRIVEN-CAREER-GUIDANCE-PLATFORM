
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createReferralRequest } from '@/lib/expertApi';

const referralSchema = z.object({
  resumeUrl: z.string().url({ message: 'Please enter a valid URL to your resume' }),
  requestMessage: z.string()
    .min(50, { message: 'Your request should be at least 50 characters' })
    .max(500, { message: 'Your request should not exceed 500 characters' }),
  targetRole: z.string().min(2, { message: 'Please specify the target role' }),
});

type ReferralRequestFormProps = {
  expertId: string;
  onCancel: () => void;
  onSuccess: () => void;
};

const ReferralRequestForm = ({ expertId, onCancel, onSuccess }: ReferralRequestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof referralSchema>>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      resumeUrl: '',
      requestMessage: '',
      targetRole: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof referralSchema>) => {
    try {
      setIsSubmitting(true);
      await createReferralRequest(
        expertId,
        values.resumeUrl,
        values.requestMessage,
        values.targetRole
      );
      onSuccess();
    } catch (error) {
      console.error('Error submitting referral request:', error);
      toast({
        title: 'Error',
        description: 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium">Request a Referral</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="targetRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Position</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Software Engineer, Product Manager, etc." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  The specific role you're seeking a referral for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resumeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://drive.google.com/your-resume" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Link to your resume (Google Drive, Dropbox, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="requestMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Request</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Introduce yourself and explain why you're interested in this role and company..." 
                    className="h-24"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Explain why you're a good fit for the role and company
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReferralRequestForm;
