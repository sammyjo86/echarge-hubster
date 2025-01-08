import { createClient } from '@supabase/supabase-js';

// @ts-ignore - Lovable handles secrets differently than environment variables
const supabaseUrl = process.env.SUPABASE_URL;
// @ts-ignore - Lovable handles secrets differently than environment variables
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please configure SUPABASE_URL and SUPABASE_ANON_KEY in your project settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);