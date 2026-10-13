import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Cpu, 
  DollarSign, 
  Activity, 
  ShieldCheck, 
  Database, 
  Layers, 
  Flame, 
  PowerOff, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { YieldNode } from '../types/hyperion';

interface NodeDetailModalProps {
  node: YieldNode | null;
  onClose: () => void;
  onToggleBoost: (id: number) => void;
  onForceTerminate?: (id: number) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onToggleBoost,
  onForceTerminate
}) => {
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownStep, setShutdownStep] = useState<string>('');
  const [shutdownProgress, setShutdownProgress] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);

  if (!node) return null;

  const handleForceTerminate = () => {
    setIsShuttingDown(true);
    setShutdownProgress(15);
    setShutdownStep('Scrubbing volatile memory & cryptographic state keys...');

    setTimeout(() => {
      setShutdownProgress(45);
      setShutdownStep('Quenching RF/microwave carrier frequency to 0.0 Hz...');
    }, 600);

    setTimeout(() => {
      setShutdownProgress(80);
      setShutdownStep('Zeroizing firmware register tables & de-authorizing node...');
    }, 1200);

    setTimeout(() => {
      setShutdownProgress(100);
      setShutdownStep('Node wiped and safely terminated.');
      setIsTerminated(true);
      setIsShuttingDown(false);
      if (onForceTerminate) {
        onForceTerminate(node.id);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101b] border border-cyan-800/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 font-mono relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {node.code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800">
                {node.classLabel}
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400">{node.sector}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">
              {node.name}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 font-sans leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-900">
          {node.description || 'Autonomous node executing algorithmic micro-yield capture and liquidity routing across decentralized protocols.'}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Yield Rate</span>
            <span className="text-base font-bold text-emerald-400">
              ${node.currentYieldPerSec.toFixed(2)}/s
            </span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Accrued Earned</span>
            <span className="text-base font-bold text-cyan-300">
              ${node.accumulatedEarned.toFixed(2)}
            </span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Qubit Allocation</span>
            <span className="text-base font-bold text-purple-400">
              {node.qubitAllocation} Qubits
            </span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Activity Score</span>
            <span className="text-base font-bold text-slate-200">
              {node.activityPercent}%
            </span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Hardware Health</span>
            <span className={`text-base font-bold ${isTerminated || node.status === 'OFFLINE' ? 'text-red-400' : 'text-emerald-300'}`}>
              {isTerminated || node.status === 'OFFLINE' ? '0%' : `${node.healthPercent}%`}
            </span>
          </div>

          <div className="bg-black/50 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[11px] block">Current Status</span>
            <span className={`text-sm font-bold ${
              isTerminated || node.status === 'OFFLINE' ? 'text-red-400' :
              node.status === 'BOOST 2.5x' ? 'text-cyan-300' : 'text-emerald-400'
            }`}>
              {isTerminated ? 'TERMINATED' : node.status}
            </span>
          </div>
        </div>

        {/* Visual Shutdown Sequence in Progress */}
        {isShuttingDown && (
          <div className="bg-red-950/40 border border-red-700/60 rounded-xl p-4 space-y-2.5 animate-pulse">
            <div className="flex items-center justify-between text-xs font-bold text-red-400">
              <span className="flex items-center gap-1.5">
                <PowerOff className="w-4 h-4 animate-spin" />
                SHUTDOWN & ZEROIZATION IN PROGRESS
              </span>
              <span>{shutdownProgress}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-red-900">
              <div 
                className="bg-red-500 h-full transition-all duration-300 ease-out" 
                style={{ width: `${shutdownProgress}%` }}
              />
            </div>
            <div className="text-[11px] text-red-200 font-mono">
              {shutdownStep}
            </div>
          </div>
        )}

        {isTerminated && (
          <div className="bg-emerald-950/40 border border-emerald-600/60 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Node successfully wiped and terminated. System audit logged.</span>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-800 gap-3">
          <button
            onClick={() => onToggleBoost(node.id)}
            disabled={isShuttingDown || isTerminated || node.status === 'OFFLINE'}
            className={`w-full sm:flex-1 py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 ${
              node.isBoosted
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 hover:bg-cyan-900'
                : 'bg-cyan-600 hover:bg-cyan-500 text-black'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            {node.isBoosted ? 'DEACTIVATE BOOST 2.5x' : 'APPLY 2.5x BOOST MULTIPLIER'}
          </button>

          {/* Force Terminate Button */}
          <button
            onClick={handleForceTerminate}
            disabled={isShuttingDown || isTerminated || node.status === 'OFFLINE'}
            className="w-full sm:w-auto py-2 px-4 rounded-xl font-bold text-xs bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/80 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
            title="Trigger visual shutdown sequence and wipe node"
          >
            <PowerOff className="w-4 h-4 text-red-400" />
            Force Terminate
          </button>
        </div>
      </div>
    </div>
  );
};
