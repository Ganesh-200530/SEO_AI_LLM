import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';

type Tab = 'login' | 'signup';

export default function Login() {
  const [tab, setTab] = useState<Tab>('login');
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate auth — replace with real Supabase auth
    await new Promise(r => setTimeout(r, 1200));
    // Persist login details to localStorage
    const displayName = tab === 'signup' ? name || email.split('@')[0] : email.split('@')[0];
    localStorage.setItem('seoai_user', JSON.stringify({
      email,
      name: displayName,
      initial: displayName.charAt(0).toUpperCase(),
      loggedIn: true,
    }));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#06060f' }}>

      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.2) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(249,115,22,0.12) 0%, transparent 60%)' }} />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight" style={{ background: 'linear-gradient(90deg,#a78bfa,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SEO·AI</span>
        </Link>

        {/* Center copy */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 className="text-5xl font-black leading-tight text-white mb-6">
              Your SEO<br />
              <span style={{ background: 'linear-gradient(90deg,#a78bfa,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Superpower</span><br />
              Awaits.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(200,185,255,0.6)' }}>
              Log in to access your AI agent swarm, saved reports, and full SEO command centre.
            </p>
          </motion.div>

          {/* Agent pills */}
          <div className="flex flex-wrap gap-3 mt-10">
            {[['🔍','SEER','#7c3aed'],['🎯','KIRA','#f97316'],['✍️','QUILL','#10b981'],['🧠','NOVA','#ec4899'],['⚡','BOLT','#eab308']].map(([emoji,name,color]) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + Math.random() * 0.3 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
              >
                <span>{emoji}</span> {name}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 text-xs" style={{ color: 'rgba(200,185,255,0.3)' }}>
          Trusted by SEO professionals worldwide.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black" style={{ background: 'linear-gradient(90deg,#a78bfa,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SEO·AI</span>
          </Link>

          <h2 className="text-3xl font-black text-white mb-2">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(200,185,255,0.5)' }}>
            {tab === 'login' ? 'Sign in to your agent dashboard.' : 'Join thousands of SEO professionals.'}
          </p>

          {/* Tab Toggle */}
          <div className="flex p-1 rounded-xl mb-8" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
            {(['login','signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className="flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all"
                style={tab === t
                  ? { background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: 'white', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }
                  : { color: 'rgba(200,185,255,0.5)' }
                }
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-red-300 font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.7)' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)', caretColor: '#a78bfa' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.7)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(124,58,237,0.5)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)', caretColor: '#a78bfa' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.7)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(124,58,237,0.5)' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm outline-none transition-all"
                  style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)', caretColor: '#a78bfa' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(124,58,237,0.5)' }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all mt-2"
              style={{ background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: loading ? 'none' : '0 0 30px rgba(124,58,237,0.35)' }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <>{tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(124,58,237,0.15)' }} />
            <span className="text-xs" style={{ color: 'rgba(200,185,255,0.3)' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(124,58,237,0.15)' }} />
          </div>

          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)' }}
            onClick={() => navigate('/dashboard')}
          >
            <Github className="w-4 h-4" />
            Continue with GitHub
          </button>

          <p className="text-center text-xs mt-8" style={{ color: 'rgba(200,185,255,0.3)' }}>
            By continuing, you agree to our{' '}
            <span className="cursor-pointer hover:text-violet-400 transition-colors" style={{ color: 'rgba(167,139,250,0.6)' }}>Terms</span>
            {' & '}
            <span className="cursor-pointer hover:text-violet-400 transition-colors" style={{ color: 'rgba(167,139,250,0.6)' }}>Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
