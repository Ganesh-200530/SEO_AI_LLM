import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Bell, Shield, LogOut, FileText, Zap, TrendingUp, Star, ChevronRight, Edit3, Check } from 'lucide-react';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('seoai_user');
    return raw ? JSON.parse(raw) : { name: 'Guest User', email: 'guest@example.com', initial: 'G' };
  } catch {
    return { name: 'Guest User', email: 'guest@example.com', initial: 'G' };
  }
}

const STATS = [
  { label: 'Reports Run', value: '47', icon: FileText, color: '#7c3aed' },
  { label: 'URLs Analysed', value: '23', icon: TrendingUp, color: '#f97316' },
  { label: 'Avg. Score', value: '84', icon: Star, color: '#10b981' },
  { label: 'Agents Used', value: '235', icon: Zap, color: '#ec4899' },
];

const RECENT = [
  { title: 'homepage-audit', score: 91, date: '2 hours ago', type: 'URL' },
  { title: 'blog-post-optimization', score: 78, date: 'Yesterday', type: 'Content' },
  { title: 'product-page-seo', score: 88, date: '3 days ago', type: 'URL' },
];

const MENU = [
  { icon: Bell, label: 'Notifications', desc: 'Email alerts for completed analyses' },
  { icon: Shield, label: 'Security', desc: 'Password & two-factor authentication' },
];

export default function Profile() {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(storedUser.name);
  const [nameInput, setNameInput] = useState(storedUser.name);

  const saveName = () => {
    setName(nameInput);
    // Persist updated name back to localStorage
    try {
      const raw = localStorage.getItem('seoai_user');
      if (raw) {
        const u = JSON.parse(raw);
        u.name = nameInput;
        u.initial = nameInput.charAt(0).toUpperCase();
        localStorage.setItem('seoai_user', JSON.stringify(u));
      }
    } catch { /* ignore */ }
    setEditName(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#06060f' }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)',
        backgroundSize: '44px 44px',
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.1) 0%,transparent 60%)' }} />

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8"
          style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.18)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
                {name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2" style={{ background: '#10b981', borderColor: '#06060f' }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {editName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveName()}
                      className="bg-transparent border-b text-xl font-black text-white outline-none"
                      style={{ borderColor: '#7c3aed' }}
                    />
                    <button onClick={saveName}><Check className="w-4 h-4" style={{ color: '#10b981' }} /></button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl font-black text-white">{name}</h1>
                    <button onClick={() => setEditName(true)}><Edit3 className="w-3.5 h-3.5" style={{ color: 'rgba(124,58,237,0.5)' }} /></button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <Mail className="w-3 h-3" style={{ color: 'rgba(167,139,250,0.5)' }} />
                <span className="text-sm" style={{ color: 'rgba(167,139,250,0.5)' }}>{storedUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>Pro Plan</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-5 text-center"
              style={{ background: 'rgba(14,14,26,0.8)', border: `1px solid ${color}20`, backdropFilter: 'blur(20px)' }}
            >
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
              <div className="text-2xl font-black text-white mb-0.5">{value}</div>
              <div className="text-xs" style={{ color: 'rgba(200,185,255,0.4)' }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6"
          style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.18)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-white">Recent Reports</h2>
            <Link to="/dashboard" className="text-xs font-bold" style={{ color: '#a78bfa' }}>View all →</Link>
          </div>
          <div className="space-y-3">
            {RECENT.map(({ title, score, date, type }) => (
              <div key={title} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: score >= 85 ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)', color: score >= 85 ? '#10b981' : '#f97316' }}>
                  {score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{title}</p>
                  <p className="text-xs" style={{ color: 'rgba(200,185,255,0.4)' }}>{date} · {type}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(124,58,237,0.4)' }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.18)', backdropFilter: 'blur(20px)' }}
        >
          <div className="px-6 pt-5 pb-2">
            <h2 className="font-black text-white text-sm uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.5)' }}>Settings</h2>
          </div>
          {MENU.map(({ icon: Icon, label, desc }) => (
            <button key={label} className="w-full flex items-center gap-4 px-6 py-4 transition-colors hover:bg-violet-500/5 border-t" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
                <Icon className="w-4 h-4" style={{ color: '#a78bfa' }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs" style={{ color: 'rgba(200,185,255,0.4)' }}>{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: 'rgba(124,58,237,0.4)' }} />
            </button>
          ))}
        </motion.div>

        {/* Sign out */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={() => {
            localStorage.removeItem('seoai_user');
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>

      </div>
    </div>
  );
}
