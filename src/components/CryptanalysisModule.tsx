import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Binary, 
  Cpu, 
  Zap, 
  Sparkles, 
  Calculator, 
  Lock, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { CryptanalysisProfile } from '../types/hyperion';

interface CryptanalysisModuleProps {
  spec: CryptanalysisProfile;
  onVerifyOracle: () => void;
}

export const CryptanalysisModule: React.FC<CryptanalysisModuleProps> = ({
  spec,
  onVerifyOracle
}) => {
  const [bitA, setBitA] = useState<number>(1);
  const [bitB, setBitB] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedHash, setVerifiedHash] = useState('0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');

  const xorResult = bitA ^ bitB;
  const andResult = bitA & bitB;

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onVerifyOracle();
      setVerifiedHash('0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
      setIsVerifying(false);
    }, 600);
  };

  return (
    <div className="bg-slate-900/80 border border-purple-900/40 rounded-xl p-4 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              NODE #26 AUDIT ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Galois Field $\mathbb&#123;F&#125;_2$ Cryptanalysis
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
            Node 26: Cryptanalysis Audit Module
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-1 max-w-4xl">
            Executes Grover oracle search decomposition over Galois Fields $\mathbb&#123;F&#125;_2$ to evaluate algorithmic system security & regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="px-4 py-2 rounded-lg bg-purple-900/80 hover:bg-purple-800 border border-purple-600/80 text-purple-200 font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.25)] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'VERIFYING ORACLE...' : 'BENCHMARK GROVER DEPTH'}
          </button>
        </div>
      </div>

      {/* 4 Pillars Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Algebraic Equation Resolution */}
        <div className="bg-black/60 rounded-xl p-4 border border-purple-900/30 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-purple-400 mb-2 flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5" />
              // ALGEBRAIC EQUATION RESOLUTION
            </div>
            <div className="space-y-1.5 font-mono text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">XOR Mapping:</span>
                <span className="text-cyan-300 font-semibold">a ⊕ b = a + b (mod 2)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">AND Mapping:</span>
                <span className="text-cyan-300 font-semibold">a ∧ b = a · b</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Linear Complexity:</span>
                <span className="text-emerald-400 font-bold">L = {spec.linearComplexityBits} bits</span>
              </div>
            </div>
          </div>

          {/* Mini Interactive GF(2) Bitwise Calculator */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-500">
              <span>TEST GF(2) OPERANDS:</span>
              <span>a={bitA}, b={bitB}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBitA(bitA === 1 ? 0 : 1)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                a = {bitA}
              </button>
              <button
                onClick={() => setBitB(bitB === 1 ? 0 : 1)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
              >
                b = {bitB}
              </button>
              <span className="text-cyan-400 font-bold pl-1">
                ⊕={xorResult} | ∧={andResult}
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 2: SHA-256 Oracle Pipeline */}
        <div className="bg-black/60 rounded-xl p-4 border border-purple-900/30">
          <div className="text-xs font-mono font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            // SHA-256 ORACLE PIPELINE
          </div>
          <div className="space-y-2 font-mono text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
            <div className="text-slate-300">
              <span className="text-slate-500">Ch = </span>
              <span className="text-cyan-300">(E ∧ F) ⊕ (¬E ∧ G)</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-500">Maj = </span>
              <span className="text-cyan-300">(A ∧ B) ⊕ (A ∧ C) ⊕ (B ∧ C)</span>
            </div>
            <div className="text-slate-300 text-[11px] pt-1 border-t border-slate-800 text-purple-300">
              t_1 = H + Σ_1(E) + Ch + K[i] + W[i]
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Compression Rounds:</span>
            <span className="text-slate-200 font-bold">64 Iterations</span>
          </div>
        </div>

        {/* Pillar 3: Grover Oracle Search Depth */}
        <div className="bg-black/60 rounded-xl p-4 border border-purple-900/30">
          <div className="text-xs font-mono font-bold text-amber-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            // GROVER ORACLE SEARCH DEPTH
          </div>
          <div className="space-y-2 font-mono text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Search Space:</span>
              <span className="text-amber-300 font-bold">{spec.targetSearchSpace}</span>
            </div>
            <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400">
              Estimated Steps:
            </div>
            <div className="text-xs font-bold font-mono text-emerald-400">
              {spec.estimatedSteps}
            </div>
          </div>
          <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Quadratic Speedup:</span>
            <span className="text-amber-400 font-bold">O(√N) Proven</span>
          </div>
        </div>

        {/* Pillar 4: Logical Qubit & Synthesis Depth */}
        <div className="bg-black/60 rounded-xl p-4 border border-purple-900/30">
          <div className="text-xs font-mono font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            // QUANTUM SYNTHESIS LOAD
          </div>
          <div className="space-y-3 font-mono text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-900">
            <div>
              <div className="text-[11px] text-slate-400 mb-0.5">Logical Qubit Allocation:</div>
              <div className="text-base font-bold text-emerald-300">
                {spec.logicalQubitAllocation.toLocaleString()} Qubits
              </div>
            </div>
            <div className="pt-1.5 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 mb-0.5">Circuit Synthesis Depth:</div>
              <div className="text-base font-bold text-purple-300">
                {spec.circuitSynthesisDepth}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Profiles Table */}
      <div className="bg-black/60 rounded-xl p-4 border border-purple-900/30">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-purple-400" />
            // RESOURCE PROFILES (ALGORITHMIC QUANTUM RESISTANCE)
          </div>
          <div className="text-[11px] font-mono text-purple-400">
            Active Galois Field $\mathbb&#123;F&#125;_2$ Evaluation
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">Alg</th>
                <th className="py-2 px-3">Qubits</th>
                <th className="py-2 px-3">T-Depth</th>
                <th className="py-2 px-3">Cryptanalytic Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {spec.algorithms.map((alg) => (
                <tr key={alg.name} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{alg.name}</td>
                  <td className="py-2.5 px-3 text-purple-300">{alg.qubits}</td>
                  <td className="py-2.5 px-3 text-amber-300">{alg.tDepth}</td>
                  <td className="py-2.5 px-3 text-slate-300">{alg.securityLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Audit Hash Output */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
          <span>Active Audit State Hash:</span>
          <span className="text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px] select-all">
            {verifiedHash}
          </span>
        </div>
      </div>
    </div>
  );
};
