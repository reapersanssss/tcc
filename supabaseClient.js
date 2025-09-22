
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://mcfsycndtlkpvburzxfy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jZnN5Y25kdGxrcHZidXJ6eGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDE2ODMsImV4cCI6MjA3MzcxNzY4M30.R1qJfLmJ0Dt7UoF59vY-5FQWCDHK5gfy1M_kTYLkobQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});