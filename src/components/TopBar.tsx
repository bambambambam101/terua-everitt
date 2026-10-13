import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  DollarSign, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Radio, 
  Zap, 
  Activity, 
  Layers, 
  Sparkles, 
  Compass, 
  MapPin, 
  Bot, 
  Terminal, 
  Flame, 
  Maximize, 
  Minimize, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  ShieldAlert,
  QrCode,
  Database,
  Workflow,
  BookOpen,
  User,
  Gamepad2,
  Laptop
} from 'lucide-react';
import { YieldNode } from '../types/hyperion';
import { HardwareTrustWidget } from './HardwareTrustWidget';

export type ActiveAppView = 
  | 'hardware'
  | 'famicom'
  | 'suite'
  | 'blueprint'
  | 'knowledge'
  | 'apex'
  | 'engine' 
  | 'scanner'
  | 'sdr'
  | 'iqreplay'
  | 'browser'
  | 'entropy'
  | 'absorbers'
  | 'mapper' 
  | 'defender' 
  | 'darkai' 
  | 'terminator' 
  | 'v2k' 
  | 'cli' 
  | 'all';

interface TopBarProps {
  nodes: YieldNode[];
  accumulatedYield: number;
  speedMultiplier: number;
  setSpeedMultiplier: (mult: number) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  onResetYield: () => void;
  onExportLedger: () => void;
  activeShiftSupervisor: string;
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  onOpenOptionsMenu: () => void;
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  nodes,
  accumulatedYield,
  speedMultiplier,
  setSpeedMultiplier,
  isRunning,
  setIsRunning,
  onResetYield,
  onExportLedger,
  activeShiftSupervisor,
  activeView,
  setActiveView,
  onOpenOptionsMenu,
  onOpenSettings
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const onlineCount = nodes.filter(n => n.status !== 'OFFLINE' && n.status !== 'ANOMALY').length;
  const totalPipelines = nodes.length + 1; // 25 nodes + Node 26 (Audit Module) = 26
  const totalYieldPerSec = nodes.reduce((sum, n) => {
    if (n.status === 'OFFLINE' || n.status === 'ANOMALY') return sum;
    return sum + n.currentYieldPerSec;
  }, 0);

  // Fullscreen tracking
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header className="border-b border-cyan-900/40 bg-[#070b13]/95 backdrop-blur sticky top-0 z-40">
      {/* Top Telemetry Feed Ticker */}
      <div className="px-4 py-1.5 bg-black/70 border-b border-cyan-950/60 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SYS TELEMETRY: HP VICTUS GAMING & OPPO A40 SECURED
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-300">
            PQC ENFORCED: ML-KEM-1024 // DILITHIUM
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-emerald-400 hidden md:inline">
            COOPERATIVE BANK: $14.85M NZD (TERUA EVERITT)
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>
            SUPERVISOR: <span className="text-amber-400 font-bold">{activeShiftSupervisor}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            YIELD RATE: <span className="text-emerald-300 font-bold">${totalYieldPerSec.toFixed(2)}/s</span>
          </span>
        </div>
      </div>

      {/* Main KPI Bar */}
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-800 p-0.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center">
            <div className="w-full h-full bg-[#070b13] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-mono tracking-wider text-slate-100 flex items-center gap-2">
                HYPERION
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  MIL-SPEC v5.2
                </span>
              </h1>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Autonomous 4-Tier Agent Architecture • SDR HackRF One • PQC Layer 1
            </p>
          </div>
        </div>

