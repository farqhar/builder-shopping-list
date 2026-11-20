// DELIBERATELY BROKEN EXAMPLE: asks for every order, with no limit. With
// max_rows raised to 100,000 in config.toml, that's what it gets.
import { supabase } from "./supabaseClient";

export async function listAllOrders() {
  return supabase.from("orders").select("*");
}
