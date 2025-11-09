#!/usr/bin/env node

const https = require("https");

function callClaude(messages, systemPrompt = "") {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      reject(new Error("ANTHROPIC_API_KEY not set in .env"));
      return;
    }

    const body = JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const options = {
      hostname: "api.anthropic.com",
      port: 443,
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.content && parsed.content[0]) {
            resolve(parsed.content[0].text);
          } else {
            reject(new Error(`Unexpected response: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(body);
    req.end();
  });
}

async function runDebate() {
  console.log("CONSTITUTIONAL ADVERSARIAL LLM DEBATE");
  console.log("====================================\n");

  const debateTopics = [
    {
      title: "Port & Process Management Strategy",
      position1: "Keep using traditional port binding with manual cleanup",
      position2: "Containerize with Docker to eliminate port/process issues",
    },
    {
      title: "Component Rendering: 25 Components Issue",
      position1: "Issue is component code - need to debug rendering",
      position2: "Issue is data flow - API not connecting to frontend properly",
    },
  ];

  let finalRecommendations = [];

  for (const topic of debateTopics) {
    console.log(`\n### TOPIC: ${topic.title}`);
    console.log("===================================");

    try {
      // Position 1 - Opening Argument
      console.log(`\nPOSITION 1: ${topic.position1}`);
      const pos1Open = await callClaude([
        {
          role: "user",
          content: `You are a technical architect in a debate. Your position is: "${topic.position1}"

Context: Dashboard debugging for 1 day - frontend (5001) and backend (5000) both start successfully but dashboard doesn't render components or fetch data.

Make a strong opening argument (2-3 sentences) for why your position is the BEST solution. Be specific.`,
        },
      ]);
      console.log(pos1Open);

      // Position 2 - Counter Argument
      console.log(`\nPOSITION 2: ${topic.position2}`);
      const pos2Counter = await callClaude([
        {
          role: "user",
          content: `You are a technical architect. Your position is: "${topic.position2}"

The opposing argument was: "${pos1Open}"

Counter their argument (2-3 sentences). Address their specific points. Be technical.`,
        },
      ]);
      console.log(pos2Counter);

      // Judge's Decision
      console.log(`\nJUDGE ANALYSIS:`);
      const judgeDecision = await callClaude([
        {
          role: "user",
          content: `You are a neutral judge analyzing this debate:

Topic: ${topic.title}
Position 1: "${pos1Open}"
Position 2: "${pos2Counter}"

Context: Services run independently. Problem is RUNTIME (components not rendering, data not flowing). Not a startup/binding issue.

Provide:
1. Which position is stronger? (1 or 2)
2. Why? (1 sentence)
3. ACTION to take now (1 sentence)`,
        },
      ]);
      console.log(judgeDecision);
      finalRecommendations.push({ topic: topic.title, recommendation: judgeDecision });
    } catch (err) {
      console.error(`❌ Error in debate: ${err.message}`);
    }
  }

  // Meta-Analysis
  console.log(`\n\n### META-ANALYSIS: What Should We Do?`);
  console.log("===================================");

  try {
    const metaRecommendation = await callClaude([
      {
        role: "user",
        content: `After 1 day debugging a React+Next.js + Express dashboard:

✅ WORKS:
- Backend API (port 5000) running
- Frontend dev server (port 5001) serving
- 25 React components properly coded

❌ BROKEN:
- Dashboard doesn't render components
- API data not flowing to frontend
- Recurring port/process conflicts

Decision: A) Continue debugging (risk: more circles) OR B) Rebuild with Docker (several hours)?

What's your professional Go/No-Go recommendation in 3-4 sentences?`,
      },
    ]);
    console.log(metaRecommendation);
  } catch (err) {
    console.error(`❌ Meta analysis error: ${err.message}`);
  }

  console.log("\nLLM Debate completed!");
  console.log(`\nFinal Recommendations:`);
  finalRecommendations.forEach((rec, i) => {
    console.log(`${i + 1}. ${rec.topic}`);
    console.log(`   ${rec.recommendation.substring(0, 100)}...`);
  });
}

runDebate().catch((err) => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
