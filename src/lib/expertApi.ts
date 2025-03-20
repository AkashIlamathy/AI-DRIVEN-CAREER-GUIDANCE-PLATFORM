
import { supabase } from "@/integrations/supabase/client";
import { IndustryExpert, ReferralRequest, ExpertSearchParams } from "@/types/expertTypes";

// Expert Profile Functions
export const createExpertProfile = async (expertData: Omit<IndustryExpert, 'id' | 'user_id' | 'created_at'>): Promise<IndustryExpert | null> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('User must be logged in to create an expert profile');
  }
  
  const { data, error } = await supabase
    .from('industry_experts')
    .insert({
      ...expertData,
      user_id: userProfile.user.id
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating expert profile:', error);
    throw error;
  }
  
  return data;
};

export const getExpertProfile = async (userId: string): Promise<IndustryExpert | null> => {
  const { data, error } = await supabase
    .from('industry_experts')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
    console.error('Error fetching expert profile:', error);
    throw error;
  }
  
  return data;
};

export const updateExpertProfile = async (expertId: string, updates: Partial<IndustryExpert>): Promise<IndustryExpert | null> => {
  const { data, error } = await supabase
    .from('industry_experts')
    .update(updates)
    .eq('id', expertId)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error updating expert profile:', error);
    throw error;
  }
  
  return data;
};

// Expert Search
export const searchExperts = async (params: ExpertSearchParams): Promise<IndustryExpert[]> => {
  let query = supabase
    .from('industry_experts')
    .select('*')
    .eq('is_available', true);
  
  if (params.organization) {
    query = query.ilike('organization', `%${params.organization}%`);
  }
  
  if (params.role) {
    query = query.ilike('role', `%${params.role}%`);
  }
  
  if (params.name) {
    query = query.ilike('name', `%${params.name}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error searching experts:', error);
    throw error;
  }
  
  return data || [];
};

// Referral Request Functions
export const createReferralRequest = async (
  expertId: string, 
  resumeUrl: string, 
  requestMessage: string,
  targetRole: string
): Promise<ReferralRequest | null> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('User must be logged in to create a referral request');
  }
  
  const { data, error } = await supabase
    .from('referral_requests')
    .insert({
      expert_id: expertId,
      user_id: userProfile.user.id,
      resume_url: resumeUrl,
      request_message: requestMessage,
      target_role: targetRole,
      status: 'pending'
    })
    .select('*')
    .single();
  
  if (error) {
    console.error('Error creating referral request:', error);
    throw error;
  }
  
  return data as ReferralRequest;
};

export const getUserReferralRequests = async (): Promise<ReferralRequest[]> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('User must be logged in to view referral requests');
  }
  
  const { data, error } = await supabase
    .from('referral_requests')
    .select('*')
    .eq('user_id', userProfile.user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user referral requests:', error);
    throw error;
  }
  
  return (data || []) as ReferralRequest[];
};

export const getExpertReferralRequests = async (): Promise<ReferralRequest[]> => {
  const { data: userProfile } = await supabase.auth.getUser();
  
  if (!userProfile.user) {
    throw new Error('User must be logged in to view expert referral requests');
  }
  
  // First, get the expert profile
  const { data: expertProfile, error: expertError } = await supabase
    .from('industry_experts')
    .select('id')
    .eq('user_id', userProfile.user.id)
    .single();
  
  if (expertError) {
    console.error('Error fetching expert profile:', expertError);
    throw expertError;
  }
  
  if (!expertProfile) {
    throw new Error('No expert profile found for this user');
  }
  
  // Get the referral requests for this expert
  const { data: requests, error: requestsError } = await supabase
    .from('referral_requests')
    .select('*')
    .eq('expert_id', expertProfile.id)
    .order('created_at', { ascending: false });
  
  if (requestsError) {
    console.error('Error fetching expert referral requests:', requestsError);
    throw requestsError;
  }

  // Get all user IDs from the referral requests to fetch their names
  const userIds = (requests || []).map(request => request.user_id);
  
  // If there are no requests, return an empty array
  if (userIds.length === 0) {
    return [];
  }
  
  // Fetch user profiles for the user IDs
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', userIds);
  
  if (profilesError) {
    console.error('Error fetching user profiles:', profilesError);
    throw profilesError;
  }
  
  // Create a map of user_id to name for easier lookup
  const userNameMap = (profiles || []).reduce((map, profile) => {
    map[profile.id] = profile.name;
    return map;
  }, {});
  
  // Add user names to the referral requests
  const requestsWithUserNames = (requests || []).map(request => ({
    ...request,
    user_name: userNameMap[request.user_id] || 'Anonymous User'
  }));
  
  return requestsWithUserNames as ReferralRequest[];
};

export const updateReferralRequestStatus = async (
  requestId: string, 
  status: 'accepted' | 'rejected',
  feedback?: string
): Promise<ReferralRequest | null> => {
  const updates: Partial<ReferralRequest> = { 
    status, 
    updated_at: new Date().toISOString() 
  };
  
  if (feedback) {
    updates.feedback = feedback;
  }
  
  const { data, error } = await supabase
    .from('referral_requests')
    .update(updates)
    .eq('id', requestId)
    .select('*')
    .single();
  
  if (error) {
    console.error('Error updating referral request:', error);
    throw error;
  }
  
  return data as ReferralRequest;
};
