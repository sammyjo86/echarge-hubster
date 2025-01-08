import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhwtwicfvzouosutiaap.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod3R3aWNmdnpvdW9zdXRpYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNzIyMTAsImV4cCI6MjA1MTk0ODIxMH0.zKrv5OaPrDF2lTjRixVawGKngelAdeMVrHEi_YgiaKw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);