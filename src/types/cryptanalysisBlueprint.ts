export type ComplexityTier = 1 | 2 | 3 | 4;

export type HashAlgorithmType = 
  | 'MD4' 
  | 'MD5' 
  | 'SHA-1' 
  | 'NTLM' 
  | 'SHA-256' 
  | 'SHA-512' 
  | 'BLAKE3' 
  | 'MD4-39' 
  | 'Reduced-SHA2' 
  | 'Reduced-SHA3' 
  | 'Salted-SHA256' 
  | 'Salted-MD5' 
  | 'Hybrid-SHA512-BLAKE3';

export type SolverEngineType = 'LOOKUP' | 'SAT' | 'GPU' | 'HEURISTIC' | 'QUANTUM_EST';

export type TargetStatus = 'UNRESOLVED' | 'PROCESSING' | 'SOLVED' | 'EXHAUSTED' | 'PREEMPTED';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'TIMED_OUT';

export interface JobRecord {
  job_id: string;
  created_at: string;
  total_hashes: number;
  time_limit_sec: number;
  status: JobStatus;
  elapsed_sec: number;
  solved_count: number;
  sla_target_sec: number;
  aggregate_throughput_hps: number;
}

export interface HashTarget {
  target_id: string;
  job_id: string;
  raw_hash: string;
  salt: string | null;
  detected_type: HashAlgorithmType;
  complexity_tier: ComplexityTier;
  status: TargetStatus;
  preimage_result: string | null;
  execution_time_ms: number;
  assigned_engine: SolverEngineType;
  worker_slot: number | null;
  confidence: number;
  entropy_score: number;
  preempted_from_sat?: boolean;
}

export interface SolverLog {
  log_id: number;
  target_id: string;
  engine_type: SolverEngineType;
  cnf_variables: number | null;
  cnf_clauses: number | null;
  hash_rate_mhs: number | null;
  success: boolean;
  timestamp: string;
  details: string;
}

export interface QuantumMetric {
  metric_id: string;
  target_id: string;
  algorithm: HashAlgorithmType;
  classical_complexity: string;
  quantum_complexity: string;
  logical_qubits: number;
  t_depth: string;
  surface_cycles: string;
  quantum_cost_factor: number;
  physical_qubits: string;
  overhead_factor: string;
}

export interface WorkerSlot {
  slot_id: number;
  engine: SolverEngineType;
  status: 'IDLE' | 'BUSY' | 'PREEMPTING' | 'DONE';
  currentTargetId: string | null;
  currentAlgorithm: HashAlgorithmType | null;
  hashRateMhs: number;
  progressPercent: number;
  timeActiveMs: number;
  isGpuAccelerated: boolean;
}

export interface TierAllocationConfig {
  tier: ComplexityTier;
  name: string;
  proportionPercent: number;
  targetCount: number;
  primaryEngine: string;
  timeAllocationSec: string;
  categoryBudgetSec: number;
  algorithms: HashAlgorithmType[];
  color: string;
}
