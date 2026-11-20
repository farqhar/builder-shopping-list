// DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
// This file runs in the browser (it's bundled by Vite).
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SECRET_KEY,
);
