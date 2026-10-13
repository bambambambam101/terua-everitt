import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Clock, 
  Layers, 
  Cpu, 
  Activity, 
  TrendingUp, 
  Table, 
  Terminal, 
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface PassiveStream {
  id: number;
  name: string;
  yieldRate: number;
  domain: string;
  risk: 'Low' | 'Med' | 'High';
  currentYield: number;
  accumulated: number;
}

export const SwarmOrchestratorView: React.FC = () => {
  const STREAMS_DATA: PassiveStream[] = [
    { id: 1, name: "Single/Multi-Family Equity", yieldRate: 0.0021, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 2, name: "Short-Term Vacation Rentals", yieldRate: 0.0038, domain: "Real Estate", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 3, name: "Commercial Triple-Net (NNN)", yieldRate: 0.0019, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 4, name: "Passive LP Syndications", yieldRate: 0.0029, domain: "Real Estate", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 5, name: "Private Real Estate Debt Notes", yieldRate: 0.0031, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 6, name: "Self-Storage Facility Assets", yieldRate: 0.0025, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 7, name: "Manufactured Housing Parks", yieldRate: 0.0027, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 8, name: "Farmland & Agricultural Leases", yieldRate: 0.0012, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 9, name: "Billboard & Telecom Leases", yieldRate: 0.0023, domain: "Real Estate", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 10, name: "Commercial Fleet Rental Ops", yieldRate: 0.0042, domain: "Physical Assets", risk: "High", currentYield: 0, accumulated: 0 },
    { id: 11, name: "Oil & Gas Mineral Royalties", yieldRate: 0.0045, domain: "Energy/Resources", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 12, name: "Overriding Royalty Interests", yieldRate: 0.0041, domain: "Energy/Resources", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 13, name: "Midstream Energy MLPs", yieldRate: 0.0024, domain: "Energy/Resources", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 14, name: "Utility Solar Ground Leases", yieldRate: 0.0018, domain: "Infrastructure", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 15, name: "Commercial Timberland Harvests", yieldRate: 0.0015, domain: "Resources", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 16, name: "Water Rights Leases", yieldRate: 0.0030, domain: "Resources", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 17, name: "Wind Turbine Royalties", yieldRate: 0.0022, domain: "Infrastructure", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 18, name: "Mining Hard Mineral Royalties", yieldRate: 0.0039, domain: "Resources", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 19, name: "Bootstrapped Micro-SaaS", yieldRate: 0.0085, domain: "Digital IP", risk: "High", currentYield: 0, accumulated: 0 },
    { id: 20, name: "Platform Ecosystem Extensions", yieldRate: 0.0062, domain: "Digital IP", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 21, name: "Content Authority Sites", yieldRate: 0.0054, domain: "Digital IP", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 22, name: "Affiliate Marketing Networks", yieldRate: 0.0049, domain: "Digital IP", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 23, name: "Subscription Newsletters", yieldRate: 0.0041, domain: "Digital IP", risk: "Low", currentYield: 0, accumulated: 0 },
    { id: 24, name: "Enterprise API Access", yieldRate: 0.0078, domain: "Digital IP", risk: "Med", currentYield: 0, accumulated: 0 },
    { id: 25, name: "Native Mobile App Networks", yieldRate: 0.0065, domain: "Digital IP", risk: "High", currentYield: 0, accumulated: 0 }
  ];

  const [streams, setStreams] = useState<PassiveStream[]>(STREAMS_DATA);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [animationCycle, setAnimationCycle] = useState<number>(0);
  const [totalAccumulatedYield, setTotalAccumulatedYield] = useState<number>(3854.40);
  const [currentTimeUtc, setCurrentTimeUtc] = useState<string>('--:--:-- UTC');
  const [activeShiftName, setActiveShiftName] = useState<'ALPHA' | 'BETA' | 'GAMMA'>('GAMMA');
  const [groverDepthText, setGroverDepthText] = useState<string>('Ideal Basis Depth: 2^138.4 iterations');
  const [keccakDepthText, setKeccakDepthText] = useState<string>('2^124.6 cycles');
  const [isAnomalyActive, setIsAnomalyActive] = useState<boolean>(false);
  const [oracleLogs, setOracleLogs] = useState<Array<{ id: string; time: string; text: string }>>([
    { id: '1', time: '20:40:12', text: 'Swarm execution threads initiated across 26 nodes.' },
    { id: '2', time: '20:40:15', text: 'Galois Field F2 Grover oracle decomposition initialized.' },
    { id: '3', time: '20:40:22', text: 'SHA-256 compression oracle pipeline validated.' }
  ]);

  const logBoxRef = useRef<HTMLDivElement>(null);

  const addOracleLog = (msg: string) => {
    const timestamp = new Date().toTimeString().slice(0, 8);
    setOracleLogs(prev => [...prev.slice(-30), { id: Math.random().toString(), time: timestamp, text: msg }]);
  };

  // Clock & Shift Update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      const hours = now.getUTCHours();
      const timeString = now.toUTCString().substring(17, 25) + ' UTC';
      setCurrentTimeUtc(timeString);

      if (hours >= 0 && hours < 8) {
        setActiveShiftName('ALPHA');
      } else if (hours >= 8 && hours < 16) {
        setActiveShiftName('BETA');
      } else {
        setActiveShiftName('GAMMA');
      }
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Yield Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      let tickTotal = 0;
      setStreams(prev => prev.map(s => {
        const variance = 0.85 + Math.random() * 0.3;
        const currentYield = s.yieldRate * variance * 10;
        tickTotal += currentYield;
        return {
          ...s,
          currentYield,
          accumulated: s.accumulated + currentYield
        };
      }));

      setTotalAccumulatedYield(prev => prev + tickTotal);

      // Randomly update Node 26 state depth
      if (Math.random() > 0.5) {
        const depth = (128 + Math.random() * 25.6).toFixed(1);
        setGroverDepthText(`Ideal Basis Depth: 2^${depth} iterations`);
        setKeccakDepthText(`2^${(120 + Math.random() * 8).toFixed(1)} cycles`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Scroll logs to bottom
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [oracleLogs]);

  const toggleSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
      addOracleLog('Swarm execution threads initiated across 26 nodes.');
    } else {
      setIsRunning(false);
      addOracleLog('Swarm pipeline suspended by operator.');
    }
  };

  const injectQuantumAnomaly = () => {
    setIsAnomalyActive(true);
    addOracleLog('[ANOMALY] Phase decoherence injected in QPU state vector.');
    setGroverDepthText('Ideal Basis Depth: RE-CALIBRATING...');

    setTimeout(() => {
      setIsAnomalyActive(false);
      setGroverDepthText('Ideal Basis Depth: 2^136.2 iterations (Restored)');
      addOracleLog('[RESOLVED] Surface code syndrome extraction corrected physical errors.');
    }, 2500);
  };

  const handleResetYield = () => {
    setTotalAccumulatedYield(0);
    setStreams(prev => prev.map(s => ({ ...s, currentYield: 0, accumulated: 0 })));
    addOracleLog('Accumulated net yield reset to $0.00.');
  };

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Top Telemetry Header Bar */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                HYPERION QUANTUM
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold ${
                isRunning 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isRunning ? 'SWARM NODE ACTIVE' : 'SWARM NODE PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Class-Hierarchical Agent Engine & Cryptanalytic Yield Simulator
            </p>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs w-full md:w-auto">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TOTAL INCOME STREAMS</span>
            <span className="text-white font-bold text-sm">26 Active Pipelines</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">SIMULATED CRYPTO ORACLE COST</span>
            <span className="text-amber-400 font-bold text-sm">2^12.6 Logical Qubits</span>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center gap-3">
            <div>
              <span className="text-slate-500 block text-[10px]">ACCUMULATED NET YIELD</span>
              <span className="text-emerald-400 font-bold text-base">
                ${totalAccumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <button
              onClick={handleResetYield}
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
              title="Reset yield counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column / Multi-Layer Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* SIDEBAR LAYER: STATUS & MANAGEMENT MODULES (1 Col) */}
        <div className="flex flex-col space-y-5 xl:col-span-1">
          
          {/* Class Hierarchy Map */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono flex items-center gap-1.5">
                👑 Class Hierarchy
              </h3>
              <span className="text-[10px] text-purple-400">4 Tiers</span>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-slate-950 p-2.5 rounded border-l-2 border-purple-500 flex justify-between items-center">
                <strong className="text-purple-400">CLASS-1: Macro AI Directors</strong>
                <span className="text-[9px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/40">Strategic</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border-l-2 border-blue-500 flex justify-between items-center">
                <strong className="text-blue-400">CLASS-2: Shift Agents</strong>
                <span className="text-[9px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/40">Rotation</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border-l-2 border-cyan-500 flex justify-between items-center">
                <strong className="text-cyan-400">CLASS-3: Task Execution Bots</strong>
                <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800/40">Execution</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border-l-2 border-amber-500 flex justify-between items-center">
                <strong className="text-amber-400">CLASS-4: R&D Self-Healers</strong>
                <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">Audit/Fix</span>
              </div>
            </div>
          </div>

          {/* Operational Control Shift Matrix */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono flex items-center gap-1.5">
                🕒 Shift Rotation Matrix
              </h3>
              <span className="text-[10px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded font-mono border border-slate-800">
                {currentTimeUtc}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-center text-[10px]">
              <div className={`p-2 rounded border transition ${
                activeShiftName === 'ALPHA' 
                  ? 'bg-purple-950/60 border-purple-500 text-purple-300 font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="font-bold block text-white text-[10px]">ALPHA</span>
                00:00-08:00
              </div>

              <div className={`p-2 rounded border transition ${
                activeShiftName === 'BETA' 
                  ? 'bg-blue-950/60 border-blue-500 text-blue-300 font-bold shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="font-bold block text-white text-[10px]">BETA</span>
                08:00-16:00
              </div>

              <div className={`p-2 rounded border transition ${
                activeShiftName === 'GAMMA' 
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <span className="font-bold block text-white text-[10px]">GAMMA</span>
                16:00-24:00
              </div>
            </div>
          </div>

          {/* Execution Actions Dashboard */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono flex items-center gap-1.5">
              🕹️ Swarm Control Interface
            </h3>
            <div className="space-y-2">
              <button
                onClick={toggleSimulation}
                className={`w-full font-mono text-xs py-2 px-3 rounded transition cursor-pointer font-bold flex items-center justify-center gap-2 ${
                  isRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isRunning ? 'HALT SWARM CONSOLE' : 'INITIALISE SWARM CONSOLE'}
              </button>

              <button
                onClick={injectQuantumAnomaly}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-amber-500/40 text-amber-400 hover:text-amber-300 font-mono text-xs py-2 px-3 rounded transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                INJECT QUANTUM ANOMALY
              </button>
            </div>
          </div>

        </div>

        {/* MIDDLE LAYER: MAIN 25 STREAM MATRIX LISTING (2 Cols) */}
        <div className="xl:col-span-2 flex flex-col bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden h-[620px]">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
            <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase font-mono flex items-center gap-2">
              <Table className="w-3.5 h-3.5 text-cyan-400" />
              Production Streams Matrix Ledger
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAnimationCycle(c => c + 1)}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 flex items-center gap-1 transition cursor-pointer"
                title="Re-run real-time agent instantiation glitch sequence"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                RE-INSTANTIATE AGENTS
              </button>
              <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded font-mono text-slate-400 border border-slate-800">
                Nodes 1 - 25
              </span>
            </div>
          </div>

          {/* Staggered Glitch Grid Container */}
          <motion.div 
            key={`stream-matrix-${animationCycle}`}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.045, // Sequential cascade
                  delayChildren: 0.05
                }
              }
            }}
            className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 overflow-y-auto flex-1 bg-slate-950/40"
          >
            {streams.map((stream, index) => {
              const riskBadgeClass = 
                stream.risk === 'Low' ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800/50' :
                stream.risk === 'Med' ? 'bg-amber-950/90 text-amber-400 border-amber-800/50' :
                'bg-rose-950/90 text-rose-400 border-rose-800/50';

              return (
                <motion.div
                  key={stream.id}
                  variants={{
                    hidden: { 
                      opacity: 0, 
                      y: 16, 
                      scale: 0.94,
                      filter: 'blur(3px) brightness(2)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                    },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      filter: 'blur(0px) brightness(1)',
                      transition: {
                        duration: 0.38,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    }
                  }}
                  whileHover={{ 
                    scale: 1.015,
                    boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)' 
                  }}
                  animate={{
                    x: [0, -2, 2, -1, 0],
                    skewX: [0, -1.5, 1.5, 0],
                    transition: {
                      delay: index * 0.045 + 0.1,
                      duration: 0.22,
                      times: [0, 0.25, 0.5, 0.75, 1]
                    }
                  }}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition relative overflow-hidden group"
                >
                  {/* Real-time Agent Instantiation Glitch Bar Indicator */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-cyan-400 font-bold">
                          NODE #{stream.id < 10 ? '0' + stream.id : stream.id}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase">INSTANTIATED</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 truncate max-w-[170px]" title={stream.name}>
                        {stream.name}
                      </h4>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${riskBadgeClass}`}>
                      {stream.risk} Risk
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500">{stream.domain}</span>
                    <span className="text-emerald-400 font-bold">
                      ${stream.currentYield.toFixed(3)} /s
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* RIGHT LAYER: THE CRYPTANALYTIC GROVER ORACLE CORE NODE (1 Col) */}
        <div className="xl:col-span-1 bg-slate-900/90 rounded-xl border border-slate-800 p-4 flex flex-col h-[620px] space-y-3">
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse"></span>
              Node 26: Cryptanalysis Audit Module
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
              Models dynamic systems over Galois Fields $\mathbb&#123;F&#125;_2$ using Grover oracle decomposition parameters to audit corporate network compliance profiles.
            </p>
          </div>
          
          {/* Real-time Mathematical Calculation Display Shell */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 font-mono text-[10px] space-y-3 flex-1 overflow-y-auto">
            <div>
              <span className="text-purple-400 block font-bold">// ALGEBRAIC EQUATION RESOLUTION MAP</span>
              <span className="text-slate-500 block">Bitwise XOR Mapping: a ⊕ b = a + b</span>
              <span className="text-slate-500 block">Bitwise AND Mapping: a ∧ b = a · b</span>
              <span className={`block mt-1 font-bold ${isAnomalyActive ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                {groverDepthText}
              </span>
            </div>

            <div className="border-t border-slate-800/60 pt-2">
              <span className="text-cyan-400 block font-bold">// SHA-256 COMPRESSION ORACLE PIPELINE</span>
              <div className="text-slate-400 space-y-0.5 text-[9px] bg-slate-900/60 p-1.5 rounded mt-1">
                <div>Ch = (E ∧ F) ⊕ (¬E ∧ G)</div>
                <div>Maj = (A ∧ B) ⊕ (A ∧ C) ⊕ (B ∧ C)</div>
                <div className="text-purple-300">t_1 = H + Σ_1 + Ch + K[i] + W[i]</div>
              </div>
            </div>

            <div className="border-t border-slate-800/60 pt-2">
              <span className="text-amber-400 block font-bold">// REVERSIBLE QUANTUM RESOURCE PROFILES</span>
              <table className="w-full text-left mt-1 border-collapse text-[9px]">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800">
                    <th className="py-1">Algorithm</th>
                    <th className="py-1">Logical Qubits</th>
                    <th className="py-1">Est. Depth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  <tr>
                    <td className="py-1 text-slate-400">MD5</td>
                    <td>~2^10.5</td>
                    <td>Low Ancilla</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-slate-400">SHA-256</td>
                    <td>~2^12.6</td>
                    <td>2^153.8 cycles</td>
                  </tr>
                  <tr className="font-bold text-cyan-300">
                    <td className="py-1">Keccak-256</td>
                    <td>3,200</td>
                    <td>{keccakDepthText}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-800/60 pt-2">
              <span className="text-purple-400 block font-bold">// ORACLE STATE LOG</span>
              <div ref={logBoxRef} className="h-24 overflow-y-auto text-[9px] text-slate-400 space-y-1 bg-slate-900/60 p-1.5 rounded">
                {oracleLogs.map(log => (
                  <div key={log.id} className="flex gap-1.5">
                    <span className="text-slate-600">[{log.time}]</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
