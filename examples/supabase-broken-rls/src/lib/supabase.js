// DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
// This file runs in the browser (it's bundled by Vite).
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
