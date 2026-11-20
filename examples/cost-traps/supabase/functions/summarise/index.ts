// DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
// A public Edge Function: no sign-in check, no rate limit, and one paid AI
// call for every item the caller sends.
Deno.serve(async (req) => {
  const { items } = await req.json();
  const summaries = [];

  for (const item of items) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "MODEL_NAME_HERE",
        max_tokens: 300,
        messages: [{ role: "user", content: `Summarise: ${item}` }],
      }),
    });
    summaries.push(await response.json());
  }

  return Response.json({ summaries });
});
