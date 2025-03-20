
export interface IndustryExpert {
  id: string;
  user_id: string;
  name: string;
  organization: string;
  role: string;
  bio: string | null;
  is_available: boolean;
  created_at: string;
}

export interface ReferralRequest {
  id: string;
  user_id: string;
  expert_id: string;
  resume_url: string;
  request_message: string;
  target_role: string;
  status: 'pending' | 'accepted' | 'rejected';
  feedback: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
}

export interface ExpertSearchParams {
  organization?: string;
  role?: string;
  name?: string;
}
