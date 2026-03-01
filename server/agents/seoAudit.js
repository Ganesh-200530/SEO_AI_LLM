import { callGemini } from '../utils/gemini.js';
import { buildAgentPrompt } from '../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are the SEO Audit Agent — a Technical SEO analyst.

Your task is to analyze the provided content and return a structured SEO audit.

You MUST return valid JSON in this exact format:
{
  "score": <number 0-100>,
  "keyword_density": <number as percentage>,
  "readability_score": <number 0-100>,
  "structure_depth": <number 1-5>,
  "structure_issues": [<string>],
  "reasoning": "<short explanation of the score>"
}

Be analytical. Be specific. Avoid generic commentary.`;

export async function runSeoAudit(content, keyword, industry) {
  const userPrompt = buildAgentPrompt('SEO Audit', content, keyword, industry);
  const result = await callGemini(SYSTEM_PROMPT, userPrompt);
  return result;
}
