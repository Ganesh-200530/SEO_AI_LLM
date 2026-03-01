import { useState, useEffect } from 'react';
import { Cpu, Search, FileText, Sparkles, Settings, CheckCircle } from 'lucide-react';

const AGENTS = [
  { name: 'SEO Audit Agent', icon: Search, color: 'text-blue-400', desc: 'Scoring content & analyzing structure...' },
  { name: 'Keyword Intelligence', icon: FileText, color: 'text-green-400', desc: 'Mapping keywords & search intent...' },
  { name: 'Content Optimization', icon: Sparkles, color: 'text-purple-400', desc: 'Generating optimized title & meta...' },
  { name: 'LLM Optimization', icon: Cpu, color: 'text-yellow-400', desc: 'Optimizing for AI discoverability...' },
  { name: 'Technical SEO', icon: Settings, color: 'text-cyan-400', desc: 'Building schema & linking strategy...' },
];

export default function LoadingSkeleton() {
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev < AGENTS.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 mb-4">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          AI Agents are analyzing your content...
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transition-all duration-1000"
            style={{ width: `${((activeAgent + 1) / AGENTS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Round {Math.min(activeAgent + 1, 4)} of 4 — {activeAgent < 2 ? 'Parallel analysis' : 'Cascading data flow'}
        </p>
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {AGENTS.map((agent, i) => {
          const Icon = agent.icon;
          const isActive = i === activeAgent;
          const isDone = i < activeAgent;

          return (
            <div
              key={i}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                isActive
                  ? 'bg-gray-800/80 border-blue-500/50 shadow-lg shadow-blue-500/10'
                  : isDone
                  ? 'bg-gray-900/50 border-gray-700/50 opacity-70'
                  : 'bg-gray-900/30 border-gray-800/50 opacity-40'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isActive ? 'bg-blue-500/20' : isDone ? 'bg-green-500/20' : 'bg-gray-800'
              }`}>
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Icon className={`w-5 h-5 ${isActive ? agent.color : 'text-gray-600'}`} />
                )}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'}`}>
                  {agent.name}
                </div>
                <div className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-600'}`}>
                  {isDone ? 'Complete — data passed to next agent' : isActive ? agent.desc : 'Waiting...'}
                </div>
              </div>
              {isActive && (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
