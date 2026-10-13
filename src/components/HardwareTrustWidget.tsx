import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Laptop, RefreshCw, Key, Lock } from 'lucide-react';
import { useHardwareAuth } from '../context/HardwareAuthContext';

interface HardwareTrustWidgetProps {
  compact?: boolean;
}

export const HardwareTrustWidget: React.FC<HardwareTrustWidgetProps> = ({ compact = false }) => {
  const { status, trustScore, isSimulated, openModal } = useHardwareAuth();

  if (compact) {
    return (
      <button
        onClick={openModal}
        className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-2 transition cursor-pointer min-h-[44px] shadow-sm ${
          status === 'AUTHENTICATED'
            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            : status === 'CONNECTING' || status === 'CHALLENGING'
            ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/80'
            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
        }`}
        title="HP Victus Hardware Trust Manager (Port 8443)"
      >
        {status === 'AUTHENTICATED' ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>TPM 2.0: 100% TRUSTED</span>
          </>
        ) : status === 'CONNECTING' || status === 'CHALLENGING' ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>HANDSHAKE :8443...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>HARDWARE AUTH (8443)</span>
          </>
        )}
      </button>
    );
  }

  // Full Dashboard Widget format
  return (
    <button
      onClick={openModal}
      className={`rounded-xl p-3 sm:px-3.5 sm:py-2.5 border transition cursor-pointer flex items-center gap-3 text-left min-h-[48px] shadow-sm ${
        status === 'AUTHENTICATED'
          ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900/90 border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
          : status === 'CONNECTING' || status === 'CHALLENGING'
          ? 'bg-gradient-to-r from-cyan-950/60 to-slate-900/90 border-cyan-500/50 hover:border-cyan-400'
          : 'bg-gradient-to-r from-indigo-950/40 to-slate-900/90 border-indigo-900/60 hover:border-indigo-600'
      }`}
      title="Click to open HP Victus Hardware Authentication Manager"
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
        status === 'AUTHENTICATED'
          ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          : status === 'CONNECTING' || status === 'CHALLENGING'
          ? 'bg-cyan-950 border-cyan-500/50 text-cyan-400'
          : 'bg-indigo-950 border-indigo-800 text-indigo-400'
      }`}>
        {status === 'AUTHENTICATED' ? (
          <Lock className="w-4 h-4" />
        ) : status === 'CONNECTING' || status === 'CHALLENGING' ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Laptop className="w-4 h-4" />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            HARDWARE TRUST STATUS
          </span>
          {status === 'AUTHENTICATED' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </div>

        <div className="text-xs sm:text-sm font-bold font-mono tracking-tight flex items-center gap-1.5">
          {status === 'AUTHENTICATED' ? (
            <>
              <span className="text-emerald-300">HP VICTUS: 100% TRUSTED</span>
              {isSimulated && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  SIM
                </span>
              )}
            </>
          ) : status === 'CONNECTING' || status === 'CHALLENGING' ? (
            <span className="text-cyan-300">HANDSHAKE IN PROGRESS</span>
          ) : status === 'ERROR' ? (
            <span className="text-rose-400">UNTRUSTED · STANDBY</span>
          ) : (
            <span className="text-indigo-300 hover:text-indigo-200">STANDBY · PORT 8443</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default HardwareTrustWidget;
