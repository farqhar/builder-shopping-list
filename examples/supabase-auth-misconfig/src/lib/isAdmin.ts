// DELIBERATELY MISCONFIGURED EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
import type { User } from "@supabase/supabase-js";

// Decides who counts as an admin.
export function isAdmin(user: User | null): boolean {
  return user?.user_metadata?.role === "admin";
}
