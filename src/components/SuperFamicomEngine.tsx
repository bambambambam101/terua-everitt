import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Gamepad2, 
  Radio, 
  Terminal, 
  Cpu, 
  Activity, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Download, 
  RotateCcw, 
  Sliders, 
  Code2, 
  Database, 
  ShieldAlert, 
  Zap, 
  Wifi, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  FileText, 
  Trash2, 
  Plus, 
  RefreshCw, 
  HardDrive, 
  Flame, 
  Server, 
  Lock, 
  Eye, 
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  BINAURAL_CATALOG, 
  INITIAL_PRESETS, 
  INITIAL_TERMUX_PROCESSES, 
  SQL_SCHEMA_BLUEPRINT,
  TERMUX_SETUP_SCRIPT,
  LIVE_MONITOR_PY_SOURCE,
  BinauralInterval,
  FrequencyPreset,
  TermuxProcess
} from '../data/superFamicomData';
import { 
  HAK5_DEVICE_INVENTORY, 
  DUCKY_PAYLOAD_REPOSITORY, 
  CLOUD_C2_FLEET_PRESETS,
  Hak5DeviceProfile,
  DuckyPayload
} from '../data/hak5ArsenalData';

type SubTab = 'synthesizer' | 'termux_cli' | 'payload_studio' | 'device_matrix' | 'cloud_c2' | 'sql_blueprint';

