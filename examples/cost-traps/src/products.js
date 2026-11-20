// A CORRECT CONTROL: this list query asks for one page of 50 rows at a time.
import { supabase } from "./supabaseClient";

export async function listProducts(page = 0) {
  const pageSize = 50;
  return supabase
    .from("products")
    .select("id, name, price")
    .range(page * pageSize, page * pageSize + pageSize - 1);
}
