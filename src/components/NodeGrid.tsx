import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  SlidersHorizontal, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { YieldNode, AgentClass } from '../types/hyperion';

interface NodeGridProps {
  nodes: YieldNode[];
  onToggleBoost: (id: number) => void;
  onSelectNode: (node: YieldNode) => void;
  selectedFilter: 'ALL' | 'C-1' | 'C-2' | 'C-3' | 'C-4';
  setSelectedFilter: (filter: 'ALL' | 'C-1' | 'C-2' | 'C-3' | 'C-4') => void;
}

export const NodeGrid: React.FC<NodeGridProps> = ({
  nodes,
  onToggleBoost,
  onSelectNode,
  selectedFilter,
  setSelectedFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'yield' | 'earned' | 'activity'>('id');

  const filteredNodes = nodes.filter((n) => {
    if (selectedFilter !== 'ALL' && n.agentClass !== selectedFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.name.toLowerCase().includes(q) ||
        n.code.toLowerCase().includes(q) ||
        n.classLabel.toLowerCase().includes(q) ||
        n.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sortedNodes = [...filteredNodes].sort((a, b) => {
    if (sortBy === 'yield') return b.currentYieldPerSec - a.currentYieldPerSec;
    if (sortBy === 'earned') return b.accumulatedEarned - a.accumulatedEarned;
    if (sortBy === 'activity') return b.activityPercent - a.activityPercent;
    return a.id - b.id;
  });

  return (
    <div className="bg-slate-900/80 border border-cyan-900/40 rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold font-mono text-slate-100 tracking-wider">
              Production Streams Matrix Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Live Nodes #01 - #25 Yield Pipelines
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Filter Tabs */}
          <div className="flex items-center bg-black/60 rounded-lg p-1 border border-slate-800">
            {(['ALL', 'C-1', 'C-2', 'C-3', 'C-4'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search pipelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-black/50 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 w-44"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-black/50 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="id">Sort: Node ID</option>
            <option value="yield">Sort: Yield Rate</option>
            <option value="earned">Sort: Total Earned</option>
            <option value="activity">Sort: Activity %</option>
          </select>
        </div>
      </div>

      {/* Grid of Nodes #01 - #25 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3.5">
        {sortedNodes.map((node) => {
          const isAnomaly = node.status === 'ANOMALY';
          const isHealing = node.status === 'HEALING';
          const isBoosted = node.isBoosted;

          // Theme colors based on Agent Class
          const classColor = 
            node.agentClass === 'C-1' ? 'text-amber-400 border-amber-800/60 bg-amber-950/40' :
            node.agentClass === 'C-2' ? 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40' :
            node.agentClass === 'C-3' ? 'text-purple-400 border-purple-800/60 bg-purple-950/40' :
            'text-emerald-400 border-emerald-800/60 bg-emerald-950/40';

          return (
            <div
              key={node.id}
              className={`rounded-xl p-3.5 border transition-all flex flex-col justify-between relative overflow-hidden group ${
                isAnomaly
                  ? 'bg-red-950/40 border-red-600 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : isHealing
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : isBoosted
                      ? 'bg-slate-950/90 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400'
                      : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Top row: Code & Class & Status */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-100">
                      {node.code}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold ${classColor}`}>
                      {node.classLabel}
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isAnomaly
                      ? 'bg-red-950 text-red-300 border border-red-700'
                      : isHealing
                        ? 'bg-purple-950 text-purple-300 border border-purple-700 animate-pulse'
                        : isBoosted
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/80 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                  }`}>
                    {node.status}
                  </span>
                </div>

                {/* Node Title */}
                <h3 
                  onClick={() => onSelectNode(node)}
                  className="text-xs font-bold font-mono text-slate-200 hover:text-cyan-400 cursor-pointer line-clamp-1 mb-2.5 transition"
                  title={node.name}
                >
                  {node.name}
                </h3>

                {/* Metrics */}
                <div className="space-y-1.5 bg-black/40 rounded-lg p-2 border border-slate-900 mb-3 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Yield/sec:</span>
                    <span className={`font-bold ${isBoosted ? 'text-cyan-300' : 'text-emerald-400'}`}>
                      ${node.currentYieldPerSec.toFixed(2)}/s
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Earned:</span>
                    <span className="text-slate-200 font-semibold">
                      ${node.accumulatedEarned.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Act:</span>
                    <span className="text-slate-300 font-mono">
                      {node.activityPercent}%
                    </span>
                  </div>

                  {/* Activity Bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${
                        isAnomaly ? 'bg-red-500' : isBoosted ? 'bg-cyan-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${node.activityPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Button: Boost */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBoost(node.id)}
                  disabled={isAnomaly || isHealing}
                  className={`w-full py-1.5 px-3 rounded-lg font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 ${
                    isBoosted
                      ? 'bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 border border-cyan-600/70 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isBoosted ? 'text-cyan-400 fill-current' : 'text-slate-400'}`} />
                  {isBoosted ? 'BOOSTED 2.5x' : 'Boost'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
