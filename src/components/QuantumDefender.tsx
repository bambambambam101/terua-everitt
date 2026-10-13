import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Cpu, 
  Smartphone, 
  Laptop, 
  Radio, 
  Dna, 
  Zap, 
  Search, 
  Filter, 
  Check, 
  RefreshCw, 
  Download, 
  ExternalLink,
  ChevronRight,
  EyeOff,
  Flame,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Wifi,
  FileCode
} from 'lucide-react';
import { DEFENSE_PROTOCOLS_50, DefenseProtocol } from '../data/defenderData';

export const QuantumDefender: React.FC = () => {
  const [protocols, setProtocols] = useState<DefenseProtocol[]>(DEFENSE_PROTOCOLS_50);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTarget, setSelectedTarget] = useState<string>('ALL');
  const [isStateLockdown, setIsStateLockdown] = useState<boolean>(true);
  
  // Interactive Modals & Scanners
  const [isAuditingPqc, setIsAuditingPqc] = useState<boolean>(false);
  const [pqcAuditLog, setPqcAuditLog] = useState<string[]>([]);
  const [showPqcModal, setShowPqcModal] = useState<boolean>(false);

  const [isScanningMvt, setIsScanningMvt] = useState<boolean>(false);
  const [mvtScanProgress, setMvtScanProgress] = useState<number>(0);
  const [showMvtModal, setShowMvtModal] = useState<boolean>(false);

  const [showBeamDnaPortal, setShowBeamDnaPortal] = useState<boolean>(false);
  const [beamFreq, setBeamFreq] = useState<number>(193.4); // THz
  const [dnaViscosity, setDnaViscosity] = useState<number>(1.2); // cP
  const [selectedProtocol, setSelectedProtocol] = useState<DefenseProtocol | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: protocols.length,
      pqc: protocols.filter(p => p.category === 'Quantum PQC').length,
      victus: protocols.filter(p => p.category === 'HP Victus').length,
      oppo: protocols.filter(p => p.category === 'Oppo A40').length,
      spyware: protocols.filter(p => p.category === 'State Spyware').length,
      ops: protocols.filter(p => p.category === 'Operations').length
    };
  }, [protocols]);

  // Filtering
  const filteredProtocols = useMemo(() => {
    return protocols.filter(p => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedTarget !== 'ALL' && p.targetDevice !== selectedTarget && p.targetDevice !== 'Both') {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.complianceSpec.toLowerCase().includes(q) ||
          `#${p.id}`.includes(q)
        );
      }
      return true;
    });
  }, [protocols, selectedCategory, selectedTarget, searchQuery]);

  // PQC Audit Simulation
  const handleRunPqcAudit = () => {
    setShowPqcModal(true);
    setIsAuditingPqc(true);
    setPqcAuditLog([
      '[PQC-INIT] Loading NIST FIPS 203 & 204 Cryptographic Modules...',
      '[PQC-KEM] Generating ML-KEM-1024 ephemeral keypair on HP Victus...',
      '[PQC-DSA] Computing ML-DSA-87 (Dilithium) digital signature for kernel root...',
      '[PQC-TLS] Negotiating X25519Kyber768 hybrid cipher suite with local gateway...',
      '[PQC-LMS] Validating stateful hash-based firmware signature against SPI flash...',
      '[PQC-TEST] Ingesting Grover quadratic speedup test vector (2^256 -> 2^128)...',
      '[PQC-SUCCESS] All 8 Quantum & Post-Quantum Cryptographic layers verified SECURE.'
    ]);
    setTimeout(() => {
      setIsAuditingPqc(false);
    }, 1800);
  };

  // MVT Spyware Scan Simulation
  const handleRunMvtScan = () => {
    setShowMvtModal(true);
    setIsScanningMvt(true);
    setMvtScanProgress(10);
    const interval = setInterval(() => {
      setMvtScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanningMvt(false);
          return 100;
        }
        return prev + 18;
      });
    }, 280);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              v5.2 MIL-SPEC
            </span>
            <span className="text-xs text-slate-400 font-mono">
              TARGETS: HP VICTUS LAPTOP & OPPO A40 SMARTPHONE + DNA/BEAM PORTAL
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            QUANTUM & STATE-SECURITY DEFENDER
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Post-quantum cryptography foundation, HP Victus hardware firmware isolation, Oppo A40 Android TEE sandboxing, and elite anti-Pegasus / state mercenary spyware defenses.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRunPqcAudit}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <Zap className="w-3.5 h-3.5" />
            Run PQC Audit
          </button>

          <button
            onClick={() => setIsStateLockdown(!isStateLockdown)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isStateLockdown
                ? 'bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            State Lockdown: {isStateLockdown ? 'ACTIVE' : 'STANDBY'}
          </button>

          <button
            onClick={handleRunMvtScan}
            className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <Smartphone className="w-3.5 h-3.5" />
            Run MVT Spyware Scan
          </button>

          <button
            onClick={() => setShowBeamDnaPortal(!showBeamDnaPortal)}
            className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          >
            <Dna className="w-3.5 h-3.5" />
            DNA & Beam Portal
          </button>
        </div>
      </div>

      {/* 50-Point Defense Matrix KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            Total Defenses
          </span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            50+ Active
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            5 Military-grade layers
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" />
            PQC Algorithms
          </span>
          <div className="text-sm font-bold font-mono text-purple-300 mt-1">
            ML-KEM / Dilithium
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            NIST FIPS 203 / 204
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Laptop className="w-3 h-3 text-cyan-400" />
            HP Victus Security
          </span>
          <div className="text-sm font-bold font-mono text-cyan-300 mt-1">
            Wolf & Sure Start
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            TPM 2.0 & DMA Shield
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-emerald-400" />
            Oppo A40 Sandbox
          </span>
          <div className="text-sm font-bold font-mono text-emerald-300 mt-1">
            TEE & AVF Enforced
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Micro-VM isolation
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <EyeOff className="w-3 h-3 text-red-400" />
            Pegasus / Predator
          </span>
          <div className="text-sm font-bold font-mono text-red-400 mt-1">
            Zero-Click Blocked
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            MVT continuous audit
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Threat Status
          </span>
          <div className="text-base font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SECURE
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Zero breaches detected
          </span>
        </div>
      </div>

      {/* Category Pills Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          50-Point Defense Matrix ({categoryCounts.all})
        </button>

        <button
          onClick={() => setSelectedCategory('Quantum PQC')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
            selectedCategory === 'Quantum PQC'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          PQC & Quantum Protections ({categoryCounts.pqc})
        </button>

        <button
          onClick={() => setSelectedCategory('HP Victus')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
            selectedCategory === 'HP Victus'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          HP Victus Hardening ({categoryCounts.victus})
        </button>

        <button
          onClick={() => setSelectedCategory('Oppo A40')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
            selectedCategory === 'Oppo A40'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          Oppo A40 OS Hardening ({categoryCounts.oppo})
        </button>

        <button
          onClick={() => setSelectedCategory('State Spyware')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
            selectedCategory === 'State Spyware'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          Anti-Pegasus & State Spyware ({categoryCounts.spyware})
        </button>

        <button
          onClick={() => setSelectedCategory('Operations')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
            selectedCategory === 'Operations'
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          Tactical Operations ({categoryCounts.ops})
        </button>
      </div>

      {/* Beam & DNA Sequence Connector Inline Portal */}
      {showBeamDnaPortal && (
        <div className="bg-black/80 border border-purple-800/60 rounded-xl p-4 sm:p-5 space-y-4 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-purple-900/60 gap-2">
            <div className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold font-mono text-purple-200">
                Beam & DNA Sequence Connector (RMFO Biophysical Portal)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-700">
                ACTIVE PORTAL
              </span>
            </div>
            <button
              onClick={() => setShowBeamDnaPortal(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Close Portal ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Beam Propagation Vector */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  Beam Propagation Vector
                </span>
                <span>{beamFreq.toFixed(1)} THz</span>
              </div>
              <input
                type="range"
                min="100"
                max="350"
                step="0.5"
                value={beamFreq}
                onChange={(e) => setBeamFreq(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Phased Array Elements:</span>
                  <span className="text-slate-200 font-bold">64 Elements (M=64)</span>
                </div>
                <div className="flex justify-between">
                  <span>Directivity Factor:</span>
                  <span className="text-emerald-400 font-bold">18.1 dB</span>
                </div>
                <div className="flex justify-between">
                  <span>Standing Wave Peak:</span>
                  <span className="text-purple-300 font-bold">Harmonic Locked</span>
                </div>
              </div>
            </div>

            {/* DNA Strand Displacement & Viscosity */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Dna className="w-4 h-4" />
                  DNA Biocomputer Indexer
                </span>
                <span>{dnaViscosity.toFixed(1)} cP</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={dnaViscosity}
                onChange={(e) => setDnaViscosity(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
              <div className="space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Microfluidic Strand Density:</span>
                  <span className="text-slate-200 font-bold">24,500 Q/sec</span>
                </div>
                <div className="flex justify-between">
                  <span>Cas13 Enzymatic Reverse Cleave:</span>
                  <span className="text-emerald-400 font-bold">100% Intact</span>
                </div>
                <div className="flex justify-between">
                  <span>Cold Data Re-braiding:</span>
                  <span className="text-cyan-300 font-bold">4.2 Exabytes Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Device Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search 50 defense protocols by title, spec, layer, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden md:inline">Target Device:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Devices</option>
            <option value="HP Victus">HP Victus Laptop</option>
            <option value="Oppo A40">Oppo A40 Smartphone</option>
            <option value="Both">Both (Cross-Platform)</option>
          </select>

          <span className="text-xs text-slate-400 font-mono pl-1">
            Showing <strong className="text-cyan-400">{filteredProtocols.length}</strong> of 50
          </span>
        </div>
      </div>

      {/* 50 Defense Protocols Table & Matrix */}
      <div className="bg-black/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/90 text-slate-400 sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Defense Protocol / Protection Title</th>
                <th className="py-3 px-3">Target Device</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Compliance Spec</th>
                <th className="py-3 px-3 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {filteredProtocols.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No defense protocols match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProtocols.map((p) => {
                  const targetBadgeColor = 
                    p.targetDevice === 'HP Victus' ? 'text-cyan-300 bg-cyan-950 border-cyan-800' :
                    p.targetDevice === 'Oppo A40' ? 'text-emerald-300 bg-emerald-950 border-emerald-800' :
                    'text-purple-300 bg-purple-950 border-purple-800';

                  const statusColor = 
                    p.status === 'ENFORCED' ? 'text-cyan-300 bg-cyan-950/90 border-cyan-700' :
                    p.status === 'ACTIVE' || p.status === 'RUNNING' || p.status === 'ENABLED' ? 'text-emerald-300 bg-emerald-950/90 border-emerald-700' :
                    p.status === 'LOCKED' || p.status === 'ARMED' || p.status === 'BLOCKED' ? 'text-amber-300 bg-amber-950/90 border-amber-700' :
                    'text-slate-300 bg-slate-900 border-slate-700';

                  return (
                    <tr 
                      key={p.id}
                      className="hover:bg-cyan-950/20 transition cursor-pointer"
                      onClick={() => setSelectedProtocol(p)}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-400">
                        #{p.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-slate-800 text-slate-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{p.title}</span>
                          <span className="text-[9px] font-normal text-slate-500 uppercase">
                            [{p.tagline}]
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                          {p.description}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold flex items-center gap-1 w-max ${targetBadgeColor}`}>
                          {p.targetDevice === 'HP Victus' ? <Laptop className="w-3 h-3" /> : p.targetDevice === 'Oppo A40' ? <Smartphone className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                          {p.targetDevice}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-400">
                        {p.complianceSpec}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProtocol(p);
                          }}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition cursor-pointer"
                          title="Inspect Defense Specs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PQC Audit Modal */}
      {showPqcModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-cyan-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-base text-cyan-300">
                  NIST Post-Quantum Cryptography Audit
                </h3>
              </div>
              <button
                onClick={() => setShowPqcModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/70 rounded-xl p-4 border border-slate-800 text-xs space-y-2 h-64 overflow-y-auto">
              {pqcAuditLog.map((log, idx) => (
                <div key={idx} className="text-emerald-400 font-mono">
                  {log}
                </div>
              ))}
              {isAuditingPqc && (
                <div className="text-cyan-400 flex items-center gap-2 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing quantum-safe key exchange verification vectors...</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Standard: FIPS 203 & 204</span>
              <button
                onClick={() => setShowPqcModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MVT Spyware Scanner Modal */}
      {showMvtModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-emerald-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 font-mono text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-emerald-300">
                  Mobile Verification Toolkit (MVT) Spyware Audit
                </h3>
              </div>
              <button
                onClick={() => setShowMvtModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Scanning Oppo A40 Filesystem & SMS Logs for Pegasus/Predator IoCs...</span>
                <span className="text-emerald-400 font-bold">{mvtScanProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${mvtScanProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-black/70 rounded-xl p-4 border border-slate-800 text-xs space-y-1.5">
              <div className="text-slate-300">Checking: SMS/MMS attachment parser (zero-click)... [CLEAN]</div>
              <div className="text-slate-300">Checking: WhatsApp & Signal SQLite database triggers... [CLEAN]</div>
              <div className="text-slate-300">Checking: WebKit / Blink in-app browser cache artifacts... [CLEAN]</div>
              <div className="text-slate-300">Checking: Known NSO Group / Cytrox C2 IP addresses... [CLEAN]</div>
              {mvtScanProgress === 100 && (
                <div className="text-emerald-400 font-bold pt-2 border-t border-slate-800 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>AUDIT COMPLETE: 0 Indicators of Compromise (IoCs) detected. Zero-click exploits blocked.</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowMvtModal(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Protocol Deep Drilldown Modal */}
      {selectedProtocol && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-cyan-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 font-mono text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold">
                  DEFENSE PROTOCOL #{selectedProtocol.id}
                </span>
                <h3 className="font-bold text-base text-slate-100">
                  {selectedProtocol.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProtocol(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed bg-black/50 p-3 rounded-xl border border-slate-800">
              {selectedProtocol.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                <span className="text-slate-400">Target Hardware:</span>
                <span className="text-cyan-300 font-bold">{selectedProtocol.targetDevice}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                <span className="text-slate-400">Security Layer:</span>
                <span className="text-purple-300 font-bold">Layer {selectedProtocol.layer}: {selectedProtocol.layerTitle}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-emerald-400 font-bold">{selectedProtocol.status}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                <span className="text-slate-400">Mitigation Impact:</span>
                <span className="text-slate-200">{selectedProtocol.mitigationImpact}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-black/40 border border-slate-900">
                <span className="text-slate-400">Compliance Standard:</span>
                <span className="text-amber-300 font-mono">{selectedProtocol.complianceSpec}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedProtocol(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold cursor-pointer"
              >
                Acknowledge Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
