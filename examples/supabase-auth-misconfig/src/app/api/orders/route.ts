// DELIBERATELY MISCONFIGURED EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
// (This file is one of the CORRECT controls.)
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClient();

  // Verifies the signed-in user's token before returning data.
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: orders } = await supabase.from("orders").select("*");
  return NextResponse.json(orders);
}
