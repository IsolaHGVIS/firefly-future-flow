import { createClient } from '@supabase/supabase-js';

// Using placeholder URLs that will work with the Supabase integration
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our user profiles
export type UserProfile = {
  id: string;
  email: string;
  monthly_income: number;
  monthly_expenses: number;
  savings: number;
  fire_goal: number;
  created_at: string;
  updated_at: string;
};

export type FinancialData = {
  id?: string;
  user_id: string;
  data: any;
  created_at: string;
};

// Helper functions for auth
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    console.error("Sign up error:", error);
    return { data: null, error: { message: "Failed to connect to authentication service" } };
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

// User profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { profile: data as UserProfile | null, error };
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      ...updates,
      id: userId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  
  return { data, error };
};

// Save financial data
export const saveFinancialData = async (userId: string, financialData: any) => {
  const { data, error } = await supabase
    .from('financial_data')
    .insert({
      user_id: userId,
      data: financialData,
      created_at: new Date().toISOString(),
    });
  
  return { data, error };
};

// Get financial data history
export const getFinancialHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('financial_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { history: data as FinancialData[], error };
};

// Get the latest financial data entry
export const getLatestFinancialData = async (userId: string) => {
  const { data, error } = await supabase
    .from('financial_data')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  return { latestData: data as FinancialData | null, error };
};
