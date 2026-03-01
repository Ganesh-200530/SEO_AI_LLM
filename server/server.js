import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import analyzeRoutes from './routes/analyze.js';
import reportRoutes from './routes/reports.js';
import { testSupabaseConnection } from './utils/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/reports', reportRoutes);

// Health check with Supabase status
app.get('/api/health', async (req, res) => {
  const db = await testSupabaseConnection();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: db,
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Test Supabase connection on startup
  const db = await testSupabaseConnection();
  console.log(`📦 Supabase: ${db.message}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured' : '⚠️  Not configured — add GEMINI_API_KEY to .env'}`);
});

export default app;
