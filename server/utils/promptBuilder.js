import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '..', '..', 'seo.md');
let template = '';

try {
  template = fs.readFileSync(templatePath, 'utf-8');
} catch {
  console.warn('⚠️  seo.md template not found. Using inline prompt.');
}

/**
 * Build the full system prompt by injecting content, keyword, and industry
 */
export function buildSystemPrompt(content, keyword, industry) {
  if (template) {
    return template
      .replace('{{content}}', content)
      .replace('{{keyword}}', keyword)
      .replace('{{industry}}', industry);
  }

  return `You are an enterprise-grade AI SEO Optimization System.
Analyze the following content for SEO optimization.

CONTENT: ${content}
TARGET KEYWORD: ${keyword}
INDUSTRY: ${industry}

Return structured JSON output.`;
}

/**
 * Build agent-specific prompts with upstream context
 */
export function buildAgentPrompt(agentName, content, keyword, industry, upstreamData = {}) {
  const base = `CONTENT:\n${content}\n\nTARGET KEYWORD: ${keyword}\nINDUSTRY: ${industry}`;

  const upstreamContext = Object.keys(upstreamData).length > 0
    ? `\n\nUPSTREAM AGENT DATA:\n${JSON.stringify(upstreamData, null, 2)}`
    : '';

  return `${base}${upstreamContext}`;
}
