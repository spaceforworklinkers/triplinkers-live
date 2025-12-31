import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "CRITICAL: Supabase environment variables are missing. application functionality will be severely degraded."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
