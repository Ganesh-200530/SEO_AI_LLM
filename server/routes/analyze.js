import { Router } from 'express';
import { load } from 'cheerio';
import { runOrchestrator } from '../utils/orchestrator.js';
import { authMiddleware } from '../middleware/auth.js';
import supabase from '../utils/supabase.js';

const router = Router();

/**
 * Fetch a URL and extract clean text content + metadata for SEO analysis.
 */
async function fetchWebsiteContent(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0; +https://seoai.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const html = await res.text();
    const $ = load(html);

    // Remove noise elements
    $('script, style, noscript, iframe, img, svg, nav, footer, header').remove();

    const title = $('title').text().trim();
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    const h2s = $('h2').map((_, el) => $(el).text().trim()).get().slice(0, 10);
    const canonicalUrl = $('link[rel="canonical"]').attr('href') || url;

    // Extract main body text
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    // Build enriched content string for the AI agents
    const enrichedContent = [
      title ? `Page Title: ${title}` : '',
      metaDesc ? `Meta Description: ${metaDesc}` : '',
      h1 ? `H1 Heading: ${h1}` : '',
      h2s.length ? `H2 Headings: ${h2s.join(' | ')}` : '',
      `Canonical URL: ${canonicalUrl}`,
      '',
      '--- Page Body Content ---',
      bodyText.substring(0, 8000),
    ].filter(Boolean).join('\n');

    return {
      content: enrichedContent,
      meta: { title, metaDesc, h1, h2s, canonicalUrl, url },
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('URL fetch timed out. The website took too long to respond.');
    throw new Error(`Failed to fetch URL: ${err.message}`);
  }
}

/**
 * POST /api/analyze
 * Submit content or a URL for SEO analysis.
 * Body: { content, keyword, industry } OR { url, keyword, industry }
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content: rawContent, url, keyword, industry } = req.body;

    let content = rawContent;
    let websiteMeta = null;

    // ── URL Mode ──
    if (url) {
      try {
        new URL(url); // validate URL format
      } catch {
        return res.status(400).json({ error: 'Invalid URL format. Please include https://' });
      }

      console.log(`🌐 Fetching URL for analysis: ${url}`);
      const fetched = await fetchWebsiteContent(url);
      content = fetched.content;
      websiteMeta = fetched.meta;
    }

    // Validation
    if (!content || !keyword || !industry) {
      return res.status(400).json({
        error: 'Missing required fields: (content or url), keyword, industry'
      });
    }

    if (content.length < 50) {
      return res.status(400).json({
        error: 'Content must be at least 50 characters long'
      });
    }

    if (keyword.length < 2) {
      return res.status(400).json({
        error: 'Keyword must be at least 2 characters long'
      });
    }

    console.log(`📊 Starting SEO analysis for keyword: "${keyword}" in ${industry}`);

    // Run the orchestrator
    const report = await runOrchestrator(content, keyword, industry);

    // Attach website metadata to report if it was a URL analysis
    if (websiteMeta) {
      report.website_meta = websiteMeta;
      report.analysis_type = 'url';
    } else {
      report.analysis_type = 'content';
    }

    // Save to Supabase if configured (non-blocking — don't let DB issues break the response)
    let savedReport = null;
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .insert({
            user_id: req.user.id,
            content: content.substring(0, 5000),
            keyword,
            industry,
            result: report,
            seo_score: report.overall_score,
          })
          .select()
          .single();

        if (error) {
          console.warn('⚠️  Supabase save skipped:', error.message);
        } else {
          savedReport = data;
        }
      } catch (dbErr) {
        console.warn('⚠️  Supabase unreachable, report not saved:', dbErr.message);
      }
    }

    res.json({
      success: true,
      report,
      report_id: savedReport?.id || null,
    });

  } catch (err) {
    console.error('Analysis error:', err.message);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

export default router;
