import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ExternalLink, Clock } from 'lucide-react';

export default function MattrPopup() {
  const [show, setShow] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!show) return;
    if (countdown <= 0) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(6,6,15,0.85)',
            backdropFilter: 'blur(12px)',
            padding: '1rem',
          }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,6,15,0.95) 50%, rgba(249,115,22,0.10) 100%)',
              border: '1px solid rgba(124,58,237,0.35)',
              borderRadius: '1.25rem',
              padding: '2rem',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(249,115,22,0.08)',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShow(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '0.5rem',
                color: '#a1a1aa',
                cursor: 'pointer',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
                e.currentTarget.style.color = '#fca5a5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#a1a1aa';
              }}
            >
              <X size={14} />
              <span>{countdown}s</span>
            </button>

            {/* Header icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.25), rgba(239,68,68,0.25))',
                  border: '1px solid rgba(249,115,22,0.4)',
                  borderRadius: '0.75rem',
                  padding: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle size={22} color="#f97316" />
              </div>
              <div>
                <h2 style={{ color: '#f5f5f5', fontSize: '1.2rem', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                  Uptiq.ai Assessment Notice
                </h2>
                <p style={{ color: '#a1a1aa', fontSize: '0.78rem', margin: 0 }}>1st Level – App Development (2026 YOP)</p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(249,115,22,0.4), transparent)', margin: '0.75rem 0 1rem' }} />

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <p style={{ color: '#d4d4d8', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                This project was originally built and developed on{' '}
                <a
                  href="https://build.withmattr.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none', borderBottom: '1px dashed rgba(167,139,250,0.4)' }}
                >
                  Mattr.ai <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </a>{' '}
                as part of the Uptiq.ai placement assessment. However, due to{' '}
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>persistent publishing failures</span>{' '}
                on the Mattr.ai platform (multiple attempts were made), and with the deadline approaching, the code was exported and deployed independently on{' '}
                <span style={{ color: '#7c3aed', fontWeight: 600 }}>AWS EC2</span>.
              </p>

              {/* Screenshot reference box */}
              <div
                style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                }}
              >
                <div style={{ color: '#f97316', marginTop: '2px', flexShrink: 0 }}>⚠️</div>
                <p style={{ color: '#d4d4d8', fontSize: '0.82rem', lineHeight: 1.55, margin: 0 }}>
                  <strong style={{ color: '#fbbf24' }}>Publishing Error:</strong>{' '}
                  "An error occurred while publishing your application. Please try again or contact support if the issue persists." — This error appeared repeatedly on Mattr.ai despite multiple retry attempts.
                </p>
              </div>

              {/* Student info */}
              <div
                style={{
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem 1rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1.5rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#a1a1aa' }}>Name</span>
                  <span style={{ color: '#e4e4e7', fontWeight: 600 }}>M Ganesh</span>
                  <span style={{ color: '#a1a1aa' }}>VTU Number</span>
                  <span style={{ color: '#e4e4e7', fontWeight: 600 }}>22332</span>
                  <span style={{ color: '#a1a1aa' }}>Email</span>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>vtu22332@veltech.edu.in</span>
                  <span style={{ color: '#a1a1aa' }}>Platform</span>
                  <span style={{ color: '#e4e4e7', fontWeight: 600 }}>
                    Mattr.ai → AWS EC2
                  </span>
                </div>
              </div>
            </div>

            {/* Timer bar */}
            <div style={{ marginTop: '1.25rem', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 10, ease: 'linear' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #f97316)', borderRadius: '999px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
              <Clock size={12} color="#71717a" />
              <span style={{ color: '#71717a', fontSize: '0.72rem' }}>Auto-closes in {countdown}s</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
