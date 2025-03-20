
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  MessageSquare,
  Loader2,
  User
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { updateReferralRequestStatus } from '@/lib/expertApi';
import { ReferralRequest } from '@/types/expertTypes';

type ReferralRequestCardProps = {
  request: ReferralRequest;
  isExpert: boolean;
  onStatusChange: () => void;
};

const ReferralRequestCard = ({ request, isExpert, onStatusChange }: ReferralRequestCardProps) => {
  const [feedback, setFeedback] = useState(request.feedback || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [actionType, setActionType] = useState<'accepted' | 'rejected' | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAction = async (action: 'accepted' | 'rejected') => {
    try {
      setIsSubmitting(true);
      await updateReferralRequestStatus(request.id, action, feedback);
      toast({
        title: action === 'accepted' ? 'Request Accepted' : 'Request Declined',
        description: 'The referral request status has been updated.',
      });
      onStatusChange();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the request status.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setConfirmationOpen(false);
    }
  };

  const openConfirmation = (action: 'accepted' | 'rejected') => {
    setActionType(action);
    setConfirmationOpen(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.target_role}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <User className="h-3.5 w-3.5" /> 
              {request.user_name || 'Anonymous User'}
            </CardDescription>
            <CardDescription>Requested on {formatDate(request.created_at)}</CardDescription>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <div className="font-medium mb-1 flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" /> Request Message
          </div>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
            {request.request_message}
          </p>
        </div>

        <div>
          <a 
            href={request.resume_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            View Resume <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>

        {request.feedback && (
          <div className="text-sm">
            <div className="font-medium mb-1">Feedback</div>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {request.feedback}
            </p>
          </div>
        )}
      </CardContent>

      {isExpert && request.status === 'pending' && (
        <CardFooter className="flex-col space-y-4">
          <div className="w-full">
            <label className="text-sm font-medium mb-1 block">
              Provide Feedback (optional)
            </label>
            <Textarea
              placeholder="Share feedback on their resume or application..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="h-24"
            />
          </div>
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => openConfirmation('rejected')}
              disabled={isSubmitting}
            >
              Decline
            </Button>
            <Button 
              className="flex-1"
              onClick={() => openConfirmation('accepted')}
              disabled={isSubmitting}
            >
              Accept Referral
            </Button>
          </div>
        </CardFooter>
      )}

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'accepted' 
                ? 'Accept Referral Request' 
                : 'Decline Referral Request'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'accepted'
                ? 'Are you sure you want to accept this referral request? This will notify the user that you\'ve agreed to provide a referral.'
                : 'Are you sure you want to decline this referral request? This will notify the user that you\'ve declined their request.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (actionType) {
                  handleAction(actionType);
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                actionType === 'accepted' ? 'Accept' : 'Decline'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ReferralRequestCard;
