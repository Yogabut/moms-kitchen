import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yjwyxpxnrdrqnxrbevyo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqd3l4cHhucmRycW54cmJldnlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTI0NTgsImV4cCI6MjA3NjE2ODQ1OH0.28zweIaVuxCE2MIfZ_atncoINyHQJMryplMhlnkXRg4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});