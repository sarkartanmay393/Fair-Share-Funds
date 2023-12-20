import { createClient } from "@supabase/supabase-js";

export const supabaseUrl ="https://jawvorkhuixgggewwkxn.supabase.co";
export const supabaseKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphd3ZvcmtodWl4Z2dnZXd3a3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE3MDU1OTYsImV4cCI6MjAxNzI4MTU5Nn0.x_xYA0Eh47EGdjKg60YDjsPmYwdkId42LI1N4uNct9k";

const createSupaClient = () =>
  createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
const supabase = createSupaClient();

export default supabase;
