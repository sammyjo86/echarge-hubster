// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lhwtwicfvzouosutiaap.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod3R3aWNmdnpvdW9zdXRpYWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNzIyMTAsImV4cCI6MjA1MTk0ODIxMH0.zKrv5OaPrDF2lTjRixVawGKngelAdeMVrHEi_YgiaKw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);