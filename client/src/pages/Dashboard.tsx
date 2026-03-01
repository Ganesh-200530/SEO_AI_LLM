import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReports, deleteReport } from '../lib/api';
import { FileText, Trash2, Plus, TrendingUp, Search, Calendar, BarChart3, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportSummary {
  id: string;
  keyword: string;
  industry: string;
  seo_score: number;
  created_at: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smoother UI feel or real fetch
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data.reports || []);
    } catch {
      // DB not configured — that's fine
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((sum, r) => sum + (r.seo_score || 0), 0) / reports.length)
    : 0;

  return (
    <div className="min-h-screen text-white pt-24 pb-12 px-6" style={{ background: '#06060f' }}>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(124,58,237,0.1) 0%,transparent 60%)' }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black" style={{ background: 'linear-gradient(90deg,#fff,rgba(167,139,250,0.8))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard Overview</h1>
            <p className="mt-1 text-sm" style={{ color: 'rgba(167,139,250,0.5)' }}>Manage your SEO audits and track performance.</p>
          </div>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all group"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 24px rgba(124,58,237,0.3)' }}
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            New Analysis
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Reports', value: reports.length, icon: FileText, hex: '#7c3aed' },
            { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, hex: '#10b981' },
            { label: 'AI Engine', value: 'Gemini 3.1', icon: BarChart3, hex: '#f97316' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden"
              style={{ background: 'rgba(14,14,26,0.8)', border: `1px solid ${(stat as any).hex}20` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl" style={{ background: `${(stat as any).hex}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: (stat as any).hex }} />
                </div>
                {i === 1 && <span className="text-xs flex items-center gap-1" style={{ color: '#10b981' }}>+2.4% <ArrowUpRight className="w-3 h-3"/></span>}
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm" style={{ color: 'rgba(167,139,250,0.5)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Reports Table/List */}
        <div className="rounded-2xl overflow-hidden backdrop-blur-md" style={{ background: 'rgba(14,14,26,0.8)', border: '1px solid rgba(124,58,237,0.18)' }}>
          <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
            <h2 className="text-lg font-black text-white">Recent Analyses</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(124,58,237,0.4)' }} />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none w-64 transition-all"
                style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.15)', caretColor: '#a78bfa' }}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center" style={{ color: 'rgba(167,139,250,0.4)' }}>
              <div className="animate-spin w-6 h-6 border-2 border-t-transparent rounded-full mx-auto mb-3" style={{ borderColor: 'rgba(124,58,237,0.4)', borderTopColor: '#7c3aed' }}/>
              Loading data...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <FileText className="w-8 h-8" style={{ color: 'rgba(124,58,237,0.5)' }} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">No reports generated yet</h3>
              <p className="mb-6 max-w-sm mx-auto text-sm" style={{ color: 'rgba(167,139,250,0.5)' }}>Start your first AI SEO audit to see detailed insights and optimization strategies.</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#f97316)', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}
              >
                Start Analysis
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-xs uppercase" style={{ color: 'rgba(167,139,250,0.4)', background: 'rgba(124,58,237,0.05)' }}>
                  <tr>
                    <th className="px-6 py-4 font-medium">Keyword / Topic</th>
                    <th className="px-6 py-4 font-medium">Industry</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody style={{ borderTop: 'none' }}>
                  {reports.map((r, i) => (
                    <motion.tr 
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="transition-colors group"
                      style={{ borderTop: '1px solid rgba(124,58,237,0.08)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-6 py-4">
                        <Link to={`/report/${r.id}`} className="font-bold text-white transition-colors" style={{ color: 'white' }} onMouseEnter={e => ((e.target as HTMLElement).style.color = '#a78bfa')} onMouseLeave={e => ((e.target as HTMLElement).style.color = 'white')}>
                          {r.keyword}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'rgba(167,139,250,0.5)' }}>{r.industry}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.15)' }}>
                            <div 
                              className="h-full rounded-full"
                              style={{ width: `${r.seo_score}%`, background: r.seo_score > 80 ? '#10b981' : r.seo_score > 50 ? '#f97316' : '#ef4444' }}
                            />
                          </div>
                          <span className="text-sm font-bold text-white">{r.seo_score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'rgba(167,139,250,0.4)' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(r.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-red-500/10"
                          style={{ color: 'rgba(167,139,250,0.4)' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#f87171')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(167,139,250,0.4)')}
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