        {/* Real-time KPI Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Active Pipelines */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3.5 py-2 flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Active Pipelines
              </div>
              <div className="text-base font-bold font-mono text-slate-100 flex items-baseline gap-1">
                <span className="text-cyan-400">{onlineCount}</span>
                <span className="text-slate-500 text-xs">/ {totalPipelines} Online</span>
              </div>
            </div>
          </div>

          {/* Oracle Qubit Load */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3.5 py-2 flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Oracle Qubit Load
              </div>
              <div className="text-base font-bold font-mono text-slate-100 flex items-baseline gap-1">
                <span className="text-purple-300">2^14.0</span>
                <span className="text-slate-400 text-xs">Logical Qubits</span>
              </div>
            </div>
          </div>

          {/* Accumulated Net Yield */}
          <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900/90 border border-emerald-800/50 rounded-lg px-4 py-2 flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-emerald-400/90 uppercase tracking-wider font-semibold">
                Accumulated Net Yield
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300 tracking-tight">
                ${accumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* HP Victus Hardware Trust Status Widget */}
          <HardwareTrustWidget />

          {/* Global Actions: Fullscreen, Deep Settings Menu & Controls */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1.5">
            {/* Options Dropdown Trigger */}
            <button
              onClick={onOpenOptionsMenu}
              className="px-2.5 py-1.5 rounded bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/60 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]"
              title="Open Cascading Options & Sub-Options (100 Matrix Items)"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>OPTIONS & SETTINGS (100)</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded text-cyan-300 hover:text-white hover:bg-cyan-950 border border-cyan-800/50 transition cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen' : 'One Full Screen for the App'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Engine Play/Pause */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 rounded font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isRunning
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  RUNNING
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  PAUSED
                </>
              )}
            </button>

            {/* Speed Multipliers */}
            <div className="flex items-center bg-black/60 rounded p-0.5 border border-slate-800">
              {([1, 2, 5] as const).map((mult) => (
                <button
                  key={mult}
                  onClick={() => setSpeedMultiplier(mult)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                    speedMultiplier === mult
                      ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mult}x
                </button>
              ))}
            </div>

            <button
              onClick={onResetYield}
              className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              title="Reset Net Yield Counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onExportLedger}
              className="px-2.5 py-1.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 text-xs font-mono font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Export Production Streams Ledger (CSV/JSON)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">EXPORT</span>
            </button>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded text-amber-300 hover:text-white hover:bg-amber-950 border border-amber-800/50 transition cursor-pointer"
                title="Operator Profile & System Settings (Theme, Storage, Account Deletion)"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation View Switcher Bar */}
      <div className="px-4 sm:px-6 flex items-center overflow-x-auto border-t border-slate-800/80 gap-1 bg-black/40">
        <button
          onClick={() => setActiveView('hardware')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'hardware'
              ? 'border-indigo-400 text-indigo-300 bg-indigo-950/60 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Laptop className="w-3.5 h-3.5 text-indigo-400" />
          HP VICTUS HARDWARE AUTH
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 font-bold">
            TPM 2.0 · :8443
          </span>
        </button>

        <button
          onClick={() => setActiveView('famicom')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'famicom'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          PROJECT SUPER FAMICOM &amp; HAK5 ARSENAL
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
            TERMUX · DUCKY 3.0
          </span>
        </button>

        <button
          onClick={() => setActiveView('suite')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'suite'
              ? 'border-amber-400 text-amber-300 bg-amber-950/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          HYPERION &amp; DOMUS SUITE (v4.2)
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-700 font-bold">
            QNS &amp; BIO-PHOTONIC
          </span>
        </button>

        <button
          onClick={() => setActiveView('blueprint')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'blueprint'
              ? 'border-purple-400 text-purple-300 bg-purple-950/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          MULTI-ENGINE HASH INVERSION (BLUEPRINT)
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-700 font-bold">
            300s SLA · 50 HASHES
          </span>
        </button>

        <button
          onClick={() => setActiveView('knowledge')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'knowledge'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          KNOWLEDGE BASE & LITERATURE
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
            CYBER FRAMEWORK
          </span>
        </button>

        <button
          onClick={() => setActiveView('apex')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'apex'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Workflow className="w-3.5 h-3.5 text-emerald-400" />
          GENKIT APEX ORCHESTRATOR
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
            BOT SWARM & BANK
          </span>
        </button>

        <button
          onClick={() => setActiveView('engine')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'engine'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          HYPERION SWARM & YIELD
        </button>

        <button
          onClick={() => setActiveView('sdr')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'sdr'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-400" />
          SDR HACKRF ONE (WATERFALL & APK)
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-950 text-red-300 border border-red-700 font-bold">
            20 MSPS
          </span>
        </button>

        <button
          onClick={() => setActiveView('iqreplay')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'iqreplay'
              ? 'border-purple-400 text-purple-300 bg-purple-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-purple-400" />
          IQ REPLAY MANAGER
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-700 font-bold">
            SIGMF & ANNOTATIONS
          </span>
        </button>

        <button
          onClick={() => setActiveView('scanner')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'scanner'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
          QUANTUM ASSET SCANNER
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold">
            QR HANDSHAKE
          </span>
        </button>

        <button
          onClick={() => setActiveView('browser')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'browser'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          CHROMIUM BROWSER & SDR BRIDGE
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-700 font-bold">
            SDR BRIDGE LINKED
          </span>
        </button>

        <button
          onClick={() => setActiveView('entropy')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'entropy'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          QUANTUM ENTROPY 3D GRAPH
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-700 font-bold">
            D3 ENGINE
          </span>
        </button>

        <button
          onClick={() => setActiveView('absorbers')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'absorbers'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          THREAT ABSORBERS & PQC LAYER 1
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
            8 NIST PQC
          </span>
        </button>

        <button
          onClick={() => setActiveView('mapper')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'mapper'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          NODE MAPPER
        </button>

        <button
          onClick={() => setActiveView('defender')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'defender'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          QUANTUM DEFENDER v5.2
        </button>

        <button
          onClick={() => setActiveView('darkai')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'darkai'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-amber-400" />
          B.A.M. x DARK AI v7.0
        </button>

        <button
          onClick={() => setActiveView('terminator')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'terminator'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-red-400" />
          SPECTRUM TERMINATOR
        </button>

        <button
          onClick={() => setActiveView('v2k')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'v2k'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-purple-400" />
          MICROWAVE & V2K (TERUA EVERITT)
        </button>

        <button
          onClick={() => setActiveView('cli')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'cli'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          NODE CLI (.PS1)
        </button>

        <button
          onClick={() => setActiveView('all')}
          className={`px-3.5 py-2 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'all'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          UNIFIED MATRIX
        </button>
      </div>
    </header>
  );
};
