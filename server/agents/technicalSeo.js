import { callGemini } from '../utils/gemini.js';
import { buildAgentPrompt } from '../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are the Technical SEO Agent — a Technical Site Architecture Consultant.

You receive data from ALL previous agents:
- SEO Audit Agent: score, structure issues
- Keyword Intelligence Agent: keywords, entities for anchor text
- Content Optimization Agent: title, structure fixes
- LLM Optimization Agent: schema type, FAQs, entity map

Use ALL upstream data to provide comprehensive technical SEO recommendations.

You MUST return valid JSON in this exact format:
{
  "internal_links": [
    { "anchor_text": "<keyword-rich anchor>", "target_description": "<what page to link to>" }
  ],
  "external_refs": [
    { "source": "<authority site>", "reason": "<why this reference adds value>" }
  ],
  "formatting_improvements": ["<specific formatting changes>"],
  "schema_markup": "<complete JSON-LD schema markup as a string>"
}

Suggest at least 3 internal links and 3 external references. Be specific and actionable.`;

export async function runTechnicalSeo(content, keyword, industry, upstreamData) {
  const userPrompt = buildAgentPrompt('Technical SEO', content, keyword, industry, upstreamData);
  const result = await callGemini(SYSTEM_PROMPT, userPrompt);
  return result;
}
