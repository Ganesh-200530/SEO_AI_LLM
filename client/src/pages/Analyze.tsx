import { useState, type FormEvent } from 'react';
import { analyzeContent, analyzeWebsite } from '../lib/api';
import { ArrowLeft, Wand2, FileText, Target, Building2, AlertCircle, Globe, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReportView from './ReportView';
import AgentLoader from '../components/AgentLoader';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'Marketing', 'Real Estate', 'Travel', 'Food & Beverage', 'SaaS',
  'Legal', 'Manufacturing', 'Entertainment', 'Automotive', 'Other',
] as const;

type Mode = 'content' | 'url';

export default function Analyze() {
  const [mode, setMode] = useState<Mode>('content');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [industry, setIndustry] = useState<typeof INDUSTRIES[number]>('Technology');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState<any>(null);

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'content' && content.length < 50) {
      setError('Content is too short. Please provide at least 50 characters.');
      return;
    }
    if (mode === 'url') {
      try { new URL(url); } catch {
        setError('Invalid URL. Please enter a full URL including https://');
        return;
      }
    }

    setLoading(true);
    setReport(null);

    try {
      const response = mode === 'url'
        ? await analyzeWebsite(url, keyword, industry)
        : await analyzeContent(content, keyword, industry);

      if (response?.report) {
        setReport(response.report);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AgentLoader mode={mode} />;
  }

  if (report) {
    return (
    <div className="min-h-screen text-white pt-20 px-6" style={{ background: '#06060f' }}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setReport(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all mb-6"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: 'rgba(167,139,250,0.7)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            New Analysis
          </button>
          <ReportView report={report} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-6 pt-24 relative overflow-hidden" style={{ background: '#06060f' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse,rgba(124,58,237,0.12) 0%,transparent 70%)' }} />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <Wand2 className="w-6 h-6" style={{ color: '#a78bfa' }} />
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight">AI SEO Analysis</h1>
          <p className="text-gray-400 text-lg">
            Analyze a live website or paste your own content. Our 5-agent AI swarm grades and optimizes everything.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex p-1 rounded-xl mb-6"
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}
        >
          <button
            type="button"
            onClick={() => handleModeSwitch('content')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'content' ? '' : ''}`}
            style={mode === 'content' ? { background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: 'white', boxShadow: '0 0 20px rgba(124,58,237,0.25)' } : { color: 'rgba(167,139,250,0.5)' }}
          >
            <FileText className="w-4 h-4" />
            Content Paste
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'url' ? '' : ''}`}
            style={mode === 'url' ? { background: 'linear-gradient(135deg,#7c3aed,#c026d3)', color: 'white', boxShadow: '0 0 20px rgba(124,58,237,0.25)' } : { color: 'rgba(167,139,250,0.5)' }}
          >
            <Globe className="w-4 h-4" />
            Website URL
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-8 shadow-2xl"
          style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.18)', backdropFilter: 'blur(20px)' }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg p-4 mb-6 flex items-center gap-3 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === 'content' ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'rgba(167,139,250,0.7)' }}>
                      <FileText className="w-4 h-4" style={{ color: '#a78bfa' }} />
                      Content <span className="text-xs font-normal" style={{ color: 'rgba(167,139,250,0.35)' }}>(min 50 characters)</span>
                    </label>
                    <div className="relative group">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={7}
                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none resize-none transition-all"
                        style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)', caretColor: '#a78bfa' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
                        placeholder="Paste your article, blog draft, or webpage copy here..."
                      />
                      <div className="absolute bottom-3 right-3 text-xs rounded-md px-2 py-1" style={{ color: 'rgba(124,58,237,0.5)', background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.1)' }}>
                        {content.length} chars
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="url"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'rgba(167,139,250,0.7)' }}>
                      <Link2 className="w-4 h-4" style={{ color: '#a78bfa' }} />
                      Website URL
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Globe className="w-4 h-4" style={{ color: 'rgba(124,58,237,0.4)' }} />
                      </span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none transition-all"
                        style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)', caretColor: '#a78bfa' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
                        placeholder="https://example.com/your-page"
                      />
                    </div>
                    <p className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(124,58,237,0.5)' }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#7c3aed' }}></span>
                      The page will be fetched, content extracted, and analysed automatically.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'rgba(167,139,250,0.7)' }}>
                    <Target className="w-4 h-4" style={{ color: '#10b981' }} />
                    Target Keyword
                  </label>
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                    style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)', caretColor: '#a78bfa' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.6)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(124,58,237,0.2)')}
                    placeholder="e.g. AI SEO Tools"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2" style={{ color: 'rgba(167,139,250,0.7)' }}>
                    <Building2 className="w-4 h-4" style={{ color: '#f97316' }} />
                    Industry/Niche
                  </label>
                  <div className="relative">
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value as typeof INDUSTRIES[number])}
                      className="w-full rounded-xl px-4 py-3 text-white appearance-none outline-none transition-all cursor-pointer"
                      style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.2)' }}
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind} className="bg-gray-900">{ind}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(124,58,237,0.4)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl transition-all overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 32px rgba(124,58,237,0.35)' }}
                >
                  <span className="relative flex items-center gap-2">
                    {mode === 'url'
                      ? <><Globe className="w-5 h-5" /> Analyse Website</>                       
                      : <><Wand2 className="w-5 h-5 group-hover:animate-pulse" /> Generate SEO Report</>
                    }
                  </span>
                </button>
              </div>
            </form>
        </motion.div>
      </div>
    </div>
  );
}
