import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import supabase from '../utils/supabase.js';

const router = Router();

/**
 * GET /api/reports
 * List all reports for the logged-in user.
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ reports: [], message: 'Database not configured' });
    }

    const { data, error } = await supabase
      .from('reports')
      .select('id, keyword, industry, seo_score, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ reports: data });
  } catch (err) {
    console.error('Reports fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

/**
 * GET /api/reports/:id
 * Get a single report with full detail.
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(404).json({ error: 'Database not configured' });
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ report: data });
  } catch (err) {
    console.error('Report fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

/**
 * DELETE /api/reports/:id
 * Delete a report.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!supabase) {
      return res.status(404).json({ error: 'Database not configured' });
    }

    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    console.error('Report delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
