import React from 'react';
import { 
  Radio, 
  Terminal, 
  ShieldCheck, 
  AlertTriangle, 
  FileCode, 
  Download, 
  Activity, 
  Zap,
  MapPin
} from 'lucide-react';
import { FrequencyNode } from '../data/nodesData';

interface HeaderProps {
  nodes: FrequencyNode[];
  activeTab: 'console' | 'powershell' | 'terminal' | 'spectrum' | 'nodes';
  setActiveTab: (tab: 'console' | 'powershell' | 'terminal' | 'spectrum' | 'nodes') => void;
  onEmergencyShutdownAll: () => void;
  onExportCoordinates: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  nodes,
  activeTab,
  setActiveTab,
  onEmergencyShutdownAll,
  onExportCoordinates
}) => {
  const [timeUtc, setTimeUtc] = React.useState('');
  const [timeLocal, setTimeLocal] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().slice(17, 25) + ' UTC');
      setTimeLocal(now.toLocaleTimeString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalCount = nodes.length;
  const terminatedCount = nodes.filter(n => n.status === 'TERMINATED' || n.status === 'WIPED').length;
  const activeCount = nodes.filter(n => n.status === 'ACTIVE').length;
  const totalPowerManagedKw = Math.round(nodes.reduce((acc, n) => acc + n.powerWatts, 0) / 1000);

  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur sticky top-0 z-40">
      {/* Top Telemetry Ticker */}
      <div className="px-4 py-1.5 bg-black/60 border-b border-cyan-950/60 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYS-STATUS: ADMIN CREDENTIALS AUTHORIZED
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-cyan-300/80">
            OWNERSHIP AUTH: GRANTED (USER PRIVILEGES CONFIRMED)
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            MANAGEMENT INTERFACE: PS 7.4 / REST / SSH
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400 font-mono">
            LOCAL: <span className="text-slate-200">{timeLocal}</span>
          </span>
          <span className="text-cyan-400 font-mono">
            {timeUtc}
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-6 py-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-slate-100 font-mono">
                RF FREQUENCY NODE AUDIT & CONTROL
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-700/50">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              1.0 GHz – 92.5 GHz Spectrum Telemetry • Coordinate Logging Engine • Remote Admin Decommission
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className="px-2.5 py-1.5 rounded bg-slate-900/80 border border-slate-800 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">NODES:</span>
            <span className="font-bold text-slate-100">{totalCount}</span>
          </div>

          <div className="px-2.5 py-1.5 rounded bg-emerald-950/40 border border-emerald-900/50 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400/80">TERMINATED:</span>
            <span className="font-bold text-emerald-300">{terminatedCount}</span>
          </div>

          <div className={`px-2.5 py-1.5 rounded flex items-center gap-2 ${activeCount > 0 ? 'bg-red-950/40 border border-red-800 text-red-300 animate-pulse' : 'bg-slate-900/80 border border-slate-800 text-slate-400'}`}>
            <AlertTriangle className={`w-3.5 h-3.5 ${activeCount > 0 ? 'text-red-400' : 'text-slate-500'}`} />
            <span>ACTIVE:</span>
            <span className="font-bold">{activeCount}</span>
          </div>

          <div className="px-2.5 py-1.5 rounded bg-amber-950/30 border border-amber-900/40 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400/80">LOAD:</span>
            <span className="font-bold text-amber-300">{totalPowerManagedKw} kW</span>
          </div>

          {activeCount > 0 && (
            <button
              onClick={onEmergencyShutdownAll}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)] text-xs cursor-pointer"
              title="Dispatches administrative shutdown command to all active transmitting nodes"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              TERMINATE ALL ACTIVE ({activeCount})
            </button>
          )}

          <button
            onClick={onExportCoordinates}
            className="px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-700/60 font-semibold rounded flex items-center gap-1.5 transition-all text-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT COORDS
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="px-4 sm:px-6 flex items-center overflow-x-auto border-t border-slate-800/80 gap-1 bg-slate-950/50">
        <button
          onClick={() => setActiveTab('powershell')}
          className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'powershell'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          POWERSHELL SCRIPT STUDIO
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-900/60 text-cyan-200">
            .ps1
          </span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'terminal'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          PS TERMINAL SIMULATOR
        </button>

        <button
          onClick={() => setActiveTab('console')}
          className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'console'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          TACTICAL MAP & RADAR
        </button>

        <button
          onClick={() => setActiveTab('spectrum')}
          className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'spectrum'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-400" />
          SPECTRUM ANALYZER
        </button>

        <button
          onClick={() => setActiveTab('nodes')}
          className={`px-4 py-2.5 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'nodes'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-400" />
          NODE MATRIX ({totalCount})
        </button>
      </div>
    </header>
  );
};
