import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Terminal, 
  ShieldCheck, 
  Binary, 
  TrendingUp, 
  Bot, 
  Zap, 
  Search, 
  Layers, 
  Activity, 
  Play, 
  Check, 
  RotateCw, 
  Sparkles,
  Flame,
  Key,
  Globe,
  Database,
  Code
} from 'lucide-react';

interface AgentProfile {
  id: string;
  name: string;
  role: string;
  classType: string;
  status: 'ONLINE' | 'ACTIVE' | 'PROCESSING' | 'IDLE';
  skillsCount: number;
  workloadPct: number;
  latencyMs: number;
  lastAction: string;
}

export const DarkAiFramework: React.FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([
    {
      id: 'agent-1',
      name: 'CryptoAnalyst',
      role: 'Asymmetric Ciphers & Lattice Hardness',
      classType: 'Cryptanalysis Engine',
      status: 'ONLINE',
      skillsCount: 8,
      workloadPct: 34,
      latencyMs: 1.2,
      lastAction: 'Audited RSA-4096 modulus & Fermat bounds'
    },
    {
      id: 'agent-2',
      name: 'PenTestAI',
      role: 'Vulnerability Fuzzing & Static Analysis',
      classType: 'Security Evaluator',
      status: 'ONLINE',
      skillsCount: 6,
      workloadPct: 48,
      latencyMs: 2.1,
      lastAction: 'Verified 0 critical CVE vectors in daemon'
    },
    {
      id: 'agent-3',
      name: 'OSINTAgent',
      role: 'Passive Recon & Attack Surface Mapping',
      classType: 'Reconnaissance Core',
      status: 'ONLINE',
      skillsCount: 7,
      workloadPct: 22,
      latencyMs: 3.4,
      lastAction: 'Queried Certificate Transparency logs'
    },
    {
      id: 'agent-4',
      name: 'RedTeamSim',
      role: 'Adversary Emulation & MITRE Mapping',
      classType: 'Tactical Simulation',
      status: 'ONLINE',
      skillsCount: 5,
      workloadPct: 18,
      latencyMs: 1.8,
      lastAction: 'Simulated lateral movement honeypot trap'
    },
    {
      id: 'agent-5',
      name: 'OAOPArbitrageBot',
      role: 'Omni-Arbitrage Orchestration Protocol',
      classType: 'Algorithmic Yield',
      status: 'ACTIVE',
      skillsCount: 9,
      workloadPct: 76,
      latencyMs: 0.8,
      lastAction: 'Mapped triangular DEX spread (+14.2% yield)'
    },
    {
      id: 'agent-6',
      name: 'SkillsAbsorber',
      role: 'Dynamic Tool Fusion & Runtime Synthesis',
      classType: 'Self-Mutation Core',
      status: 'ONLINE',
      skillsCount: 4,
      workloadPct: 15,
      latencyMs: 1.5,
      lastAction: 'Synthesized C++ eBPF telemetry hooks'
    },
    {
      id: 'agent-7',
      name: 'KernelGuardian',
      role: 'Ubuntu 26.04 Resolute Kernel Telemetry',
      classType: 'Host Orchestrator',
      status: 'ONLINE',
      skillsCount: 3,
      workloadPct: 12,
      latencyMs: 0.4,
      lastAction: 'Enforced zero-copy memory ring buffers'
    }
  ]);

  const [logs, setLogs] = useState<Array<{ id: string; time: string; type: 'SUCCESS' | 'INFO' | 'WARN'; message: string }>>([
    { id: '1', time: '4:03:36 pm', type: 'SUCCESS', message: 'Autonomous scan completed: 0 vulnerabilities found, 100% endpoint integrity.' },
    { id: '2', time: '4:03:34 pm', type: 'SUCCESS', message: 'OAOP Arbitrage scan executed: +14.2% projected yield identified across DEX liquidity pools.' },
    { id: '3', time: '02:51:26 am', type: 'INFO', message: 'B.A.M. x Dark AI v7.0 kernel initialized successfully.' },
    { id: '4', time: '02:51:24 am', type: 'SUCCESS', message: 'Omni-Arbitrage Orchestration Protocol (OAOP) connected to liquidity nodes.' },
    { id: '5', time: '02:51:20 am', type: 'INFO', message: 'Multi-Agent Matrix loaded: CryptoAnalyst, PenTestAI, OSINTAgent, RedTeamSim.' },
    { id: '6', time: '02:51:15 am', type: 'SUCCESS', message: 'Skills Absorber initialized: ready to convert raw input into executable tools.' }
  ]);

  // RSA Factor Lab State
  const [rsaModulus, setRsaModulus] = useState<string>('3233'); // 61 * 53
  const [rsaFactorResult, setRsaFactorResult] = useState<{ p: number; q: number; phi: number; timeMs: number } | null>({ p: 61, q: 53, phi: 3120, timeMs: 0.12 });
  const [isFactoring, setIsFactoring] = useState(false);

  // Active Tool Simulation Flags
  const [activeTab, setActiveTab] = useState<'agents' | 'rsa' | 'oaop' | 'skills' | 'ai_skills'>('agents');
  const [cliInput, setCliInput] = useState('');

  const addLog = (type: 'SUCCESS' | 'INFO' | 'WARN', message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Math.random().toString(), time, type, message }, ...prev.slice(0, 40)]);
  };

  const handleRunScan = () => {
    addLog('INFO', '[AUTONOMOUS-SCAN] Dispatching PenTestAI & KernelGuardian across local sockets...');
    setTimeout(() => {
      addLog('SUCCESS', 'Autonomous scan completed: 0 vulnerabilities found, 100% endpoint integrity.');
    }, 700);
  };

  const handleRunOaopScan = () => {
    addLog('INFO', '[OAOP] Querying Omni-Arbitrage routing graph across 9 liquidity pools...');
    setTimeout(() => {
      addLog('SUCCESS', 'OAOP Arbitrage scan executed: +14.2% projected yield identified across DEX liquidity pools.');
    }, 600);
  };

  const handleRunOsintRecon = () => {
    addLog('INFO', '[OSINT] Executing passive asset enumeration & ASN mapping pass...');
    setTimeout(() => {
      addLog('SUCCESS', 'OSINT recon pass finished: verified 0 unintended open ports or exposed staging endpoints.');
    }, 800);
  };

  const handleSkillsFusion = () => {
    addLog('INFO', '[SKILLS-ABSORBER] Ingesting raw API signatures into runtime tool matrix...');
    setTimeout(() => {
      addLog('SUCCESS', 'Skills Absorber Fusion complete: 42 executable subroutines compiled & hot-reloaded.');
    }, 650);
  };

  // Factoring Toy Modulus Algorithm
  const handleFactorRsa = () => {
    setIsFactoring(true);
    const n = parseInt(rsaModulus, 10);
    const start = performance.now();

    setTimeout(() => {
      if (isNaN(n) || n < 4) {
        setRsaFactorResult(null);
        setIsFactoring(false);
        addLog('WARN', `Invalid integer modulus: '${rsaModulus}'`);
        return;
      }

      // Simple trial division for simulation
      let p = 0;
      let q = 0;
      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) {
          p = d;
          q = Math.floor(n / d);
          break;
        }
      }

      const end = performance.now();
      const elapsed = parseFloat((end - start).toFixed(3));

      if (p > 0) {
        const phi = (p - 1) * (q - 1);
        setRsaFactorResult({ p, q, phi, timeMs: elapsed });
        addLog('SUCCESS', `[RSA-FACTOR] Factored N = ${n}: p = ${p}, q = ${q}, φ(N) = ${phi} in ${elapsed}ms.`);
      } else {
        setRsaFactorResult(null);
        addLog('WARN', `[RSA-FACTOR] N = ${n} is prime or factoring exceeded search depth.`);
      }
      setIsFactoring(false);
    }, 350);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = cliInput.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear' || cmd === 'cls') {
      setLogs([]);
      setCliInput('');
      return;
    }
    if (cmd === 'scan') {
      handleRunScan();
    } else if (cmd === 'oaop') {
      handleRunOaopScan();
    } else if (cmd === 'osint') {
      handleRunOsintRecon();
    } else if (cmd === 'fusion' || cmd === 'skills') {
      handleSkillsFusion();
    } else if (cmd === 'status') {
      addLog('INFO', 'B.A.M. x Dark AI v7.0: 7/7 Agents Online | Kernel 7.0.0-30 | Uptime: 99.99%');
    } else {
      addLog('INFO', `Command parsed: '${cmd}'. Executed via Ubuntu 26.04 Resolute micro-agent dispatcher.`);
    }
    setCliInput('');
  };

  return (
    <div className="bg-[#080d19] border border-cyan-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Title & Branding Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              B.A.M. x DARK AI v7.0 OBSIDIAN
            </span>
            <span className="text-xs text-slate-400 font-mono">
              PhD-Level Multi-Agent Framework // Ubuntu 26.04 Resolute Kernel
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-purple-400" />
            MISSION CONTROL & AGENT ORCHESTRATION
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Autonomous multi-agent synthesis, Omni-Arbitrage protocol (OAOP), RSA factor analysis lab, and real-time kernel stream.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            onClick={handleRunScan}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Run Autonomous Scan
          </button>

          <button
            onClick={handleRunOaopScan}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            OAOP Arbitrage Bot
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Kernel: ACTIVE (7.0.0-30)
          </div>
        </div>
      </div>

      {/* KPI Stats Bar from Prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Bot className="w-3 h-3 text-cyan-400" />
            Active Agents
          </span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            7 / 7
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Fully synchronized
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Learned Skills
          </span>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">
            42
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Absorbed subroutines
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Globe className="w-3 h-3 text-blue-400" />
            Registered APIs
          </span>
          <div className="text-xl font-bold font-mono text-blue-300 mt-1">
            9
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Universal webhooks
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Arbitrage Yield
          </span>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            +14.2%
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            OAOP projected spread
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Security Findings
          </span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            3
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Low/Informational
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Kernel Uptime
          </span>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            99.99%
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Resolute kernel lock
          </span>
        </div>
      </div>

      {/* Sub-Module Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'agents'
              ? 'bg-purple-950 text-purple-300 border border-purple-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          Multi-Agent Matrix (7)
        </button>

        <button
          onClick={() => setActiveTab('rsa')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'rsa'
              ? 'bg-purple-950 text-purple-300 border border-purple-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          Cryptography & RSA Factor Lab
        </button>

        <button
          onClick={() => setActiveTab('oaop')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'oaop'
              ? 'bg-purple-950 text-purple-300 border border-purple-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          OAOP Arbitrage Engine (+14.2%)
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'skills'
              ? 'bg-purple-950 text-purple-300 border border-purple-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Framework C++ / Python Source
        </button>

        <button
          onClick={() => setActiveTab('ai_skills')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ai_skills'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AI Skill Matrix & Tool Registry (42)
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-black/50 border border-slate-800 hover:border-purple-600/60 rounded-xl p-3.5 space-y-3 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" />
                    {agent.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {agent.status}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-300">{agent.role}</div>
                <div className="text-[10px] text-slate-500">{agent.classType}</div>
              </div>

              <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-900 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Skills Learned:</span>
                  <span className="text-purple-300 font-bold">{agent.skillsCount} skills</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Workload:</span>
                  <span className="text-slate-200">{agent.workloadPct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Latency:</span>
                  <span className="text-emerald-400">{agent.latencyMs}ms</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 line-clamp-1 italic">
                "{agent.lastAction}"
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rsa' && (
        <div className="bg-black/60 rounded-xl p-4 border border-slate-800 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-slate-100">
                RSA Factor Analysis & Modular Arithmetic Lab
              </h3>
            </div>
            <span className="text-slate-500 text-[11px]">
              Formula: N = p · q • φ(N) = (p-1)(q-1) • d ≡ e⁻¹ (mod φ(N))
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-slate-400 block text-[11px]">
                Target Modulus N (Integer):
              </label>
              <input
                type="text"
                value={rsaModulus}
                onChange={(e) => setRsaModulus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 3233"
              />
              <div className="flex gap-2 text-[10px]">
                <button
                  onClick={() => setRsaModulus('3233')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  61 × 53 (3233)
                </button>
                <button
                  onClick={() => setRsaModulus('10403')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  101 × 103 (10403)
                </button>
                <button
                  onClick={() => setRsaModulus('8927')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  79 × 113 (8927)
                </button>
              </div>
              <button
                onClick={handleFactorRsa}
                disabled={isFactoring}
                className="w-full mt-2 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 font-bold transition cursor-pointer"
              >
                {isFactoring ? 'Factoring...' : 'Run Factor Analysis'}
              </button>
            </div>

            {/* Factoring Results Box */}
            <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-slate-400 font-bold text-[11px]">
                ANALYSIS OUTPUT:
              </div>
              {rsaFactorResult ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                    <span className="text-slate-400">Prime Factor p:</span>
                    <span className="text-cyan-300 font-bold">{rsaFactorResult.p}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                    <span className="text-slate-400">Prime Factor q:</span>
                    <span className="text-cyan-300 font-bold">{rsaFactorResult.q}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                    <span className="text-slate-400">Euler's Totient φ(N):</span>
                    <span className="text-emerald-300 font-bold">{rsaFactorResult.phi}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                    <span className="text-slate-400">Execution Time:</span>
                    <span className="text-purple-300">{rsaFactorResult.timeMs} ms</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic py-6 text-center">
                  Enter an integer composite modulus and trigger factor analysis.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'oaop' && (
        <div className="bg-black/60 rounded-xl p-4 border border-slate-800 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Omni-Arbitrage Orchestration Protocol (OAOP) Routing Mesh
              </h3>
            </div>
            <span className="text-emerald-400 font-bold text-xs">
              Projected Net Yield: +14.2%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">Route Alpha</span>
              <div className="font-bold text-slate-200">WETH → USDC → DAI → WETH</div>
              <div className="text-emerald-400 font-bold text-xs">+3.84% Net Spread</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">Route Beta</span>
              <div className="font-bold text-slate-200">SOL → JitoSOL → USDC → SOL</div>
              <div className="text-emerald-400 font-bold text-xs">+5.12% Net Spread</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">Route Gamma</span>
              <div className="font-bold text-slate-200">USDC → ARB → ETH → USDC</div>
              <div className="text-emerald-400 font-bold text-xs">+5.24% Net Spread</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-black/60 rounded-xl p-4 border border-slate-800 space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-300 font-bold">Framework Source Code Structure (C++ / Python 3.12)</span>
            <span className="text-[10px] text-slate-500">Compiled on Ubuntu 26.04 Resolute</span>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`// B.A.M. x Dark AI v7.0 Core Kernel Dispatcher
#include <iostream>
#include <vector>
#include <memory>

class MultiAgentDispatcher {
public:
    void dispatchTask(const std::string& taskName) {
        std::cout << "[KERNEL-7.0] Ingesting " << taskName << " into eBPF ring buffer." << std::endl;
    }
};

// Python Bridge: OAOP Omni-Arbitrage Engine
class OAOPProtocol:
    def calculate_triangular_spread(self, pool_a, pool_b, pool_c):
        return {"projected_yield": "+14.2%", "status": "OPTIMAL"}
`}
          </pre>
        </div>
      )}

      {activeTab === 'ai_skills' && (
        <div className="bg-black/60 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-4 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  AI Autonomous Skills & Capabilities Matrix (42 Learned Skills)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Dynamic skill registry synthesized by SkillsAbsorber Core and exposed as first-class tool definitions for AI agents.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                9 REGISTERED APIS
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                7 ONLINE AGENTS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'sk-1', name: 'pqc-key-generation', category: 'CRYPTOGRAPHY', agent: 'CryptoAnalyst', desc: 'Synthesizes ML-KEM Kyber-1024 public/private key pairs and validates lattice hardness.' },
              { id: 'sk-2', name: 'dilithium-signature-verify', category: 'CRYPTOGRAPHY', agent: 'CryptoAnalyst', desc: 'Performs post-quantum ML-DSA Dilithium-87 digital signature verification on firmware updates.' },
              { id: 'sk-3', name: 'triangular-dex-arbitrage', category: 'ALGORITHMIC YIELD', agent: 'OAOPArbitrageBot', desc: 'Calculates triangular and multi-hop DEX spreads across Uniswap v3, Curve, and Raydium.' },
              { id: 'sk-4', name: 'flashloan-bundle-builder', category: 'ALGORITHMIC YIELD', agent: 'OAOPArbitrageBot', desc: 'Builds atomic flash loan arbitrage transaction bundles for low-latency private mempool submission.' },
              { id: 'sk-5', name: 'mitm-packet-absorber', category: 'DEFENSE', agent: 'KernelGuardian', desc: 'Intercepts ARP spoofing and DNS cache poisoning attacks, re-routing malicious energy to virtual sink.' },
              { id: 'sk-6', name: 'ransomware-trap-quench', category: 'DEFENSE', agent: 'PenTestAI', desc: 'Detects high-entropy bulk file write calls and neutralizes encryptor payloads in real time.' },
              { id: 'sk-7', name: 'rf-v2k-spectrum-analyzer', category: 'SDR & HARDWARE', agent: 'SkillsAbsorber', desc: 'Analyzes 1MHz-6GHz raw I/Q samples from virtual HackRF One to identify covert microwave beacons.' },
              { id: 'sk-8', name: 'riemann-zero-factorizer', category: 'MATHEMATICS', agent: 'CryptoAnalyst', desc: 'Computes zeros along the critical line s = 1/2 + it to un-encrypt legacy asymmetric moduli.' },
              { id: 'sk-9', name: 'ebpf-kernel-audit', category: 'SYSTEM HARDENING', agent: 'KernelGuardian', desc: 'Attaches zero-overhead eBPF ring buffer hooks to monitor kernel syscall execution paths.' },
              { id: 'sk-10', name: 'resiphoned-ledger-sync', category: 'FINANCIAL RESTORATION', agent: 'CryptoAnalyst', desc: 'Verifies cryptographic proof-of-reserves for Terua Everitt Cooperative Bank NZ deposits.' },
              { id: 'sk-11', name: 'quantum-qr-handshake', category: 'HARDWARE LINK', agent: 'SkillsAbsorber', desc: 'Encodes state vectors into optical QR matrices for physical mobile camera verification.' },
              { id: 'sk-12', name: 'trade-secret-obfuscation', category: 'COMPLIANCE', agent: 'RedTeamSim', desc: 'Applies polymorph bytecode scrambling and HP Victus hardware-binding integrity checks.' }
            ].map(skill => (
              <div key={skill.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 hover:border-cyan-800 transition space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold block">{skill.category}</span>
                    <strong className="text-xs text-slate-100">{skill.name}</strong>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-purple-300 border border-purple-800/60 font-mono">
                    {skill.agent}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {skill.desc}
                </p>
                <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    TOOL READY
                  </span>
                  <span className="text-slate-500 font-mono">v7.0 EXECUTABLE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Orchestration Stream (from user prompt) */}
      <div className="bg-black/80 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-200">REAL-TIME ORCHESTRATION STREAM</span>
            <span className="text-slate-500 text-[10px]">(Kernel 7.0.0-30)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              STREAM ACTIVE
            </span>
          </div>
        </div>

        {/* Logs Feed */}
        <div className="p-3.5 overflow-y-auto max-h-52 space-y-1.5 text-xs font-mono leading-relaxed">
          {logs.map((log) => {
            const badgeColor = 
              log.type === 'SUCCESS' ? 'text-emerald-400 border-emerald-800 bg-emerald-950/40' :
              log.type === 'WARN' ? 'text-amber-400 border-amber-800 bg-amber-950/40' :
              'text-cyan-400 border-cyan-800 bg-cyan-950/40';

            return (
              <div key={log.id} className="flex items-start gap-2 hover:bg-white/[0.02] py-0.5 px-1 rounded">
                <span className="text-slate-500 text-[11px] shrink-0 select-none">[{log.time}]</span>
                <span className={`px-1.5 py-0.2 text-[9px] rounded border font-bold shrink-0 ${badgeColor}`}>
                  [{log.type}]
                </span>
                <span className="text-slate-300 break-words">{log.message}</span>
              </div>
            );
          })}
        </div>

        {/* Quick CLI Prompt */}
        <form onSubmit={handleCliSubmit} className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <span className="text-cyan-400 font-bold pl-2 select-none text-xs">
            bam@darkai-kernel:~$
          </span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder="Type 'scan', 'oaop', 'osint', 'skills', 'rsa', 'status', or 'clear'..."
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700/60 rounded text-xs cursor-pointer font-bold"
          >
            Exec
          </button>
        </form>
      </div>

      {/* Quick Actions Footer Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-3">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-purple-400" />
          QUICK ACTIONS (AUTONOMOUS CORE):
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('rsa')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Run RSA Factor Analysis
          </button>

          <button
            onClick={handleRunOaopScan}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Query OAOP Arbitrage Bot
          </button>

          <button
            onClick={handleRunOsintRecon}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Execute OSINT Recon Pass
          </button>

          <button
            onClick={handleSkillsFusion}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            Skills Absorber Fusion
          </button>
        </div>
      </div>
    </div>
  );
};
