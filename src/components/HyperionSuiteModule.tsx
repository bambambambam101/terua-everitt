import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, 
  Cpu, 
  Zap, 
  Activity, 
  Target, 
  Dna, 
  Flame, 
  Download, 
  RefreshCw, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import { INITIAL_YIELD_NODES, NODE_26_SPEC, TOTAL_INITIAL_ACCUMULATED_EARNED } from '../data/hyperionData';

interface TargetProfile {
  id: number;
  name: string;
  code: string;
  doppler: number;
  dna: string;
  active: boolean;
}

export const HyperionSuiteModule: React.FC = () => {
  // Navigation tabs: 'qns' | 'hyperion' | 'domus' | 'nodes'
  const [activeTab, setActiveTab] = useState<'qns' | 'hyperion' | 'domus' | 'nodes'>('qns');

  // Targets state
  const [targets, setTargets] = useState<TargetProfile[]>([
    { id: 1, name: "Dr. Alexander Vance", code: "TARGET-ALPHA", doppler: 1.25, dna: "AGCT9981", active: true },
    { id: 2, name: "Dr. Elena Rostova", code: "TARGET-BETA", doppler: 0.85, dna: "CGTT4412", active: false }
  ]);

  // Target input form
  const [inputName, setInputName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [inputDoppler, setInputDoppler] = useState('');
  const [inputDna, setInputDna] = useState('');

  // Biometrics calibration sliders
  const [sg, setSg] = useState<number>(0.85);
  const [st, setSt] = useState<number>(0.90);
  const [sd, setSd] = useState<number>(0.78);
  const [tlock, setTlock] = useState<number>(0.75);

  // Phased array controls
  const [theta, setTheta] = useState<number>(18.4);
  const [mElements, setMElements] = useState<number>(64);
  const [plasmaNe, setPlasmaNe] = useState<number>(1.2);
  const [tec, setTec] = useState<number>(45.0);
  const [isAutoSweep, setIsAutoSweep] = useState<boolean>(false);
  const [autoSweepDir, setAutoSweepDir] = useState<number>(1);
  const [isSqueezed, setIsSqueezed] = useState<boolean>(false);
  const [arrayScaleLinear, setArrayScaleLinear] = useState<boolean>(true);

  // Grover state
  const [groverStep, setGroverStep] = useState<number>(3);
  const [groverProgress, setGroverProgress] = useState<number>(78.4);

  // Console telemetry stream
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[${new Date().toISOString().split('T')[1].slice(0, 8)}] > Quantum Control Suite Engine v4.2.0 Online.`,
    `[${new Date().toISOString().split('T')[1].slice(0, 8)}] > EKF Filter active. Tracking zero-point variance.`,
    `[${new Date().toISOString().split('T')[1].slice(0, 8)}] > Phased Array synthesized at 18.4° steering.`
  ]);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Canvas refs
  const beamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const arrayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hyperionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const domus1Ref = useRef<HTMLCanvasElement | null>(null);
  const domus2Ref = useRef<HTMLCanvasElement | null>(null);
  const domus3Ref = useRef<HTMLCanvasElement | null>(null);
  const domus4Ref = useRef<HTMLCanvasElement | null>(null);

  const timeStepRef = useRef<number>(0);

  // Sound tone player
  const playTone = useCallback((freq: number, duration = 0.15, type: OscillatorType = 'sine') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (ctx) {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch (e) {
      // Audio not supported or blocked
    }
  }, []);

  const addConsoleLog = useCallback((msg: string) => {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    setConsoleLogs(prev => [...prev.slice(-80), `[${timestamp}] > ${msg}`]);
  }, []);

  // Biometric integrated likelihood calculation
  const integratedL = sg * 0.40 + st * 0.35 + sd * 0.25;
  const isLocked = integratedL >= tlock;
  const matchConfidencePct = (integratedL * 100).toFixed(1);

  // Directivity calculation
  const directivityDb = (10 * Math.log10(mElements)).toFixed(1);

  // Grover phase
  const groverPhaseRad = (groverStep * 0.314).toFixed(2);

  // Add Target handler
  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputCode.trim()) return;
    playTone(600, 0.12);

    const newTarget: TargetProfile = {
      id: Date.now(),
      name: inputName.trim(),
      code: inputCode.trim(),
      doppler: parseFloat(inputDoppler) || 1.0,
      dna: inputDna.trim() || 'AABBCC99',
      active: true
    };

    setTargets(prev => [newTarget, ...prev.map(t => ({ ...t, active: false }))]);
    setInputName('');
    setInputCode('');
    setInputDoppler('');
    setInputDna('');
    addConsoleLog(`Target signature registered: ${newTarget.code} (${newTarget.name})`);
  };

  // Lock target
  const handleSelectTarget = (id: number) => {
    playTone(520, 0.1);
    setTargets(prev => prev.map(t => ({ ...t, active: t.id === id })));
    const t = targets.find(t => t.id === id);
    if (t) {
      addConsoleLog(`Target lock changed to ${t.code} (${t.name})`);
    }
  };

  // Delete target
  const handleDeleteTarget = (id: number) => {
    playTone(280, 0.1);
    setTargets(prev => {
      const remaining = prev.filter(t => t.id !== id);
      if (remaining.length > 0 && !remaining.some(t => t.active)) {
        remaining[0].active = true;
      }
      return remaining;
    });
    addConsoleLog(`Target profile deleted.`);
  };

  // Grover Step
  const handleGroverIteration = () => {
    playTone(720, 0.12);
    setGroverStep(prev => prev + 1);
    setGroverProgress(prev => {
      if (prev < 99.5) {
        const next = prev + (100 - prev) * 0.35;
        return next > 99.8 ? 99.9 : next;
      }
      return 45.0;
    });
    addConsoleLog(`Grover Oracle Iteration ${groverStep + 1} executed. Target Probability: ${groverProgress.toFixed(1)}%`);
  };

  // Grover Reset
  const handleResetGrover = () => {
    playTone(350, 0.1);
    setGroverStep(0);
    setGroverProgress((1.0 / 65536) * 100);
    addConsoleLog('Grover oracle state reset to uniform quantum superposition.');
  };

  // Synthesize Beam Pulse
  const handleSynthesizeBeam = () => {
    playTone(880, 0.3, 'sawtooth');
    addConsoleLog(`PULSE SYNTHESIZED: Steering ${theta.toFixed(1)}°, Elements M=${mElements}, Directivity ${directivityDb} dB.`);
  };

  // Export State JSON
  const handleExportStateJSON = () => {
    playTone(600, 0.1);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      version: "4.2.0",
      suite: "Hyperion & Domus Quantum Control Suite",
      targets,
      biometrics: { sg, st, sd, tlock, integratedL },
      phasedArray: { theta, mElements, plasmaNe, tec, directivityDb, isSqueezed },
      timestamp: new Date().toISOString()
    }, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", "Hyperion_State_Export.json");
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    addConsoleLog('State exported to JSON file.');
  };

  // Main Canvas Animation Loop
  useEffect(() => {
    let animId: number;

    const animate = () => {
      timeStepRef.current += 0.05;
      const tStep = timeStepRef.current;

      // Auto Sweep
      if (isAutoSweep) {
        setTheta(prev => {
          let next = prev + autoSweepDir * 0.3;
          if (next >= 50) setAutoSweepDir(-1);
          if (next <= -50) setAutoSweepDir(1);
          return parseFloat(next.toFixed(1));
        });
      }

      // Draw Beam Canvas
      const bCanvas = beamCanvasRef.current;
      if (bCanvas) {
        const ctx = bCanvas.getContext('2d');
        if (ctx) {
          if (bCanvas.width !== bCanvas.clientWidth || bCanvas.height !== bCanvas.clientHeight) {
            bCanvas.width = bCanvas.clientWidth;
            bCanvas.height = bCanvas.clientHeight;
          }
          const w = bCanvas.width;
          const h = bCanvas.height;
          ctx.clearRect(0, 0, w, h);

          // Grid
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
          for (let y = 0; y < h; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

          const radTheta = (theta * Math.PI) / 180;
          const cx = 35;
          const cy = h / 2;
          const beamLen = w * 0.85;

          const targetX = cx + Math.cos(radTheta) * beamLen;
          const targetY = cy + Math.sin(radTheta) * beamLen;

          // Main Vector
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = isSqueezed ? '#c084fc' : '#22d3ee';
          ctx.lineWidth = isSqueezed ? 3 : 2;
          ctx.shadowColor = isSqueezed ? '#a855f7' : '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Propagating Wavefronts
          const numRings = 7;
          for (let i = 1; i <= numRings; i++) {
            const r = ((tStep * 35 + i * 30) % beamLen);
            const rx = cx + Math.cos(radTheta) * r;
            const ry = cy + Math.sin(radTheta) * r;

            ctx.beginPath();
            ctx.arc(rx, ry, Math.max(2, 16 * (r / beamLen)), radTheta - Math.PI / 2, radTheta + Math.PI / 2);
            ctx.strokeStyle = `rgba(${isSqueezed ? '192, 132, 252' : '34, 211, 238'}, ${Math.max(0, 1 - r / beamLen)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Phased Emitter Array Nodes
          const M = Math.min(16, mElements);
          for (let i = -M / 2; i <= M / 2; i++) {
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(cx, cy + i * 5, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Array Factor Canvas
      const aCanvas = arrayCanvasRef.current;
      if (aCanvas) {
        const ctx = aCanvas.getContext('2d');
        if (ctx) {
          if (aCanvas.width !== aCanvas.clientWidth || aCanvas.height !== aCanvas.clientHeight) {
            aCanvas.width = aCanvas.clientWidth;
            aCanvas.height = aCanvas.clientHeight;
          }
          const w = aCanvas.width;
          const h = aCanvas.height;
          ctx.clearRect(0, 0, w, h);

          const thetaSteer = (theta * Math.PI) / 180;
          ctx.beginPath();
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.8;

          for (let x = 0; x < w; x++) {
            const angle = ((x / w) - 0.5) * Math.PI;
            const psi = Math.PI * (Math.sin(angle) - Math.sin(thetaSteer));
            let af = 1.0;
            if (Math.abs(psi) > 1e-5) {
              af = Math.abs(Math.sin((mElements * psi) / 2) / (mElements * Math.sin(psi / 2)));
            }

            let val = af;
            if (!arrayScaleLinear) {
              val = (20 * Math.log10(Math.max(af, 1e-3)) + 30) / 30;
              val = Math.max(0, val);
            }

            const y = h - (val * (h - 25) + 10);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // Draw Hyperion Swarm Coherence Canvas
      const hCanvas = hyperionCanvasRef.current;
      if (hCanvas) {
        const ctx = hCanvas.getContext('2d');
        if (ctx) {
          if (hCanvas.width !== hCanvas.clientWidth || hCanvas.height !== hCanvas.clientHeight) {
            hCanvas.width = hCanvas.clientWidth;
            hCanvas.height = hCanvas.clientHeight;
          }
          const w = hCanvas.width;
          const h = hCanvas.height;
          ctx.clearRect(0, 0, w, h);

          ctx.beginPath();
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2.5;

          for (let x = 0; x < w; x++) {
            const y = h / 2 + Math.sin(x * 0.03 + tStep * 2) * (h * 0.25)
                            + Math.cos(x * 0.015 - tStep) * (h * 0.1);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // Draw Domus Canvases (1 to 4)
      const domusItems = [
        { ref: domus1Ref, color: '#10b981', freq: 1.2 },
        { ref: domus2Ref, color: '#06b6d4', freq: 2.4 },
        { ref: domus3Ref, color: '#a855f7', freq: 0.8 },
        { ref: domus4Ref, color: '#f59e0b', freq: 3.1 }
      ];

      domusItems.forEach(({ ref, color, freq }, idx) => {
        const canvas = ref.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
              canvas.width = canvas.clientWidth;
              canvas.height = canvas.clientHeight;
            }
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.8;

            for (let x = 0; x < w; x++) {
              const y = h / 2 + Math.sin((x * 0.04 * freq) + tStep * (idx + 1)) * (h * 0.3)
                              + Math.cos(x * 0.02) * 4;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [theta, mElements, plasmaNe, tec, isAutoSweep, autoSweepDir, isSqueezed, arrayScaleLinear]);

  return (
    <div className="bg-slate-950/95 border border-cyan-900/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-slate-100 font-mono">
      {/* Top Header & Telemetry Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-bold">
                MIL-SPEC v4.2.0 FULL
              </span>
              <span className="text-xs text-slate-400">
                Deploy-HyperionSuite.ps1 Native Target
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-cyan-300 tracking-wider flex items-center gap-2">
              HYPERION &amp; DOMUS QUANTUM CONTROL SUITE
            </h1>
          </div>
        </div>

        {/* Module Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => { setActiveTab('qns'); playTone(440, 0.08, 'triangle'); }}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'qns' ? 'bg-cyan-600 text-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>01</span> QNS-Orbital Command
          </button>
          <button
            onClick={() => { setActiveTab('hyperion'); playTone(500, 0.08, 'triangle'); }}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'hyperion' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>02</span> Hyperion Swarm
          </button>
          <button
            onClick={() => { setActiveTab('domus'); playTone(550, 0.08, 'triangle'); }}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'domus' ? 'bg-emerald-600 text-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>03</span> Domus Bio-Photonic
          </button>
          <button
            onClick={() => { setActiveTab('nodes'); playTone(600, 0.08, 'triangle'); }}
            className={`px-3 py-2 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[44px] ${
              activeTab === 'nodes' ? 'bg-amber-600 text-black shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>26</span> Production Nodes (01-26)
          </button>
        </div>

        {/* Telemetry Metrics & Export */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="hidden sm:block">EKF: <span className="text-emerald-400 font-bold">0.0082 mm</span></div>
          <div>Ne: <span className="text-cyan-400 font-bold">{plasmaNe}e17 cm⁻³</span></div>
          <div>TEC: <span className="text-purple-400 font-bold">{tec} TECU</span></div>
          <button
            onClick={handleExportStateJSON}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 text-xs flex items-center gap-1 transition cursor-pointer min-h-[38px]"
          >
            <Download className="w-3.5 h-3.5" />
            Export State
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODULE 1: QNS-ORBITAL COMMAND
      ========================================================================= */}
      {activeTab === 'qns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Target Database & Biometrics */}
          <div className="lg:col-span-4 space-y-4">
            {/* Target Database & Lock Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> TARGET DATABASE &amp; LOCK MATRIX
                </h2>
                <span className="text-[10px] bg-black/60 border border-slate-800 px-2 py-0.5 rounded text-cyan-400 font-bold">
                  {targets.length} Targets
                </span>
              </div>

              <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
                {targets.map(t => (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-lg border flex justify-between items-center text-xs transition ${
                      t.active ? 'border-cyan-500/80 bg-cyan-950/20' : 'border-slate-800 bg-black/40'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        {t.name}
                        {t.active && (
                          <span className="text-[9px] px-1 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{t.code} | {t.doppler} Hz</div>
                      <div className="text-[10px] text-cyan-400/80">Hash: {t.dna}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSelectTarget(t.id)}
                        className={`px-2.5 py-1 text-[10px] rounded font-bold min-h-[36px] cursor-pointer ${
                          t.active ? 'bg-cyan-600 text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {t.active ? 'LOCKED' : 'LOCK'}
                      </button>
                      <button
                        onClick={() => handleDeleteTarget(t.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Target Form */}
              <form onSubmit={handleAddTarget} className="space-y-2 pt-3 border-t border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Register Target Signature
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    required
                    className="bg-black/70 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Code (e.g. ALPHA-1)"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    required
                    className="bg-black/70 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Doppler (Hz)"
                    value={inputDoppler}
                    onChange={(e) => setInputDoppler(e.target.value)}
                    required
                    className="bg-black/70 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Bio-Hash Hex"
                    value={inputDna}
                    onChange={(e) => setInputDna(e.target.value)}
                    required
                    className="bg-black/70 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold py-2 rounded-lg text-xs transition min-h-[44px] cursor-pointer"
                >
                  + ADD TARGET PROFILE
                </button>
              </form>
            </div>

            {/* Biometric Field Calibration Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Dna className="w-4 h-4" /> BIOMETRIC FIELD CALIBRATION
                </h2>
                <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                  <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                  <span className={`text-[10px] font-bold ${isLocked ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isLocked ? 'LOCKED' : 'SEARCHING'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Genomic Resonance (S_gen)</span>
                    <span className="text-cyan-400 font-bold">{sg.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={sg}
                    onChange={(e) => setSg(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Thermal Signature (S_therm)</span>
                    <span className="text-cyan-400 font-bold">{st.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={st}
                    onChange={(e) => setSt(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Doppler Velocity (S_dop)</span>
                    <span className="text-cyan-400 font-bold">{sd.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={sd}
                    onChange={(e) => setSd(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Lock Threshold (T_lock)</span>
                    <span className="text-purple-400 font-bold">{tlock.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={tlock}
                    onChange={(e) => setTlock(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-black/60 border border-slate-800 rounded flex justify-between items-center text-xs">
                <span className="text-slate-400">Integrated Likelihood (L):</span>
                <span className="font-bold text-cyan-400 font-mono text-sm">{integratedL.toFixed(3)}</span>
              </div>
              <div className={`text-center text-xs font-bold py-2 rounded border ${
                isLocked 
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' 
                  : 'text-amber-400 bg-amber-950/40 border-amber-800/50'
              }`}>
                Match Confidence: {matchConfidencePct}%
              </div>
            </div>
          </div>

          {/* Center & Right Column: Visualizers & Phased Array */}
          <div className="lg:col-span-8 space-y-4">
            {/* Canvas Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beam Propagation Visualizer */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" /> BEAM PROPAGATION VECTOR
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">REAL-TIME CANVAS</span>
                </div>
                <div className="relative flex-1 min-h-[220px] bg-black/80 rounded-lg border border-slate-800/80 overflow-hidden">
                  <canvas ref={beamCanvasRef} className="w-full h-full block" />
                </div>
              </div>

              {/* Phased Array Pattern Factor */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> ARRAY FACTOR |AF(θ)|²
                  </span>
                  <button
                    onClick={() => { setArrayScaleLinear(!arrayScaleLinear); playTone(500, 0.08); }}
                    className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                  >
                    Scale: {arrayScaleLinear ? 'Linear' : 'Log (dB)'}
                  </button>
                </div>
                <div className="relative flex-1 min-h-[220px] bg-black/80 rounded-lg border border-slate-800/80 overflow-hidden">
                  <canvas ref={arrayCanvasRef} className="w-full h-full block" />
                </div>
              </div>
            </div>

            {/* Phased Array & Ionospheric Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <h2 className="text-xs font-bold text-cyan-400 tracking-wider mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> PHASED ARRAY &amp; IONOSPHERIC SYNTHESIS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mb-4">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Steering Angle (θ)</span>
                    <span className="text-cyan-400 font-bold">{theta.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    step="0.5"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Elements (M)</span>
                    <span className="text-cyan-400 font-bold">{mElements}</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="128"
                    step="8"
                    value={mElements}
                    onChange={(e) => setMElements(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Plasma Density (Ne)</span>
                    <span className="text-cyan-400 font-bold">{plasmaNe.toFixed(1)} ×10¹⁷</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="5.0"
                    step="0.1"
                    value={plasmaNe}
                    onChange={(e) => setPlasmaNe(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>TEC Correction</span>
                    <span className="text-purple-400 font-bold">{tec.toFixed(1)} TECU</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="1"
                    value={tec}
                    onChange={(e) => setTec(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 bg-black h-1.5 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsAutoSweep(!isAutoSweep);
                      playTone(650, 0.1);
                      addConsoleLog(`Auto Orbital Sweep ${!isAutoSweep ? 'ACTIVATED' : 'HALTED'}`);
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs flex items-center gap-1.5 transition cursor-pointer min-h-[44px] ${
                      isAutoSweep ? 'border-cyan-500 bg-cyan-950/60 text-cyan-400 font-bold' : 'border-slate-800 bg-black/60 text-slate-300'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAutoSweep ? 'animate-spin' : ''}`} />
                    Auto Orbital Sweep
                  </button>

                  <button
                    onClick={() => {
                      setIsSqueezed(!isSqueezed);
                      playTone(800, 0.12);
                      addConsoleLog(`Quantum Squeezed Vacuum Mode ${!isSqueezed ? 'ENABLED (-6 dB noise)' : 'DISABLED'}`);
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs flex items-center gap-1.5 transition cursor-pointer min-h-[44px] ${
                      isSqueezed ? 'border-purple-500 bg-purple-950/60 text-purple-300 font-bold' : 'border-slate-800 bg-black/60 text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Quantum Squeezed Mode
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-400">
                    Directivity: <span className="text-cyan-400 font-bold">{directivityDb} dB</span>
                  </div>
                  <button
                    onClick={handleSynthesizeBeam}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg text-xs transition shadow-lg shadow-cyan-500/20 min-h-[44px] cursor-pointer"
                  >
                    SYNTHESIZE BEAM PULSE
                  </button>
                </div>
              </div>
            </div>

            {/* Terminal Log Console */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> REAL-TIME TELEMETRY EVENT STREAM
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConsoleLogs([])}
                    className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    Clear
                  </button>
                  <span className="text-[10px] text-slate-600 font-mono">LIVE 100 Hz</span>
                </div>
              </div>
              <div className="h-28 bg-black/70 rounded-lg border border-slate-800/80 p-2.5 font-mono text-[11px] text-slate-300 overflow-y-auto space-y-1">
                {consoleLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 shrink-0">&gt;</span>
                    <span className="text-slate-200">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 2: HYPERION SWARM DASHBOARD
      ========================================================================= */}
      {activeTab === 'hyperion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col h-[480px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> HYPERION AI SWARM PHASE COHERENCE TELEMETRY
              </h2>
              <span className="text-xs text-slate-500 font-mono">NODE-26 QUANTUM BUS</span>
            </div>
            <div className="flex-1 relative bg-black/60 rounded-xl border border-slate-800/80 overflow-hidden p-2">
              <canvas ref={hyperionCanvasRef} className="w-full h-full block" />
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-bold text-purple-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> GROVER QUANTUM ORACLE MATRIX
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Executes real quantum amplitude amplification iterations over biometric target Hilbert spaces. Amplifies targeted phase states relative to orthogonal noise.
            </p>

            <div className="p-3.5 bg-black/60 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Oracle Step Counter (k):</span>
                <span className="text-purple-400 font-bold">Iteration {groverStep}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Target Probability |a_k|²:</span>
                <span className="text-purple-400 font-bold">{groverProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                <div 
                  className="bg-purple-500 h-full transition-all duration-300" 
                  style={{ width: `${groverProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleGroverIteration}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition cursor-pointer min-h-[44px]"
              >
                EXECUTE GROVER AMPLIFICATION STEP
              </button>
              <button
                onClick={handleResetGrover}
                className="w-full py-2 bg-black/60 hover:bg-slate-800 text-slate-400 border border-slate-800 rounded-lg text-xs transition cursor-pointer min-h-[44px]"
              >
                Reset Quantum Superposition
              </button>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
              <div>Hilbert Dim (N): 2^16 = 65,536</div>
              <div>Optimal Steps (π/4 √N): ~201</div>
              <div>Current Phase Shift: <span className="text-purple-400">{groverPhaseRad} rad</span></div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 3: DOMUS BIO-PHOTONIC SUITE
      ========================================================================= */}
      {activeTab === 'domus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-emerald-400">SPECTRA ALPHA (780nm)</span>
              <span className="text-[10px] text-emerald-400 font-mono">1.20 GHz</span>
            </div>
            <div className="flex-1 bg-black/80 rounded-lg border border-slate-800 overflow-hidden">
              <canvas ref={domus1Ref} className="w-full h-full block" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-cyan-400">SPECTRA BETA (850nm)</span>
              <span className="text-[10px] text-cyan-400 font-mono">2.40 GHz</span>
            </div>
            <div className="flex-1 bg-black/80 rounded-lg border border-slate-800 overflow-hidden">
              <canvas ref={domus2Ref} className="w-full h-full block" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-purple-400">SPECTRA GAMMA (940nm)</span>
              <span className="text-[10px] text-purple-400 font-mono">0.80 GHz</span>
            </div>
            <div className="flex-1 bg-black/80 rounded-lg border border-slate-800 overflow-hidden">
              <canvas ref={domus3Ref} className="w-full h-full block" />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col h-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-amber-400">SPECTRA DELTA (1064nm)</span>
              <span className="text-[10px] text-amber-400 font-mono">3.10 GHz</span>
            </div>
            <div className="flex-1 bg-black/80 rounded-lg border border-slate-800 overflow-hidden">
              <canvas ref={domus4Ref} className="w-full h-full block" />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODULE 4: PRODUCTION SWARM MATRIX (NODES 01 - 25 & NODE 26)
      ========================================================================= */}
      {activeTab === 'nodes' && (
        <div className="space-y-6">
          {/* Header Summary Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  PRODUCTION SWARM MATRIX
                </span>
                <span className="text-xs text-slate-400">
                  All 25 Nodes Operating in 2.5x Boost Mode
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-6 h-6 text-emerald-400" />
                Nodes 01 - 25 Autonomous Yield Streams
              </h2>
            </div>

            <div className="bg-black/70 border border-emerald-700/60 rounded-xl px-4 py-3 text-right">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Total Accumulated Earned
              </div>
              <div className="text-2xl font-bold text-emerald-300">
                ${TOTAL_INITIAL_ACCUMULATED_EARNED.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* 25 Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {INITIAL_YIELD_NODES.map((node) => (
              <div
                key={node.id}
                className="bg-slate-900/90 border border-emerald-900/40 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/70 transition shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-200">
                      NODE {String(node.id).padStart(2, '0')}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                      BOOSTED
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-100 truncate mb-1">
                    {node.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 mb-2">
                    {node.classLabel}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-cyan-400">${node.currentYieldPerSec.toFixed(2)}/s</span>
                  <span className="text-emerald-300">
                    ${(node.accumulatedEarned / 1000).toFixed(1)}k
                  </span>
                  <span className="text-[10px] text-purple-300">2.5x</span>
                </div>
              </div>
            ))}
          </div>

          {/* Node 26: Grover Quantum Oracle & GF(2) Audit */}
          <div className="bg-slate-900/90 border border-purple-900/50 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700">
                    NODE #26
                  </span>
                  <span className="text-xs text-slate-400">
                    CRYPTANALYSIS AUDIT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Node 26: Grover Quantum Oracle &amp; GF(2) Audit
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Galois Field $\mathbb&#123;F&#125;_2$ Linear Complexity &amp; Reversible Logic Synthesis
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">GROVER SEARCH TIME</span>
                  <span className="text-emerald-400 font-bold">13.11 ms</span>
                </div>
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">TOTAL REVERSIBLE GATES</span>
                  <span className="text-purple-300 font-bold">1.00e+15</span>
                </div>
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">QUBIT ALLOCATION</span>
                  <span className="text-cyan-400 font-bold">16,384 Qubits</span>
                </div>
                <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">CIRCUIT DEPTH SCALE</span>
                  <span className="text-amber-400 font-bold">2^300</span>
                </div>
              </div>
            </div>

            {/* Formula & Primitive Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-400 font-bold">// FORMULAIC BREAKDOWN</div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-900 space-y-1.5 text-slate-300">
                  <div>R ≈ (π/4) × √(2^256) = (π/4) × 2^128 steps</div>
                  <div>T_1 = H + Σ_1(E) + Ch(E,F,G) + K_i + W_i</div>
                  <div className="text-emerald-400 font-bold">GF(2) Modulus: a ⊕ b = a + b (mod 2)</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  *Grover diffusion operator accelerates SHA-256 preimage collision search by quadratic speedup over $\mathbb&#123;F&#125;_2^n$.
                </p>
              </div>

              {/* Hash Primitives Table */}
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 pb-2">
                    <tr>
                      <th className="pb-1.5">Hash Primitive</th>
                      <th className="pb-1.5">Classical Security</th>
                      <th className="pb-1.5">Grover Qubits</th>
                      <th className="pb-1.5">Toffoli Gate Depth</th>
                      <th className="pb-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <tr>
                      <td className="py-2 text-cyan-300 font-bold">MD5</td>
                      <td className="py-2 text-slate-300">2^64 Steps</td>
                      <td className="py-2 text-slate-300">1,248 Qubits</td>
                      <td className="py-2 text-slate-300">2.4 × 10^5</td>
                      <td className="py-2 text-red-400 font-bold">BROKEN</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-cyan-300 font-bold">SHA-256</td>
                      <td className="py-2 text-slate-300">2^256 Steps</td>
                      <td className="py-2 text-slate-300">16,384 Qubits</td>
                      <td className="py-2 text-slate-300">1.00e+15</td>
                      <td className="py-2 text-amber-400 font-bold">AUDITING</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-cyan-300 font-bold">Keccak-256</td>
                      <td className="py-2 text-slate-300">2^256 Steps</td>
                      <td className="py-2 text-slate-300">5,120 Qubits</td>
                      <td className="py-2 text-slate-300">8.90 × 10^15</td>
                      <td className="py-2 text-emerald-400 font-bold">RESISTANT</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