export const SuperFamicomEngine: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('synthesizer');

  // ==========================================
  // 1. ACOUSTIC SYNTHESIS & WEB AUDIO STATE
  // ==========================================
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [carrierHz, setCarrierHz] = useState<number>(216.0);
  const [differentialHz, setDifferentialHz] = useState<number>(6.0);
  const [waveform, setWaveform] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.35);
  const [activeBandName, setActiveBandName] = useState<string>('THETA (θ)');
  const [presetLabel, setPresetLabel] = useState<string>('Super Famicom Theta Synthesis');

  // Audio Context & Oscillators
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLeftRef = useRef<OscillatorNode | null>(null);
  const oscRightRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerLeftRef = useRef<StereoPannerNode | null>(null);
  const pannerRightRef = useRef<StereoPannerNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Storage and JSON exports tracking
  interface ExportRecord {
    id: string;
    filename: string;
    label: string;
    sizeKb: number;
    timestamp: string;
    data: any;
  }

  const [exportedRecords, setExportedRecords] = useState<ExportRecord[]>([
    {
      id: 'rec-01',
      filename: 'preset_export_theta_1728701000.json',
      label: 'Deep Theta Hypnagogic Trance',
      sizeKb: 1.84,
      timestamp: '2026-10-12 04:00:15 UTC',
      data: {
        system_profile_metadata: {
          engine_platform: 'Super_Famicom_Termux',
          preset_label: 'Deep Theta Hypnagogic Trance',
          timestamp: '2026-10-12 04:00:15 UTC'
        },
        synthesis_matrix: {
          left_carrier_hz: 216.0,
          right_offset_hz: 222.0,
          resultant_differential_hz: 6.0
        },
        subsystem_hardware_telemetry: {
          ram_usage_percentage: 42.15,
          cpu_usage_percentage: 4.8,
          top_active_processes: INITIAL_TERMUX_PROCESSES.slice(0, 3)
        }
      }
    }
  ]);
  const [selectedRecordData, setSelectedRecordData] = useState<any | null>(null);
  const [storageAlert, setStorageAlert] = useState<string | null>(null);

  // Termux hardware simulation state
  const [ramUsageMb, setRamUsageMb] = useState<number>(2410);
  const [totalRamMb] = useState<number>(6144);
  const [cpuUsagePercent, setCpuUsagePercent] = useState<number>(7.4);
  const [processes, setProcesses] = useState<TermuxProcess[]>(INITIAL_TERMUX_PROCESSES);
  const [kernelLogs, setKernelLogs] = useState<string[]>([
    `[${new Date().toISOString().slice(11, 19)}] [INIT] Project Super Famicom termux daemon online.`,
    `[${new Date().toISOString().slice(11, 19)}] [AUDIO] WebAudio binaural dsp engine calibrated.`,
    `[${new Date().toISOString().slice(11, 19)}] [MEMINFO] /proc/meminfo parsed: 6144MB total / 3734MB free.`,
    `[${new Date().toISOString().slice(11, 19)}] [STORAGE] Asymmetric cap enforced at 25.0 KB.`
  ]);

  // ==========================================
  // 2. HAK5 PAYLOAD STUDIO PRO & DUCKY SCRIPT STATE
  // ==========================================
  const [selectedPayloadId, setSelectedPayloadId] = useState<string>('ducky-win-revshell');
  const [duckyCode, setDuckyCode] = useState<string>(DUCKY_PAYLOAD_REPOSITORY[0].duckyscript_code);
  const [compileStatus, setCompileStatus] = useState<'idle' | 'compiling' | 'compiled' | 'error'>('compiled');
  const [compiledBytecode, setCompiledBytecode] = useState<string>('');
  const [bytecodeSize, setBytecodeSize] = useState<number>(0);
  const [typingSimulating, setTypingSimulating] = useState<boolean>(false);
  const [simulatedScreenOutput, setSimulatedScreenOutput] = useState<string[]>([]);
  const [simTargetOs, setSimTargetOs] = useState<'Windows' | 'macOS' | 'Linux'>('Windows');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // ==========================================
  // 3. DEVICE ARSENAL & CLOUD C2 STATE
  // ==========================================
  const [deviceFilter, setDeviceFilter] = useState<string>('ALL');
  const [c2Devices, setC2Devices] = useState(CLOUD_C2_FLEET_PRESETS);
  const [c2ActionNotice, setC2ActionNotice] = useState<string | null>(null);

  // ==========================================
  // 4. SQL RUNNER STATE
  // ==========================================
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT band_name, lower_frequency_hz, upper_frequency_hz, clinical_description FROM binaural_frequency_catalog ORDER BY lower_frequency_hz ASC;'
  );
  const [sqlResults, setSqlResults] = useState<any[] | null>(null);

  // ==========================================
  // 5. TERMUX CLI & BASH DAEMON STATE
  // ==========================================
  const [termuxSubView, setTermuxSubView] = useState<'terminal' | 'script' | 'python'>('terminal');
  const [termuxCommandInput, setTermuxCommandInput] = useState<string>('');
  const [isDaemonRunning, setIsDaemonRunning] = useState<boolean>(false);
  const [termuxTerminalLines, setTermuxTerminalLines] = useState<string[]>([
    '=============================================================',
    '🎮 PROJECT SUPER FAMICOM: COMPREHENSIVE PRODUCTION ENGINE',
    '=============================================================',
    '[+] Termux Android environment ready at: /data/data/com.termux/files/home/super_famicom_termux',
    '[+] Toolchains linked: python 3.11.8, ndk-sysroot, clang 18.1.2, procps, coreutils',
    '[+] Registered .bashrc shortcuts: sf-run, sf-logs, sf-clean',
    '👉 Type any command or click the quick action buttons below.'
  ]);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedPySource, setCopiedPySource] = useState<boolean>(false);

  // Total storage size in KB
  const totalStorageKb = useMemo(() => {
    return parseFloat(exportedRecords.reduce((acc, r) => acc + r.sizeKb, 0).toFixed(2));
  }, [exportedRecords]);

  // Log kernel message helper
  const addKernelLog = useCallback((tag: string, msg: string) => {
    const timestamp = new Date().toISOString().slice(11, 19);
    setKernelLogs(prev => [`[${timestamp}] [${tag}] ${msg}`, ...prev.slice(0, 50)]);
  }, []);

  // Update WebAudio oscillator frequencies
  useEffect(() => {
    const rightHz = carrierHz + differentialHz;
    if (oscLeftRef.current) {
      oscLeftRef.current.frequency.setTargetAtTime(carrierHz, audioCtxRef.current?.currentTime || 0, 0.05);
      oscLeftRef.current.type = waveform;
    }
    if (oscRightRef.current) {
      oscRightRef.current.frequency.setTargetAtTime(rightHz, audioCtxRef.current?.currentTime || 0, 0.05);
      oscRightRef.current.type = waveform;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(isPlayingAudio ? volume : 0, audioCtxRef.current?.currentTime || 0, 0.05);
    }
  }, [carrierHz, differentialHz, waveform, isPlayingAudio, volume]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      try {
        if (oscLeftRef.current) oscLeftRef.current.stop();
        if (oscRightRef.current) oscRightRef.current.stop();
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
      } catch (e) {
        // cleanup ignore
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Canvas visualizer loop
  useEffect(() => {
    let t = 0;
    const render = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.fillStyle = '#060a12';
          ctx.fillRect(0, 0, w, h);

          // Grid lines
          ctx.strokeStyle = '#111e38';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Center axis
          ctx.strokeStyle = '#1e3a5f';
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();

          const f1 = carrierHz;
          const f2 = carrierHz + differentialHz;
          const beatFreq = Math.abs(differentialHz);

          // Left Channel Wave (Cyan)
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const angle = (x / w) * Math.PI * 8 + t * (f1 / 100);
            const y = (h / 2) + Math.sin(angle) * (h * 0.22);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Right Channel Wave (Purple)
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const angle = (x / w) * Math.PI * 8 + t * (f2 / 100);
            const y = (h / 2) + Math.sin(angle) * (h * 0.22);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Binaural Interference Envelope (Amber beat waveform)
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const angle1 = (x / w) * Math.PI * 8 + t * (f1 / 100);
            const angle2 = (x / w) * Math.PI * 8 + t * (f2 / 100);
            // Combined superposition interference
            const envelope = (Math.sin(angle1) + Math.sin(angle2)) * 0.5;
            const y = (h / 2) + envelope * (h * 0.38);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          t += 0.04;
        }
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [carrierHz, differentialHz, isPlayingAudio]);

  // Audio Play / Stop handler
  const togglePlayAudio = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();

        // Left ear panner & oscillator
        const oscL = audioCtxRef.current.createOscillator();
        const pannerL = audioCtxRef.current.createStereoPanner();
        pannerL.pan.value = -1.0; // 100% Left

        // Right ear panner & oscillator
        const oscR = audioCtxRef.current.createOscillator();
        const pannerR = audioCtxRef.current.createStereoPanner();
        pannerR.pan.value = 1.0; // 100% Right

        // Master Gain
        const masterGain = audioCtxRef.current.createGain();
        masterGain.gain.value = volume;

        oscL.type = waveform;
        oscL.frequency.value = carrierHz;
        oscR.type = waveform;
        oscR.frequency.value = carrierHz + differentialHz;

        oscL.connect(pannerL);
        pannerL.connect(masterGain);

        oscR.connect(pannerR);
        pannerR.connect(masterGain);

        masterGain.connect(audioCtxRef.current.destination);

        oscL.start();
        oscR.start();

        oscLeftRef.current = oscL;
        oscRightRef.current = oscR;
        pannerLeftRef.current = pannerL;
        pannerRightRef.current = pannerR;
        gainNodeRef.current = masterGain;

        setIsPlayingAudio(true);
        addKernelLog('AUDIO', `Binaural stream started: Carrier ${carrierHz}Hz, Diff ${differentialHz}Hz (${activeBandName})`);
      } else {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
          setIsPlayingAudio(true);
          addKernelLog('AUDIO', 'Binaural stream resumed.');
        } else if (isPlayingAudio) {
          audioCtxRef.current.suspend();
          setIsPlayingAudio(false);
          addKernelLog('AUDIO', 'Binaural stream paused.');
        } else {
          audioCtxRef.current.resume();
          setIsPlayingAudio(true);
          addKernelLog('AUDIO', 'Binaural stream resumed.');
        }
      }
    } catch (e: any) {
      console.error('Audio initialization error:', e);
      addKernelLog('ERROR', `Audio context fault: ${e.message}`);
    }
  }, [carrierHz, differentialHz, waveform, volume, isPlayingAudio, activeBandName, addKernelLog]);

  // Load Preset
  const handleApplyInterval = (interval: BinauralInterval) => {
    setCarrierHz(interval.recommended_carrier_hz);
    setDifferentialHz(interval.default_diff_hz);
    setActiveBandName(interval.band_name);
    setPresetLabel(`Preset ${interval.band_name} Tuning`);
    addKernelLog('PRESET', `Applied interval ${interval.band_name}: ${interval.default_diff_hz}Hz differential.`);
  };

  const handleApplyPreset = (preset: FrequencyPreset) => {
    setCarrierHz(preset.base_carrier_hz);
    setDifferentialHz(preset.target_differential_hz);
    setWaveform(preset.waveform_type);
    setActiveBandName(preset.band_category);
    setPresetLabel(preset.preset_label);
    addKernelLog('PRESET', `Loaded configuration: "${preset.preset_label}"`);
  };

  // Export JSON Preset with Asymmetric Capacity Enforcement (25KB Max)
  const handleExportJsonPreset = () => {
    const leftHz = carrierHz;
    const rightHz = carrierHz + differentialHz;
    const diff = Math.round(Math.abs(leftHz - rightHz) * 100) / 100;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

    const payload = {
      system_profile_metadata: {
        engine_platform: 'Super_Famicom_Termux',
        preset_label: presetLabel,
        timestamp
      },
      synthesis_matrix: {
        left_carrier_hz: leftHz,
        right_offset_hz: rightHz,
        resultant_differential_hz: diff
      },
      subsystem_hardware_telemetry: {
        ram_usage_percentage: Math.round((ramUsageMb / totalRamMb) * 10000) / 100,
        cpu_usage_percentage: cpuUsagePercent,
        top_active_processes: processes.slice(0, 3)
      }
    };

    const serialized = JSON.stringify(payload, null, 2);
    const sizeKb = parseFloat((serialized.length / 1024).toFixed(2));
    const filename = `preset_export_${presetLabel.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.json`;

    const newRecord: ExportRecord = {
      id: `rec-${Date.now()}`,
      filename,
      label: presetLabel,
      sizeKb,
      timestamp,
      data: payload
    };

    let updated = [newRecord, ...exportedRecords];
    let currentTotalSize = updated.reduce((acc, r) => acc + r.sizeKb, 0);

    // Enforce 25 KB Asymmetric Storage Cap
    const MAX_FOLDER_SIZE_KB = 25.0;
    if (currentTotalSize > MAX_FOLDER_SIZE_KB) {
      while (currentTotalSize > MAX_FOLDER_SIZE_KB && updated.length > 1) {
        const purged = updated.pop();
        if (purged) {
          const purgeMsg = `Asymmetric volume cap exceeded (>25KB). Purged historical record: ${purged.filename}`;
          setStorageAlert(purgeMsg);
          addKernelLog('ROTATION', purgeMsg);
        }
        currentTotalSize = updated.reduce((acc, r) => acc + r.sizeKb, 0);
      }
    } else {
      setStorageAlert(null);
    }

    setExportedRecords(updated);
    setSelectedRecordData(payload);
    addKernelLog('SYNTHESIS', `Exported configuration record: ${filename} (${sizeKb} KB)`);
  };

  // Download raw JSON
  const handleDownloadJsonFile = (record: ExportRecord) => {
    const blob = new Blob([JSON.stringify(record.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Termux periodic CPU/RAM ambient fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsagePercent(prev => {
        const delta = (Math.random() * 3 - 1.5);
        return Math.max(1.2, Math.min(48.0, Math.round((prev + delta) * 10) / 10));
      });
      setRamUsageMb(prev => {
        const delta = Math.floor(Math.random() * 20 - 10);
        return Math.max(1800, Math.min(3800, prev + delta));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Kill Process Action
  const handleKillProcess = (pid: number) => {
    const target = processes.find(p => p.pid === pid);
    if (!target) return;
    setProcesses(prev => prev.filter(p => p.pid !== pid));
    addKernelLog('SIGKILL', `Process PID ${pid} (${target.command}) terminated.`);
  };

  // ==========================================
  // DUCKY SCRIPT 3.0 COMPILER SIMULATOR
  // ==========================================
  const compileDuckyScript = useCallback((source: string) => {
    setCompileStatus('compiling');
    try {
      const lines = source.split('\n');
      const bytes: number[] = [0x51, 0x55, 0x41, 0x43, 0x4B, 0x03]; // "QUACK\x03" Header magic
      let parsedLines = 0;

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || line.startsWith('REM')) continue;

        parsedLines++;
        if (line.startsWith('DEFAULT_DELAY')) {
          const delayVal = parseInt(line.split(' ')[1] || '100', 10);
          bytes.push(0xD0, (delayVal >> 8) & 0xFF, delayVal & 0xFF);
        } else if (line.startsWith('DELAY')) {
          const delayVal = parseInt(line.split(' ')[1] || '500', 10);
          bytes.push(0xDE, (delayVal >> 8) & 0xFF, delayVal & 0xFF);
        } else if (line.startsWith('STRING')) {
          const str = rawLine.replace(/^\s*STRING\s+/, '');
          bytes.push(0x53, str.length & 0xFF);
          for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
          }
        } else if (line === 'ENTER') {
          bytes.push(0x28);
        } else if (line.startsWith('GUI')) {
          bytes.push(0xE3);
          const key = line.split(' ')[1];
          if (key) bytes.push(key.charCodeAt(0));
        } else if (line.startsWith('COMMAND')) {
          bytes.push(0xE3, 0x2C); // Cmd Space
        } else if (line.startsWith('CONTROL')) {
          bytes.push(0xE0);
        } else if (line.startsWith('ALT')) {
          bytes.push(0xE2);
        } else {
          bytes.push(0x04); // Generic keycode
        }
      }

      // Generate Hex Dump format
      const hex = bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
      setCompiledBytecode(hex);
      setBytecodeSize(bytes.length);
      setCompileStatus('compiled');
      addKernelLog('DUCKY', `DuckyScript compiled to inject.bin (${bytes.length} bytes, ${parsedLines} instructions).`);
    } catch (e: any) {
      setCompileStatus('error');
      addKernelLog('ERROR', `Compiler error: ${e.message}`);
    }
  }, [addKernelLog]);

  // Load payload from repo
  const handleSelectPayload = (payload: DuckyPayload) => {
    setSelectedPayloadId(payload.id);
    setDuckyCode(payload.duckyscript_code);
    compileDuckyScript(payload.duckyscript_code);
    if (payload.target_os === 'macOS') setSimTargetOs('macOS');
    else if (payload.target_os === 'Linux') setSimTargetOs('Linux');
    else setSimTargetOs('Windows');
  };

  // Compile on mount or duckyCode change
  useEffect(() => {
    compileDuckyScript(duckyCode);
  }, []);

  // Copy code helper
  const handleCopyDuckyCode = () => {
    navigator.clipboard.writeText(duckyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download inject.bin
  const handleDownloadInjectBin = () => {
    const bytes = compiledBytecode.split(' ').map(hex => parseInt(hex, 16));
    const uint8 = new Uint8Array(bytes);
    const blob = new Blob([uint8], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inject.bin';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Virtual Target Keystroke Injection Simulator
  const handleSimulateKeystrokes = async () => {
    if (typingSimulating) return;
    setTypingSimulating(true);
    setSimulatedScreenOutput([]);

    const lines = duckyCode.split('\n');
    const outputs: string[] = [];

    outputs.push(`[HARDWARE] USB Rubber Ducky plugged into target ${simTargetOs} USB port.`);
    outputs.push(`[ENUMERATION] VendorID: 0x046D (Logitech HID Keyboard Emulation)`);
    outputs.push(`[TIMING] Default injection delay calibrated. Initiating keystrokes...`);
    setSimulatedScreenOutput([...outputs]);
    await new Promise(r => setTimeout(r, 600));

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('REM')) continue;

      if (line.startsWith('DELAY')) {
        const ms = parseInt(line.split(' ')[1] || '500', 10);
        await new Promise(r => setTimeout(r, Math.min(ms, 400)));
      } else if (line.startsWith('GUI r') || line.startsWith('GUI')) {
        outputs.push(`[HOST] Key combination: [WIN] + [R] -> Run Dialog spawned.`);
        setSimulatedScreenOutput([...outputs]);
        await new Promise(r => setTimeout(r, 300));
      } else if (line.startsWith('STRING')) {
        const text = rawLine.replace(/^\s*STRING\s+/, '');
        outputs.push(`[TYPEWRITER >] ${text}`);
        setSimulatedScreenOutput([...outputs]);
        await new Promise(r => setTimeout(r, 150));
      } else if (line === 'ENTER') {
        outputs.push(`[EXECUTE] <ENTER> Key struck.`);
        setSimulatedScreenOutput([...outputs]);
        await new Promise(r => setTimeout(r, 200));
      } else {
        outputs.push(`[KEY] ${line}`);
        setSimulatedScreenOutput([...outputs]);
        await new Promise(r => setTimeout(r, 100));
      }
    }

    outputs.push(`[COMPLETION] ✅ Payload injection sequence finished. Ducky LED pulse: STEALTH GREEN.`);
    setSimulatedScreenOutput([...outputs]);
    setTypingSimulating(false);
  };

  // Run SQL Query
  const handleRunSql = () => {
    const q = sqlQuery.toLowerCase();
    if (q.includes('binaural_frequency_catalog')) {
      setSqlResults(
        BINAURAL_CATALOG.map((c, i) => ({
          interval_id: `b4c-${i + 1}`,
          band_name: c.band_name,
          lower_frequency_hz: c.lower_frequency_hz,
          upper_frequency_hz: c.upper_frequency_hz,
          clinical_description: c.clinical_description
        }))
      );
    } else if (q.includes('custom_frequency_presets')) {
      setSqlResults(
        INITIAL_PRESETS.map((p, i) => ({
          preset_id: p.id,
          preset_label: p.preset_label,
          base_carrier_hz: p.base_carrier_hz,
          target_differential_hz: p.target_differential_hz,
          waveform_type: p.waveform_type,
          updated_at: p.created_at
        }))
      );
    } else if (q.includes('user_profiles')) {
      setSqlResults([
        { user_id: 'usr-8891-alpha', profile_name: 'Operator_Terua', device_model: 'Victus-OPPO-Termux', created_at: '2026-10-12 00:00:00 UTC' },
        { user_id: 'usr-9942-beta', profile_name: 'Hak5_Fleet_Admin', device_model: 'Cloud-C2-Master', created_at: '2026-10-12 01:15:00 UTC' }
      ]);
    } else {
      setSqlResults([
        { status: 'SUCCESS', rows_affected: 1, notice: 'Query executed against simulated Termux relational engine.' }
      ]);
    }
    addKernelLog('SQL', `Executed query: ${sqlQuery.slice(0, 40)}...`);
  };

  // Termux CLI command execution
  const executeTermuxCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setTermuxTerminalLines(prev => [...prev, `$ ${cmd}`]);
    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setTermuxTerminalLines([
        '🎮 Termux console cleared. Type `sf-run`, `sf-logs`, `sf-clean`, or `help`.'
      ]);
      return;
    }

    if (lower === 'help') {
      setTermuxTerminalLines(prev => [
        ...prev,
        'Project Super Famicom Production Commands:',
        '  sf-run        - Start 3-cycle SuperFamicomEngine Python daemon',
        '  sf-logs       - Tail the background system_logs/runtime.log stream',
        '  sf-clean      - Purge all exported acoustic JSON files (clean storage)',
        '  pkg install   - Sync packages and install toolchains',
        '  ls -la        - List workspace files and directories',
        '  ps aux        - Display active Termux PID handles and memory',
        '  cat schema    - View relational database schema_blueprint.sql',
        '  cat python    - View live_monitor.py source code',
        '  clear         - Clear terminal buffer'
      ]);
      return;
    }

    if (lower === 'sf-run' || lower.includes('python3 live_monitor.py')) {
      setIsDaemonRunning(true);
      setTermuxTerminalLines(prev => [
        ...prev,
        '🚀 [DAEMON] Super Famicom telemetry monitor running in background mode.',
        `[${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC] [INIT] Background telemetry daemon initialized successfully.`
      ]);

      const daemonPresets = [
        { label: "Alpha_Focus", carrier: 220.0, diff: 10.0 },
        { label: "Theta_Deep", carrier: 150.0, diff: 6.0 },
        { label: "Delta_Rest", carrier: 95.0, diff: 2.5 },
        { label: "Gamma_High", carrier: 400.0, diff: 40.0 }
      ];

      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 600));
        const p = daemonPresets[i % daemonPresets.length];
        const leftHz = p.carrier;
        const rightHz = p.carrier + p.diff;
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        const filename = `preset_export_${p.label.toLowerCase()}_${Date.now() + i}.json`;

        const payload = {
          system_profile_metadata: {
            engine_platform: 'Super_Famicom_Termux',
            preset_label: p.label,
            timestamp
          },
          synthesis_matrix: {
            left_carrier_hz: leftHz,
            right_offset_hz: rightHz,
            resultant_differential_hz: p.diff
          },
          subsystem_hardware_telemetry: {
            ram_usage_percentage: Math.round((ramUsageMb / totalRamMb) * 10000) / 100,
            cpu_usage_percentage: cpuUsagePercent,
            top_active_processes: processes.slice(0, 3)
          }
        };

        const serialized = JSON.stringify(payload, null, 2);
        const sizeKb = parseFloat((serialized.length / 1024).toFixed(2));

        setExportedRecords(prev => {
          let updated = [{
            id: `rec-daemon-${Date.now()}-${i}`,
            filename,
            label: p.label,
            sizeKb,
            timestamp,
            data: payload
          }, ...prev];

          const MAX_FOLDER_SIZE_KB = 25.0;
          let currentTotal = updated.reduce((acc, r) => acc + r.sizeKb, 0);
          while (currentTotal > MAX_FOLDER_SIZE_KB && updated.length > 1) {
            const purged = updated.pop();
            if (purged) {
              addKernelLog('ROTATION', `Asymmetric cap exceeded. Purged: ${purged.filename}`);
            }
            currentTotal = updated.reduce((acc, r) => acc + r.sizeKb, 0);
          }
          return updated;
        });

        addKernelLog('SYNTHESIS', `Generated artifact: ${filename}`);
        setTermuxTerminalLines(prev => [
          ...prev,
          `  ✅ [EXPORTED] Configuration record generated successfully -> ${filename}`
        ]);
      }

      setTermuxTerminalLines(prev => [
        ...prev,
        '  ✨ Daemon execution cycle completed. 3 artifacts generated and verified.'
      ]);
      setIsDaemonRunning(false);
      return;
    }

    if (lower === 'sf-logs' || lower.includes('tail')) {
      setTermuxTerminalLines(prev => [
        ...prev,
        '--- [TAIL: system_logs/runtime.log] ---',
        ...kernelLogs.slice(0, 10).map(l => `  ${l}`),
        '--- [EOF: Log tail stream paused] ---'
      ]);
      return;
    }

    if (lower === 'sf-clean' || lower.includes('rm -f')) {
      setExportedRecords([]);
      setSelectedRecordData(null);
      setStorageAlert(null);
      addKernelLog('ROTATION', 'All historical JSON presets purged via sf-clean shortcut.');
      setTermuxTerminalLines(prev => [
        ...prev,
        '  🔄 [CLEANER] Purged all historical JSON records from ./acoustic_export_data/*.json',
        '  ✅ Storage space reclaimed: 0.00 KB used of 25.0 KB capacity.'
      ]);
      return;
    }

    if (lower.startsWith('pkg') || lower.includes('pkg install')) {
      setTermuxTerminalLines(prev => [
        ...prev,
        '[+] Syncing core packages and missing dependencies...',
        'Hit:1 https://termux.net stable InRelease',
        'Reading package lists... Done',
        'Building dependency tree... Done',
        'python is already the newest version (3.11.8)',
        'ndk-sysroot is already the newest version',
        'clang is already the newest version (18.1.2)',
        'coreutils is already the newest version (9.4-1)',
        'procps is already the newest version (4.0.4)',
        '[+] 0 upgraded, 0 newly installed, 0 to remove. All toolchains ready.'
      ]);
      return;
    }

    if (lower === 'ls' || lower.startsWith('ls ')) {
      setTermuxTerminalLines(prev => [
        ...prev,
        'drwx------  4 u0_a241 u0_a241  4096 Oct 12 04:00 acoustic_export_data',
        'drwx------  2 u0_a241 u0_a241  4096 Oct 12 04:00 system_logs',
        '-rw-------  1 u0_a241 u0_a241  1420 Oct 12 04:00 schema_blueprint.sql',
        '-rwx------  1 u0_a241 u0_a241  6180 Oct 12 04:00 live_monitor.py',
        '-rw-------  1 u0_a241 u0_a241   245 Oct 12 04:00 .bashrc'
      ]);
      return;
    }

    if (lower === 'ps' || lower.startsWith('ps ')) {
      setTermuxTerminalLines(prev => [
        ...prev,
        'PID   USER     TIME   COMMAND',
        ...processes.map(p => `${p.pid.toString().padEnd(5)} ${p.user.padEnd(8)} 0:02   ${p.command} (${(p.memory_used_kb / 1024).toFixed(1)}MB)`)
      ]);
      return;
    }

    if (lower.includes('schema')) {
      setTermuxTerminalLines(prev => [
        ...prev,
        '-- Contents of schema_blueprint.sql:',
        ...SQL_SCHEMA_BLUEPRINT.split('\n').slice(0, 15),
        '-- [... remaining DDL truncated. View in SQL Blueprint Tab]'
      ]);
      return;
    }

    setTermuxTerminalLines(prev => [
      ...prev,
      `bash: ${cmd}: command executed in simulated Termux sandbox. Output logged.`
    ]);
  };

  // Download setup_super_famicom.sh
  const handleDownloadBashScript = () => {
    const blob = new Blob([TERMUX_SETUP_SCRIPT], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup_super_famicom.sh';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download live_monitor.py
  const handleDownloadPySource = () => {
    const blob = new Blob([LIVE_MONITOR_PY_SOURCE], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'live_monitor.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered devices
  const filteredDevices = useMemo(() => {
    if (deviceFilter === 'ALL') return HAK5_DEVICE_INVENTORY;
    return HAK5_DEVICE_INVENTORY.filter(d => d.category.toLowerCase().includes(deviceFilter.toLowerCase()));
  }, [deviceFilter]);

  return (
    <div className="space-y-6 font-mono text-slate-100">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-cyan-800/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-600/80 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Gamepad2 className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  PROJECT SUPER FAMICOM
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                    TERMUX CORE v4.2
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                    HAK5 ARSENAL
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Acoustic Binaural Synthesis Matrix · Termux Hardware Diagnostics · DuckyScript 3.0 Compiler IDE · Hak5 Device Fleet
                </p>
              </div>
            </div>
          </div>

          {/* Quick Hardware Indicators */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-black/60 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">CPU:</span>
              <span className="text-cyan-300 font-bold">{cpuUsagePercent}%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400">RAM:</span>
              <span className="text-purple-300 font-bold">{ramUsageMb} / {totalRamMb} MB</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">STORAGE:</span>
              <span className={`font-bold ${totalStorageKb > 22 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {totalStorageKb} / 25.0 KB
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('synthesizer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeSubTab === 'synthesizer'
                ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>1. ACOUSTIC SYNTHESIZER & TELEMETRY</span>
          </button>

          <button
            onClick={() => setActiveSubTab('termux_cli')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeSubTab === 'termux_cli'
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>2. TERMUX SHELL & DAEMON ENGINE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('payload_studio')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeSubTab === 'payload_studio'
                ? 'bg-amber-950 border border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>3. DUCKY SCRIPT 3.0 IDE & COMPILER</span>
          </button>

          <button
            onClick={() => setActiveSubTab('device_matrix')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeSubTab === 'device_matrix'
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>4. HAK5 DEVICE INVENTORY & FIRMWARE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cloud_c2')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeSubTab === 'cloud_c2'
                ? 'bg-indigo-950 border border-indigo-500 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>5. CLOUD C² FLEET CONSOLE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sql_blueprint')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer ${
              activeSubTab === 'sql_blueprint'
                ? 'bg-purple-950 border border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>6. SQL SCHEMA BLUEPRINT & RUNNER</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUB-TAB 1: ACOUSTIC SYNTHESIZER & TERMUX TELEMETRY             */}
      {/* ============================================================== */}
      {activeSubTab === 'synthesizer' && (
        <div className="space-y-6">
          {storageAlert && (
            <div className="p-3 bg-amber-950/80 border border-amber-600 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>{storageAlert}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Dual-Channel Binaural Beating Controls & Canvas */}
            <div className="lg:col-span-7 space-y-6">
              {/* Oscilloscope Canvas Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      Real-Time Binaural Waveform Superposition
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span className="text-cyan-300 font-bold">L: {carrierHz.toFixed(1)} Hz</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span className="text-purple-300 font-bold">R: {(carrierHz + differentialHz).toFixed(1)} Hz</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-amber-300 font-bold">BEAT: {differentialHz.toFixed(2)} Hz</span>
                    </div>
                  </div>
                </div>

                <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-[#060a12] shadow-inner">
                  <canvas 
                    ref={canvasRef} 
                    width={720} 
                    height={220} 
                    className="w-full h-[220px] block"
                  />
                  <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono pointer-events-none">
                    44.1 kHz STEREO DAC · TIME DIVISION 10ms · BEAT ENVELOPE: {differentialHz.toFixed(2)} Hz ({activeBandName})
                  </div>
                </div>

                {/* Audio Master Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayAudio}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition min-h-[44px] cursor-pointer shadow-lg ${
                        isPlayingAudio 
                          ? 'bg-rose-950 border border-rose-600 text-rose-300 hover:bg-rose-900' 
                          : 'bg-emerald-950 border border-emerald-600 text-emerald-300 hover:bg-emerald-900'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>MUTE BINAURAL TONE</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>SYNTHESIZE AUDIO STREAM</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleExportJsonPreset}
                      className="px-4 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-600 text-cyan-300 font-bold text-xs flex items-center gap-2 hover:bg-cyan-900 transition min-h-[44px] cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>EXPORT PRESET JSON</span>
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 min-w-[160px]">
                    {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-28 accent-cyan-400 cursor-pointer"
                      title="Volume Level"
                    />
                    <span className="text-xs text-slate-400 font-bold">{Math.round(volume * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Sliders & Waveform Tuning Grid */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Frequency Carriers & Waveform Modulation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Carrier Frequency */}
                  <div className="p-3.5 bg-black/50 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">BASE CARRIER FREQUENCY</span>
                      <span className="text-cyan-300 font-bold text-sm">{carrierHz.toFixed(1)} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="960"
                      step="1"
                      value={carrierHz}
                      onChange={(e) => setCarrierHz(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>40 Hz (Bass)</span>
                      <span>432 Hz (Verdi)</span>
                      <span>528 Hz (Miracle)</span>
                      <span>960 Hz</span>
                    </div>
                  </div>

                  {/* Differential Frequency */}
                  <div className="p-3.5 bg-black/50 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold">TARGET DIFFERENTIAL (BEAT)</span>
                      <span className="text-amber-300 font-bold text-sm">{differentialHz.toFixed(2)} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="50"
                      step="0.1"
                      value={differentialHz}
                      onChange={(e) => setDifferentialHz(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>0.5 Hz (Delta)</span>
                      <span>7.83 Hz (Schumann)</span>
                      <span>10 Hz (Alpha)</span>
                      <span>40 Hz (Gamma)</span>
                    </div>
                  </div>
                </div>

                {/* Waveform Selector */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Harmonic Waveform Topology
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setWaveform(type)}
                        className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition min-h-[44px] cursor-pointer ${
                          waveform === type
                            ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Selection Matrix */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Auditory Brainwave Interval Catalog
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BINAURAL_CATALOG.map(item => (
                      <button
                        key={item.band_name}
                        onClick={() => handleApplyInterval(item)}
                        className={`p-2.5 rounded-xl border text-left transition min-h-[44px] cursor-pointer ${
                          activeBandName === item.band_name
                            ? 'bg-purple-950/60 border-purple-500 text-purple-200'
                            : 'bg-black/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{item.band_name}</div>
                        <div className="text-[10px] text-purple-400 font-mono mt-0.5">
                          {item.lower_frequency_hz} - {item.upper_frequency_hz} Hz ({item.default_diff_hz} Hz)
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Termux Hardware Diagnostics & Export Records */}
            <div className="lg:col-span-5 space-y-6">
              {/* Termux /proc Telemetry Explorer */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Termux /proc Kernel Diagnostics
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    LIVE POLL: 44.1k
                  </span>
                </div>

                {/* RAM and CPU visual gauges */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-bold">RAM CONSUMPTION</div>
                    <div className="text-base font-bold text-cyan-400">
                      {Math.round((ramUsageMb / totalRamMb) * 100)}%
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-cyan-400 h-full transition-all duration-300" 
                        style={{ width: `${(ramUsageMb / totalRamMb) * 100}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {ramUsageMb} MB / {totalRamMb} MB
                    </div>
                  </div>

                  <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-bold">CPU LOAD (/proc/stat)</div>
                    <div className="text-base font-bold text-amber-400">
                      {cpuUsagePercent}%
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, cpuUsagePercent * 2)}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-slate-500">
                      8 Cores Online · Clock 2.84 GHz
                    </div>
                  </div>
                </div>

                {/* Top Resource Consuming Processes */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                    <span>ACTIVE /proc PID HANDLES</span>
                    <span className="text-[10px] text-slate-500">{processes.length} Processes</span>
                  </div>

                  <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                    {processes.map(proc => (
                      <div 
                        key={proc.pid} 
                        className="p-2 bg-black/40 border border-slate-800/80 rounded-lg flex items-center justify-between text-xs hover:border-slate-700 transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-400 font-bold font-mono">PID {proc.pid}</span>
                            <span className="text-slate-300 font-mono text-[11px] truncate">{proc.command}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {(proc.memory_used_kb / 1024).toFixed(1)} MB RAM · {proc.cpu_percent}% CPU
                          </div>
                        </div>

                        <button
                          onClick={() => handleKillProcess(proc.pid)}
                          className="px-2 py-1 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[10px] hover:bg-rose-900 transition min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer flex-shrink-0"
                          title="Terminate PID"
                        >
                          KILL
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Kernel Logs */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Termux Background Daemon Log Trace
                  </div>
                  <div className="bg-black/80 border border-slate-800 rounded-xl p-2.5 h-[110px] overflow-y-auto text-[10px] font-mono space-y-1 text-slate-400 select-all">
                    {kernelLogs.map((log, idx) => (
                      <div key={idx} className="leading-tight">
                        <span className="text-slate-600">{log.slice(0, 10)}</span>
                        <span className={log.includes('ERROR') ? 'text-rose-400' : log.includes('AUDIO') ? 'text-cyan-400' : 'text-slate-300'}>
                          {log.slice(10)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Asymmetric Exported Files & JSON Inspector */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Exported Signal Artifacts (Cap: 25KB)
                    </h3>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    totalStorageKb > 22 ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {totalStorageKb} KB
                  </span>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {exportedRecords.map(rec => (
                    <div 
                      key={rec.id}
                      className="p-2.5 bg-black/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs hover:border-cyan-800 transition"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-white truncate text-[11px]">{rec.filename}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {rec.sizeKb} KB · {rec.timestamp}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setSelectedRecordData(rec.data)}
                          className="px-2 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] hover:bg-cyan-900 transition min-h-[36px] flex items-center cursor-pointer"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          VIEW
                        </button>
                        <button
                          onClick={() => handleDownloadJsonFile(rec)}
                          className="p-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                          title="Download JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected JSON Preview */}
                {selectedRecordData && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400">
                      ARTIFACT SCHEMA INSPECTOR:
                    </div>
                    <pre className="bg-black/90 border border-slate-800 rounded-xl p-3 text-[10px] text-emerald-400 overflow-x-auto max-h-[140px] font-mono">
                      {JSON.stringify(selectedRecordData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: TERMUX CLI & DAEMON ENGINE                          */}
      {/* ============================================================== */}
      {activeSubTab === 'termux_cli' && (
        <div className="space-y-6">
          {/* Subview Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTermuxSubView('terminal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[40px] cursor-pointer flex items-center gap-1.5 ${
                  termuxSubView === 'terminal'
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>INTERACTIVE TERMINAL</span>
              </button>

              <button
                onClick={() => setTermuxSubView('script')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[40px] cursor-pointer flex items-center gap-1.5 ${
                  termuxSubView === 'script'
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>SETUP_SUPER_FAMICOM.SH</span>
              </button>

              <button
                onClick={() => setTermuxSubView('python')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[40px] cursor-pointer flex items-center gap-1.5 ${
                  termuxSubView === 'python'
                    ? 'bg-amber-950 border border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>LIVE_MONITOR.PY</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CWD: ~/super_famicom_termux</span>
            </div>
          </div>

          {/* VIEW 1: INTERACTIVE TERMINAL */}
          {termuxSubView === 'terminal' && (
            <div className="space-y-4">
              {/* Quick Command Launcher Buttons */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Quick Operations & Aliases (~/.bashrc)</span>
                  <span className="text-[10px] text-slate-500">Click to execute in sandbox</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => executeTermuxCommand('sf-run')}
                    disabled={isDaemonRunning}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500 text-emerald-300 text-xs font-bold hover:brightness-125 transition flex items-center gap-1.5 min-h-[42px] cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>sf-run (3-Cycle Daemon)</span>
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('sf-logs')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 min-h-[42px] cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>sf-logs (Tail Log)</span>
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('sf-clean')}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 min-h-[42px] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>sf-clean (Purge 25KB)</span>
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('pkg install')}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition flex items-center gap-1.5 min-h-[42px] cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    <span>pkg install toolchains</span>
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('ls -la')}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition min-h-[42px] cursor-pointer"
                  >
                    ls -la
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('ps aux')}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition min-h-[42px] cursor-pointer"
                  >
                    ps aux
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('cat schema')}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs transition min-h-[42px] cursor-pointer"
                  >
                    cat schema
                  </button>

                  <button
                    onClick={() => executeTermuxCommand('clear')}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs transition min-h-[42px] cursor-pointer ml-auto"
                  >
                    clear
                  </button>
                </div>
              </div>

              {/* Terminal Screen & Input Box */}
              <div className="bg-black/95 border border-emerald-900/60 rounded-2xl p-5 shadow-2xl font-mono space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="text-slate-400 ml-2 font-bold">
                      TERMUX SHELL · com.termux · BASH 5.2.26
                    </span>
                  </div>

                  {isDaemonRunning ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      DAEMON RUNNING (3 CYCLES)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      TERMINAL READY
                    </span>
                  )}
                </div>

                {/* Output log stream */}
                <div className="h-[380px] overflow-y-auto p-4 bg-[#050811] border border-slate-900 rounded-xl space-y-1.5 text-xs text-emerald-400 font-mono select-all">
                  {termuxTerminalLines.map((line, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {line.startsWith('$') ? (
                        <span className="text-cyan-300 font-bold">{line}</span>
                      ) : line.includes('ERROR') ? (
                        <span className="text-rose-400 font-bold">{line}</span>
                      ) : line.includes('✅') || line.includes('EXPORTED') ? (
                        <span className="text-emerald-300 font-bold">{line}</span>
                      ) : line.includes('🚀') || line.includes('DAEMON') ? (
                        <span className="text-amber-300 font-bold">{line}</span>
                      ) : line.includes('=============================================================') ? (
                        <span className="text-slate-500">{line}</span>
                      ) : (
                        <span className="text-slate-300">{line}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Command Line Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeTermuxCommand(termuxCommandInput);
                    setTermuxCommandInput('');
                  }}
                  className="flex items-center gap-2 pt-1"
                >
                  <span className="text-emerald-400 font-bold text-xs">
                    u0_a241@termux:~$
                  </span>
                  <input
                    type="text"
                    value={termuxCommandInput}
                    onChange={(e) => setTermuxCommandInput(e.target.value)}
                    placeholder="Type command (e.g. sf-run, sf-logs, sf-clean, help)..."
                    className="flex-1 bg-black/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 min-h-[42px]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition min-h-[42px] cursor-pointer"
                  >
                    EXECUTE
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 2: SETUP_SUPER_FAMICOM.SH */}
          {termuxSubView === 'script' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    setup_super_famicom.sh (Production Bash Script)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Installs toolchains, initializes directories, generates schema_blueprint.sql & live_monitor.py, configures .bashrc
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(TERMUX_SETUP_SCRIPT);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-600 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition min-h-[42px] cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'COPIED SCRIPT' : 'COPY BASH SCRIPT'}</span>
                  </button>

                  <button
                    onClick={handleDownloadBashScript}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition min-h-[42px] cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD .SH</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-black/90 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed">
                {TERMUX_SETUP_SCRIPT}
              </pre>
            </div>
          )}

          {/* VIEW 3: LIVE_MONITOR.PY */}
          {termuxSubView === 'python' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    live_monitor.py (SuperFamicomEngine Python Core)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Process-aware signal configuration engine, /proc reader, asymmetric cap cleaner, JSON preset exporter
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(LIVE_MONITOR_PY_SOURCE);
                      setCopiedPySource(true);
                      setTimeout(() => setCopiedPySource(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-950 border border-amber-600 text-amber-300 text-xs font-bold hover:bg-amber-900 transition min-h-[42px] cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedPySource ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPySource ? 'COPIED PYTHON' : 'COPY PYTHON'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPySource}
                    className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-600 text-cyan-300 text-xs font-bold hover:bg-cyan-900 transition min-h-[42px] cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD .PY</span>
                  </button>

                  <button
                    onClick={() => {
                      setTermuxSubView('terminal');
                      executeTermuxCommand('sf-run');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-bold hover:bg-emerald-900 transition min-h-[42px] cursor-pointer flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>RUN DAEMON NOW</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-black/90 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono overflow-x-auto max-h-[500px] leading-relaxed">
                {LIVE_MONITOR_PY_SOURCE}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: HAK5 PAYLOAD STUDIO PRO & DUCKY SCRIPT 3.0 IDE     */}
      {/* ============================================================== */}
      {activeSubTab === 'payload_studio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Columns: Payload Repository Catalog */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Official Hak5 Payloads Library
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    DuckyScript 3.0
                  </span>
                </div>

                <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
                  {DUCKY_PAYLOAD_REPOSITORY.map(payload => (
                    <button
                      key={payload.id}
                      onClick={() => handleSelectPayload(payload)}
                      className={`w-full p-3 rounded-xl border text-left transition cursor-pointer min-h-[44px] ${
                        selectedPayloadId === payload.id
                          ? 'bg-amber-950/60 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                          : 'bg-black/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white line-clamp-1">{payload.title}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 flex-shrink-0">
                          {payload.target_os}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {payload.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80">
                        <span>{payload.category}</span>
                        <span className="text-amber-400">{payload.author}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 8 Columns: DuckyScript Editor, Compiler & Typewriter Simulator */}
            <div className="lg:col-span-8 space-y-6">
              {/* Editor Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Payload Studio IDE · DuckyScript 3.0
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Target: {simTargetOs}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopyDuckyCode}
                      className="px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 hover:text-white transition min-h-[38px] cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
                    </button>

                    <button
                      onClick={() => compileDuckyScript(duckyCode)}
                      className="px-3 py-1.5 rounded-lg bg-amber-950 border border-amber-600 text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-900 transition min-h-[38px] cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>COMPILE INJECT.BIN</span>
                    </button>

                    <button
                      onClick={handleDownloadInjectBin}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-600 text-cyan-300 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-900 transition min-h-[38px] cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD .BIN ({bytecodeSize}B)</span>
                    </button>
                  </div>
                </div>

                {/* Code Textarea with line numbers */}
                <div className="relative border border-slate-800 rounded-xl overflow-hidden bg-black/80 font-mono text-xs">
                  <textarea
                    value={duckyCode}
                    onChange={(e) => {
                      setDuckyCode(e.target.value);
                      compileDuckyScript(e.target.value);
                    }}
                    rows={14}
                    className="w-full p-4 bg-transparent text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-black"
                    spellCheck={false}
                  />
                </div>

                {/* Bytecode Hex Dump Viewer */}
                <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>COMPILED BYTECODE (inject.bin HEX DUMP)</span>
                    <span className="text-cyan-400 font-mono">{bytecodeSize} Bytes</span>
                  </div>
                  <div className="bg-black/90 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 tracking-widest break-all max-h-[70px] overflow-y-auto">
                    {compiledBytecode || '51 55 41 43 4B 03 ...'}
                  </div>
                </div>

                {/* Virtual Injection Simulator Runner */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={handleSimulateKeystrokes}
                    disabled={typingSimulating}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition min-h-[44px] cursor-pointer shadow-lg ${
                      typingSimulating
                        ? 'bg-amber-950/60 border border-amber-700 text-amber-300 animate-pulse'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-black font-extrabold'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>{typingSimulating ? 'INJECTING KEYSTROKES...' : 'TEST INJECTION ON VIRTUAL TARGET'}</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>SIM TARGET:</span>
                    {(['Windows', 'macOS', 'Linux'] as const).map(os => (
                      <button
                        key={os}
                        onClick={() => setSimTargetOs(os)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                          simTargetOs === os
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                            : 'bg-black/40 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Virtual Target Keystroke Screen Monitor */}
              {simulatedScreenOutput.length > 0 && (
                <div className="bg-black/95 border border-cyan-900 rounded-2xl p-5 shadow-2xl space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      <span className="text-xs text-slate-400 ml-2 font-bold">
                        VIRTUAL {simTargetOs.toUpperCase()} TARGET SCREEN (1000 WPM INJECTION)
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 animate-pulse">● HID STREAM ACTIVE</span>
                  </div>

                  <div className="bg-[#050811] p-4 rounded-xl border border-slate-800/80 text-xs text-slate-200 font-mono space-y-1.5 max-h-[220px] overflow-y-auto">
                    {simulatedScreenOutput.map((out, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {out.startsWith('[TYPEWRITER >]') ? (
                          <span className="text-cyan-300 font-bold">{out}</span>
                        ) : out.startsWith('[HARDWARE]') ? (
                          <span className="text-amber-400 font-bold">{out}</span>
                        ) : out.startsWith('[COMPLETION]') ? (
                          <span className="text-emerald-400 font-bold">{out}</span>
                        ) : (
                          <span className="text-slate-400">{out}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: HAK5 FULL DEVICE ARSENAL & FIRMWARE MATRIX         */}
      {/* ============================================================== */}
      {activeSubTab === 'device_matrix' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {[
              'ALL', 
              'Keystroke Injection', 
              'Wireless Auditing', 
              'Multi-Function Implant', 
              'Network Implant', 
              'Hardware Keylogger', 
              'Surveillance & Video', 
              'Command & Control'
            ].map(cat => (
              <button
                key={cat}
                onClick={() => setDeviceFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition min-h-[38px] cursor-pointer ${
                  deviceFilter === cat
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                    : 'bg-black/40 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Device Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map(device => (
              <div 
                key={device.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-cyan-700/80 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white tracking-wide">
                        {device.name}
                      </h4>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                        {device.codename}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${device.badge_color}`}>
                      {device.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {device.description}
                  </p>

                  <div className="p-3 bg-black/60 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Primary OS:</span>
                      <span className="text-white font-bold truncate max-w-[170px]">{device.primary_os}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Firmware:</span>
                      <span className="text-cyan-300 truncate max-w-[170px]">{device.firmware_suite}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Payloads:</span>
                      <span className="text-amber-300 truncate max-w-[170px]">{device.payload_language}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Capabilities:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      {device.key_features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={device.official_repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                  >
                    <span>OFFICIAL REPOSITORY</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      setActiveSubTab('payload_studio');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition min-h-[36px] cursor-pointer"
                  >
                    LOAD SCRIPTS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 4: CLOUD C² FLEET CONSOLE                             */}
      {/* ============================================================== */}
      {activeSubTab === 'cloud_c2' && (
        <div className="space-y-6">
          {c2ActionNotice && (
            <div className="p-3 bg-indigo-950/80 border border-indigo-600 rounded-xl text-xs text-indigo-200 flex items-center justify-between">
              <span>{c2ActionNotice}</span>
              <button 
                onClick={() => setC2ActionNotice(null)}
                className="text-indigo-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Cloud C² Central Fleet Orchestrator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Encrypted TLS WebSocket Gateway · Remote Provisioning · Exfiltration Bucket Telemetry
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setC2ActionNotice('Fleet telemetry ping dispatched across 5 devices. All beacons responding.');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-600 text-indigo-300 text-xs font-bold hover:bg-indigo-900 transition min-h-[44px] cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>SYNC FLEET PING</span>
                </button>
              </div>
            </div>

            {/* Fleet Devices Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">DEVICE CODENAME</th>
                    <th className="py-2.5 px-3">HARDWARE PROFILE</th>
                    <th className="py-2.5 px-3">IP ADDRESS</th>
                    <th className="py-2.5 px-3">STATUS</th>
                    <th className="py-2.5 px-3">ACTIVE PAYLOAD</th>
                    <th className="py-2.5 px-3">EXFIL DUMPS</th>
                    <th className="py-2.5 px-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {c2Devices.map(dev => (
                    <tr key={dev.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-bold text-white">{dev.name}</td>
                      <td className="py-3 px-3 text-slate-400">{dev.device_type}</td>
                      <td className="py-3 px-3 text-cyan-300">{dev.ip_address}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          dev.status === 'ARMED' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                          dev.status === 'ACTIVE_SNIFFING' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                          dev.status === 'EXFILTRATING' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                          'bg-cyan-950 text-cyan-300 border-cyan-800'
                        }`}>
                          {dev.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{dev.active_payload}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{dev.exfil_records} files</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setC2ActionNotice(`Provisioning new DuckyScript task to ${dev.name} via Cloud C²...`);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold min-h-[36px] cursor-pointer"
                        >
                          PROVISION
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 5: SQL SCHEMA BLUEPRINT & RUNNER                      */}
      {/* ============================================================== */}
      {activeSubTab === 'sql_blueprint' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Columns: Schema DDL */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      schema_blueprint.sql (PostgreSQL 16)
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SQL_SCHEMA_BLUEPRINT);
                    }}
                    className="px-2 py-1 rounded bg-black/60 border border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer"
                  >
                    COPY DDL
                  </button>
                </div>

                <pre className="p-4 bg-black/80 border border-slate-800 rounded-xl text-xs text-purple-300 font-mono overflow-x-auto max-h-[500px]">
                  {SQL_SCHEMA_BLUEPRINT}
                </pre>
              </div>
            </div>

            {/* Right 6 Columns: Interactive Query Runner */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Interactive SQL Query Runner
                  </h3>
                  <button
                    onClick={handleRunSql}
                    className="px-4 py-1.5 rounded-lg bg-purple-950 border border-purple-600 text-purple-300 text-xs font-bold hover:bg-purple-900 transition min-h-[38px] cursor-pointer"
                  >
                    EXECUTE SQL
                  </button>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-black/80 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="text-slate-500">Quick queries:</span>
                    <button
                      onClick={() => setSqlQuery('SELECT * FROM binaural_frequency_catalog;')}
                      className="text-cyan-400 hover:underline"
                    >
                      catalog
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setSqlQuery('SELECT * FROM custom_frequency_presets;')}
                      className="text-cyan-400 hover:underline"
                    >
                      presets
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setSqlQuery('SELECT * FROM user_profiles;')}
                      className="text-cyan-400 hover:underline"
                    >
                      users
                    </button>
                  </div>
                </div>

                {sqlResults && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      QUERY RESULT SET ({sqlResults.length} ROWS):
                    </span>
                    <div className="overflow-x-auto max-h-[300px] border border-slate-800 rounded-xl bg-black/60">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/80">
                            {Object.keys(sqlResults[0] || {}).map(col => (
                              <th key={col} className="p-2 text-[10px] uppercase">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {sqlResults.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-800/40">
                              {Object.values(row).map((val: any, cidx) => (
                                <td key={cidx} className="p-2 text-[11px] text-slate-300 whitespace-nowrap">
                                  {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
