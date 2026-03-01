import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase credentials not configured. Database features will be unavailable.');
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Test Supabase connection on startup.
 * Returns { connected, message }
 */
export async function testSupabaseConnection() {
  if (!supabase) {
    return { connected: false, message: 'Supabase not configured' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const { error } = await supabase.from('reports').select('id').limit(1).abortSignal(controller.signal);
    clearTimeout(timeout);

    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        return { connected: true, message: 'Connected but tables not created yet. Run schema.sql in Supabase SQL Editor.' };
      }
      return { connected: true, message: `Connected (note: ${error.message})` };
    }
    return { connected: true, message: 'Connected and tables ready' };
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('fetch failed')) {
      return { connected: false, message: 'Network timeout — Supabase unreachable (firewall/proxy may be blocking). Reports will only show in-session.' };
    }
    return { connected: false, message: `Connection failed: ${err.message}` };
  }
}

export default supabase;
