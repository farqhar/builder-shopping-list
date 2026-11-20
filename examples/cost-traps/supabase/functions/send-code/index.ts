// DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
// Checks that the caller is signed in (good), but doesn't limit how often
// one user can trigger a paid SMS.
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
  );
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return new Response("Sign in first", { status: 401 });

  const { phone } = await req.json();
  await fetch("https://sms.example.com/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("SMS_API_KEY") ?? ""}` },
    body: JSON.stringify({ to: phone, text: "Your code is 123456" }),
  });

  return new Response("Sent");
});
