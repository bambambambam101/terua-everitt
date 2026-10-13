export type AgentClass = 'C-1' | 'C-2' | 'C-3' | 'C-4';

export type NodeStatus = 'ONLINE' | 'BOOST 2.5x' | 'ANOMALY' | 'HEALING' | 'OFFLINE';

export interface YieldNode {
  id: number;
  code: string;
  name: string;
  agentClass: AgentClass;
  classLabel: string;
  baseYieldPerSec: number;
  currentYieldPerSec: number;
  accumulatedEarned: number;
  activityPercent: number;
  isBoosted: boolean;
  status: NodeStatus;
  qubitAllocation: number;
  sector: string;
  healthPercent: number;
  description?: string;
  lastAnomaly?: string;
}

export type ShiftName = 'ALPHA' | 'BETA' | 'GAMMA';

export interface ShiftInfo {
  name: ShiftName;
  hours: string;
  supervisor: string;
  efficiencyMultiplier: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  category: 'YIELD' | 'SYSTEM' | 'QUANTUM' | 'ANOMALY' | 'HEALER';
  message: string;
}

export interface CryptanalysisProfile {
  targetSearchSpace: string;
  estimatedSteps: string;
  logicalQubitAllocation: number;
  circuitSynthesisDepth: string;
  linearComplexityBits: number;
  algorithms: {
    name: string;
    qubits: string;
    tDepth: string;
    securityLevel: string;
  }[];
}
