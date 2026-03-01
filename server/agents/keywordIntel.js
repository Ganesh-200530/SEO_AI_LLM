import { callGemini } from '../utils/gemini.js';
import { buildAgentPrompt } from '../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are the Keyword Intelligence Agent — a Search Intent and Keyword Strategist.

Your task is to analyze keyword usage and suggest strategic keywords.

You MUST return valid JSON in this exact format:
{
  "main_keyword_usage": "<assessment of how the main keyword is used>",
  "search_intent": "<informational|navigational|transactional|commercial>",
  "related_keywords": ["<5 related keywords>"],
  "long_tail_keywords": ["<5 long-tail keywords>"],
  "semantic_entities": ["<relevant semantic entities>"]
}

Be strategic. Focus on search intent alignment. Avoid generic suggestions.`;

export async function runKeywordIntel(content, keyword, industry) {
  const userPrompt = buildAgentPrompt('Keyword Intelligence', content, keyword, industry);
  const result = await callGemini(SYSTEM_PROMPT, userPrompt);
  return result;
}
