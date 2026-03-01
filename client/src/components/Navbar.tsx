import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LayoutDashboard, PlusCircle, User, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function getStoredUser() {
  try {
    const raw = localStorage.getItem('seoai_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Re-read on each render so sign-in/sign-out reflects immediately
  const user = getStoredUser();
  const loggedIn = Boolean(user?.loggedIn);

  const isActive = (path: string) => location.pathname === path;

  const hide = location.pathname === '/login';
  if (hide) return null;

  const handleSignOut = () => {
    localStorage.removeItem('seoai_user');
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze', path: '/analyze', icon: PlusCircle },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(6,6,15,0.75)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight" style={{ background: 'linear-gradient(90deg,#a78bfa,#fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SEOÂ·AI</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-violet-400/60 font-medium -mt-0.5">ENTERPRISE</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path) ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-violet-500/5'
                }`}
                style={isActive(link.path) ? { background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' } : {}}
              >
                <link.icon className={`w-4 h-4 ${isActive(link.path) ? 'text-violet-400' : ''}`} />
                {link.name}
              </Link>
            ))}
            <div className="w-px h-6 mx-2" style={{ background: 'rgba(124,58,237,0.2)' }} />

            {loggedIn ? (
              <>
                {/* Avatar with user initial */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
                  style={isActive('/profile') ? { background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' } : {}}
                  title={user?.name || user?.email}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 12px rgba(124,58,237,0.35)' }}>
                    {user?.initial || <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm font-medium text-white max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ml-1 transition-all"
                  style={{ color: 'rgba(248,113,113,0.8)', border: '1px solid rgba(239,68,68,0.15)' }}
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all ml-1"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-400 hover:text-white">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed inset-x-0 top-16 z-40 p-4 md:hidden"
            style={{ background: 'rgba(6,6,15,0.97)', borderBottom: '1px solid rgba(124,58,237,0.15)' }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  style={isActive(link.path) ? { background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' } : {}}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              {loggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white" style={isActive('/profile') ? { background: 'rgba(124,58,237,0.15)' } : {}}>
                    <User className="w-5 h-5" /> {user?.name || 'Profile'}
                  </Link>
                  <button onClick={() => { setOpen(false); handleSignOut(); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)' }}>
                  <LogIn className="w-5 h-5" /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
