import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AGENTS = [
  {
    id: 'seoAudit',
    name: 'Agent SEER',
    role: 'SEO Auditor',
    emoji: '🔍',
    color: 'violet',
    startAt: 0,
    lines: ['Scanning keyword density...', 'Checking meta structures...', 'Auditing on-page signals...'],
  },
  {
    id: 'keywordIntel',
    name: 'Agent KIRA',
    role: 'Keyword Intel',
    emoji: '🎯',
    color: 'orange',
    startAt: 0,
    lines: ['Mining keyword clusters...', 'Mapping search intent...', 'Analysing SERP landscape...'],
  },
  {
    id: 'contentOpt',
    name: 'Agent QUILL',
    role: 'Content Optimizer',
    emoji: '✍️',
    color: 'green',
    startAt: 9,
    lines: ['Rewriting low-density blocks...', 'Boosting readability score...', 'Inserting semantic keywords...'],
  },
  {
    id: 'llmOpt',
    name: 'Agent NOVA',
    role: 'LLM Optimizer',
    emoji: '🧠',
    color: 'pink',
    startAt: 20,
    lines: ['Generating optimised copy...', 'Calibrating brand voice...', 'Injecting power phrases...'],
  },
  {
    id: 'techSeo',
    name: 'Agent BOLT',
    role: 'Technical SEO',
    emoji: '⚡',
    color: 'yellow',
    startAt: 31,
    lines: ['Auditing schema markup...', 'Checking Core Web Vitals...', 'Validating canonical URLs...'],
  },
];

