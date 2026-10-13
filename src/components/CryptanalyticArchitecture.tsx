import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Binary, 
  Zap, 
  Database, 
  Layers, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Activity, 
  Server, 
  Atom, 
  Table, 
  Terminal, 
  FileCode2, 
  Flame, 
  ArrowRight, 
  Check, 
  Copy, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  HashTarget, 
  WorkerSlot, 
  ComplexityTier, 
  HashAlgorithmType, 
  SolverEngineType, 
  JobRecord,
  SolverLog,
  QuantumMetric
} from '../types/cryptanalysisBlueprint';
import { 
  SLA_WINDOW_SECONDS, 
  MAX_BATCH_SIZE, 
  TOTAL_WORKER_CONCURRENCY,
  TIER_CONFIGS, 
  QUANTUM_BENCHMARK_MATRIX, 
  INITIAL_BATCH_50_HASHES, 
  INITIAL_WORKER_SLOTS,
  SAT_TIMEOUT_PREEMPTION_MS
} from '../data/cryptanalysisData';

export const CryptanalyticArchitecture: React.FC = () => {
  // Master active tab inside the blueprint
  const [activeTab, setActiveTab] = useState<'batch' | 'sat' | 'algebraic' | 'quantum' | 'database'>('batch');

  // Batch Execution & SLA State
  const [batch, setBatch] = useState<HashTarget[]>(INITIAL_BATCH_50_HASHES);
  const [workerSlots, setWorkerSlots] = useState<WorkerSlot[]>(INITIAL_WORKER_SLOTS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(182.4);
  const [slaTimeLimit] = useState<number>(SLA_WINDOW_SECONDS);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Filters & Search
  const [tierFilter, setTierFilter] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SOLVED' | 'PROCESSING' | 'PREEMPTED' | 'EXHAUSTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<HashTarget | null>(INITIAL_BATCH_50_HASHES[0]);

  // SAT Interactive State
  const [satBitA, setSatBitA] = useState<number>(1);
  const [satBitB, setSatBitB] = useState<number>(1);
  const [satCarryIn, setSatCarryIn] = useState<number>(0);
  const [useRelaxationConstraints, setUseRelaxationConstraints] = useState<boolean>(true);
  const [satSimulatedTime, setSatSimulatedTime] = useState<number>(7.4);

  // Algebraic GF(2) Playground State
  const [gf2A, setGf2A] = useState<number>(1);
  const [gf2B, setGf2B] = useState<number>(0);

  // Quantum Explorer State
  const [quantumActiveAlg, setQuantumActiveAlg] = useState<string>('SHA-256');

  // Database Tab State
  const [dbActiveTable, setDbActiveTable] = useState<'tbl_jobs' | 'tbl_hash_targets' | 'tbl_solver_logs' | 'tbl_quantum_metrics'>('tbl_hash_targets');
  const [sqlQueryInput, setSqlQueryInput] = useState<string>('SELECT detected_type, COUNT(*), AVG(execution_time_ms) as avg_ms FROM tbl_hash_targets GROUP BY detected_type;');
  const [sqlQueryResult, setSqlQueryResult] = useState<string | null>(null);

  // Custom hash injector modal
  const [showInjectModal, setShowInjectModal] = useState<boolean>(false);
  const [customHashInput, setCustomHashInput] = useState<string>('');
  const [customSaltInput, setCustomSaltInput] = useState<string>('');

  // Derived Batch Metrics
  const solvedCount = useMemo(() => batch.filter(t => t.status === 'SOLVED').length, [batch]);
  const exhaustedCount = useMemo(() => batch.filter(t => t.status === 'EXHAUSTED').length, [batch]);
  const preemptedCount = useMemo(() => batch.filter(t => t.preempted_from_sat).length, [batch]);
  const progressPercent = useMemo(() => (solvedCount / batch.length) * 100, [solvedCount, batch.length]);
  const aggregateThroughput = useMemo(() => {
    return elapsedSeconds > 0 ? (solvedCount / elapsedSeconds).toFixed(3) : '0.000';
  }, [solvedCount, elapsedSeconds]);

  // SLA time remaining
  const slaRemainingSeconds = Math.max(0, slaTimeLimit - elapsedSeconds);
  const isWithinSla = elapsedSeconds <= slaTimeLimit;

  // Real-time SLA Execution Tick Engine
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isProcessing) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 0.5;
          if (next >= slaTimeLimit) {
            setIsProcessing(false);
          }
          return parseFloat(next.toFixed(1));
        });

        // Advance workers and uncompleted batch items
        setBatch(prevBatch => {
          const pendingIdx = prevBatch.findIndex(t => t.status === 'UNRESOLVED' || t.status === 'PROCESSING');
          if (pendingIdx === -1) {
            setIsProcessing(false);
            return prevBatch;
          }

          return prevBatch.map((target, idx) => {
            if (idx === pendingIdx) {
              return {
                ...target,
                status: 'SOLVED',
                preimage_result: target.preimage_result || `candidate_key_${Math.random().toString(36).substring(2, 8)}`,
                execution_time_ms: target.execution_time_ms || Math.floor(Math.random() * 8000 + 500)
              };
            }
            return target;
          });
        });

        // Randomize worker progress
        setWorkerSlots(prevSlots => prevSlots.map(w => ({
          ...w,
          status: 'BUSY',
          progressPercent: Math.min(100, (w.progressPercent + Math.floor(Math.random() * 25) + 10) % 100),
          hashRateMhs: w.isGpuAccelerated ? +(1420 + Math.random() * 60 - 30).toFixed(1) : +(45 + Math.random() * 6 - 3).toFixed(1)
        })));
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, slaTimeLimit]);

  // Copy to clipboard helper
  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Reset entire batch
  const handleResetBatch = () => {
    setIsProcessing(false);
    setElapsedSeconds(0);
    setBatch(INITIAL_BATCH_50_HASHES.map((t, idx) => {
      // Keep some solved or reset to unresolved
      return {
        ...t,
        status: 'UNRESOLVED',
        preimage_result: null,
        execution_time_ms: 0
      };
    }));
    setWorkerSlots(INITIAL_WORKER_SLOTS);
  };

  // Fast solve all to full completion (satisfying benchmark target)
  const handleFastBenchmarkSolve = () => {
    setIsProcessing(false);
    setElapsedSeconds(182.4); // Expected parallel time under blueprint formula
    setBatch(INITIAL_BATCH_50_HASHES);
    setWorkerSlots(INITIAL_WORKER_SLOTS.map(w => ({
      ...w,
      status: 'DONE',
      progressPercent: 100
    })));
  };

  // Preemption simulation
  const handleSimulate15sPreemption = () => {
    setBatch(prev => prev.map(t => {
      if (t.target_id === 'tgt-42') {
        return {
          ...t,
          status: 'SOLVED',
          assigned_engine: 'GPU',
          preempted_from_sat: true,
          execution_time_ms: 16800,
          preimage_result: 'preempted_gpu_kernel_fallback'
        };
      }
      return t;
    }));
    // Flash worker slot 10
    setWorkerSlots(prev => prev.map(w => {
      if (w.slot_id === 10) {
        return {
          ...w,
          status: 'PREEMPTING',
          progressPercent: 100
        };
      }
      return w;
    }));
    setTimeout(() => {
      setWorkerSlots(prev => prev.map(w => w.slot_id === 10 ? { ...w, status: 'DONE' } : w));
    }, 1500);
  };

  // Dynamic Classifier for Custom Hash
  const handleInjectCustomHash = () => {
    if (!customHashInput.trim()) return;
    const cleanHash = customHashInput.trim();
    let detected: HashAlgorithmType = 'SHA-256';
    let tier: ComplexityTier = 2;
    let engine: SolverEngineType = 'GPU';

    const len = cleanHash.length;
    if (len === 32) {
      if (customSaltInput) {
        detected = 'Salted-MD5';
        tier = 4;
        engine = 'HEURISTIC';
      } else {
        detected = 'MD5';
        tier = 1;
        engine = 'LOOKUP';
      }
    } else if (len === 40) {
      detected = 'SHA-1';
      tier = 1;
      engine = 'LOOKUP';
    } else if (len === 64) {
      if (customSaltInput) {
        detected = 'Salted-SHA256';
        tier = 4;
        engine = 'HEURISTIC';
      } else {
        detected = 'SHA-256';
        tier = 2;
        engine = 'GPU';
      }
    } else if (len === 128) {
      detected = 'SHA-512';
      tier = 2;
      engine = 'GPU';
    }

    const newTarget: HashTarget = {
      target_id: `tgt-${Date.now().toString().slice(-4)}`,
      job_id: 'job-custom-01',
      raw_hash: cleanHash,
      salt: customSaltInput.trim() || null,
      detected_type: detected,
      complexity_tier: tier,
      status: 'PROCESSING',
      preimage_result: null,
      execution_time_ms: 3200,
      assigned_engine: engine,
      worker_slot: Math.floor(Math.random() * 16) + 1,
      confidence: 0.98,
      entropy_score: 4.85
    };

    setBatch(prev => [newTarget, ...prev.slice(0, 49)]);
    setSelectedTarget(newTarget);
    setShowInjectModal(false);
    setCustomHashInput('');
    setCustomSaltInput('');

    // Auto-solve after 2 seconds
    setTimeout(() => {
      setBatch(prev => prev.map(t => t.target_id === newTarget.target_id ? {
        ...t,
        status: 'SOLVED',
        preimage_result: 'recovered_key_' + Math.random().toString(36).slice(2, 7)
      } : t));
    }, 2000);
  };

  // Filtered batch targets
  const filteredBatch = useMemo(() => {
    return batch.filter(t => {
      if (tierFilter !== 'ALL' && t.complexity_tier !== tierFilter) return false;
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchHash = t.raw_hash.toLowerCase().includes(q);
        const matchType = t.detected_type.toLowerCase().includes(q);
        const matchPreimage = t.preimage_result?.toLowerCase().includes(q);
        if (!matchHash && !matchType && !matchPreimage) return false;
      }
      return true;
    });
  }, [batch, tierFilter, statusFilter, searchQuery]);

  // SQL query executor
  const handleExecuteSql = () => {
    const q = sqlQueryInput.trim().toUpperCase();
    if (q.includes('COUNT') || q.includes('GROUP BY')) {
      setSqlQueryResult(JSON.stringify([
        { detected_type: 'MD5', count: 10, avg_execution_ms: 202.5, success_rate: '100%' },
        { detected_type: 'SHA-1', count: 5, avg_execution_ms: 406.0, success_rate: '100%' },
        { detected_type: 'SHA-256', count: 14, avg_execution_ms: 6120.0, success_rate: '100%' },
        { detected_type: 'MD4-39', count: 4, avg_execution_ms: 7775.0, success_rate: '100%' },
        { detected_type: 'Hybrid-SHA512-BLAKE3', count: 2, avg_execution_ms: 29450.0, success_rate: '50%' }
      ], null, 2));
    } else {
      setSqlQueryResult(JSON.stringify(batch.slice(0, 5).map(t => ({
        target_id: t.target_id,
        raw_hash: t.raw_hash.slice(0, 16) + '...',
        detected_type: t.detected_type,
        status: t.status,
        execution_time_ms: t.execution_time_ms
      })), null, 2));
    }
  };

  // Export DB data
  const handleExportDatabase = (format: 'json' | 'sql' | 'csv') => {
    let content = '';
    let mimeType = 'application/json';
    let filename = `cryptanalytic_batch_export.${format}`;

    if (format === 'json') {
      content = JSON.stringify({
        job: {
          job_id: 'job-init-001',
          total_hashes: batch.length,
          solved: solvedCount,
          elapsed_sec: elapsedSeconds,
          sla_compliance: isWithinSla
        },
        hash_targets: batch,
        quantum_benchmarks: QUANTUM_BENCHMARK_MATRIX
      }, null, 2);
    } else if (format === 'csv') {
      mimeType = 'text/csv';
      const headers = ['target_id', 'job_id', 'raw_hash', 'salt', 'detected_type', 'complexity_tier', 'status', 'preimage_result', 'execution_time_ms', 'assigned_engine'];
      const rows = batch.map(t => [
        t.target_id,
        t.job_id,
        t.raw_hash,
        t.salt || '',
        t.detected_type,
        t.complexity_tier,
        t.status,
        t.preimage_result || '',
        t.execution_time_ms,
        t.assigned_engine
      ].join(','));
      content = [headers.join(','), ...rows].join('\n');
    } else if (format === 'sql') {
      mimeType = 'text/plain';
      content = `-- High-Throughput Cryptanalytic System Architecture: DDL & Seed Dump\n` +
        `CREATE TABLE tbl_jobs (\n` +
        `  job_id UUID PRIMARY KEY,\n` +
        `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n` +
        `  total_hashes INTEGER CHECK (total_hashes <= 50),\n` +
        `  time_limit_sec INTEGER DEFAULT 300,\n` +
        `  status VARCHAR(32) NOT NULL\n` +
        `);\n\n` +
        `CREATE TABLE tbl_hash_targets (\n` +
        `  target_id UUID PRIMARY KEY,\n` +
        `  job_id UUID REFERENCES tbl_jobs(job_id),\n` +
        `  raw_hash VARCHAR(256) NOT NULL,\n` +
        `  salt VARCHAR(128),\n` +
        `  detected_type VARCHAR(64) NOT NULL,\n` +
        `  complexity_tier INTEGER CHECK (complexity_tier BETWEEN 1 AND 4),\n` +
        `  status VARCHAR(32) NOT NULL,\n` +
        `  preimage_result BYTEA,\n` +
        `  execution_time_ms INTEGER\n` +
        `);\n\n` +
        batch.map(t => `INSERT INTO tbl_hash_targets (target_id, job_id, raw_hash, detected_type, complexity_tier, status, preimage_result, execution_time_ms) VALUES ('${t.target_id}', 'job-init-001', '${t.raw_hash}', '${t.detected_type}', ${t.complexity_tier}, '${t.status}', '${t.preimage_result || ''}', ${t.execution_time_ms});`).join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Tseitin Modular Addition Calculation
  const tseitinSum = satBitA ^ satBitB ^ satCarryIn;
  const tseitinCarryOut = (satBitA & satBitB) | (satBitA & satCarryIn) | (satBitB & satCarryIn);

  return (
    <div className="bg-slate-950/95 border border-cyan-900/40 rounded-xl p-4 sm:p-6 shadow-2xl space-y-6 text-slate-100 font-sans">
      {/* Blueprint Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              BLUEPRINT SPECIFICATION
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              MULTI-ENGINE HASH INVERSION
            </span>
            <span className="text-xs font-mono text-slate-400">
              50 Hashes / 300s SLA Window • 16-Worker Concurrency
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2.5">
            <Server className="w-6 h-6 text-cyan-400" />
            High-Throughput Cryptanalytic System Architecture
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1 max-w-4xl leading-relaxed">
            Dynamic solver routing bridging Boolean Satisfiability (SAT) with CDCL constraint relaxation, finite-field $\mathbb&#123;F&#125;_2$ Gröbner bases, massively parallel GPU mutation kernels, and Grover quantum oracle decomposition.
          </p>
        </div>

        {/* Global Blueprint Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsProcessing(!isProcessing)}
            className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
              isProcessing 
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isProcessing ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                PAUSE INVERSION
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                EXECUTE 300s PIPELINE
              </>
            )}
          </button>

          <button
            onClick={handleFastBenchmarkSolve}
            className="px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Fast Solve 50 Hashes (Benchmark Target: ~182.4s parallel completion)"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            BENCHMARK SOLVE
          </button>

          <button
            onClick={handleSimulate15sPreemption}
            className="px-3 py-2 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Simulate 15-second SAT timeout preempting to GPU worker pool"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            TEST 15s SAT PREEMPTION
          </button>

          <button
            onClick={handleResetBatch}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Reset Batch State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SLA Budget & Performance Cockpit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: 300-Second SLA Timer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              SLA TIMER (300s LIMIT)
            </span>
            <span className={isWithinSla ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {isWithinSla ? 'WITHIN SLA' : 'SLA BREACHED'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-2xl font-bold font-mono text-white">
              {elapsedSeconds.toFixed(1)}s
              <span className="text-xs text-slate-500 font-normal"> / 300.0s</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {slaRemainingSeconds.toFixed(1)}s left
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                elapsedSeconds < 240 ? 'bg-cyan-500' : elapsedSeconds <= 300 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (elapsedSeconds / slaTimeLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Resolution Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              BATCH RESOLUTION
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              {progressPercent.toFixed(0)}% COMPLETE
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-2xl font-bold font-mono text-emerald-300">
              {solvedCount}
              <span className="text-xs text-slate-500 font-normal"> / 50 Hashes</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {preemptedCount > 0 && <span className="text-purple-400">{preemptedCount} Preempted · </span>}
              {exhaustedCount > 0 ? `${exhaustedCount} Exhausted` : '0 Exhausted'}
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Aggregate Throughput */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              AGGREGATE THROUGHPUT
            </span>
            <span className="text-xs text-purple-300 font-mono">
              TARGET: 0.167 h/s
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-2xl font-bold font-mono text-purple-300">
              {aggregateThroughput}
              <span className="text-xs text-slate-400 font-normal"> h/s</span>
            </div>
            <div className="text-xs font-mono text-emerald-400">
              +58% vs baseline
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 truncate">
            Peak Capacity: 0.274 h/s across 16 slots
          </div>
        </div>

        {/* Metric 4: Total System Capacity Formula */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-cyan-400" />
              CAPACITY FORMULA
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">THEORETICAL</span>
          </div>
          <div className="font-mono text-[11px] text-cyan-200 bg-black/60 p-1.5 rounded border border-slate-800 my-1">
            ∑ (N_k · τ_k) / C_k ≈ 180s ≤ 300s
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Heterogeneous Slots: 16</span>
            <span className="text-emerald-400 font-bold">Safe Headroom: 120s</span>
          </div>
        </div>
      </div>

      {/* 16-Worker Concurrency Grid (Heterogeneous Hardware Slots) */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              16-Worker Concurrency Model (Heterogeneous Pipeline Slots)
            </h2>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Slots 1-4: In-Memory / SAT
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Slots 5-8: CDCL SAT (ρ)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Slots 9-14: GPU CUDA
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" /> Slots 15-16: Heuristic
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-16 gap-2">
          {workerSlots.map((worker) => {
            const isGpu = worker.isGpuAccelerated;
            const isPreempting = worker.status === 'PREEMPTING';

            return (
              <div 
                key={worker.slot_id}
                className={`p-2 rounded-lg border font-mono text-[10px] transition flex flex-col justify-between ${
                  isPreempting 
                    ? 'bg-purple-950/70 border-purple-500 animate-pulse'
                    : worker.status === 'BUSY'
                    ? 'bg-slate-900 border-cyan-800/60'
                    : 'bg-black/50 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-300">W-{String(worker.slot_id).padStart(2, '0')}</span>
                  <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                    worker.engine === 'LOOKUP' ? 'bg-cyan-950 text-cyan-300' :
                    worker.engine === 'SAT' ? 'bg-amber-950 text-amber-300' :
                    worker.engine === 'GPU' ? 'bg-emerald-950 text-emerald-300' :
                    'bg-purple-950 text-purple-300'
                  }`}>
                    {worker.engine}
                  </span>
                </div>
                
                <div className="my-1">
                  <div className="text-[9px] text-slate-400 truncate">
                    {isPreempting ? 'PREEMPTING' : isGpu ? `${worker.hashRateMhs} MH/s` : 'Active'}
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full ${isPreempting ? 'bg-purple-400' : isGpu ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                      style={{ width: `${worker.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="text-[8px] text-slate-400 truncate">
                  {worker.status === 'DONE' ? 'IDLE/READY' : worker.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="border-b border-slate-800 flex items-center overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('batch')}
          className={`px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'batch'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-4 h-4 text-cyan-400" />
          50-HASH BATCH QUEUE & CLASSIFIER
        </button>

        <button
          onClick={() => setActiveTab('sat')}
          className={`px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'sat'
              ? 'border-amber-400 text-amber-300 bg-amber-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Binary className="w-4 h-4 text-amber-400" />
          SAT ENGINE & RELAXATION (ρ)
        </button>

        <button
          onClick={() => setActiveTab('algebraic')}
          className={`px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'algebraic'
              ? 'border-purple-400 text-purple-300 bg-purple-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-purple-400" />
          ALGEBRAIC & GRÖBNER BASES (GF(2))
        </button>

        <button
          onClick={() => setActiveTab('quantum')}
          className={`px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'quantum'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Atom className="w-4 h-4 text-cyan-400" />
          QUANTUM GROVER ORACLE DECOMPOSITION
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'database'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          RELATIONAL DATABASE & TELEMETRY
        </button>
      </div>

      {/* =========================================================================
          TAB 1: 50-HASH BATCH EXECUTION & CLASSIFIER
      ========================================================================= */}
      {activeTab === 'batch' && (
        <div className="space-y-5">
          {/* Workload Partitioning Cards (from Blueprint Table) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TIER_CONFIGS.map(tier => {
              const targetsInTier = batch.filter(t => t.complexity_tier === tier.tier);
              const solvedInTier = targetsInTier.filter(t => t.status === 'SOLVED').length;

              return (
                <div 
                  key={tier.tier}
                  onClick={() => setTierFilter(tierFilter === tier.tier ? 'ALL' : tier.tier)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    tierFilter === tier.tier 
                      ? 'bg-slate-900 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-black/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold" style={{ color: tier.color }}>
                        {tier.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tier.proportionPercent}% ({tier.targetCount} targets)
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-2">
                      Engine: <span className="text-slate-200">{tier.primaryEngine}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] flex items-center justify-between text-slate-400">
                    <span>Alloc: {tier.timeAllocationSec}</span>
                    <span className="text-emerald-400 font-bold">
                      {solvedInTier} / {targetsInTier.length} Solved
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Controls Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40 p-3 rounded-lg border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by hash, algorithm, or preimage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 w-56 sm:w-72"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800 text-xs font-mono">
                {(['ALL', 'SOLVED', 'PREEMPTED', 'EXHAUSTED'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2 py-1 rounded transition cursor-pointer text-[11px] ${
                      statusFilter === s ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInjectModal(true)}
                className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                + INJECT TARGET HASH
              </button>

              <button
                onClick={() => handleExportDatabase('csv')}
                className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 transition cursor-pointer"
                title="Export Batch as CSV"
              >
                <Download className="w-3.5 h-3.5" />
                CSV
              </button>
            </div>
          </div>

          {/* 50 Hashes Main Grid */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-black/60 shadow-inner">
            <div className="overflow-x-auto max-h-[460px]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0 z-10 text-[11px]">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">TARGET DIGEST</th>
                    <th className="p-2.5">ALGORITHM</th>
                    <th className="p-2.5">TIER</th>
                    <th className="p-2.5">ENGINE</th>
                    <th className="p-2.5">STATUS</th>
                    <th className="p-2.5">PREIMAGE / SOLUTION</th>
                    <th className="p-2.5 text-right">LATENCY</th>
                    <th className="p-2.5 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredBatch.map((target) => {
                    const isSelected = selectedTarget?.target_id === target.target_id;
                    const tierColor = TIER_CONFIGS.find(t => t.tier === target.complexity_tier)?.color || '#94a3b8';

                    return (
                      <tr 
                        key={target.target_id}
                        onClick={() => setSelectedTarget(target)}
                        className={`transition cursor-pointer ${
                          isSelected ? 'bg-cyan-950/40' : 'hover:bg-slate-900/50'
                        }`}
                      >
                        <td className="p-2.5 font-bold text-slate-400">{target.target_id}</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-200">
                          <div className="flex items-center gap-1.5 max-w-[220px]">
                            <span className="truncate">{target.raw_hash}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyHash(target.raw_hash);
                              }}
                              className="text-slate-400 hover:text-cyan-300 p-0.5"
                              title="Copy Hash"
                            >
                              {copiedHash === target.raw_hash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          {target.salt && (
                            <span className="text-[10px] text-purple-400">Salt: {target.salt}</span>
                          )}
                        </td>
                        <td className="p-2.5 font-bold text-slate-200">
                          {target.detected_type}
                        </td>
                        <td className="p-2.5">
                          <span 
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                            style={{ 
                              color: tierColor, 
                              borderColor: `${tierColor}55`, 
                              backgroundColor: `${tierColor}15` 
                            }}
                          >
                            Tier {target.complexity_tier}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            target.assigned_engine === 'LOOKUP' ? 'bg-cyan-950 text-cyan-300' :
                            target.assigned_engine === 'SAT' ? 'bg-amber-950 text-amber-300' :
                            target.assigned_engine === 'GPU' ? 'bg-emerald-950 text-emerald-300' :
                            'bg-purple-950 text-purple-300'
                          }`}>
                            {target.assigned_engine}
                            {target.preempted_from_sat && ' (PREEMPTED)'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {target.status === 'SOLVED' ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> SOLVED
                            </span>
                          ) : target.status === 'PROCESSING' ? (
                            <span className="text-cyan-400 font-bold flex items-center gap-1 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" /> SOLVING
                            </span>
                          ) : target.status === 'EXHAUSTED' ? (
                            <span className="text-slate-400 font-semibold flex items-center gap-1">
                              EXHAUSTED (30s)
                            </span>
                          ) : (
                            <span className="text-slate-400">UNRESOLVED</span>
                          )}
                        </td>
                        <td className="p-2.5 font-mono text-emerald-300 font-bold">
                          {target.preimage_result ? (
                            <span className="bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                              {target.preimage_result}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">None</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-300">
                          {target.execution_time_ms ? `${target.execution_time_ms} ms` : '—'}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTarget(target);
                              if (target.complexity_tier === 3) setActiveTab('sat');
                              else if (target.complexity_tier === 1) setActiveTab('algebraic');
                              else setActiveTab('quantum');
                            }}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] transition cursor-pointer"
                          >
                            Trace
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Showing {filteredBatch.length} of 50 target items</span>
              <span className="text-slate-300">Global Concurrency: 16 Worker Slots Active</span>
            </div>
          </div>

          {/* Selected Target Deep Telemetry Inspector */}
          {selectedTarget && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-slate-200">
                    TARGET INSPECTOR: {selectedTarget.target_id} ({selectedTarget.detected_type})
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Worker Slot #{selectedTarget.worker_slot || 1} Assigned
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Raw Digest:</span>
                  <div className="p-2 rounded bg-black/60 border border-slate-800 text-cyan-300 break-all select-all">
                    {selectedTarget.raw_hash}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Preimage Plaintext Recovered:</span>
                  <div className="p-2 rounded bg-black/60 border border-slate-800 text-emerald-400 font-bold select-all">
                    {selectedTarget.preimage_result || '<NOT_YET_SOLVED>'}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Classification Telemetry:</span>
                  <div className="p-2 rounded bg-black/60 border border-slate-800 text-slate-300 space-y-1 text-[11px]">
                    <div>Shannon Entropy: <span className="text-cyan-400 font-bold">{selectedTarget.entropy_score} bits/byte</span></div>
                    <div>Routing Tier: <span className="text-amber-400 font-bold">Tier {selectedTarget.complexity_tier}</span></div>
                    <div>Confidence: <span className="text-emerald-400 font-bold">{(selectedTarget.confidence * 100).toFixed(0)}%</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: SAT SOLVING & CONSTRAINT RELAXATION (ρ)
      ========================================================================= */}
      {activeTab === 'sat' && (
        <div className="space-y-6">
          <div className="bg-black/60 border border-amber-900/40 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold mb-2">
              <Binary className="w-4 h-4" />
              BOOLEAN SATISFIABILITY (SAT) REDUCTION & TSEITIN TRANSFORMATION
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Cryptographic hash preimages are modeled as systems of propositional formulas in Conjunctive Normal Form (CNF): 
              $C(x, y) = 1$. Tseitin transformations encode modular additions $a + b = c \pmod&#123;2^w&#125;$ by introducing auxiliary carry variables $r_i$.
            </p>

            {/* Tseitin Modular Carry Interactive Formula */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <div className="text-xs text-cyan-400 font-bold mb-2">// MODULAR ADDITION CARRY BIT EQUATIONS</div>
                <div className="space-y-2 text-xs text-slate-300 bg-black/60 p-3 rounded-lg border border-slate-900">
                  <div className="text-cyan-300 font-bold">
                    c_i = a_i ⊕ b_i ⊕ r_&#123;i-1&#125;
                  </div>
                  <div className="text-amber-300 font-bold">
                    r_i = (a_i ∧ b_i) ∨ (a_i ∧ r_&#123;i-1&#125;) ∨ (b_i ∧ r_&#123;i-1&#125;)
                  </div>
                  <div className="text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                    Each modular addition step produces 12 CNF clauses and 1 auxiliary variable $r_i$ per bit.
                  </div>
                </div>
              </div>

              {/* Interactive Tseitin Bit Evaluator */}
              <div>
                <div className="text-xs text-slate-400 font-bold mb-2">// INTERACTIVE BITWISE ADDER SIMULATION</div>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => setSatBitA(satBitA === 1 ? 0 : 1)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs cursor-pointer"
                  >
                    a_i = {satBitA}
                  </button>
                  <button
                    onClick={() => setSatBitB(satBitB === 1 ? 0 : 1)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs cursor-pointer"
                  >
                    b_i = {satBitB}
                  </button>
                  <button
                    onClick={() => setSatCarryIn(satCarryIn === 1 ? 0 : 1)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs cursor-pointer"
                  >
                    r_&#123;i-1&#125; = {satCarryIn}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
                  <div>Sum Output bit (c_i): <span className="text-emerald-400 font-bold">{tseitinSum}</span></div>
                  <div>Carry Output bit (r_i): <span className="text-amber-400 font-bold">{tseitinCarryOut}</span></div>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Generated Clauses: (¬c_i ∨ a_i ∨ b_i ∨ r_i-1) ∧ (c_i ∨ ¬a_i ∨ ¬b_i) ...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Constraint Relaxation (ρ) for Truncated / Weakened Hashes (MD4-39) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Constraint Relaxation Generator: MD4-39 & Reduced-Round Variants
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Black-box optimization introduces relaxation constraints $\rho$ into MiniSat / CaDiCaL to prune combinatorial explosion.
                </p>
              </div>

              {/* Relaxation Switch */}
              <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-lg border border-slate-800">
                <span className="text-xs font-mono text-slate-400">Relaxation Constraints (ρ):</span>
                <button
                  onClick={() => {
                    setUseRelaxationConstraints(!useRelaxationConstraints);
                    setSatSimulatedTime(!useRelaxationConstraints ? 7.4 : 3600);
                  }}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                    useRelaxationConstraints
                      ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {useRelaxationConstraints ? 'ACTIVE (ρ_1, ρ_2 ENABLED)' : 'DISABLED (PURE CNF)'}
                </button>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px]">SEARCH SPACE DENSITY</span>
                <div className="text-xl font-bold text-slate-100 mb-1">
                  {useRelaxationConstraints ? '2^16.8 Pruned' : '2^39 Combinatorial'}
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  {useRelaxationConstraints 
                    ? 'Automated black-box optimization constraints prune invalid state vectors before CDCL branch decisions.'
                    : 'Unconstrained Tseitin formulation suffers from clause bloat and exponential unit propagation slowdown.'}
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px]">SOLVER LATENCY (MD4-39)</span>
                <div className={`text-xl font-bold mb-1 ${useRelaxationConstraints ? 'text-emerald-400' : 'text-red-400'}`}>
                  {useRelaxationConstraints ? '7.4 Seconds' : '> 1.0 Hours'}
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  {useRelaxationConstraints 
                    ? 'Sub-minute operational threshold achieved! Comfortably adheres to the 15-second SAT per-target budget.'
                    : 'Hits 15-second timeout and triggers orchestrator preemption to GPU mutation pipeline.'}
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px]">15-SECOND PREEMPTION GUARD</span>
                <div className="text-xl font-bold text-purple-400 mb-1">
                  AUTO-PREEMPTION ACTIVE
                </div>
                <div className="text-[10px] text-slate-400 leading-normal">
                  If any SAT solver thread exceeds 15,000ms, Task Orchestrator preempts the worker and re-routes target to GPU kernel pool.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ALGEBRAIC CRYPTANALYSIS & GRÖBNER BASES (GF(2))
      ========================================================================= */}
      {activeTab === 'algebraic' && (
        <div className="space-y-6">
          <div className="bg-black/60 border border-purple-900/40 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold mb-2">
              <FileCode2 className="w-4 h-4" />
              MULTIVARIATE NON-LINEAR POLYNOMIAL SYSTEMS OVER GALOIS FIELD $\mathbb&#123;F&#125;_2$
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Algebraic cryptanalysis reformulates bitwise compression loops as polynomial equations over the quotient ring 
              $\mathbb&#123;F&#125;_2[x_1, \dots, x_n] / \langle x_i^2 - x_i \rangle$. Finding a preimage corresponds to computing the minimal Gröbner basis of the ideal $I = \langle p_1, \dots, p_k \rangle$ via $F_4 / F_5$ algorithms.
            </p>

            {/* Arithmetic Table in GF(2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Bitwise NOT</div>
                <div className="text-cyan-300 font-bold text-sm">¬a = 1 + a</div>
                <div className="text-[10px] text-slate-400 mt-1">Linear degree 1 transformation</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Bitwise XOR</div>
                <div className="text-cyan-300 font-bold text-sm">a ⊕ b = a + b (mod 2)</div>
                <div className="text-[10px] text-slate-400 mt-1">Direct linear field addition</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Bitwise AND</div>
                <div className="text-amber-300 font-bold text-sm">a ∧ b = a · b</div>
                <div className="text-[10px] text-slate-400 mt-1">Non-linear degree 2 product</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold mb-1">Bitwise OR</div>
                <div className="text-purple-300 font-bold text-sm">a ∨ b = a + b + ab</div>
                <div className="text-[10px] text-slate-400 mt-1">Mixed linear + quadratic term</div>
              </div>
            </div>
          </div>

          {/* Interactive Gröbner Polynomial Simulator */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Binary className="w-4 h-4 text-purple-400" />
                F4 / F5 Gröbner Basis Reduction Engine & Term Elimination
              </h3>
              <span className="text-xs text-purple-400">Order: Degree Reverse Lexicographic (degrevlex)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-cyan-400 font-bold text-xs">// S-POLYNOMIAL COMPUTATION & CANCELLATION</div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  S(f, g) combines polynomials to cancel their leading terms:
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-amber-300 text-xs">
                  S(f, g) = (lcm(LM(f), LM(g)) / LT(f)) · f - (lcm(LM(f), LM(g)) / LT(g)) · g
                </div>
                <div className="text-[11px] text-slate-400">
                  Early hash rounds exhibit low algebraic degree, allowing Gröbner elimination to resolve linear relations before SAT branch initiation.
                </div>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="text-emerald-400 font-bold text-xs">// HYBRID WORKFLOW BENCHMARK</div>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Linear Equations Identified:</span>
                    <span className="text-emerald-400 font-bold">128 linear variables substituted</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remaining CNF Variables:</span>
                    <span className="text-cyan-400 font-bold">Reduced by 42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solving Speedup:</span>
                    <span className="text-purple-400 font-bold">3.8x faster CDCL convergence</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Integrated with Tier 1 & Tier 3 solver worker queues to streamline subsequent MiniSat assignments.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: QUANTUM GROVER ORACLE DECOMPOSITION
      ========================================================================= */}
      {activeTab === 'quantum' && (
        <div className="space-y-6">
          {/* 4 Structural Layers Breakdown */}
          <div className="bg-black/60 border border-cyan-900/40 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold mb-2">
              <Atom className="w-4 h-4" />
              THE 4 STRUCTURAL LAYERS OF QUANTUM CRYPTANALYSIS (GROVER PREIMAGE BOUNDS)
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
              Grover’s algorithm provides a quadratic query speedup from $O(2^k)$ to $O(2^&#123;k/2&#125;)$ calls to iteration operator $G$. 
              However, fault-tolerant physical execution costs introduce massive overheads that render standard full-round hashes post-quantum resilient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-cyan-400 font-bold text-xs mb-1">1. Classical Query Model</div>
                <p className="text-[11px] text-slate-300 font-sans mb-1">
                  Theoretical query count: ⌊(π/4) · 2^(k/2)⌋ calls to oracle $U_g$.
                </p>
                <div className="text-[10px] text-slate-400">SHA-256 bound: 2^128 queries</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-purple-400 font-bold text-xs mb-1">2. Logical Circuit Layer</div>
                <p className="text-[11px] text-slate-300 font-sans mb-1">
                  Reversible circuit for $f(x)$, state registers $A..H$, and uncomputation.
                </p>
                <div className="text-[10px] text-slate-400">Logical Qubits: 2^12.6 (≈6,144)</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-amber-400 font-bold text-xs mb-1">3. Fault-Tolerant Layer</div>
                <p className="text-[11px] text-slate-300 font-sans mb-1">
                  Topological surface codes, distance $d$, magic-state distillation.
                </p>
                <div className="text-[10px] text-slate-400">Surface Cycles: 2^153.8 cycles</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                <div className="text-emerald-400 font-bold text-xs mb-1">4. Physical Resource Layer</div>
                <p className="text-[11px] text-slate-300 font-sans mb-1">
                  Cryogenic physical qubit footprint and cycle latency overheads.
                </p>
                <div className="text-[10px] text-slate-400">Overhead: 2^75× above query count</div>
              </div>
            </div>
          </div>

          {/* SHA-256 Oracle Reversible Circuit Walkthrough */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              SHA-256 Grover Oracle: Message Stretch & Compression Reversibility
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-cyan-300 font-bold text-xs">// 1. MESSAGE SCHEDULE EXPANSION W[i]</div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900 space-y-1 text-[11px]">
                  <div>σ_0 = (W_&#123;i-15&#125; ≫ 7) ⊕ (W_&#123;i-15&#125; ≫ 18) ⊕ (W_&#123;i-15&#125; ≫ 3)</div>
                  <div>σ_1 = (W_&#123;i-2&#125; ≫ 17) ⊕ (W_&#123;i-2&#125; ≫ 19) ⊕ (W_&#123;i-2&#125; ≫ 10)</div>
                  <div className="text-emerald-400 font-bold">W[i] = W_&#123;i-16&#125; + σ_0 + W_&#123;i-7&#125; + σ_1</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Reversible expansion requires temporary ancilla registers for each rotation, uncomputed immediately in-place.
                </p>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-amber-300 font-bold text-xs">// 2. COMPRESSION LOOP & UNCOMPUTATION</div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900 space-y-1 text-[11px]">
                  <div>Σ_1 = (E ≫ 6) ⊕ (E ≫ 11) ⊕ (E ≫ 25)</div>
                  <div>Ch = (E ∧ F) ⊕ (¬E ∧ G)</div>
                  <div>t_1 = H + Σ_1 + Ch + K[i] + W[i]</div>
                  <div className="text-purple-300 font-bold">E = D + t_1, A = t_1 + t_2</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Temporary ancillas allocated for $t_1, t_2, \Sigma, Ch$ must be XOR uncomputed to prevent quantum entanglement leakage!
                </p>
              </div>
            </div>
          </div>

          {/* Cryptographic Algorithm Quantum Comparison Matrix (from Blueprint Table) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
            <div className="p-3 bg-black/60 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-200">
                Cryptographic Algorithm Quantum Complexity & Circuit Depth Matrix
              </span>
              <span className="text-[11px] text-slate-400">Surface Code Distance d=27</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-3">ALGORITHM</th>
                    <th className="p-3">CLASSICAL COMPLEXITY</th>
                    <th className="p-3">QUANTUM COMPLEXITY</th>
                    <th className="p-3">LOGICAL QUBITS</th>
                    <th className="p-3">T-DEPTH</th>
                    <th className="p-3">SURFACE CODE CYCLES</th>
                    <th className="p-3">CIRCUIT OVERHEAD NOTE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {QUANTUM_BENCHMARK_MATRIX.map(metric => (
                    <tr key={metric.algorithm} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-bold text-cyan-300">{metric.algorithm}</td>
                      <td className="p-3 text-slate-300">{metric.classical_complexity}</td>
                      <td className="p-3 text-purple-300 font-bold">{metric.quantum_complexity}</td>
                      <td className="p-3 text-amber-300 font-bold">{metric.logical_qubits.toLocaleString()}</td>
                      <td className="p-3 text-slate-400">{metric.t_depth}</td>
                      <td className="p-3 text-emerald-400 font-bold">{metric.surface_cycles}</td>
                      <td className="p-3 text-[11px] text-slate-400 max-w-xs">{metric.overhead_factor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: RELATIONAL DATABASE & TELEMETRY
      ========================================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-black/60 border border-emerald-900/40 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                <Database className="w-4 h-4" />
                RELATIONAL DATA INFRASTRUCTURE BLUEPRINT (POSTGRESQL / SQLITE ENGINE)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportDatabase('sql')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer"
                >
                  DOWNLOAD SQL DUMP
                </button>
                <button
                  onClick={() => handleExportDatabase('json')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer"
                >
                  DOWNLOAD JSON
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Stores batch jobs, individual hash targets, solver telemetry execution traces, and quantum resistance evaluations across 4 normalized relational tables.
            </p>
          </div>

          {/* Table Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs">
            {(['tbl_hash_targets', 'tbl_jobs', 'tbl_solver_logs', 'tbl_quantum_metrics'] as const).map(tName => (
              <button
                key={tName}
                onClick={() => setDbActiveTable(tName)}
                className={`px-3 py-2 border-b-2 font-bold transition cursor-pointer ${
                  dbActiveTable === tName
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tName}
              </button>
            ))}
          </div>

          {/* SQL Query Console */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                LIVE SQL QUERY CONSOLE
              </span>
              <button
                onClick={handleExecuteSql}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
              >
                EXECUTE SQL
              </button>
            </div>
            <div className="relative">
              <textarea
                value={sqlQueryInput}
                onChange={(e) => setSqlQueryInput(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded bg-black/70 border border-slate-700 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {sqlQueryResult && (
              <div className="p-3 bg-black/80 rounded-lg border border-slate-800 text-xs text-slate-300 max-h-48 overflow-y-auto font-mono">
                <div className="text-[10px] text-slate-400 mb-1">QUERY RESULTS (JSON RESPONSE):</div>
                <pre>{sqlQueryResult}</pre>
              </div>
            )}
          </div>

          {/* Active Table Viewer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs">
            <div className="flex items-center justify-between mb-3 text-slate-300">
              <span className="font-bold">TABLE VIEW: {dbActiveTable}</span>
              <span className="text-[11px] text-slate-400">
                {dbActiveTable === 'tbl_hash_targets' ? `${batch.length} Rows` :
                 dbActiveTable === 'tbl_jobs' ? '1 Row' :
                 dbActiveTable === 'tbl_quantum_metrics' ? `${QUANTUM_BENCHMARK_MATRIX.length} Rows` :
                 '16 Active Logs'}
              </span>
            </div>

            <div className="overflow-x-auto max-h-64 border border-slate-800 rounded-lg bg-black/60">
              {dbActiveTable === 'tbl_jobs' && (
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">job_id</th>
                      <th className="p-2.5">created_at</th>
                      <th className="p-2.5">total_hashes</th>
                      <th className="p-2.5">time_limit_sec</th>
                      <th className="p-2.5">status</th>
                      <th className="p-2.5">elapsed_sec</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 text-cyan-400">job-init-001</td>
                      <td className="p-2.5 text-slate-300">2026-10-12 00:53:27</td>
                      <td className="p-2.5 text-slate-300">{batch.length}</td>
                      <td className="p-2.5 text-slate-300">300</td>
                      <td className="p-2.5 text-emerald-400 font-bold">{isProcessing ? 'PROCESSING' : 'COMPLETED'}</td>
                      <td className="p-2.5 text-slate-300">{elapsedSeconds.toFixed(1)}s</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {dbActiveTable === 'tbl_hash_targets' && (
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">target_id</th>
                      <th className="p-2.5">job_id</th>
                      <th className="p-2.5">raw_hash</th>
                      <th className="p-2.5">detected_type</th>
                      <th className="p-2.5">complexity_tier</th>
                      <th className="p-2.5">status</th>
                      <th className="p-2.5">execution_time_ms</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {batch.slice(0, 10).map(t => (
                      <tr key={t.target_id}>
                        <td className="p-2.5 text-cyan-400 font-bold">{t.target_id}</td>
                        <td className="p-2.5 text-slate-400">{t.job_id}</td>
                        <td className="p-2.5 text-slate-200 truncate max-w-[150px]">{t.raw_hash}</td>
                        <td className="p-2.5 text-slate-300">{t.detected_type}</td>
                        <td className="p-2.5 text-amber-400">Tier {t.complexity_tier}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">{t.status}</td>
                        <td className="p-2.5 text-slate-300">{t.execution_time_ms} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbActiveTable === 'tbl_quantum_metrics' && (
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">algorithm</th>
                      <th className="p-2.5">logical_qubits</th>
                      <th className="p-2.5">t_depth</th>
                      <th className="p-2.5">surface_cycles</th>
                      <th className="p-2.5">quantum_cost_factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {QUANTUM_BENCHMARK_MATRIX.map(m => (
                      <tr key={m.algorithm}>
                        <td className="p-2.5 text-cyan-400 font-bold">{m.algorithm}</td>
                        <td className="p-2.5 text-amber-300">{m.logical_qubits}</td>
                        <td className="p-2.5 text-slate-300">{m.t_depth}</td>
                        <td className="p-2.5 text-emerald-400">{m.surface_cycles}</td>
                        <td className="p-2.5 text-purple-400">{m.quantum_cost_factor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbActiveTable === 'tbl_solver_logs' && (
                <div className="p-3 text-slate-400 text-xs">
                  Showing 16 latest solver execution logs. All solver transactions recorded with sub-millisecond precision.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Inject Custom Hash Target */}
      {showInjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Inject Custom Hash for Dynamic Classification
              </h3>
              <button 
                onClick={() => setShowInjectModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Target Hash Digest (Hex):</label>
                <input
                  type="text"
                  placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
                  value={customHashInput}
                  onChange={(e) => setCustomHashInput(e.target.value)}
                  className="w-full p-2.5 rounded bg-black/70 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Salt Parameter (Optional):</label>
                <input
                  type="text"
                  placeholder="e.g. secure_salt_seed_2026"
                  value={customSaltInput}
                  onChange={(e) => setCustomSaltInput(e.target.value)}
                  className="w-full p-2.5 rounded bg-black/70 border border-slate-700 text-purple-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>Length: {customHashInput.length} chars</div>
                <div>Predicted: {customHashInput.length === 32 ? 'MD5 / NTLM (Tier 1)' : customHashInput.length === 64 ? 'SHA-256 (Tier 2)' : customHashInput.length === 128 ? 'SHA-512 (Tier 2)' : 'Custom/Truncated (Tier 3)'}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowInjectModal(false)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleInjectCustomHash}
                disabled={!customHashInput.trim()}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                Enqueue & Classify Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
