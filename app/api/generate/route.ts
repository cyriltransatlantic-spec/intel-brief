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

    const isFrance = region === "France";

    const systemPrompt = `You are an intelligence analyst. Use web search to find current data${isFrance ? ", and the data.gouv.fr tools for official French public datasets (companies, funding, economic indicators)" : ""}, then output ONLY a JSON object — no prose, no markdown, no code fences. Start your response with { and end with }.

Schema:
{
  "industry": string,
  "tagline": string,
  "overview": {
    "market_size": string,
    "growth_rate": string,
    "maturity": string,
    "geography": string,
    "summary": string
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
}`;

    const userPrompt = `Generate a full intelligence briefing for: "${industry}" in region: ${region}. Depth: ${depth}.
Search for current 2024-2025 data. Include 4 trends, 5 key players, 4 recent funding rounds.${isFrance ? "\nPrioritize data.gouv.fr for official French company registries, funding data, and economic statistics." : ""}
Output JSON only — start immediately with {`;

    let messages: Anthropic.MessageParam[] = [
      { role: "user", content: userPrompt },
      { role: "assistant", content: "{" },
    ];

    let response: Anthropic.Message;
    const MAX_CONTINUATIONS = 5;
    let continuations = 0;

    do {
      if (isFrance) {
        response = await (client.beta.messages.create as Function)({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          system: systemPrompt,
          betas: ["mcp-client-2025-04-04"],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          mcp_servers: [
            {
              type: "url",
              url: "https://mcp.data.gouv.fr/mcp",
              name: "datagouv",
            },
          ],
          messages,
        });
      } else {
        response = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          system: systemPrompt,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages,
        });
      }

      if (response.stop_reason === "tool_use" || response.stop_reason === "pause_turn") {
        messages.push({ role: "assistant", content: response.content });
        continuations++;
      }
    } while (
      (response.stop_reason === "tool_use" || response.stop_reason === "pause_turn") &&
      continuations < MAX_CONTINUATIONS
    );

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) {
      console.error("No text block. stop_reason:", response.stop_reason, "content types:", response.content.map(b => b.type));
      return Response.json({ error: "No text response from model" }, { status: 500 });
    }

    // The prefill means the actual JSON starts with the prefilled "{"
    const raw = "{" + textBlock.text.trim();
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonEnd === -1) {
      console.error("No closing brace. text preview:", raw.slice(0, 300));
      return Response.json({ error: "Could not parse JSON from response" }, { status: 500 });
    }

    const reportData = JSON.parse(raw.slice(0, jsonEnd + 1));
    return Response.json(reportData);
  } catch (error: unknown) {
    console.error("Generate error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate report";
    return Response.json({ error: message }, { status: 500 });
  }
}
