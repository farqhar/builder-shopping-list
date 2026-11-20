// DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
// The key below is fake, but it's written straight into the code.
const AI_API_KEY = "sk-proj-fake-0000-practice-only";

export async function askAI(prompt) {
  const response = await fetch("https://api.example.com/v1/chat", {
    method: "POST",
    headers: { Authorization: `Bearer ${AI_API_KEY}` },
    body: JSON.stringify({ prompt }),
  });
  return response.json();
}
