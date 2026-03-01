import { runSeoAudit } from '../agents/seoAudit.js';
import { runKeywordIntel } from '../agents/keywordIntel.js';
import { runContentOptimizer } from '../agents/contentOptimizer.js';
import { runLlmOptimizer } from '../agents/llmOptimizer.js';
import { runTechnicalSeo } from '../agents/technicalSeo.js';

/**
 * Orchestrator — coordinates all 5 agents with proper data flow.
 *
 * Execution Order:
 *   Round 1 (parallel): SEO Audit + Keyword Intelligence
 *   Round 2: Content Optimization (receives Round 1 outputs)
 *   Round 3: LLM Optimization (receives Round 1 + Round 2 outputs)
 *   Round 4: Technical SEO (receives all previous outputs)
 */
export async function runOrchestrator(content, keyword, industry) {
  const report = {
    content_snippet: content.substring(0, 200) + '...',
    keyword,
    industry,
    agents: {},
    errors: [],
    created_at: new Date().toISOString(),
  };

  // ── Round 1: Parallel — SEO Audit + Keyword Intelligence ──
  console.log('🔄 Round 1: Running SEO Audit + Keyword Intelligence (parallel)...');
  const [auditResult, keywordResult] = await Promise.allSettled([
    runSeoAudit(content, keyword, industry),
    runKeywordIntel(content, keyword, industry),
  ]);

  const audit = auditResult.status === 'fulfilled' ? auditResult.value : null;
  const keywords = keywordResult.status === 'fulfilled' ? keywordResult.value : null;

  if (audit) report.agents.seoAudit = audit;
  else report.errors.push({ agent: 'SEO Audit', error: auditResult.reason?.message });

  if (keywords) report.agents.keywordIntel = keywords;
  else report.errors.push({ agent: 'Keyword Intelligence', error: keywordResult.reason?.message });

  // ── Round 2: Content Optimization (receives Round 1 data) ──
  console.log('🔄 Round 2: Running Content Optimization...');
  try {
    const contentUpstream = {
      seoAudit: audit || {},
      keywordIntel: keywords || {},
    };
    const contentResult = await runContentOptimizer(content, keyword, industry, contentUpstream);
    report.agents.contentOptimization = contentResult;
  } catch (err) {
    report.errors.push({ agent: 'Content Optimization', error: err.message });
  }

  // ── Round 3: LLM Optimization (receives Round 1 + Round 2 data) ──
  console.log('🔄 Round 3: Running LLM Optimization...');
  try {
    const llmUpstream = {
      keywordIntel: keywords || {},
      contentOptimization: report.agents.contentOptimization || {},
    };
    const llmResult = await runLlmOptimizer(content, keyword, industry, llmUpstream);
    report.agents.llmOptimization = llmResult;
  } catch (err) {
    report.errors.push({ agent: 'LLM Optimization', error: err.message });
  }

  // ── Round 4: Technical SEO (receives ALL previous data) ──
  console.log('🔄 Round 4: Running Technical SEO...');
  try {
    const techUpstream = {
      seoAudit: audit || {},
      keywordIntel: keywords || {},
      contentOptimization: report.agents.contentOptimization || {},
      llmOptimization: report.agents.llmOptimization || {},
    };
    const techResult = await runTechnicalSeo(content, keyword, industry, techUpstream);
    report.agents.technicalSeo = techResult;
  } catch (err) {
    report.errors.push({ agent: 'Technical SEO', error: err.message });
  }

  // ── Final Assembly ──
  console.log('✅ Orchestrator: Assembling final report...');
  report.overall_score = audit?.score || 0;
  report.is_partial = report.errors.length > 0;

  return report;
}
