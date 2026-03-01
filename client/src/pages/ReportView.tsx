import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Copy, BarChart3, Search, MessageSquare, Code2, Sparkles, ChevronRight, Calendar as CalendarIcon, Globe, ExternalLink } from 'lucide-react';
import { useState } from 'react';

// You can create these sub-components or import them if they exist and are well-styled.
// For "complete new ui", I'll inline stylish versions or reuse if good.
// The user has existing components like ScoreGauge, KeywordChips, CopyBlock. I'll reimplement them cleanly to ensure style match.

const Card = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors ${className}`}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-white">
    <div className="p-1.5 bg-blue-500/10 rounded-lg">
      <Icon className="w-5 h-5 text-blue-400" />
    </div>
    {title}
  </div>
);

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) => {
  const styles = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[color as keyof typeof styles]}`}>
      {children}
    </span>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

interface ReportProps {
  report: any;
}

export default function ReportView({ report }: ReportProps) {
  // Use a fallback for robustness
  const agents = report?.agents || {};
  const audit = agents.seoAudit || {};
  const keywords = agents.keywordIntel || {};
  const contentOpt = agents.contentOptimization || {};
  const llmOpt = agents.llmOptimization || {};
  const techSeo = agents.technicalSeo || {};

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Website Meta Banner — shown only for URL analyses */}
      {report.analysis_type === 'url' && report.website_meta && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="p-2.5 bg-blue-500/10 rounded-xl shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold truncate">{report.website_meta.title || 'Website Analysis'}</p>
            <a
              href={report.website_meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm truncate flex items-center gap-1 mt-0.5 transition-colors"
            >
              {report.website_meta.url}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
            {report.website_meta.metaDesc && (
              <p className="text-gray-500 text-xs mt-1 line-clamp-1">{report.website_meta.metaDesc}</p>
            )}
          </div>
          <Badge color="blue">Website Scan</Badge>
        </motion.div>
      )}

      {/* Header Summary */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{report.keyword || 'SEO Analysis'}</h1>
          <div className="flex flex-wrap gap-2 text-sm text-gray-400">
            <Badge color="blue">{report.industry || 'General'}</Badge>
            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        {/* Overall Score Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-4 bg-gray-900 border border-white/10 px-6 py-4 rounded-2xl"
        >
          <div className="text-right">
            <div className="text-sm text-gray-400">Overall Score</div>
            <div className={`text-3xl font-bold ${scoreColor(report.overall_score || 0)}`}>
              {report.overall_score || 0}/100
            </div>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-gray-800" fill="transparent" />
              <circle 
                cx="32" cy="32" r="28" 
                stroke="currentColor" 
                strokeWidth="4" 
                className={`${scoreColor(report.overall_score || 0)} transition-all duration-1000 ease-out`}
                fill="transparent" 
                strokeDasharray={175.9} 
                strokeDashoffset={175.9 - (175.9 * (report.overall_score || 0)) / 100} 
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {report.is_partial && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 px-4 py-3 rounded-xl flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Analysis incomplete. Some agents faced intermittent errors.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Audit & Stats */}
        <div className="space-y-6">
          <Card delay={0.1}>
            <SectionHeader icon={BarChart3} title="Audit Metrics" />
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-400">Keyword Density</span>
                <span className="font-semibold">{audit.keyword_density || 0}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-gray-400">Readability</span>
                <span className="font-semibold">{audit.readability_score || 0}/100</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-gray-400">Word Count</span>
                <span className="font-semibold">{audit.word_count || 0}</span>
              </div>
            </div>
          </Card>

          <Card delay={0.2}>
            <SectionHeader icon={Code2} title="Technical Health" />
            <div className="space-y-3">
              {techSeo.schema_markup_suggestions?.length > 0 ? (
                 <div className="bg-gray-950/50 p-3 rounded-lg border border-white/5 text-sm">
                   <div className="text-gray-400 mb-1">Schema Suggestion:</div>
                   <div className="font-mono text-xs text-blue-300">{techSeo.schema_markup_suggestions[0]}</div>
                 </div>
              ) : (
                <div className="text-sm text-gray-500 italic">No schema issues detected.</div>
              )}
              {techSeo.mobile_friendliness_issues?.length > 0 && (
                <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/10 text-sm text-red-300">
                  <div className="font-medium mb-1">Mobile Issues:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {techSeo.mobile_friendliness_issues.map((issue: string, i: number) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Column 2: Content Optimization */}
        <div className="lg:col-span-2 space-y-6">
          <Card delay={0.3}>
            <SectionHeader icon={Search} title="Keyword Strategy" />
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Related Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.related_keywords?.slice(0, 8).map((k: string, i: number) => (
                    <Badge key={i} color="blue">{k}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Long-Tail Opportunities</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.long_tail_keywords?.slice(0, 6).map((k: string, i: number) => (
                    <Badge key={i} color="purple">{k}</Badge>
                  ))}
                </div>
              </div>
              {keywords.search_intent && (
                 <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl">
                    <span className="text-blue-400 font-medium">Search Intent Analysis: </span>
                    <span className="text-gray-300">{keywords.search_intent}</span>
                 </div>
              )}
            </div>
          </Card>

          <Card delay={0.4}>
            <SectionHeader icon={Sparkles} title="AI Content Recommendations" />
            
            <div className="space-y-6">
              {contentOpt.seo_title && (
                <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 font-medium">Optimized Title Tag</span>
                    <CopyButton text={contentOpt.seo_title} />
                  </div>
                  <div className="text-lg font-medium text-white">{contentOpt.seo_title}</div>
                </div>
              )}

              {contentOpt.meta_description && (
                <div className="bg-gray-950/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 font-medium">Meta Description</span>
                    <CopyButton text={contentOpt.meta_description} />
                  </div>
                  <div className="text-gray-300 leading-relaxed">{contentOpt.meta_description}</div>
                </div>
              )}

              {contentOpt.intro_hook && (
                <div className="border-l-2 border-purple-500 pl-4 py-1">
                   <div className="text-sm text-purple-400 font-medium mb-1">Suggested Hook</div>
                   <p className="text-gray-300 italic">"{contentOpt.intro_hook}"</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* LLM Optimization */}
          {llmOpt.conversational_triggers?.length > 0 && (
             <Card delay={0.5}>
               <SectionHeader icon={MessageSquare} title="Voice & AI Search Optimization" />
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-gray-950/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Conversational Triggers</h4>
                    <ul className="space-y-2">
                      {llmOpt.conversational_triggers.slice(0,3).map((t: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div className="bg-gray-900/30 p-4 rounded-xl border border-white/5">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Entity Salience</h4>
                    <div className="flex flex-wrap gap-2">
                       {llmOpt.entity_salience_suggestions?.map((e: string, i: number) => (
                         <span key={i} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">{e}</span>
                       ))}
                    </div>
                 </div>
               </div>
             </Card>
          )}

        </div>
      </div>
    </div>
  );
}


