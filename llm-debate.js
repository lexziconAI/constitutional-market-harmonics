const Anthropic = require("@anthropic-ai/sdk").default;
const fs = require("fs");

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const debateTopics = [
  {
    title: "Port & Process Management Strategy",
    position1: "Keep using traditional port binding with manual cleanup",
    position2: "Containerize with Docker to eliminate port/process issues",
  },
  {
    title: "Architecture: Monolithic vs Microservices",
    position1: "Keep frontend and backend in same repo/process",
    position2: "Separate into independent services with Docker Compose",
  },
  {
    title: "Real-time Communication: REST vs WebSocket",
    position1: "Use REST polling for simplicity",
    position2: "Implement Socket.io for real-time bidirectional updates",
  },
  {
    title: "Component Rendering: 25 Components Issue",
    position1: "Issue is component code - need to debug rendering",
    position2: "Issue is data flow - API not connecting to frontend properly",
  },
];

async function runDebate() {
  console.log("🎭 CONSTITUTIONAL ADVERSARIAL LLM DEBATE");
  console.log("========================================\n");

  let debateHistory = [];
  let finalRecommendations = [];

  for (const topic of debateTopics) {
    console.log(`\n📌 TOPIC: ${topic.title}`);
    console.log("─".repeat(60));

    // Position 1 - Opening Argument
    console.log(`\n🔵 POSITION 1: ${topic.position1}`);
    const pos1Open = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a technical architect in a debate. Your position is: "${topic.position1}"

Context: We are debugging a React+Next.js + Express dashboard that has been failing for 1 day:
- Frontend (port 5001) and Backend API (port 5000) both start successfully
- But dashboard doesn't render components or fetch data
- We've had recurring port/process conflicts
- Components are properly coded but not rendering

Make a strong opening argument (3-4 sentences) for why your position is the BEST solution to these problems. Be specific and technical.`,
        },
      ],
    });
    const pos1OpenText = pos1Open.content[0].text;
    console.log(pos1OpenText);
    debateHistory.push({ position: 1, text: pos1OpenText });

    // Position 2 - Countering Argument
    console.log(`\n🔴 POSITION 2: ${topic.position2}`);
    const pos2Counter = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a technical architect in a debate. Your position is: "${topic.position2}"

The opposing argument was: "${pos1OpenText}"

Context: We are debugging a React+Next.js + Express dashboard that has been failing for 1 day:
- Frontend (port 5001) and Backend API (port 5000) both start successfully
- But dashboard doesn't render components or fetch data
- We've had recurring port/process conflicts
- Components are properly coded but not rendering

Counter their argument and make a strong case for why your position is better (3-4 sentences). Address their specific points. Be specific and technical.`,
        },
      ],
    });
    const pos2CounterText = pos2Counter.content[0].text;
    console.log(pos2CounterText);
    debateHistory.push({ position: 2, text: pos2CounterText });

    // Position 1 - Rebuttal
    console.log(`\n🔵 POSITION 1 (Rebuttal): ${topic.position1}`);
    const pos1Rebuttal = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a technical architect in a debate. Your position is: "${topic.position1}"

The opposing argument was: "${pos2CounterText}"

Context: We are debugging a React+Next.js + Express dashboard that has been failing for 1 day.

This is your final rebuttal (2-3 sentences). Defend your position against their strongest points. What's the killer argument they're missing? Be specific and technical.`,
        },
      ],
    });
    const pos1RebuttalText = pos1Rebuttal.content[0].text;
    console.log(pos1RebuttalText);
    debateHistory.push({ position: 1, text: pos1RebuttalText });

    // Judge's Decision
    console.log(`\n⚖️  JUDGE'S ANALYSIS:`);
    const judgeDecision = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `You are a neutral technical judge analyzing this debate:

Topic: ${topic.title}

Position 1 arguments: "${pos1OpenText}" | "${pos1RebuttalText}"
Position 2 arguments: "${pos2CounterText}"

Given the specific context that:
- Both services start successfully (port 5001 frontend, port 5000 backend)
- Problem is RUNTIME (components not rendering, data not flowing)
- Not a startup/binding issue
- We have 1 day of iterative debugging behind us
- 25 components are properly coded

Provide:
1. Which position is stronger for THIS specific problem? (1 or 2)
2. Why in 1-2 sentences
3. Specific ACTION to take now (1 sentence)`,
        },
      ],
    });
    const judgeText = judgeDecision.content[0].text;
    console.log(judgeText);
    finalRecommendations.push({ topic: topic.title, recommendation: judgeText });
  }

  // Meta-Debate: Should we debug further or rebuild?
  console.log(`\n\n📌 META-QUESTION: Debug Current vs Complete Rebuild?`);
  console.log("─".repeat(60));

  const metaDebate = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1500,
    system: `You are analyzing 1 day of failed debugging iterations. Consider:
- We've already recovered component files using LLM analysis
- Backend and frontend both run independently
- Recurring issues with ports/processes (symptoms of deeper problem)
- No successful end-to-end test yet
- Browser integration completely blocked

Provide a CLEAR GO/NO-GO recommendation.`,
    messages: [
      {
        role: "user",
        content: `After 1 day of debugging the Constitutional Market Harmonics dashboard, we have:

✅ WORKING:
- Backend API server (port 5000) running and responding
- Frontend dev server (port 5001) serving HTML
- 25 React components properly coded and imported
- Component tier architecture defined

❌ NOT WORKING:
- Dashboard doesn't render in browser
- Components not visible on page
- Backend data not flowing to frontend
- Recurring port/process conflicts

We've tried:
- Port switching (3000→3001→3002→5000→5001)
- Component file recovery via LLM
- Import path fixing
- Process cleanup
- TypeScript configuration fixes

Decision Point: Should we:
A) Continue debugging the current setup (risk: more circles)
B) Complete rebuild with Docker containerization (cost: several hours)
C) Minimal restart: Single clear entry point with health checks

What's your professional recommendation?`,
      },
    ],
  });

  console.log("\n🏆 META-DEBATE RECOMMENDATION:");
  console.log(metaDebate.content[0].text);

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    debate_rounds: debateHistory.length,
    topics_debated: debateTopics.map((t) => t.title),
    judge_recommendations: finalRecommendations,
    meta_debate: metaDebate.content[0].text,
    summary: "LLM adversarial debate completed",
  };

  fs.writeFileSync(
    "debate-results.json",
    JSON.stringify(results, null, 2),
    "utf8"
  );
  console.log("\n✅ Debate results saved to debate-results.json");
}

runDebate().catch((err) => {
  console.error("❌ Debate error:", err.message);
  process.exit(1);
});
