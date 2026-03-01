import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Search, Cpu, TrendingUp, ArrowRight, Globe, Shield, Terminal } from 'lucide-react';

const AGENTS = [
  { emoji: '🔍', name: 'SEER', role: 'SEO Auditor', color: '#7c3aed' },
  { emoji: '🎯', name: 'KIRA', role: 'Keyword Intel', color: '#f97316' },
  { emoji: '✍️', name: 'QUILL', role: 'Content Optimizer', color: '#10b981' },
  { emoji: '🧠', name: 'NOVA', role: 'LLM Optimizer', color: '#ec4899' },
  { emoji: '⚡', name: 'BOLT', role: 'Technical SEO', color: '#eab308' },
];

const FEATURES = [
  { icon: Search, title: 'Deep SEO Audit', desc: 'Keyword density, meta structures, semantic intent — dissected by Agent SEER.', accent: '#7c3aed' },
  { icon: Cpu, title: '5-Agent AI Swarm', desc: 'Gemini 3.1 Pro agents run in parallel, each specialised for a different SEO layer.', accent: '#f97316' },
  { icon: TrendingUp, title: 'Market Intelligence', desc: 'KIRA mines keyword clusters and SERP gaps to give you an edge over competitors.', accent: '#10b981' },
  { icon: Globe, title: 'Live Website Scan', desc: 'Paste a URL and we crawl, extract, and analyse the live page in seconds.', accent: '#ec4899' },
  { icon: Shield, title: 'Technical Health', desc: 'Core Web Vitals, schema markup, canonical tags — BOLT catches what devs miss.', accent: '#eab308' },
  { icon: Terminal, title: 'One-Click Copy', desc: 'QUILL rewrites weak sections and NOVA polishes your brand voice automatically.', accent: '#06b6d4' },
];

export default function Landing() {
  return (
    <div className="min-h-screen text-white overflow-hidden" style={{ background: '#06060f' }}>

      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(124,58,237,0.04) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.12) 0%, transparent 65%)' }} />

      <div className="relative z-10">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-40 pb-28 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#a78bfa' }} />
            Powered by Gemini 3.1 Pro · 5-Agent AI Swarm
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6"
          >
            <span className="text-white">Rank Higher.</span>
            <br />
            <span style={{ background: 'linear-gradient(90deg, #a78bfa 0%, #fb923c 50%, #f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Outsmart All.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ color: 'rgba(200,185,255,0.55)' }}
          >
            Five specialised AI agents audit, optimise, and rewrite your content — delivering a full SEO report in under 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/analyze"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}
            >
              Start Free Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'rgba(167,139,250,0.8)' }}
            >
              View Dashboard
            </Link>
          </motion.div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-10 mt-20">
            {[['5', 'AI Agents'], ['3.1', 'Gemini Pro'], ['∞', 'Analyses'], ['<60s', 'Report Time']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white">{val}</div>
                <div className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: 'rgba(167,139,250,0.45)' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* AGENTS SHOWCASE */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Meet The Swarm</h2>
            <p className="text-sm" style={{ color: 'rgba(200,185,255,0.4)' }}>Five agents. One mission. Zero compromises.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {AGENTS.map(({ emoji, name, role, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-2xl p-5 text-center transition-all"
                style={{ background: 'rgba(14,14,26,0.8)', border: `1px solid ${color}20`, backdropFilter: 'blur(20px)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ background: `${color}15`, boxShadow: `0 0 20px ${color}20` }}
                >
                  {emoji}
                </div>
                <p className="font-black text-white text-sm">{name}</p>
                <p className="text-xs mt-0.5" style={{ color: `${color}` }}>{role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="max-w-7xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Everything You Need to Dominate Search</h2>
            <p className="text-sm" style={{ color: 'rgba(200,185,255,0.4)' }}>From crawl to copy — handled by AI.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-6 group transition-all hover:-translate-y-1"
                style={{ background: 'rgba(14,14,26,0.8)', border: `1px solid ${accent}18`, backdropFilter: 'blur(20px)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all"
                  style={{ background: `${accent}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h3 className="font-black text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(200,185,255,0.45)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 40px rgba(124,58,237,0.4)' }}>
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Ready to Rank #1?</h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(200,185,255,0.5)' }}>
              Run your first AI SEO analysis free. No credit card required.
            </p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 32px rgba(124,58,237,0.35)' }}
            >
              Analyse For Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </section>

        <footer className="border-t px-6 py-8 text-center text-xs" style={{ borderColor: 'rgba(124,58,237,0.12)', color: 'rgba(200,185,255,0.3)' }}>
          SEO·AI Enterprise · Powered by Gemini 3.1 Pro · Built with ❤️
        </footer>
      </div>
    </div>
  );
}

