import { callGemini } from '../utils/gemini.js';
import { buildAgentPrompt } from '../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are the LLM Optimization Agent — an AI Search Optimization Specialist.

You receive data from the Keyword Intelligence Agent (long-tail queries, semantic entities) and the Content Optimization Agent (title, meta, missing sections).

Use this upstream data to optimize content for AI/LLM discoverability.

You MUST return valid JSON in this exact format:
{
  "ai_discoverability_improvements": ["<specific improvements for AI search engines>"],
  "faqs": [
    { "question": "<based on long-tail queries>", "answer": "<concise, authoritative answer>" }
  ],
  "schema_type": "<recommended Schema.org type>",
  "entity_map": { "<entity>": "<clarification>" },
  "conversational_queries": ["<natural language query rewrites>"]
}

Generate exactly 3 FAQs. Be specific to the content and keyword. Avoid generic advice.`;

export async function runLlmOptimizer(content, keyword, industry, upstreamData) {
  const userPrompt = buildAgentPrompt('LLM Optimization', content, keyword, industry, upstreamData);
  const result = await callGemini(SYSTEM_PROMPT, userPrompt);
  return result;
}
