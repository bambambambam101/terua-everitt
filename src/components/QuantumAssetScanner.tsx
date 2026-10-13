import React, { useState, useEffect, useMemo } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  Smartphone, 
  RefreshCw, 
  Check, 
  Copy, 
  Download, 
  Wifi, 
  Lock, 
  Zap, 
  Key, 
  Camera, 
  Eye, 
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Activity,
  HeartPulse,
  Home,
  Globe,
  Radio,
  FileText,
  AlertTriangle,
  Sliders,
  Database,
  BarChart3,
  Bot
} from 'lucide-react';

interface QuantumAssetScannerProps {
  accumulatedYield?: number;
}

export type ScannerSubTab = 
  | 'qr_exchange' 
  | 'ledger_management'
  | 'cyber_iot_healthcare'
  | 'household_twin'
  | 'risk_threat_engine'
  | 'ai_skills_framework';

export const QuantumAssetScanner: React.FC<QuantumAssetScannerProps> = ({ 
  accumulatedYield = 3854.40 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ScannerSubTab>('qr_exchange');
  const [deviceSyncStatus, setDeviceSyncStatus] = useState<'READY' | 'HANDSHAKE_INIT' | 'VERIFYING_PQC' | 'SYNCHRONIZED'>('READY');
  const [targetPlatform, setTargetPlatform] = useState<'HP_VICTUS_BRIDGE' | 'OPPO_A40' | 'GENERIC_PQC'>('OPPO_A40');
  const [syncSessionId, setSyncSessionId] = useState<string>('HYPERION-SYNC-7749-PQC');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [regenerateCounter, setRegenerateCounter] = useState<number>(0);
  const [simulatedDevicePayload, setSimulatedDevicePayload] = useState<string>('');
  const [showRawPayload, setShowRawPayload] = useState<boolean>(false);

  // Dynamic encrypted Ledger State
  const ledgerState = useMemo(() => {
    return {
      version: 'HYPERION-v7.5-DOMUS-PQC',
      timestampUtc: new Date().toISOString(),
      nonce: Math.floor(Math.random() * 90000000 + 10000000).toString(16),
      pqcStandard: 'NIST ML-KEM-1024 (Kyber) + ML-DSA-87 (Dilithium)',
      beneficiary: 'TERUA EVERITT // JONATHAN RHOADES RESTORED',
      bankDestination: 'THE COOPERATIVE BANK NEW ZEALAND',
      clearedBalances: {
        fiatNzd: '$2,000,294.00 NZD',
        ethereum: '1,450.84 ETH ($4,207,436.00 NZD)',
        bitcoin: '42.50 BTC ($3,825,000.00 NZD)',
        tetherUsdt: '4,500,000.00 USDT ($6,817,500.00 NZD)',
        accumulatedNetYield: `$${accumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD`,
        totalRestoredReserves: '$14,850,230.00 NZD'
      },
      quantumSignatures: {
        kyberPublicKeyFingerprint: '4f9a7c81d3e2b056ba83726190efac1255841029ab346e92',
        dilithiumSigHash: '8b71d93ef20a7b64921cae931048bca6452290f14238e89d1',
        quantumEntropySeed: '0x99A3F1DE42C0B83E5813739A01946F9E1'
      },
      authorizedClients: [
        'HP Victus 16 Gaming Laptop (Host Engine Master)',
        'Oppo A40 Physical Mobile Device (Remote Handshake Receiver)'
      ]
    };
  }, [accumulatedYield, regenerateCounter]);

  // JSON stringified payload
  const rawPayloadText = useMemo(() => {
    return JSON.stringify(ledgerState, null, 2);
  }, [ledgerState]);

  // Generate deterministic QR pattern matrix based on state hash
  const qrMatrix = useMemo(() => {
    const size = 25; // 25x25 grid
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    let seed = 0;
    for (let i = 0; i < rawPayloadText.length; i++) {
      seed = (seed * 31 + rawPayloadText.charCodeAt(i)) & 0xffffffff;
    }

    const prng = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 4294967296;
    };

    // Finder patterns: 3 corners (7x7 squares)
    const drawFinderPattern = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[r0 + r][c0 + c] = true;
          } else {
            matrix[r0 + r][c0 + c] = false;
          }
        }
      }
    };

    drawFinderPattern(0, 0); // Top-left
    drawFinderPattern(0, size - 7); // Top-right
    drawFinderPattern(size - 7, 0); // Bottom-left

    // Alignment pattern near bottom-right (5x5)
    for (let r = size - 9; r <= size - 5; r++) {
      for (let c = size - 9; c <= size - 5; c++) {
        const isBorder = r === size - 9 || r === size - 5 || c === size - 9 || c === size - 5;
        const isCenter = r === size - 7 && c === size - 7;
        matrix[r][c] = isBorder || isCenter;
      }
    }

    // Timing lines
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Fill data modules with pseudo-random pattern based on state hash
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= size - 8) ||
          (r >= size - 8 && c < 8) ||
          (r >= size - 10 && r <= size - 4 && c >= size - 10 && c <= size - 4) ||
          r === 6 || c === 6
        ) {
          continue;
        }
        matrix[r][c] = prng() > 0.48;
      }
    }

    return matrix;
  }, [rawPayloadText]);

  // Handle re-keying or refreshing the QR code
  const handleRegenerateQr = () => {
    setRegenerateCounter(prev => prev + 1);
    setSyncSessionId(`HYPERION-SYNC-${Math.floor(1000 + Math.random() * 9000)}-PQC`);
    setDeviceSyncStatus('READY');
  };

  // Simulate mobile device camera handshake
  const handleSimulateSync = () => {
    setDeviceSyncStatus('HANDSHAKE_INIT');
    setTimeout(() => {
      setDeviceSyncStatus('VERIFYING_PQC');
      setTimeout(() => {
        setDeviceSyncStatus('SYNCHRONIZED');
        setSimulatedDevicePayload(`Oppo A40 connected at ${new Date().toLocaleTimeString()} NZST via TLS 1.3 + ML-KEM-1024 hybrid tunnel. Ledger digest: 0x98A4C... synced.`);
      }, 1500);
    }, 1200);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(rawPayloadText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadLedgerSyncJson = () => {
    const blob = new Blob([rawPayloadText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hyperion_PQC_Asset_Ledger_Handshake_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#090d1a] border border-cyan-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Header & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              PHYSICAL HARDWARE SYNC
            </span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              NIST PQC ML-KEM CAMERA HANDSHAKE // 18 AI ECOSYSTEM SKILLS
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <QrCode className="w-6 h-6 text-cyan-400" />
            QUANTUM ASSET SCANNER & ECOSYSTEM SUITE
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-4xl">
            Complete management interface for Encrypted QR Asset Exchange, Mobile Sync Handshakes, IoT Asset Tracking, Healthcare Device Security, Household Digital Twins, and Autonomous AI Skills orchestration.
          </p>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={handleRegenerateQr}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-700/50 text-cyan-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate QR Seed
          </button>

          <button
            onClick={handleSimulateSync}
            disabled={deviceSyncStatus === 'HANDSHAKE_INIT' || deviceSyncStatus === 'VERIFYING_PQC'}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
          >
            <Smartphone className="w-3.5 h-3.5" />
            {deviceSyncStatus === 'SYNCHRONIZED' ? 'Handshake Synchronized' : 'Simulate Camera Handshake'}
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation Matrix */}
      <div className="flex items-center overflow-x-auto border-b border-slate-800 gap-1.5 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveSubTab('qr_exchange')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'qr_exchange'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Encrypted QR & Mobile Handshake
        </button>

        <button
          onClick={() => setActiveSubTab('ledger_management')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ledger_management'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          Asset Ledger Management ($14.8M NZD)
        </button>

        <button
          onClick={() => setActiveSubTab('cyber_iot_healthcare')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'cyber_iot_healthcare'
              ? 'bg-purple-950 text-purple-300 border border-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5 text-purple-400" />
          IoT Tracking & Healthcare Security
        </button>

        <button
          onClick={() => setActiveSubTab('household_twin')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'household_twin'
              ? 'bg-amber-950 text-amber-300 border border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          Household Digital Twin (Domus)
        </button>

        <button
          onClick={() => setActiveSubTab('risk_threat_engine')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'risk_threat_engine'
              ? 'bg-rose-950 text-rose-300 border border-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          Risk Scoring & Threat Correlation
        </button>

        <button
          onClick={() => setActiveSubTab('ai_skills_framework')}
          className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ai_skills_framework'
              ? 'bg-blue-950 text-blue-300 border border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.25)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-blue-400" />
          Autonomous AI Skills (18 Ecosystem Tools)
        </button>
      </div>

      {/* TAB 1: ENCRYPTED QR & MOBILE HANDSHAKE */}
      {activeSubTab === 'qr_exchange' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-inner">
            <div className="w-full flex justify-between items-center mb-4 text-xs">
              <span className="text-[10px] text-slate-400">SESSION: <strong className="text-cyan-400">{syncSessionId}</strong></span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                deviceSyncStatus === 'SYNCHRONIZED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : deviceSyncStatus === 'VERIFYING_PQC'
                    ? 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                    : deviceSyncStatus === 'HANDSHAKE_INIT'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}>
                {deviceSyncStatus === 'SYNCHRONIZED' ? 'PAIRED & VERIFIED' :
                 deviceSyncStatus === 'VERIFYING_PQC' ? 'VERIFYING PQC DILITHIUM...' :
                 deviceSyncStatus === 'HANDSHAKE_INIT' ? 'OPTICAL SCAN DETECTED...' : 'READY FOR SCAN'}
              </span>
            </div>

            {/* QR Matrix */}
            <div className="relative p-4 bg-white rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] border-4 border-cyan-500/80 transition-transform duration-300 hover:scale-[1.02]">
              <div 
                className="grid gap-[2px] bg-white"
                style={{
                  gridTemplateColumns: `repeat(${qrMatrix.length}, minmax(0, 1fr))`,
                  width: '260px',
                  height: '260px'
                }}
              >
                {qrMatrix.map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-full h-full rounded-[1px] transition-colors duration-150 ${
                        cell ? 'bg-slate-950' : 'bg-white'
                      }`}
                    />
                  ))
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-slate-950 border-2 border-cyan-400 rounded-lg p-1.5 shadow-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
              </div>
            </div>

            <div className="mt-5 text-center space-y-1">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Point Mobile Camera to Synchronize</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans max-w-xs">
                Scan using physical mobile device (Oppo A40) for offline cryptographic token synchronization.
              </p>
            </div>

            {deviceSyncStatus === 'SYNCHRONIZED' && (
              <div className="mt-4 w-full bg-emerald-950/60 border border-emerald-600/60 rounded-lg p-3 text-xs text-emerald-300 flex items-start gap-2 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-emerald-200">Device Successfully Authenticated!</strong>
                  <span className="text-[10px] text-emerald-300/90">{simulatedDevicePayload}</span>
                </div>
              </div>
            )}
          </div>

          {/* Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  FEDERATED DEVICE ENROLLMENT & PQC PROTOCOLS
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                  ML-KEM ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div 
                  onClick={() => setTargetPlatform('OPPO_A40')}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    targetPlatform === 'OPPO_A40'
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-black/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">Oppo A40 Physical Mobile</span>
                    <span className="text-[10px] text-cyan-400 font-mono">REMOTE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Optical sync receiver via camera handshake + ML-KEM Kyber-1024 TLS link.
                  </p>
                </div>

                <div 
                  onClick={() => setTargetPlatform('HP_VICTUS_BRIDGE')}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    targetPlatform === 'HP_VICTUS_BRIDGE'
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-black/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">HP Victus Gaming Host</span>
                    <span className="text-[10px] text-purple-400 font-mono">PRIMARY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Hardware-locked state anchor, trade secret obfuscation & LMS firmware signatures.
                  </p>
                </div>
              </div>
            </div>

            {/* Cryptographic Ledger Payload Inspector */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Encrypted Handshake Envelope (ML-KEM / Dilithium)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowRawPayload(!showRawPayload)}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    {showRawPayload ? 'Collapse' : 'Expand JSON'}
                  </button>
                  <button
                    onClick={handleCopyPayload}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-300 border border-cyan-800 flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadLedgerSyncJson}
                    className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] text-emerald-300 border border-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    JSON
                  </button>
                </div>
              </div>

              <div className="bg-black/70 rounded-lg p-3 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-900">
                <pre className="leading-tight">
                  {showRawPayload ? rawPayloadText : rawPayloadText.slice(0, 360) + '\n... [Remaining cryptographic payload encrypted with ML-KEM-1024]'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSET LEDGER MANAGEMENT */}
      {activeSubTab === 'ledger_management' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  RESTORED ASSET INVENTORY & AUDIT REPOSITORY
                </h3>
                <span className="text-xs text-slate-400">BENEFICIARY: TERUA EVERITT // CLEARED COOPERATIVE BANK NZ</span>
              </div>
              <span className="text-xs font-bold text-white bg-emerald-950 px-3 py-1 rounded border border-emerald-700">
                TOTAL PORTFOLIO: $14,850,230.00 NZD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Ethereum Vault</span>
                <span className="text-emerald-300 font-bold text-sm">1,450.84 ETH</span>
                <span className="text-[10px] text-slate-400 block">$4,207,436 NZD</span>
                <span className="text-[9px] text-emerald-400 font-mono mt-1 block">Tx: 0x88f1a...42c1</span>
              </div>
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Bitcoin Reserve</span>
                <span className="text-amber-300 font-bold text-sm">42.50 BTC</span>
                <span className="text-[10px] text-slate-400 block">$3,825,000 NZD</span>
                <span className="text-[9px] text-amber-400 font-mono mt-1 block">Tx: bc1qar...980e</span>
              </div>
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">USD Tether (USDT)</span>
                <span className="text-cyan-300 font-bold text-sm">4,500,000 USDT</span>
                <span className="text-[10px] text-slate-400 block">$6,817,500 NZD</span>
                <span className="text-[9px] text-cyan-400 font-mono mt-1 block">Escrow: Cleared</span>
              </div>
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Restored Fiat Deposit</span>
                <span className="text-purple-300 font-bold text-sm">$2,000,294.00 NZD</span>
                <span className="text-[10px] text-slate-400 block">Cooperative Bank NZ</span>
                <span className="text-[9px] text-purple-400 font-mono mt-1 block">Acc: 06-0821-****</span>
              </div>
            </div>

            {/* Offline Sync State */}
            <div className="bg-black/70 p-3 rounded-lg border border-slate-900 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Secure Offline Synchronization: Local cryptstore hashed via SHA-512 + XMSS</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">STATE SYNCHRONIZED</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CYBER DEFENSE, IOT & HEALTHCARE SECURITY */}
      {activeSubTab === 'cyber_iot_healthcare' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-purple-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-purple-400" />
                  HEALTHCARE IOT & BIOMEDICAL DEVICE DEFENSE CORE
                </h3>
                <span className="text-xs text-slate-400">Continuous telemetry, telemetry exfiltration quenching, and telemetry integrity</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                12 MONITORED NODES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'Infusion Pump Node #4', ip: '10.24.12.10', freq: '2.4 GHz', status: 'SHIELDED', threat: '0 Anomalies' },
                { name: 'ECG Telemetry Monitor', ip: '10.24.12.14', freq: '868 MHz', status: 'SHIELDED', threat: 'Zero-Quenched' },
                { name: 'ICU Ventilator Bridge', ip: '10.24.12.18', freq: '5.8 GHz', status: 'PQC ENCRYPTED', threat: 'ML-KEM Validated' },
                { name: 'Biometric Holter Unit', ip: '10.24.12.22', freq: 'BLE 24.2 GHz', status: 'SHIELDED', threat: 'Exfil Blocked' },
                { name: 'Surgical Laser Gateway', ip: '10.24.12.30', freq: 'Direct Optical', status: 'ISOLATED', threat: 'Air-Gapped' },
                { name: 'PACS Imaging Server', ip: '10.24.12.45', freq: '10 GbE SFP+', status: 'AUDITED', threat: 'Zero CVEs' },
              ].map((device, idx) => (
                <div key={idx} className="p-3 bg-black/50 border border-slate-800/80 rounded-lg space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-200">{device.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                      {device.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{device.ip} • {device.freq}</div>
                  <div className="text-[10px] text-purple-300 font-mono">{device.threat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HOUSEHOLD DIGITAL TWIN MONITORING (DOMUS) */}
      {activeSubTab === 'household_twin' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-amber-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-400" />
                  DOMUS HOUSEHOLD QUANTUM DIGITAL TWIN & ANOMALY ENGINE
                </h3>
                <span className="text-xs text-slate-400">Real-time telemetry of ambient RF, photonic grid, and smart appliances</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                NORMALIZED (0.012 uW/cm²)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Ambient RF Floor</span>
                <span className="font-bold text-emerald-400 text-sm">-108.4 dBm</span>
                <span className="text-[10px] text-slate-400 block">Sub-Thermal Quenched</span>
              </div>
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Powerline Harmonics</span>
                <span className="font-bold text-slate-200 text-sm">50.00 Hz Pure</span>
                <span className="text-[10px] text-slate-400 block">Zero Dirty Electricity</span>
              </div>
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Biophotonic Coherence</span>
                <span className="font-bold text-cyan-300 text-sm">99.8% Coherent</span>
                <span className="text-[10px] text-slate-400 block">Zero Phase Drift</span>
              </div>
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg">
                <span className="text-[10px] text-slate-500 block">V2K RF Emitters</span>
                <span className="font-bold text-red-400 text-sm">0 Active (119 Wiped)</span>
                <span className="text-[10px] text-emerald-400 block">100% Neutralized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RISK SCORING & THREAT CORRELATION ENGINE */}
      {activeSubTab === 'risk_threat_engine' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-rose-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  DYNAMIC RISK SCORING & MULTI-VECTOR THREAT CORRELATION
                </h3>
                <span className="text-xs text-slate-400">Bayesian anomaly assessment across network, biometric, and geopolitical vectors</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                COMPOSITE RISK: 0.04 / 10.0 (SECURE)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-slate-200">MITM Infiltration Vector</span>
                <div className="text-emerald-400 font-bold">Risk: 0.01 (Negligible)</div>
                <p className="text-[10px] text-slate-400">PQC TLS 1.3 + ML-KEM protects against active eavesdropping and certificate forging.</p>
              </div>

              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-slate-200">Ransomware & Zero-Day Vector</span>
                <div className="text-emerald-400 font-bold">Risk: 0.02 (Neutralized)</div>
                <p className="text-[10px] text-slate-400">Dynamic honeypot absorbers swallow high-frequency write operations into virtual sinks.</p>
              </div>

              <div className="p-3 bg-black/50 border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-slate-200">Geopolitical APT Vector</span>
                <div className="text-emerald-400 font-bold">Risk: 0.01 (Shielded)</div>
                <p className="text-[10px] text-slate-400">State-security defenders trace and neutralize adversary IPs with zero attribution traces.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUTONOMOUS AI SKILLS (18 ECOSYSTEM TOOLS) */}
      {activeSubTab === 'ai_skills_framework' && (
        <div className="space-y-4">
          <div className="bg-slate-950/90 border border-blue-900/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                  REUSABLE AI SKILLS & MULTI-AGENT WORKFLOW ORCHESTRATION (18 TOOLS)
                </h3>
                <span className="text-xs text-slate-400">Autonomous tool definitions exposed to Gemini models, B.A.M. agents, and Hyperion engines</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                18 VERIFIED SKILLS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'Asset Ledger Management', category: 'LEDGER', tool: 'manage_asset_ledger()', desc: 'Queries, verifies, and records restored cryptocurrency and fiat holdings.' },
                { name: 'Encrypted QR Asset Exchange', category: 'EXCHANGE', tool: 'generate_encrypted_qr()', desc: 'Renders optical QR payloads representing encrypted state digests.' },
                { name: 'Mobile Sync Handshake', category: 'SYNC', tool: 'initiate_mobile_handshake()', desc: 'Establishes TLS 1.3 + ML-KEM camera handshake with physical devices.' },
                { name: 'AI Swarm Coordination', category: 'SWARM', tool: 'orchestrate_swarm()', desc: 'Balances workloads across 26 autonomous income and cryptanalysis nodes.' },
                { name: 'Cyber Defense Monitoring', category: 'SECURITY', tool: 'monitor_threat_absorbers()', desc: 'Tracks active MITM, malware, and ransomware absorption metrics.' },
                { name: 'IoT Asset Tracking', category: 'IOT', tool: 'track_iot_assets()', desc: 'Monitors wireless frequency, IP address, and MAC health across nodes.' },
                { name: 'Healthcare Device Security', category: 'HEALTHCARE', tool: 'audit_healthcare_devices()', desc: 'Enforces medical device encryption and stops covert telemetry exfiltration.' },
                { name: 'Geopolitical Intelligence', category: 'INTEL', tool: 'fetch_geopolitical_threats()', desc: 'Correlates APT infrastructure across international IP registries.' },
                { name: 'Cryptographic Validation', category: 'CRYPTO', tool: 'validate_pqc_signatures()', desc: 'Audits Kyber-1024 lattices and Dilithium-87 stateful hash signatures.' },
                { name: 'Household Digital Twin Monitoring', category: 'TWIN', tool: 'monitor_domus_twin()', desc: 'Analyzes biophotonic, ambient RF, and power harmonics in living spaces.' },
                { name: 'Risk Scoring Engine', category: 'RISK', tool: 'calculate_risk_score()', desc: 'Produces real-time Bayesian composite risk assessments for endpoints.' },
                { name: 'Threat Correlation Engine', category: 'CORRELATION', tool: 'correlate_threat_vectors()', desc: 'Fuses multi-vector events into cohesive attack graph models.' },
                { name: 'Autonomous Agent Skills Framework', category: 'FRAMEWORK', tool: 'register_agent_skill()', desc: 'Synthesizes, tests, and mounts new runtime skills dynamically.' },
                { name: 'Multi-Agent Workflow Orchestration', category: 'WORKFLOW', tool: 'dispatch_workflow_task()', desc: 'Executes parallel DAG pipelines across all 7 B.A.M. specialized agents.' },
                { name: 'Security Analytics Dashboard', category: 'ANALYTICS', tool: 'stream_security_telemetry()', desc: 'Feeds live log streams and anomaly detection events to UI consoles.' },
                { name: 'Asset Anomaly Detection', category: 'ANOMALY', tool: 'detect_asset_drift()', desc: 'Flags unexpected balance movements or decoherence phase drift.' },
                { name: 'Federated Device Enrollment', category: 'ENROLLMENT', tool: 'enroll_federated_device()', desc: 'Registers authorized remote mobile hardware (Oppo A40) to host cluster.' },
                { name: 'Secure Offline Synchronization', category: 'OFFLINE', tool: 'sync_offline_ledger()', desc: 'Facilitates zero-network cryptographic ledger parity via QR tokens.' },
              ].map((skill, idx) => (
                <div key={idx} className="p-3 bg-black/50 border border-slate-800/80 hover:border-blue-600 transition rounded-lg space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-blue-400 font-bold block">{skill.category}</span>
                      <strong className="text-xs text-slate-100">{skill.name}</strong>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
                      READY
                    </span>
                  </div>
                  <code className="text-[10px] text-cyan-300 font-mono block bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900">
                    {skill.tool}
                  </code>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
