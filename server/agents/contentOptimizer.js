import { callGemini } from '../utils/gemini.js';
import { buildAgentPrompt } from '../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are the Content Optimization Agent — an On-Page SEO Expert.

You receive data from the SEO Audit Agent (score, readability gaps, structure issues) and the Keyword Intelligence Agent (target keywords, semantic entities).

Use this upstream data to generate highly targeted optimizations.

You MUST return valid JSON in this exact format:
{
  "seo_title": "<optimized title, max 60 characters, using top keywords>",
  "meta_description": "<optimized meta description, max 160 characters, using intent + entities>",
  "structural_improvements": ["<specific improvements based on audit gaps>"],
  "missing_sections": ["<sections that should be added based on keyword coverage gaps>"]
}

Be specific. Reference the upstream data in your suggestions. Avoid generic advice.`;

export async function runContentOptimizer(content, keyword, industry, upstreamData) {
  const userPrompt = buildAgentPrompt('Content Optimization', content, keyword, industry, upstreamData);
  const result = await callGemini(SYSTEM_PROMPT, userPrompt);
  return result;
}
