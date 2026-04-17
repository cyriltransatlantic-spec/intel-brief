import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { industry, region, depth } = await req.json();

    if (!industry) {
      return Response.json({ error: "Industry is required" }, { status: 400 });
    }

    const systemPrompt = `You are an intelligence analyst generating a structured market brief.
Use web search to find CURRENT data (funding rounds, key players, recent news) from the last 90 days.
Return ONLY valid JSON matching this exact schema — no markdown, no code fences:
{
  "industry": string,
  "tagline": string,
  "overview": {
    "market_size": string,
    "growth_rate": string,
    "maturity": string,
    "geography": string,
    "summary": string (3-4 sentences with current data)
  },
  "trends": [{ "title": string, "signal": string, "direction": "up"|"down"|"stable", "impact": "High"|"Medium"|"Low" }],
  "players": [{ "name": string, "type": "Startup"|"Scale-up"|"Incumbent", "stage": "Seed"|"Series A"|"Series B"|"Series C+"|"Public", "hq": string, "description": string, "founded": number, "notable": string }],
  "funding": {
    "total_2024": string,
    "top_rounds": [{ "company": string, "amount": string, "stage": "Seed"|"Series A"|"Series B"|"Series C+"|"Public", "date": string }],
    "narrative": string
  },
  "summary": {
    "bullets": [string, string, string],
    "risk": string,
    "opportunity": string,
    "verdict": string
  },
  "sources": [{ "title": string, "url": string, "date": string }]
}
Every claim must be sourced. Include all URLs you consulted in sources[].`;

    const userPrompt = `Generate a full intelligence briefing for: "${industry}" in region: ${region}. Depth: ${depth}.
Search for current 2024-2025 data. Include 4 trends, 5 key players, 4 recent funding rounds.
Search for recent news, funding announcements, and market developments from the last 90 days.
Return JSON only.`;

    let messages: Anthropic.MessageParam[] = [
      { role: "user", content: userPrompt },
    ];

    let response: Anthropic.Message;
    const MAX_CONTINUATIONS = 5;
    let continuations = 0;

    do {
      response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 8000,
        system: systemPrompt,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages,
      });

      if (response.stop_reason === "pause_turn") {
        messages.push({ role: "assistant", content: response.content });
        continuations++;
      }
    } while (response.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS);

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) {
      return Response.json({ error: "No text response from model" }, { status: 500 });
    }

    const text = textBlock.text.trim();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return Response.json({ error: "Could not parse JSON from response" }, { status: 500 });
    }

    const reportData = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    return Response.json(reportData);
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate report";
    return Response.json({ error: message }, { status: 500 });
  }
}
