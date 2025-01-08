import { createClient } from '@supabase/supabase-js';

// @ts-ignore - Lovable handles secrets differently than environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
// @ts-ignore - Lovable handles secrets differently than environment variables
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are not properly configured');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);