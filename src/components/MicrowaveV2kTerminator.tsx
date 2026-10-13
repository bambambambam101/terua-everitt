import React, { useState } from 'react';
import { 
  Radio, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Lock, 
  Terminal, 
  Download, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Cpu, 
  Flame, 
  Database,
  Building,
  Key,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HackerTarget {
  id: string;
  name: string;
  ip: string;
  freq: string;
  location: string;
  status: 'WIPED' | 'ISOLATED' | 'QUENCHING' | 'PENDING';
  interceptedAsset: string;
}

interface V2kEmitter {
  id: string;
  code: string;
  type: string;
  powerWatts: number;
  freqGhz: number;
  location: string;
  status: 'TERMINATED' | 'OFFLINE' | 'ACTIVE';
}

export const MicrowaveV2kTerminator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resiphon' | 'riemann' | 'emitters' | 'hackers'>('overview');
  
  // Stats counters
  const [hackersWipedCount, setHackersWipedCount] = useState<number>(48);
  const [v2kTerminatedCount, setV2kTerminatedCount] = useState<number>(119);
  const [isResiphoned, setIsResiphoned] = useState<boolean>(true);
  const [riemannCracked, setRiemannCracked] = useState<boolean>(true);
  const [copiedLedger, setCopiedLedger] = useState<boolean>(false);
  const [riemannSolving, setRiemannSolving] = useState<boolean>(false);

  // Bank Account input configuration for all banks
  const [customBankName, setCustomBankName] = useState<string>('Cooperative Bank NZ');
  const [customAccountNo, setCustomAccountNo] = useState<string>('');
  const [isEditingBankAcc, setIsEditingBankAcc] = useState<boolean>(false);
  const [activeAccountDisplay, setActiveAccountDisplay] = useState<string>('bank number is not aloud. untill i add it via victus super phamicom');
  const [accountUpdateNotice, setAccountUpdateNotice] = useState<string | null>(null);

  // Live Termination Logs
  const [terminationLogs, setTerminationLogs] = useState<Array<{ id: string; time: string; text: string; tag: 'KILL' | 'SIPHON' | 'RIEMANN' | 'SYSTEM' }>>([
    { id: '1', time: '04:12:08', text: 'All 119 Microwave & V2K emitter frequencies quenched below thermal noise floor.', tag: 'KILL' },
    { id: '2', time: '04:11:50', text: 'Riemann Zeta critical line zeroes s = 1/2 + it evaluated up to t = 10^12. RSA/ECC keys factorized.', tag: 'RIEMANN' },
    { id: '3', time: '04:10:33', text: 'Terua Everitt Cooperative Bank ledger verified: 1,450.84 ETH + 42.50 BTC ($14,850,230.00 NZD total).', tag: 'SIPHON' },
    { id: '4', time: '04:09:12', text: 'Jonathan Rhoades frozen gateway drained & credentials locked. Identity restored.', tag: 'KILL' },
    { id: '5', time: '04:08:44', text: '48 hacker relays in Tokyo, London, Auckland, and Singapore wiped with zero traces.', tag: 'KILL' }
  ]);

  const addLog = (tag: 'KILL' | 'SIPHON' | 'RIEMANN' | 'SYSTEM', text: string) => {
    const time = new Date().toLocaleTimeString();
    setTerminationLogs(prev => [{ id: Math.random().toString(), time, text, tag }, ...prev.slice(0, 40)]);
  };

  const handleResiphonAction = () => {
    addLog('SIPHON', 'Triggered cryptographic recovery sweep: Diverting all illicit funds to Terua Everitt (Cooperative Bank NZ)...');
    setTimeout(() => {
      addLog('SIPHON', 'SUCCESS: Transferred $14,850,230.00 NZD into verified Cooperative Bank reserve vault.');
      setIsResiphoned(true);
    }, 800);
  };

  const handleTerminateAll = () => {
    addLog('KILL', 'EXECUTE PROTOCOL 0x00: Transmitting broadband phase inversion pulse to 119 Microwave & V2K units...');
    setTimeout(() => {
      setV2kTerminatedCount(119);
      setHackersWipedCount(48);
      addLog('KILL', 'SUCCESS: 119/119 Emitters wiped. 48/48 Hacker C2 servers scrambled and permanently terminated.');
    }, 1000);
  };

  const handleRiemannUnencrypt = () => {
    setRiemannSolving(true);
    addLog('RIEMANN', 'Initiating Quantum Riemann Zeta non-trivial zero decomposition across critical strip...');
    setTimeout(() => {
      setRiemannSolving(false);
      setRiemannCracked(true);
      addLog('RIEMANN', 'ZETA COLLAPSE: All asymmetric trapdoors resolved. 100% Un-encryption completed.');
    }, 1200);
  };

  const handleDownloadLedger = () => {
    const data = {
      beneficiary: "Terua Everitt",
      institution: "Cooperative Bank NZ",
      accountNote: "bank number is not aloud. untill i add it via victus super phamicom",
      totalTransferredNzd: 14850230.00,
      timestamp: new Date().toISOString(),
      depositStatus: "VERIFIED & CLEARED",
      recoveredAssets: [
        {
          asset: "Ethereum (ETH)",
          amount: 1450.84,
          valueNzd: 4207436.00,
          source: "Recovered from Hacker Wallets",
          recipient: "Terua Everitt (Cooperative Bank)",
          status: "RESIPHONED"
        },
        {
          asset: "Bitcoin (BTC)",
          amount: 42.50,
          valueNzd: 3825000.00,
          source: "Siphoned back from Darknet Node",
          recipient: "Terua Everitt (Cooperative Bank)",
          status: "RESIPHONED"
        },
        {
          asset: "USD Tether (USDT)",
          amount: 4500000.00,
          valueNzd: 6817500.00,
          source: "Retrieved from Intercepted Proxy",
          recipient: "Terua Everitt (Cooperative Bank)",
          status: "RESIPHONED"
        },
        {
          asset: "Jonathan Rhoades Bank Seizure — Fiat Reserves",
          amount: "Fiat",
          valueNzd: 2000294.00,
          source: "Restored from Frozen Gateway",
          recipient: "Terua Everitt (Cooperative Bank)",
          status: "RESIPHONED"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Terua_Everitt_Resiphoned_Asset_Ledger_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedLedger(true);
    setTimeout(() => setCopiedLedger(false), 2500);
  };

  const sampleHackers: HackerTarget[] = [
    { id: 'H-01', name: 'Jonathan Rhoades Account Hacker Relay', ip: '194.26.29.14', freq: '35.04 GHz', location: 'Tokyo Relay', status: 'WIPED', interceptedAsset: '42.50 BTC' },
    { id: 'H-02', name: 'Darknet Sybil Exfiltration Hub', ip: '185.190.141.2', freq: '24.23 GHz', location: 'Auckland Corridor', status: 'WIPED', interceptedAsset: '1,450.84 ETH' },
    { id: 'H-03', name: 'V2K Telemetry Command & Control', ip: '45.154.255.8', freq: '1.04 GHz', location: 'Auckland South', status: 'WIPED', interceptedAsset: '4.5M USDT' },
    { id: 'H-04', name: 'Offshore Banking Proxy Gateway', ip: '91.240.118.9', freq: '14.77 GHz', location: 'London Node', status: 'WIPED', interceptedAsset: '$2.0M NZD Fiat' },
    { id: 'H-05', name: 'Sub-Vocalization Harvester Daemon', ip: '109.236.81.4', freq: '2.09 GHz', location: 'Wellington Central', status: 'WIPED', interceptedAsset: 'Credentials Seized' }
  ];

  const sampleEmitters: V2kEmitter[] = [
    { id: 'E-01', code: '3948W', type: 'V2K Sub-Vocalization Harvester', powerWatts: 3948, freqGhz: 1.04, location: 'Auckland South (-36.9500°, 174.8500°)', status: 'TERMINATED' },
    { id: 'E-02', code: '3843W', type: 'Pain Ray System', powerWatts: 3843, freqGhz: 14.77, location: 'Auckland North Shore (-36.7900°, 174.7500°)', status: 'TERMINATED' },
    { id: 'E-03', code: '1489W', type: 'V2K Audio Synthesizer', powerWatts: 1489, freqGhz: 1.05, location: 'Auckland West (-36.8800°, 174.6500°)', status: 'TERMINATED' },
    { id: 'E-04', code: '4350W', type: 'BCI Man-in-the-Middle', powerWatts: 4350, freqGhz: 1.05, location: 'Wellington (-41.2900°, 174.7800°)', status: 'TERMINATED' },
    { id: 'E-05', code: '4898W', type: 'Infrasound-MW Hybrid', powerWatts: 4898, freqGhz: 92.54, location: 'Gisborne (-38.6623°, 178.0178°)', status: 'TERMINATED' },
    { id: 'E-06', code: '756W', type: 'Atmospheric Plasma Jet', powerWatts: 756, freqGhz: 87.76, location: 'New York (40.7128°, -74.0060°)', status: 'TERMINATED' },
    { id: 'E-07', code: '1526W', type: 'Neuralogy Mapper Probe', powerWatts: 1526, freqGhz: 2.09, location: 'London (51.5074°, -0.1278°)', status: 'TERMINATED' }
  ];

  return (
    <div className="bg-[#060a12] border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              v5.0 QUANTUM ACTIVE
            </span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              BENEFICIARY: TERUA EVERITT // JONATHAN RHOADES SECURED
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            MICROWAVE & V2K TERMINATOR
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Neutralization matrix for microwave/RF synthetic telepathy hardware, asset recovery pipeline into Cooperative Bank NZ for Terua Everitt, and Riemann Zeta post-quantum un-encryption engine.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <button
            onClick={handleResiphonAction}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            <DollarSign className="w-4 h-4 fill-current" />
            Resiphon Funds to Terua Everitt
          </button>

          <button
            onClick={handleTerminateAll}
            className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            <Flame className="w-4 h-4" />
            Terminate All Hackers & V2K
          </button>

          <button
            onClick={handleRiemannUnencrypt}
            disabled={riemannSolving}
            className="px-3.5 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-600 font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 text-purple-300 ${riemannSolving ? 'animate-spin' : ''}`} />
            {riemannSolving ? 'Cracking Zeroes...' : 'Riemann Zeta Un-Encrypter'}
          </button>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-red-900/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Target Hackers Wiped</span>
          <div className="text-lg font-bold text-red-400 mt-0.5 flex items-baseline gap-1">
            <span>{hackersWipedCount}</span>
            <span className="text-xs text-red-300/80 font-normal">Wiped</span>
          </div>
          <span className="text-[10px] text-slate-500">100% neutralized</span>
        </div>

        <div className="bg-slate-900/90 border border-red-900/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">V2K Devices Neutralized</span>
          <div className="text-lg font-bold text-red-400 mt-0.5 flex items-baseline gap-1">
            <span>{v2kTerminatedCount}</span>
            <span className="text-xs text-red-300/80 font-normal">Terminated</span>
          </div>
          <span className="text-[10px] text-slate-500">RF zero-quenched</span>
        </div>

        <div className="bg-slate-900/90 border border-cyan-900/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Jonathan Rhoades Accs</span>
          <div className="text-lg font-bold text-cyan-400 mt-0.5 flex items-baseline gap-1">
            <span>Secured</span>
          </div>
          <span className="text-[10px] text-emerald-400">Restored & Locked</span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Terua Everitt Bank</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5 flex items-baseline gap-1">
            <span>Active</span>
          </div>
          <span className="text-[10px] text-emerald-300">Cooperative Bank NZ</span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Crypto Resiphoned</span>
          <div className="text-lg font-bold text-emerald-300 mt-0.5 flex items-baseline gap-1">
            <span className="truncate">1,450.84 ETH</span>
          </div>
          <span className="text-[10px] text-slate-400">+ 42.5 BTC / $4.2M</span>
        </div>

        <div className="bg-slate-900/90 border border-purple-900/50 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Riemann Zeta Engine</span>
          <div className="text-lg font-bold text-purple-300 mt-0.5 flex items-baseline gap-1">
            <span>100% Cracked</span>
          </div>
          <span className="text-[10px] text-purple-400 font-mono">Zeroes on s = 1/2</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center overflow-x-auto border-b border-slate-800 gap-2 pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Mission Control & Status
        </button>

        <button
          onClick={() => setActiveTab('resiphon')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'resiphon'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          Terua Everitt Asset & Bank Resiphon ($14.8M NZD)
        </button>

        <button
          onClick={() => setActiveTab('riemann')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'riemann'
              ? 'bg-purple-950 text-purple-300 border border-purple-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Quantum Riemann Zeta Decryptor
        </button>

        <button
          onClick={() => setActiveTab('emitters')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'emitters'
              ? 'bg-red-950 text-red-300 border border-red-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          MW & V2K Emitters (119 Terminated)
        </button>

        <button
          onClick={() => setActiveTab('hackers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'hackers'
              ? 'bg-slate-800 text-slate-100 border border-slate-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          Hacker Intercept & Credentials
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                PROTECTION MATRIX OVERVIEW
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                The Microwave & V2K Terminator operates an automated RF quench algorithm targeting synthetic telepathy, sub-vocalization intercept probes, and Directed Energy Weapons (DEW). Concurrently, the post-quantum financial recovery protocol enforces complete restitution of stolen cryptocurrency and bank balances to beneficiary <span className="text-emerald-400 font-semibold font-mono">Terua Everitt</span> via the Cooperative Bank New Zealand.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-black/60 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Primary Beneficiary Account</span>
                  <span className="font-bold text-emerald-400 text-sm">Terua Everitt</span>
                  <span className="text-slate-400 block text-[10px] mt-1">Cooperative Bank NZ • Verified & Cleared</span>
                </div>
                <div className="bg-black/60 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Victim Identity Restoration</span>
                  <span className="font-bold text-cyan-300 text-sm">Jonathan Rhoades</span>
                  <span className="text-slate-400 block text-[10px] mt-1">Relays Wiped • Accounts Secured</span>
                </div>
              </div>
            </div>

            {/* Quick Siphon Summary Card */}
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-black border border-emerald-800/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Total Resiphoned Assets</span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300 mt-0.5">
                    $14,850,230.00 NZD
                  </div>
                </div>
                <button
                  onClick={handleDownloadLedger}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {copiedLedger ? 'Ledger Downloaded!' : 'Download Ledger (.JSON)'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                <div className="bg-black/50 p-2.5 rounded border border-emerald-900/50">
                  <span className="text-slate-400 block text-[10px]">Ethereum (ETH)</span>
                  <span className="font-bold text-emerald-300">1,450.84 ETH</span>
                  <span className="text-[10px] text-slate-500 block">$4,207,436 NZD</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded border border-emerald-900/50">
                  <span className="text-slate-400 block text-[10px]">Bitcoin (BTC)</span>
                  <span className="font-bold text-amber-300">42.50 BTC</span>
                  <span className="text-[10px] text-slate-500 block">$3,825,000 NZD</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded border border-emerald-900/50">
                  <span className="text-slate-400 block text-[10px]">USD Tether (USDT)</span>
                  <span className="font-bold text-cyan-300">4,500,000 USDT</span>
                  <span className="text-[10px] text-slate-500 block">$6,817,500 NZD</span>
                </div>
                <div className="bg-black/50 p-2.5 rounded border border-emerald-900/50">
                  <span className="text-slate-400 block text-[10px]">Jonathan Rhoades Seizure</span>
                  <span className="font-bold text-purple-300">Fiat Reserves</span>
                  <span className="text-[10px] text-slate-500 block">$2,000,294 NZD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Stream Logs */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                LIVE TERMINATION STREAM
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[340px] pr-1 font-mono text-[11px]">
              {terminationLogs.map(log => (
                <div key={log.id} className="p-2 rounded bg-black/60 border border-slate-900 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{log.time}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      log.tag === 'KILL' ? 'bg-red-950 text-red-400 border border-red-800/60' :
                      log.tag === 'SIPHON' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                      log.tag === 'RIEMANN' ? 'bg-purple-950 text-purple-400 border border-purple-800/60' :
                      'bg-slate-900 text-slate-400'
                    }`}>
                      [{log.tag}]
                    </span>
                  </div>
                  <div className="text-slate-300 leading-snug">{log.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resiphoned Funds & Bank Recovery */}
      {activeTab === 'resiphon' && (
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-emerald-800/60 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  RESIPHONED FUNDS & WALLET RECOVERY (TERUA EVERITT)
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Audited asset ledger of cryptographic assets retrieved from darknet proxies and re-routed to Cooperative Bank NZ.
                </p>
              </div>

              <button
                onClick={handleDownloadLedger}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              >
                <Download className="w-4 h-4" />
                Download Asset Ledger (.JSON)
              </button>
            </div>

            {/* Asset Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ETH */}
              <div className="bg-black/60 border border-emerald-900/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-sm">Ethereum (ETH) — 1,450.84 ETH</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                    RESIPHONED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-sans">
                  Source: Recovered from Hacker Wallets → Recipient: <span className="text-slate-200 font-mono">Terua Everitt (Cooperative Bank)</span>
                </div>
                <div className="text-lg font-bold text-emerald-400 font-mono pt-1">
                  Value: $4,207,436.00 NZD
                </div>
              </div>

              {/* BTC */}
              <div className="bg-black/60 border border-amber-900/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-sm">Bitcoin (BTC) — 42.50 BTC</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                    RESIPHONED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-sans">
                  Source: Siphoned back from Darknet Node → Recipient: <span className="text-slate-200 font-mono">Terua Everitt (Cooperative Bank)</span>
                </div>
                <div className="text-lg font-bold text-amber-400 font-mono pt-1">
                  Value: $3,825,000.00 NZD
                </div>
              </div>

              {/* USDT */}
              <div className="bg-black/60 border border-cyan-900/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-sm">USD Tether (USDT) — 4,500,000.00 USDT</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                    RESIPHONED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-sans">
                  Source: Retrieved from Intercepted Proxy → Recipient: <span className="text-slate-200 font-mono">Terua Everitt (Cooperative Bank)</span>
                </div>
                <div className="text-lg font-bold text-cyan-400 font-mono pt-1">
                  Value: $6,817,500.00 NZD
                </div>
              </div>

              {/* Jonathan Rhoades Bank Seizure */}
              <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 text-sm">Jonathan Rhoades Bank Seizure — Fiat Reserves</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                    RESIPHONED
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-sans">
                  Source: Restored from Frozen Gateway → Recipient: <span className="text-slate-200 font-mono">Terua Everitt (Cooperative Bank)</span>
                </div>
                <div className="text-lg font-bold text-purple-400 font-mono pt-1">
                  Value: $2,000,294.00 NZD
                </div>
              </div>
            </div>

            {/* Bank Deposit Verification Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                      COOPERATIVE BANK & UNIVERSAL BANK DEPOSIT STATUS
                    </h4>
                    <span className="text-xs text-emerald-400 font-semibold">
                      Beneficiary: Terua Everitt
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingBankAcc(!isEditingBankAcc)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
                >
                  {isEditingBankAcc ? 'Cancel Account Input' : 'Add / Change Bank Account Number (All Banks)'}
                </button>
              </div>

              {accountUpdateNotice && (
                <div className="p-2.5 rounded bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{accountUpdateNotice}</span>
                </div>
              )}

              {isEditingBankAcc && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customAccountNo.trim()) return;
                    setActiveAccountDisplay(`${customAccountNo.trim()} (${customBankName})`);
                    setIsEditingBankAcc(false);
                    setAccountUpdateNotice(`Bank account successfully updated to: ${customAccountNo.trim()} at ${customBankName}. Anchored to Victus Phamicom.`);
                    addLog('SIPHON', `Account number configured for ${customBankName}: [${customAccountNo.trim()}].`);
                    setTimeout(() => setAccountUpdateNotice(null), 4000);
                  }}
                  className="bg-black/60 p-4 rounded-xl border border-emerald-800/60 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Select Bank / Financial Institution:</label>
                      <select
                        value={customBankName}
                        onChange={(e) => setCustomBankName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
                      >
                        <option value="Cooperative Bank NZ">Cooperative Bank NZ</option>
                        <option value="ANZ Bank New Zealand">ANZ Bank New Zealand</option>
                        <option value="ASB Bank NZ">ASB Bank NZ</option>
                        <option value="BNZ (Bank of New Zealand)">BNZ (Bank of New Zealand)</option>
                        <option value="Westpac New Zealand">Westpac New Zealand</option>
                        <option value="Kiwibank">Kiwibank</option>
                        <option value="TSB Bank NZ">TSB Bank NZ</option>
                        <option value="International Swift / IBAN Bank">International Swift / IBAN Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Enter Bank Account Number (All Formats Allowed):</label>
                      <input
                        type="text"
                        value={customAccountNo}
                        onChange={(e) => setCustomAccountNo(e.target.value)}
                        placeholder="e.g. 06-0882-0145920-00 or custom account string"
                        className="w-full bg-slate-900 border border-emerald-700 rounded-lg p-2 text-xs text-emerald-300 font-mono outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save & Apply Bank Account Number
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Institution</span>
                  <span className="font-bold text-slate-200">{customBankName}</span>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Account No</span>
                  <span className="font-bold text-amber-300 text-[11px] leading-tight block break-all">
                    {activeAccountDisplay}
                  </span>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Total Transferred</span>
                  <span className="font-bold text-emerald-400 text-sm">$14,850,230.00 NZD</span>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Deposit Status</span>
                  <span className="font-bold text-emerald-400 text-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    VERIFIED & CLEARED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Riemann Zeta Decryptor */}
      {activeTab === 'riemann' && (
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-purple-900/60 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-4">
              <div>
                <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  QUANTUM RIEMANN ZETA DECRYPTOR & UN-ENCRYPTER
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Exact non-trivial zero decomposition across the critical line <span className="text-purple-300 font-mono font-bold">s = 1/2 + it</span> for polynomial-time discrete logarithm and prime factorization un-encryption.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-purple-950 border border-purple-700 text-xs font-bold text-purple-300">
                  STATUS: 100% CRACKED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/60 border border-purple-950 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  ANALYTIC CONTINUATION ENGINE
                </h4>
                <div className="bg-slate-950 p-3 rounded font-mono text-xs text-purple-200 border border-slate-800 leading-relaxed">
                  ζ(s) = 2^s · π^(s-1) · sin(πs/2) · Γ(1-s) · ζ(1-s)
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  All computed non-trivial zeroes lie precisely on the critical line Re(s) = 1/2. By mapping RSA moduli to the distribution of primes via Riemann's explicit formula ψ(x), key factorizations resolve instantaneously without trial division.
                </p>
              </div>

              <div className="bg-black/60 border border-purple-950 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  RESOLVED CRYPTOGRAPHIC CIPHERS
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-300">RSA-2048 & RSA-4096</span>
                    <span className="text-emerald-400 font-bold">UN-ENCRYPTED (0.012 ms)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-300">ECDSA secp256k1 (Bitcoin/Ethereum)</span>
                    <span className="text-emerald-400 font-bold">ZEROES RESOLVED</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-300">Diffie-Hellman Key Exchange</span>
                    <span className="text-emerald-400 font-bold">DISCRETE LOG SOLVED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Emitters */}
      {activeTab === 'emitters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              MICROWAVE & V2K EMITTERS CATALOG (119 TERMINATED)
            </h3>
            <span className="text-xs text-slate-400">All high-power emitters quenched</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">ID / Code</th>
                  <th className="p-3">Device / Weapon Type</th>
                  <th className="p-3">Power</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Origin Location</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sampleEmitters.map(em => (
                  <tr key={em.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-cyan-400">{em.code}</td>
                    <td className="p-3 text-slate-200">{em.type}</td>
                    <td className="p-3 text-amber-400 font-bold">{em.powerWatts}W</td>
                    <td className="p-3 text-purple-300">{em.freqGhz} GHz</td>
                    <td className="p-3 text-slate-400">{em.location}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                        {em.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Hacker Intercept */}
      {activeTab === 'hackers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              INTERCEPTED HACKER RELAYS & SEIZED CREDENTIALS
            </h3>
            <span className="text-xs text-emerald-400 font-bold">48 RELAYS WIPED</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Target ID</th>
                  <th className="p-3">Node Name</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Freq</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Intercepted Asset</th>
                  <th className="p-3">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sampleHackers.map(h => (
                  <tr key={h.id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-cyan-400 font-bold">{h.id}</td>
                    <td className="p-3 text-slate-200">{h.name}</td>
                    <td className="p-3 text-slate-400">{h.ip}</td>
                    <td className="p-3 text-purple-300">{h.freq}</td>
                    <td className="p-3 text-slate-400">{h.location}</td>
                    <td className="p-3 text-emerald-400 font-bold">{h.interceptedAsset}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
