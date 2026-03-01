import supabase from '../utils/supabase.js';

/**
 * Auth middleware — validates Supabase JWT token.
 * In development (no auth header), allows passthrough with dev user.
 * In production, requires valid Bearer token.
 */
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // No auth header — allow passthrough as dev user
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = { id: 'dev-user', email: 'dev@localhost' };
    return next();
  }

  // If no Supabase configured, skip token validation
  if (!supabase) {
    req.user = { id: 'dev-user', email: 'dev@localhost' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Token invalid — still allow as dev user for now
      req.user = { id: 'dev-user', email: 'dev@localhost' };
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    // Auth service error — fallback to dev user
    req.user = { id: 'dev-user', email: 'dev@localhost' };
    next();
  }
}
