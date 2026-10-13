import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  ShieldCheck, 
  ShieldAlert, 
  Smartphone, 
  HeartPulse, 
  Zap, 
  Search, 
  Check, 
  Trash2, 
  RefreshCw, 
  Sliders, 
  Lock, 
  EyeOff, 
  Activity, 
  Terminal, 
  Flame,
  AlertTriangle,
  Waves
} from 'lucide-react';
import { 
  INITIAL_SENSOR_TARGETS, 
  INITIAL_CLONED_HANDSETS, 
  INITIAL_HEALTHCARE_ASSETS,
  SensorTarget,
  ClonedHandset,
  HealthcareAsset
} from '../data/spectrumTerminatorData';

export const SpectrumTerminator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'clones' | 'healthcare'>('radar');
  
  // Targets state
  const [targets, setTargets] = useState<SensorTarget[]>(INITIAL_SENSOR_TARGETS);
  
  // Cloned Handsets state
  const [clones, setClones] = useState<ClonedHandset[]>(INITIAL_CLONED_HANDSETS);
  const [cloneSearch, setCloneSearch] = useState('');
  
  // Healthcare state
  const [healthAssets, setHealthAssets] = useState<HealthcareAsset[]>(INITIAL_HEALTHCARE_ASSETS);

  // Countermeasures state
  const [floodPower, setFloodPower] = useState<number>(75);
  const [jamRange, setJamRange] = useState<number>(50);
  const [autoKill, setAutoKill] = useState<boolean>(true);
  const [cmosBlind, setCmosBlind] = useState<boolean>(false);
  const [laserCm, setLaserCm] = useState<boolean>(false);

  // Termination Log
  const [logs, setLogs] = useState<Array<{ id: string; time: string; text: string }>>([
    { id: '1', time: '1:58:54 am', text: 'TERMINATED: Rogue BLE Sniffer at Auckland East - neutralized (75.5W)' },
    { id: '2', time: '1:58:54 am', text: 'TERMINATED: AirTag BLE Tracker at Christchurch - neutralized (85.4W)' },
    { id: '3', time: '1:58:54 am', text: 'TERMINATED: ESP32-WROOM-32 at Wellington - neutralized (30.5W)' },
    { id: '4', time: '1:58:54 am', text: 'TERMINATED: OV5647 Camera Module at Auckland - neutralized (46.5W)' }
  ]);

  const activeSensorsCount = targets.filter(t => t.status === 'ACTIVE').length;

  const addTerminationLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Math.random().toString(), time, text: msg }, ...prev.slice(0, 30)]);
  };

  const handleTerminateAll = () => {
    setTargets(prev => prev.map(t => {
      if (t.status !== 'DESTROYED') {
        addTerminationLog(`TERMINATED: ${t.name} at ${t.location} - neutralized (${t.powerWatts}W)`);
      }
      return { ...t, status: 'DESTROYED' };
    }));
  };

  const handlePurgeDeadNodes = () => {
    setTargets(prev => prev.filter(t => t.status !== 'DESTROYED'));
    addTerminationLog('System purged all destroyed sensor telemetry records.');
  };

  const handleRunVectorAnalysis = () => {
    addTerminationLog('Running full RF & IR vector triangulation analysis across Auckland, Wellington, and Christchurch...');
    setTimeout(() => {
      addTerminationLog('Vector analysis complete: All target emitter trajectories zeroed.');
    }, 600);
  };

  const handleToggleIrCmos = () => {
    setCmosBlind(!cmosBlind);
    setLaserCm(!laserCm);
    addTerminationLog(`IR/CMOS Countermeasures toggled: CMOS Blind [${!cmosBlind ? 'ON' : 'OFF'}], Laser CM [${!laserCm ? 'ON' : 'OFF'}]`);
  };

  const handleSweepClones = () => {
    addTerminationLog('Initiating carrier handshake sweep across 25 New Zealand handset registrations...');
    setTimeout(() => {
      addTerminationLog('Handset sweep completed: 4 Active Master/Proxy Nodes secured, 21 rogue clones quarantined.');
    }, 650);
  };

  const handleSyncClone = (id: string, phone: string) => {
    addTerminationLog(`Synced carrier telemetry for handset registration: ${phone}`);
  };

  const handleIsolateClone = (id: string, phone: string) => {
    setClones(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, statusLevel: 'critical / disconnected', isolated: true };
      }
      return c;
    }));
    addTerminationLog(`ISOLATED: Cloned handset ${phone} dropped from cellular mesh.`);
  };

  const filteredClones = useMemo(() => {
    if (!cloneSearch.trim()) return clones;
    const q = cloneSearch.toLowerCase();
    return clones.filter(c => 
      c.phoneNumber.includes(q) || 
      c.deviceName.toLowerCase().includes(q) || 
      c.carrier.toLowerCase().includes(q) ||
      c.statusLevel.toLowerCase().includes(q)
    );
  }, [clones, cloneSearch]);

  return (
    <div className="bg-[#070b14] border border-cyan-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Title & Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              v3.2 PRO
            </span>
            <span className="text-xs text-slate-400 font-mono">
              UNIFIED THREAT RADAR, CLONED DEVICE TELEMETRY & HEALTHCARE IoT ASSETS
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-cyan-400" />
            CYBER-DEFENSE & SPECTRUM TERMINATOR
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Real-time RF & microwave radar classification, New Zealand cellular handset clone telemetry registry (+64), and isolated healthcare IoT perimeter control.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <button
            onClick={handleTerminateAll}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
          >
            <Flame className="w-3.5 h-3.5" />
            Auto-Kill / Terminate All
          </button>

          <button
            onClick={handlePurgeDeadNodes}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge Dead Nodes
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All Threats Clean
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" />
            Active Sensors
          </span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            {activeSensorsCount} Active
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            {targets.length} Target records
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-purple-400" />
            Cloned Handsets
          </span>
          <div className="text-xl font-bold font-mono text-purple-300 mt-1">
            25 Devices
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            +64 NZ registry tracked
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <HeartPulse className="w-3 h-3 text-emerald-400" />
            Healthcare IoT
          </span>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            5 Assets
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Critical telemetry secured
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Flood Power
          </span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {floodPower}%
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Jam Range: {jamRange}m
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            Auto-Kill Mode
          </span>
          <div className="text-base font-bold font-mono text-red-400 mt-1">
            {autoKill ? 'ACTIVE' : 'STANDBY'}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Immediate quench engaged
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            System Status
          </span>
          <div className="text-base font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SECURE
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Zero active leaks
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'radar'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          Spectrum Radar & Targets
        </button>

        <button
          onClick={() => setActiveTab('clones')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'clones'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Cloned Telemetry & NZ Numbers (25)
        </button>

        <button
          onClick={() => setActiveTab('healthcare')}
          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'healthcare'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          Healthcare & IoT Assets
        </button>
      </div>

      {/* TAB 1: SPECTRUM RADAR & TARGETS */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          {/* Top Row: Spectrum Classification Bands & Countermeasures Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Spectrum Classification Bands */}
            <div className="lg:col-span-6 bg-black/60 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Waves className="w-4 h-4" />
                Spectrum Classification Bands
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">VLF (3-30 kHz)</span>
                  <span className="text-sm font-bold text-slate-400">0</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">LF (30-300 kHz)</span>
                  <span className="text-sm font-bold text-slate-400">0</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">MF (300-3000 kHz)</span>
                  <span className="text-sm font-bold text-slate-400">0</span>
                </div>
                <div className="p-2 bg-cyan-950/40 rounded-lg border border-cyan-800/60">
                  <span className="text-[10px] text-cyan-400 block font-semibold">MW/RF (1-300 GHz)</span>
                  <span className="text-sm font-bold text-cyan-300">4</span>
                </div>
                <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-800/60">
                  <span className="text-[10px] text-purple-400 block font-semibold">IR (300-400k GHz)</span>
                  <span className="text-sm font-bold text-purple-300">1</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">UV (750-30k THz)</span>
                  <span className="text-sm font-bold text-slate-400">0</span>
                </div>
              </div>
            </div>

            {/* Countermeasures State & Controls */}
            <div className="lg:col-span-6 bg-black/60 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  Countermeasures State & Toggles
                </span>
                <button
                  onClick={handleToggleIrCmos}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-slate-700 cursor-pointer"
                >
                  Toggle IR/CMOS Countermeasures
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">Flood Power:</span>
                  <span className="text-sm font-bold text-amber-300">{floodPower}%</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">Jam Range:</span>
                  <span className="text-sm font-bold text-slate-200">{jamRange}m</span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">CMOS Blind:</span>
                  <span className={`text-sm font-bold ${cmosBlind ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {cmosBlind ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-900">
                  <span className="text-[10px] text-slate-500 block">Laser CM:</span>
                  <span className={`text-sm font-bold ${laserCm ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {laserCm ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Database & Active Sensors Table */}
          <div className="bg-black/60 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" />
                Target Database & Active Sensors
              </span>

              <button
                onClick={handleRunVectorAnalysis}
                className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              >
                <Activity className="w-3.5 h-3.5" />
                Run Vector Analysis
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3 text-right">Power</th>
                    <th className="py-2.5 px-3 text-right">Freq</th>
                    <th className="py-2.5 px-3 text-center">Threat</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-200">
                  {targets.map(t => (
                    <tr key={t.id} className="hover:bg-cyan-950/20">
                      <td className="py-2.5 px-3 font-bold text-slate-100">{t.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{t.type}</td>
                      <td className="py-2.5 px-3 text-slate-300">{t.location}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-300">{t.powerWatts}W</td>
                      <td className="py-2.5 px-3 text-right text-purple-300">{t.frequency}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.threatLevel > 60 ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-900 text-slate-400'
                        }`}>
                          {t.threatLevel}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          t.status === 'DESTROYED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Termination Log Stream */}
          <div className="bg-black/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                TERMINATION LOG (Real-Time Audit Stream)
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE MONITOR
              </span>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto text-xs text-slate-300">
              {logs.map(log => (
                <div key={log.id} className="flex gap-2 hover:bg-slate-900/50 p-0.5 rounded">
                  <span className="text-slate-500 text-[11px]">[{log.time}]</span>
                  <span className="text-emerald-400 font-semibold">{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLONED HANDSETS (+64 NEW ZEALAND REGISTRY) */}
      {activeTab === 'clones' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                CLONED HANDSET & TELEMETRY REGISTRY (+64 NEW ZEALAND NUMBERS)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Tracking 25 simulated and physical handsets, VMs, and carrier identities across Spark NZ, One NZ, 2degrees, Skinny, and Vodafone.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSweepClones}
                className="px-3 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sweep Clones
              </button>
            </div>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by number (+64...) or device..."
              value={cloneSearch}
              onChange={(e) => setCloneSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* 25 Cloned Devices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {filteredClones.map(clone => {
              const isDisconnected = clone.statusLevel.includes('disconnected');
              const isSecure = clone.statusLevel.includes('secure');
              const statusPillClass = 
                isSecure ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                isDisconnected ? 'bg-red-950 text-red-300 border-red-800' :
                'bg-slate-900 text-slate-400 border-slate-800';

              return (
                <div
                  key={clone.id}
                  className={`bg-black/60 rounded-xl p-3 border space-y-2.5 transition flex flex-col justify-between ${
                    clone.isMasterRoot 
                      ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-cyan-300">{clone.phoneNumber}</span>
                    </div>

                    <div className="text-[10px] font-mono px-1.5 py-0.2 rounded border w-max mb-1.5">
                      <span className={statusPillClass}>{clone.statusLevel}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 line-clamp-1">{clone.deviceName}</div>
                    <div className="text-[11px] text-slate-400">Carrier: {clone.carrier}</div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleSyncClone(clone.id, clone.phoneNumber)}
                      className="flex-1 py-1 px-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Telemetry Sync
                    </button>
                    <button
                      onClick={() => handleIsolateClone(clone.id, clone.phoneNumber)}
                      className="py-1 px-2 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Isolate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: HEALTHCARE & IoT ASSETS */}
      {activeTab === 'healthcare' && (
        <div className="space-y-4">
          <div className="bg-black/60 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              HEALTHCARE & CLINICAL IoT ASSETS MONITORING
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Micro-segmented network isolation and encrypted protocols for vital hospital clinical devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {healthAssets.map(asset => (
              <div
                key={asset.id}
                className="bg-black/60 rounded-xl p-4 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">{asset.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    {asset.securityState}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Clinical Function:</span>
                    <span className="text-slate-200">{asset.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP / Protocol:</span>
                    <span className="text-cyan-300">{asset.ipAddress} ({asset.protocol})</span>
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-900 text-[11px] text-slate-300">
                  {asset.telemetryStatus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