const COLOR_MAP: Record<string, { border: string; glow: string; badge: string; dot: string; text: string }> = {
  violet: { border: 'border-violet-500/60',  glow: 'shadow-violet-500/30',  badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',  dot: 'bg-violet-400',  text: 'text-violet-400' },
  orange: { border: 'border-orange-500/60',  glow: 'shadow-orange-500/30',  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',  dot: 'bg-orange-400',  text: 'text-orange-400' },
  green:  { border: 'border-green-500/60',   glow: 'shadow-green-500/30',   badge: 'bg-green-500/15 text-green-300 border-green-500/30',   dot: 'bg-green-400',   text: 'text-green-400' },
  pink:   { border: 'border-pink-500/60',    glow: 'shadow-pink-500/30',    badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',    dot: 'bg-pink-400',    text: 'text-pink-400' },
  yellow: { border: 'border-yellow-500/60',  glow: 'shadow-yellow-500/30',  badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',  dot: 'bg-yellow-400',  text: 'text-yellow-400' },
};

const LOG_MESSAGES = [
  '> Initialising AI swarm...',
  '> Auth token verified. Passthrough granted.',
  '> Orchestrator online. Spinning up agents...',
  '> Agent SEER deployed [SEO_AUDIT]',
  '> Agent KIRA deployed [KEYWORD_INTEL]',
  '> Round 1: Parallel execution started...',
  '> Streaming LLM tokens from Gemini 3.1 Pro...',
  '> Round 1 complete. Passing context downstream...',
  '> Agent QUILL deployed [CONTENT_OPT]',
  '> Optimising content with upstream signals...',
  '> Round 2 complete. Context enriched.',
  '> Agent NOVA deployed [LLM_OPT]',
  '> Generating optimised copy variants...',
  '> Round 3 complete. AI copy injected.',
  '> Agent BOLT deployed [TECHNICAL_SEO]',
  '> Running schema + Core Web Vital checks...',
  '> All agents finished. Assembling final report...',
  '> Calculating overall SEO score...',
  '> Report ready. Rendering results...',
];

function RobotFace({ active, color }: { active: boolean; color: string }) {
  const c = COLOR_MAP[color];
  return (
    <div className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl transition-all duration-500 ${
      active
        ? `${c.border} shadow-lg ${c.glow} bg-gray-900`
        : 'border-white/5 bg-gray-900/40 grayscale opacity-40'
    }`}>
      <span className={active ? 'animate-bounce' : ''}
        style={{ animationDuration: '1.4s' }}>
        {active ? '🤖' : '💤'}
      </span>
      {active && (
        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${c.dot} animate-ping`} />
      )}
      {active && (
        <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${c.dot}`} />
      )}
    </div>
  );
}

export default function AgentLoader({ mode }: { mode: 'content' | 'url' }) {
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<string[]>([LOG_MESSAGES[0]]);
  const [logIndex, setLogIndex] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // drip-feed log lines
  useEffect(() => {
    if (logIndex >= LOG_MESSAGES.length) return;
    const delay = logIndex < 4 ? 600 : logIndex < 10 ? 2200 : 2800;
    const t = setTimeout(() => {
      setLogs(l => [...l, LOG_MESSAGES[logIndex]]);
      setLogIndex(i => i + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [logIndex]);

  const activeAgents = AGENTS.filter(a => elapsed >= a.startAt);
  const totalProgress = Math.min(
    Math.round((activeAgents.length / AGENTS.length) * 85 + (elapsed > 38 ? 15 : 0)),
    99
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#06060f' }}>
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)' }}
      />

      {/* Moving grid glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: ['-5%', '5%', '-5%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] blur-[140px] rounded-full"
          style={{ background: 'rgba(124,58,237,0.12)' }}
        />
        <motion.div
          animate={{ x: ['-5%', '5%', '-5%'] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] blur-[140px] rounded-full"
          style={{ background: 'rgba(249,115,22,0.08)' }}
        />
      </div>

      <div className="relative z-20 flex flex-col h-full max-w-6xl mx-auto w-full px-6 pt-24 pb-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-xs font-mono font-bold tracking-widest uppercase mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            SWARM ACTIVE
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-1">
            {mode === 'url' ? '🕷️ Crawl & Analyse' : '🧬 Content Dissection'}
          </h1>
          <p className="text-gray-500 text-sm font-mono">{elapsed}s elapsed · {totalProgress}% complete</p>
        </motion.div>

        {/* Split layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">

          {/* LEFT — Agent Grid */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Agent Status</p>
            <div className="grid grid-cols-1 gap-3">
              {AGENTS.map((agent, i) => {
                const active = elapsed >= agent.startAt;
                const c = COLOR_MAP[agent.color];
                const currentLine = active
                  ? agent.lines[Math.floor((elapsed - agent.startAt) / 4) % agent.lines.length]
                  : 'Standby...';

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-700 ${
                      active
                        ? `bg-gray-900/60 ${c.border} shadow-lg ${c.glow} backdrop-blur-sm`
                        : 'bg-gray-900/20 border-white/5'
                    }`}
                  >
                    <RobotFace active={active} color={agent.color} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-black text-sm tracking-wide ${active ? 'text-white' : 'text-gray-600'}`}>
                          {agent.name}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${active ? c.badge : 'bg-gray-900/40 text-gray-600 border-white/5'}`}>
                          {agent.role}
                        </span>
                        {active && (
                          <span className="ml-auto text-[10px] font-mono text-gray-500">
                            +{elapsed - agent.startAt}s
                          </span>
                        )}
                      </div>
                      <p className={`text-xs font-mono truncate transition-colors ${active ? c.text : 'text-gray-700'}`}>
                        {active ? (
                          <motion.span
                            key={currentLine}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {currentLine}
                          </motion.span>
                        ) : '— awaiting upstream agents —'}
                      </p>
                    </div>
                    {/* Idle wave when active */}
                    {active && (
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[0,1,2,3].map(j => (
                          <motion.div
                            key={j}
                            className={`w-1 rounded-full ${c.dot}`}
                            animate={{ height: ['4px', '16px', '8px', '4px'] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: j * 0.15, ease: 'easeInOut' }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1.5">
                <span>OVERALL PROGRESS</span>
                <span>{totalProgress}%</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#7c3aed,#f97316,#ec4899)' }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Terminal Log */}
          <div className="flex flex-col min-h-0">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">System Log</p>
            <div className="flex-1 rounded-2xl p-5 overflow-y-auto font-mono text-xs space-y-1.5" style={{ minHeight: '300px', maxHeight: '480px', background: 'rgba(6,6,15,0.9)', border: '1px solid rgba(124,58,237,0.15)' }}>
              {/* Terminal header dots */}
              <div className="flex gap-1.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-gray-600 text-[10px]">seo-orchestrator — bash</span>
              </div>
              <AnimatePresence>
                {logs.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`leading-relaxed ${
                      line.includes('deployed') ? 'text-green-400' :
                      line.includes('complete') || line.includes('ready') ? 'text-violet-400' :
                      line.includes('error') || line.includes('fail') ? 'text-red-400' :
                      'text-gray-400'
                    }`}
                  >
                    {line}
                    {i === logs.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="ml-1 inline-block w-2 h-3 bg-gray-400 align-middle"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Fun fact ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-4 bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3"
            >
              <p className="text-[10px] font-mono text-yellow-500/70 uppercase tracking-widest mb-1">⚡ Did you know?</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={Math.floor(elapsed / 8)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-gray-400"
                >
                  {[
                    'Pages ranking #1 on Google have an average of 1,447 words.',
                    'Gemini 3.1 Pro has a 1M token context window — bigger than most novels.',
                    '53% of all web traffic comes from organic search.',
                    'The average first page Google result loads in 1.65 seconds.',
                    'Long-tail keywords make up 70% of all searches.',
                  ][Math.floor(elapsed / 8) % 5]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
