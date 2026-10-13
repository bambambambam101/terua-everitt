import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Users, 
  Bot, 
  Cpu, 
  HeartHandshake, 
  Flame, 
  Sparkles,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import { ShiftInfo, ShiftName, YieldNode } from '../types/hyperion';

interface ClassHierarchyMapProps {
  shifts: ShiftInfo[];
  activeShift: ShiftName;
  onRotateShift: () => void;
  onInjectAnomaly: () => void;
  onPurgeLogs: () => void;
  nodes: YieldNode[];
  onSelectClassFilter: (cls: 'ALL' | 'C-1' | 'C-2' | 'C-3' | 'C-4') => void;
  selectedFilter: 'ALL' | 'C-1' | 'C-2' | 'C-3' | 'C-4';
}

export const ClassHierarchyMap: React.FC<ClassHierarchyMapProps> = ({
  shifts,
  activeShift,
  onRotateShift,
  onInjectAnomaly,
  onPurgeLogs,
  nodes,
  onSelectClassFilter,
  selectedFilter
}) => {
  const [shiftTime, setShiftTime] = useState('16:08:59');

  // Realistic ticking shift clock starting around 16:08:59
  useEffect(() => {
    let seconds = 16 * 3600 + 8 * 60 + 59;
    const interval = setInterval(() => {
      seconds++;
      const hrs = Math.floor((seconds / 3600) % 24).toString().padStart(2, '0');
      const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      setShiftTime(`${hrs}:${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentShiftObj = shifts.find(s => s.name === activeShift) || shifts[2];

  // Class aggregate metrics
  const c1Nodes = nodes.filter(n => n.agentClass === 'C-1');
  const c2Nodes = nodes.filter(n => n.agentClass === 'C-2');
  const c3Nodes = nodes.filter(n => n.agentClass === 'C-3');
  const c4Nodes = nodes.filter(n => n.agentClass === 'C-4');

  const c1Yield = c1Nodes.reduce((sum, n) => sum + n.currentYieldPerSec, 0);
  const c2Yield = c2Nodes.reduce((sum, n) => sum + n.currentYieldPerSec, 0);
  const c3Yield = c3Nodes.reduce((sum, n) => sum + n.currentYieldPerSec, 0);
  const c4Yield = c4Nodes.reduce((sum, n) => sum + n.currentYieldPerSec, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      {/* 4-Tier Class Hierarchy Map */}
      <div className="xl:col-span-8 bg-slate-900/80 border border-cyan-900/40 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm sm:text-base font-bold font-mono text-slate-100 tracking-wider">
              Class Hierarchy Map
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              4 Tier Architecture
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>FILTER PIPELINES:</span>
            <button
              onClick={() => onSelectClassFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] transition cursor-pointer font-bold ${
                selectedFilter === 'ALL'
                  ? 'bg-cyan-500 text-black'
                  : 'bg-black/40 text-slate-400 hover:text-white'
              }`}
            >
              ALL (26)
            </button>
          </div>
        </div>

        {/* 4 Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* CLASS-1 */}
          <div
            onClick={() => onSelectClassFilter(selectedFilter === 'C-1' ? 'ALL' : 'C-1')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer relative group ${
              selectedFilter === 'C-1'
                ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                : 'bg-slate-950/60 border-slate-800 hover:border-amber-600/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                CLASS-1
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                3 Agents
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200 font-mono mb-0.5">
              Macro AI Directors
            </div>
            <div className="text-[11px] text-slate-400 leading-tight mb-2.5">
              Autonomous Capital Allocators
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Yield Share:</span>
              <span className="text-amber-400 font-bold">${c1Yield.toFixed(2)}/s</span>
            </div>
          </div>

          {/* CLASS-2 */}
          <div
            onClick={() => onSelectClassFilter(selectedFilter === 'C-2' ? 'ALL' : 'C-2')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer relative group ${
              selectedFilter === 'C-2'
                ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-950/60 border-slate-800 hover:border-cyan-600/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                CLASS-2
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                5 Agents
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200 font-mono mb-0.5">
              Shift Agents
            </div>
            <div className="text-[11px] text-slate-400 leading-tight mb-2.5">
              Yield & Risk Orchestrators
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Yield Share:</span>
              <span className="text-cyan-400 font-bold">${c2Yield.toFixed(2)}/s</span>
            </div>
          </div>

          {/* CLASS-3 */}
          <div
            onClick={() => onSelectClassFilter(selectedFilter === 'C-3' ? 'ALL' : 'C-3')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer relative group ${
              selectedFilter === 'C-3'
                ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                : 'bg-slate-950/60 border-slate-800 hover:border-purple-600/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-purple-400 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                CLASS-3
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">
                14 Bots
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200 font-mono mb-0.5">
              Task Execution Bots
            </div>
            <div className="text-[11px] text-slate-400 leading-tight mb-2.5">
              Micro-Arbitrage & Compute Workers
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Yield Share:</span>
              <span className="text-purple-400 font-bold">${c3Yield.toFixed(2)}/s</span>
            </div>
          </div>

          {/* CLASS-4 */}
          <div
            onClick={() => onSelectClassFilter(selectedFilter === 'C-4' ? 'ALL' : 'C-4')}
            className={`p-3.5 rounded-lg border transition-all cursor-pointer relative group ${
              selectedFilter === 'C-4'
                ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-slate-950/60 border-slate-800 hover:border-emerald-600/60 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                CLASS-4
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                4 Bots
              </span>
            </div>
            <div className="text-xs font-bold text-slate-200 font-mono mb-0.5">
              R&D Self-Healers
            </div>
            <div className="text-[11px] text-slate-400 leading-tight mb-2.5">
              Code Mutators & Fault Mitigation
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Yield Share:</span>
              <span className="text-emerald-400 font-bold">${c4Yield.toFixed(2)}/s</span>
            </div>
          </div>
        </div>

        {/* Live Swarm Control Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-semibold">
            <Activity className="w-4 h-4 text-cyan-400" />
            Swarm Control Interface:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onInjectAnomaly}
              className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              INJECT QUANTUM ANOMALY
            </button>

            <button
              onClick={onPurgeLogs}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              PURGE LOGS
            </button>

            <button
              onClick={onRotateShift}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              ROTATE SHIFT
            </button>
          </div>
        </div>
      </div>

      {/* Shift Rotation Matrix Card */}
      <div className="xl:col-span-4 bg-slate-900/80 border border-cyan-900/40 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm sm:text-base font-bold font-mono text-slate-100 tracking-wider">
                Shift Rotation Matrix
              </h2>
            </div>
            <div className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/60 border border-slate-800 text-cyan-400">
              {shiftTime}
            </div>
          </div>

          {/* 3 Shifts Pills */}
          <div className="grid grid-cols-3 gap-2 mt-3.5">
            {shifts.map((s) => {
              const isActive = s.name === activeShift;
              return (
                <div
                  key={s.name}
                  className={`p-2.5 rounded-lg border text-center transition-all ${
                    isActive
                      ? 'bg-cyan-950/80 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-black/40 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className={`text-xs font-mono font-bold ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                    {s.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    {s.hours}
                  </div>
                  {isActive && (
                    <div className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Supervisor */}
          <div className="mt-4 p-3 rounded-lg bg-black/50 border border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              Active Shift Supervisor:
            </div>
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {currentShiftObj.supervisor}
            </div>
          </div>
        </div>

        {/* Quantum Coherence Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            ORACLE COHERENCE:
          </span>
          <span className="text-purple-300 font-bold">99.984%</span>
        </div>
      </div>
    </div>
  );
};
