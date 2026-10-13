import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Trash2, 
  CornerDownLeft, 
  Copy, 
  Check, 
  Radio, 
  Download,
  Filter
} from 'lucide-react';
import { SystemLog } from '../types/hyperion';

interface QuantumTerminalProps {
  logs: SystemLog[];
  onClearLogs: () => void;
  onRunCliCommand: (cmd: string) => void;
}

export const QuantumTerminal: React.FC<QuantumTerminalProps> = ({
  logs,
  onClearLogs,
  onRunCliCommand
}) => {
  const [cliInput, setCliInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter(l => {
    if (filterCategory === 'ALL') return true;
    return l.category === filterCategory;
  });

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    onRunCliCommand(cliInput.trim());
    setCliInput('');
  };

  const handleCopyLogs = () => {
    const text = logs.map(l => `${l.timestamp} [${l.category}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0f19] border border-cyan-900/40 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* Title Bar */}
      <div className="px-4 py-2.5 bg-[#121826] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="font-bold text-cyan-400">
            sys@hyperion-node-26:~$
          </span>
          <span className="text-slate-300 font-semibold">
            quantum-orchestrator.log
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            STREAM ACTIVE
          </span>
        </div>

        {/* Filter & Actions */}
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center bg-black/50 rounded p-0.5 border border-slate-800 text-[10px]">
            {['ALL', 'YIELD', 'SYSTEM', 'QUANTUM', 'ANOMALY'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            onClick={onClearLogs}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 cursor-pointer text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            Clear
          </button>
        </div>
      </div>

      {/* Log Feed Screen */}
      <div 
        ref={scrollRef}
        className="p-4 overflow-y-auto max-h-[360px] min-h-[260px] space-y-1.5 bg-[#090d16] text-slate-200 select-text leading-relaxed"
      >
        {filteredLogs.map((log) => {
          let categoryColor = 'text-cyan-400';
          let borderTag = 'border-cyan-800/60 bg-cyan-950/40';

          if (log.category === 'YIELD') {
            categoryColor = 'text-emerald-400';
            borderTag = 'border-emerald-800/60 bg-emerald-950/40';
          } else if (log.category === 'QUANTUM') {
            categoryColor = 'text-purple-400';
            borderTag = 'border-purple-800/60 bg-purple-950/40';
          } else if (log.category === 'ANOMALY') {
            categoryColor = 'text-red-400 font-bold';
            borderTag = 'border-red-700 bg-red-950 animate-pulse';
          } else if (log.category === 'HEALER') {
            categoryColor = 'text-amber-400 font-bold';
            borderTag = 'border-amber-700 bg-amber-950/50';
          }

          return (
            <div key={log.id} className="flex items-start gap-2.5 text-xs hover:bg-white/[0.02] py-0.5 rounded px-1">
              <span className="text-slate-500 font-mono shrink-0 select-none">
                {log.timestamp}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${borderTag} ${categoryColor}`}>
                [{log.category}]
              </span>
              <span className={`break-words ${log.category === 'ANOMALY' ? 'text-red-300 font-bold' : log.category === 'HEALER' ? 'text-amber-200 font-semibold' : 'text-slate-300'}`}>
                {log.message}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Command Prompt Line */}
      <form onSubmit={handleCommandSubmit} className="p-2.5 bg-[#121826] border-t border-slate-800 flex items-center gap-2">
        <span className="text-emerald-400 font-bold pl-2 select-none">
          sys@hyperion-node-26:~$
        </span>
        <input
          type="text"
          value={cliInput}
          onChange={(e) => setCliInput(e.target.value)}
          placeholder="Enter command (e.g., 'boost --all', 'inject-anomaly', 'rotate', 'status', 'help')..."
          className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs placeholder:text-slate-600"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 border border-cyan-700/60 rounded text-xs flex items-center gap-1 cursor-pointer font-bold"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          Send
        </button>
      </form>
    </div>
  );
};
