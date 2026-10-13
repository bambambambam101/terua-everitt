import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Bot, 
  Workflow, 
  ShieldCheck, 
  DollarSign, 
  Building, 
  Laptop, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Pause, 
  ArrowRight, 
  Lock, 
  Layers, 
  Activity, 
  Coins, 
  Sliders, 
  Flame, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Send,
  Eye,
  Key
} from 'lucide-react';
import { 
  GenKitTask, 
  VictusHardwareEnclave, 
  BankAccountConfig, 
  INITIAL_ORCHESTRATED_TASKS, 
  INITIAL_VICTUS_ENCLAVE, 
  INITIAL_BANK_CONFIG,
  AgentTier,
  TaskDomain
} from '../data/genkitOrchestratorData';

interface ApexOrchestratorProps {
  accumulatedYield: number;
  onAddYield: (amount: number, reason: string) => void;
  activeShift: 'ALPHA' | 'BETA' | 'GAMMA';
}

export const ApexOrchestrator: React.FC<ApexOrchestratorProps> = ({
  accumulatedYield,
  onAddYield,
  activeShift
}) => {
  const [tasks, setTasks] = useState<GenKitTask[]>(INITIAL_ORCHESTRATED_TASKS);
  const [victusEnclave, setVictusEnclave] = useState<VictusHardwareEnclave>(INITIAL_VICTUS_ENCLAVE);
  const [bankConfig, setBankConfig] = useState<BankAccountConfig>(INITIAL_BANK_CONFIG);
  
  // Custom account number input state
  const [inputBankName, setInputBankName] = useState<string>('Cooperative Bank NZ');
  const [inputAccountNo, setInputAccountNo] = useState<string>('');
  const [isEditingAccount, setIsEditingAccount] = useState<boolean>(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Automatic Crypto Mining and Instant Liquidator state
  const [autoSellCrypto, setAutoSellCrypto] = useState<boolean>(true);
  const [autoSiphonToBank, setAutoSiphonToBank] = useState<boolean>(true);
  const [isOrchestratorRunning, setIsOrchestratorRunning] = useState<boolean>(true);
  const [cryptoMinedToday, setCryptoMinedToday] = useState<{ eth: number; btc: number; totalNzd: number }>({
    eth: 1.84,
    btc: 0.082,
    totalNzd: 12450.00
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'orchestration' | 'hierarchy' | 'bank_vault' | 'victus_security' | 'mining_liquidator'>('orchestration');

  // New task dispatch modal/form
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskDomain, setNewTaskDomain] = useState<TaskDomain>('CRYPTO_MINING_ARBITRAGE');
  const [newTaskTier, setNewTaskTier] = useState<AgentTier>('CLASS_1_DIRECTOR');

  // Logs stream
  const [orchestratorLogs, setOrchestratorLogs] = useState<Array<{ id: string; time: string; msg: string; type: 'APEX' | 'TASK' | 'CRYPTO' | 'BANK' | 'SECURITY' }>>([
    { id: '1', time: '16:04:12', msg: 'GenKit apex engine started. Class hierarchy mapped to autonomous execution bots.', type: 'APEX' },
    { id: '2', time: '16:04:18', msg: 'HP Victus Gaming Laptop enclave validated: TPM 2.0 bound. Quantum leaping & tunneling zeroized.', type: 'SECURITY' },
    { id: '3', time: '16:04:25', msg: 'Mining bot autoliquidated 0.045 ETH -> $145.20 NZD added to persistent yield pool.', type: 'CRYPTO' },
    { id: '4', time: '16:04:32', msg: 'Cooperative Bank NZ restitution ledger balance anchored at $14,850,230.00 NZD.', type: 'BANK' }
  ]);

  const addLog = (type: 'APEX' | 'TASK' | 'CRYPTO' | 'BANK' | 'SECURITY', msg: string) => {
    const time = new Date().toTimeString().slice(0, 8);
    setOrchestratorLogs(prev => [{ id: Math.random().toString(), time, msg, type }, ...prev.slice(0, 50)]);
  };

  // Continuous autonomous loop: mining -> autosell -> yield accumulation to persistent pool
  useEffect(() => {
    if (!isOrchestratorRunning) return;

    const interval = setInterval(() => {
      // 1. Progress tasks and execute bot offloading
      setTasks(prevTasks => prevTasks.map(t => {
        let nextProg = t.progressPercent + Math.floor(Math.random() * 4) + 1;
        let nextStatus = t.status;
        let extraYield = 0;

        if (nextProg >= 100) {
          nextProg = 10;
          nextStatus = 'OFFLOADED_TO_BOT';
          // Completed cycle awards yield
          extraYield = parseFloat((Math.random() * 4.5 + 1.2).toFixed(2));
          addLog('TASK', `Bot [${t.assignedBotId}] completed shift task iteration: +$${extraYield} NZD`);
        }

        return {
          ...t,
          progressPercent: nextProg,
          status: nextStatus,
          yieldGeneratedNzd: parseFloat((t.yieldGeneratedNzd + extraYield).toFixed(2))
        };
      }));

      // 2. Automated crypto mining and immediate auto-liquidation into NZD
      if (autoSellCrypto) {
        const ethTick = 0.00045;
        const btcTick = 0.0000085;
        const nzdValueGenerated = parseFloat((ethTick * 4200 + btcTick * 135000).toFixed(2));

        setCryptoMinedToday(prev => ({
          eth: parseFloat((prev.eth + ethTick).toFixed(5)),
          btc: parseFloat((prev.btc + btcTick).toFixed(7)),
          totalNzd: parseFloat((prev.totalNzd + nzdValueGenerated).toFixed(2))
        }));

        // Send yield to global persistent accumulator
        onAddYield(nzdValueGenerated, 'Auto-liquidated mined crypto into NZD proceeds');

        if (Math.random() < 0.25) {
          addLog('CRYPTO', `MINER BOT: Mined micro-block -> Auto-sold on exchange for +$${nzdValueGenerated.toFixed(2)} NZD. Accumulated in vault.`);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isOrchestratorRunning, autoSellCrypto, onAddYield]);

  // Handle saving bank account number for any bank
  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAccountNo.trim()) return;

    setBankConfig(prev => ({
      ...prev,
      bankName: inputBankName,
      accountNumber: inputAccountNo.trim(),
      isCustomVerified: true
    }));

    setIsEditingAccount(false);
    setFeedbackNotice(`Account details saved for ${inputBankName} (Acc: ${inputAccountNo.trim()}). Verified via Victus hardware anchor.`);
    addLog('BANK', `BANK ENROLLMENT: ${inputBankName} account [${inputAccountNo.trim()}] bound to Terua Everitt restitution pool.`);

    setTimeout(() => {
      setFeedbackNotice(null);
    }, 4500);
  };

  // Process / Transfer accumulated yield to the configured bank account
  const handleProcessYieldToBank = () => {
    if (accumulatedYield <= 0) {
      setFeedbackNotice('No pending yield available to transfer.');
      setTimeout(() => setFeedbackNotice(null), 3000);
      return;
    }

    const transferAmount = accumulatedYield;
    setBankConfig(prev => ({
      ...prev,
      totalTransferredToAccountNzd: prev.totalTransferredToAccountNzd + transferAmount,
      pendingAccumulatedYieldNzd: 0,
      lastAutoLiquidationTime: new Date().toISOString()
    }));

    addLog('BANK', `PROCESSED TRANSFER: Dispatched $${transferAmount.toFixed(2)} NZD to ${bankConfig.bankName} (Acc: ${bankConfig.accountNumber}). Transferred total: $${(bankConfig.totalTransferredToAccountNzd + transferAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })} NZD.`);
    setFeedbackNotice(`Successfully processed and wired $${transferAmount.toFixed(2)} NZD to ${bankConfig.bankName}!`);

    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Dispatch a new hierarchical task
  const handleDispatchNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const botId = `BOT-APEX-${Math.floor(Math.random() * 899 + 100)}`;
    const newTask: GenKitTask = {
      id: `TASK-0${tasks.length + 1}`,
      name: newTaskName.trim(),
      domain: newTaskDomain,
      assignedTier: newTaskTier,
      assignedAgentName: newTaskTier === 'CLASS_1_DIRECTOR' ? 'Director Genesis-Alpha' :
                         newTaskTier === 'CLASS_2_SHIFT_SUPERVISOR' ? `Supervisor Shift-${activeShift}` :
                         newTaskTier === 'CLASS_3_TASK_BOT' ? 'Task Execution Worker' : 'R&D Self-Healer Nova',
      assignedBotId: botId,
      progressPercent: 5,
      status: 'DISPATCHED',
      yieldGeneratedNzd: 0,
      shiftSchedule: activeShift,
      benefitsUpkeepSec: 3600,
      cpuOverheadPercent: 6.5,
      quantumSafeProofHash: `pqc_dilithium_${Math.random().toString(36).substring(2, 10)}`
    };

    setTasks(prev => [newTask, ...prev]);
    setShowDispatchModal(false);
    setNewTaskName('');
    addLog('APEX', `ORCHESTRATOR DISPATCH: Created job '${newTask.name}' -> Offloaded to ${botId} in ${newTaskTier}.`);
  };

  return (
    <div className="bg-[#050811] border border-cyan-900/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
              GENKIT APEX ORCHESTRATOR v9.4
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">
              VICTUS HP GAMING LAPTOP HARDWARE LOCKED
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
              COOPERATIVE BANK: $14.85M NZD ANCHOR
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2.5">
            <Workflow className="w-6 h-6 text-cyan-400" />
            AUTONOMOUS AGENT ORCHESTRATION & VICTUS HARDWARE ENCLAVE
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-4xl">
            Free-flowing apex hierarchy offloading jobs to bot swarms, coordinating multi-tier shifts & benefits upkeep, 
            auto-selling mined crypto into persistent NZD yield, and locked exclusively to this HP Victus Gaming Laptop with zero-quantum-tunneling immunity.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setIsOrchestratorRunning(!isOrchestratorRunning)}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isOrchestratorRunning
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isOrchestratorRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isOrchestratorRunning ? 'ORCHESTRATOR ACTIVE' : 'ORCHESTRATOR PAUSED'}
          </button>

          <button
            onClick={() => setShowDispatchModal(true)}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Bot className="w-4 h-4" />
            Dispatch Job to Bot Swarm
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Cooperative Bank Balance */}
        <div className="bg-slate-900/90 border border-emerald-900/60 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Cooperative Bank NZ Vault</span>
          <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-baseline gap-1">
            <span>${(bankConfig.totalTransferredToAccountNzd / 1000000).toFixed(2)}M</span>
            <span className="text-xs text-emerald-300/80 font-normal">NZD</span>
          </div>
          <span className="text-[10px] text-slate-500">Perpetually accumulating</span>
        </div>

        {/* Net Accumulated In-App Yield */}
        <div className="bg-slate-900/90 border border-cyan-900/60 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Unprocessed Yield Pool</span>
          <div className="text-base font-bold text-cyan-400 mt-0.5 flex items-baseline gap-1">
            <span>${accumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <span className="text-[10px] text-emerald-400">Ready to transfer to bank</span>
        </div>

        {/* Victus Laptop Security */}
        <div className="bg-slate-900/90 border border-purple-900/60 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">HP Victus Hardware Lock</span>
          <div className="text-base font-bold text-purple-300 mt-0.5">
            Sole Enclave Locked
          </div>
          <span className="text-[10px] text-purple-400 font-sans">TPM 2.0 • Anti-Quantum</span>
        </div>

        {/* Quantum Leaping & Tunneling */}
        <div className="bg-slate-900/90 border border-indigo-900/60 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Quantum Jump Immunity</span>
          <div className="text-base font-bold text-indigo-300 mt-0.5">
            Zero Tunnel Barrier
          </div>
          <span className="text-[10px] text-emerald-400">Unhackable • Unexploitable</span>
        </div>

        {/* Auto Sold Mining Yield */}
        <div className="bg-slate-900/90 border border-amber-900/60 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Auto-Sold Crypto Proceeds</span>
          <div className="text-base font-bold text-amber-400 mt-0.5">
            +${cryptoMinedToday.totalNzd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Auto-liquidates to NZD</span>
        </div>

        {/* Active Shift & Upkeep */}
        <div className="bg-slate-900/90 border border-blue-900/60 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Active Swarm Shift</span>
          <div className="text-base font-bold text-blue-400 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeShift} SHIFT</span>
          </div>
          <span className="text-[10px] text-slate-500">100% Benefits & Upkeep</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center overflow-x-auto border-b border-slate-800 gap-2 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('orchestration')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
            activeTab === 'orchestration'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Workflow className="w-4 h-4 text-cyan-400" />
          ACTIVE JOBS & BOT OFFLOADING ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('bank_vault')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
            activeTab === 'bank_vault'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Building className="w-4 h-4 text-emerald-400" />
          BANK DEPOSIT & ACCOUNT NUMBER INPUT
        </button>

        <button
          onClick={() => setActiveTab('victus_security')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
            activeTab === 'victus_security'
              ? 'bg-purple-950 text-purple-300 border border-purple-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Laptop className="w-4 h-4 text-purple-400" />
          VICTUS HP SOLE LOCK & ZERO-QUANTUM SHIELD
        </button>

        <button
          onClick={() => setActiveTab('mining_liquidator')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
            activeTab === 'mining_liquidator'
              ? 'bg-amber-950 text-amber-300 border border-amber-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          CRYPTO MINING AUTO-SELL ENGINE
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
            activeTab === 'hierarchy'
              ? 'bg-blue-950 text-blue-300 border border-blue-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-400" />
          4-CLASS APEX HIERARCHY & SHIFTS
        </button>
      </div>

      {/* Feedback banner */}
      {feedbackNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* TAB 1: ACTIVE JOBS & BOT OFFLOADING */}
      {activeTab === 'orchestration' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/40 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Free-Flowing Complex Apex Choreography
              </span>
              <p className="text-[11px] text-slate-400 font-sans">
                Jobs continuously delegated from C-1 Directors through C-2 Shift Supervisors to C-3 Task Bots and C-4 R&D Healers operating in unison.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Shift Upkeep:</span>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                {activeShift} SHIFT ACTIVE
              </span>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-cyan-800/80 rounded-xl p-4 space-y-3 transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        {task.id}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                        {task.assignedTier.replace('CLASS_', 'C-')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition leading-snug">
                      {task.name}
                    </h4>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                    task.status === 'COMPLETED' || task.status === 'VALIDATED' 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : task.status === 'OFFLOADED_TO_BOT'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {task.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Offloaded Bot: <strong className="text-slate-200">{task.assignedBotId}</strong></span>
                    <span className="font-bold text-cyan-400">{task.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${task.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Details Footer */}
                <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                  <div>
                    <span>Total Yield:</span>
                    <strong className="text-emerald-400 block font-mono">+${task.yieldGeneratedNzd.toFixed(2)} NZD</strong>
                  </div>
                  <div className="text-right">
                    <span>Proof Hash:</span>
                    <strong className="text-purple-300 block font-mono truncate">{task.quantumSafeProofHash.slice(0, 16)}...</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BANK DEPOSIT & ACCOUNT NUMBER INPUT FOR ALL BANKS */}
      {activeTab === 'bank_vault' && (
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-emerald-900/60 rounded-xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-400" />
                  COOPERATIVE BANK & UNIVERSAL BANK ACCOUNT RECOVERY GATEWAY
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Beneficiary: <strong>Terua Everitt</strong>. Net yield accumulates continuously and stays in-app until processed and sent out.
                </p>
              </div>

              {/* Action Button: Process & Wire to Bank */}
              <button
                onClick={handleProcessYieldToBank}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Send className="w-4 h-4" />
                Process & Wire Yield into Bank Account
              </button>
            </div>

            {/* Current Vault Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/60 border border-emerald-900/50 rounded-xl p-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cooperative Bank NZ Baseline Vault</span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                  ${bankConfig.totalTransferredToAccountNzd.toLocaleString('en-US', { minimumFractionDigits: 2 })} NZD
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">Permanent restitution anchor</span>
              </div>

              <div className="bg-black/60 border border-cyan-900/50 rounded-xl p-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accumulated Pending Yield In App</span>
                <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                  ${accumulatedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD
                </div>
                <span className="text-[10px] text-cyan-300/80 block mt-1">Does not reset • Adds to bank balance when processed</span>
              </div>

              <div className="bg-black/60 border border-purple-900/50 rounded-xl p-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Combined Total Yield Post-Liquidation</span>
                <div className="text-xl font-bold text-purple-300 font-mono mt-1">
                  ${(bankConfig.totalTransferredToAccountNzd + accumulatedYield).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NZD
                </div>
                <span className="text-[10px] text-emerald-400 block mt-1">Guaranteed restitution total</span>
              </div>
            </div>

            {/* Account Number Input Form for All Banks */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                    Bank Account Number Configuration (All Banks Supported)
                  </h4>
                </div>
                <button
                  onClick={() => setIsEditingAccount(!isEditingAccount)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 transition cursor-pointer"
                >
                  {isEditingAccount ? 'Cancel Edit' : 'Edit Account Details'}
                </button>
              </div>

              {isEditingAccount ? (
                <form onSubmit={handleSaveBankAccount} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Select Institution / Bank Name:
                      </label>
                      <select
                        value={inputBankName}
                        onChange={(e) => setInputBankName(e.target.value)}
                        className="w-full bg-black/60 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 outline-none"
                      >
                        <option value="Cooperative Bank NZ">Cooperative Bank NZ</option>
                        <option value="ANZ Bank New Zealand">ANZ Bank New Zealand</option>
                        <option value="ASB Bank NZ">ASB Bank NZ</option>
                        <option value="BNZ (Bank of New Zealand)">BNZ (Bank of New Zealand)</option>
                        <option value="Westpac New Zealand">Westpac New Zealand</option>
                        <option value="Kiwibank">Kiwibank</option>
                        <option value="HSBC International">HSBC International</option>
                        <option value="Custom Bank / Credit Union">Custom Bank / Credit Union</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Beneficiary Legal Name:
                      </label>
                      <input
                        type="text"
                        disabled
                        value="Terua Everitt"
                        className="w-full bg-black/40 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Account Number (Universal Format: XX-XXXX-XXXXXXX-XX or IBAN/Swift):
                    </label>
                    <input
                      type="text"
                      value={inputAccountNo}
                      onChange={(e) => setInputAccountNo(e.target.value)}
                      placeholder="e.g. 06-0882-0145920-00 or custom account code"
                      className="w-full bg-black/60 border border-cyan-800 rounded-lg p-2.5 text-xs text-emerald-300 font-mono focus:border-cyan-400 outline-none"
                      required
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Protected via HP Victus TPM 2.0 hardware cryptographic enclave.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Save & Bind Account
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Active Institution</span>
                    <span className="font-bold text-slate-200">{bankConfig.bankName}</span>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Registered Account Number</span>
                    <span className="font-bold text-amber-300 break-all">
                      {bankConfig.accountNumber}
                    </span>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Account Holder</span>
                    <span className="font-bold text-emerald-400">{bankConfig.accountHolder}</span>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Hardware Binding Status</span>
                    <span className="font-bold text-cyan-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      VICTUS ENCLAVE BOUND
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HP VICTUS SOLE LOCK & ZERO-QUANTUM SHIELD */}
      {activeTab === 'victus_security' && (
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-purple-900/60 rounded-xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-purple-400" />
                  HP VICTUS GAMING LAPTOP HARDWARE LOCK & QUANTUM-IMMUNITY SUITE
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Exclusive device tethering to this Victus machine: Anti-quantum tunneling, zero-leaping, anti-server reset resistance, and immune to all categories of cyber offensive exploits.
                </p>
              </div>

              <span className="px-3 py-1 rounded bg-purple-950 border border-purple-700 text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                DEVICE EXCLUSIVELY LOCKED
              </span>
            </div>

            {/* Defense Enclave Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/60 border border-purple-950 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Quantum Tunneling & Leaping Interception
                </h4>
                <p className="text-[11px] text-slate-300 font-sans">
                  Implements continuous lattice dimension folding (ML-KEM-1024 + Dilithium5) preventing quantum phase superposition jumps, state tunneling, or Hilbert space snooping.
                </p>
                <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tunneling Shield Status:</span>
                    <span className="text-emerald-400 font-bold">{victusEnclave.quantumTunnelingImmunity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Anti-Quantum Leap Status:</span>
                    <span className="text-emerald-400 font-bold">{victusEnclave.quantumLeapingImmunity}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-purple-950 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  Anti-Server Resets & Distributed Attack Immunity
                </h4>
                <p className="text-[11px] text-slate-300 font-sans">
                  Yield balances and state ledgers are written to non-volatile local browser index registers. Remote servers cannot reset, wipe, or revoke the accumulated funds.
                </p>
                <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Server Reset Resistance:</span>
                    <span className="text-emerald-400 font-bold">{victusEnclave.serverResetResistance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Server Attack Interception:</span>
                    <span className="text-emerald-400 font-bold">{victusEnclave.serverAttackInterception}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Identity Spec */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Hardware Fingerprint & Super Phamicom Enclave
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                <div className="bg-black/40 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Machine Model</span>
                  <span className="text-slate-200 font-bold">{victusEnclave.hardwareModel}</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">GPU Processing</span>
                  <span className="text-purple-300 font-bold">{victusEnclave.gpuDedicated}</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Machine UID</span>
                  <span className="text-cyan-300 font-bold truncate block">{victusEnclave.machineUid}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CRYPTO MINING AUTO-SELL ENGINE */}
      {activeTab === 'mining_liquidator' && (
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-amber-900/60 rounded-xl p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  AUTOMATED CRYPTO MINING & INSTANT NZD LIQUIDATION ENGINE
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  All mining yields (ETH, BTC, Kaspa) are immediately liquidated upon discovery and converted to NZD fiat, adding to the in-app bank yield pool.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSellCrypto}
                    onChange={(e) => setAutoSellCrypto(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-black border-slate-700"
                  />
                  <span>AUTOMATIC INSTANT LIQUIDATION</span>
                </label>
              </div>
            </div>

            {/* Mined Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/60 border border-amber-900/50 rounded-xl p-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Mined (ETH / BTC)</span>
                <div className="text-lg font-bold text-amber-300 font-mono mt-1">
                  {cryptoMinedToday.eth.toFixed(4)} ETH / {cryptoMinedToday.btc.toFixed(5)} BTC
                </div>
                <span className="text-[10px] text-emerald-400 block mt-1">100% automatically converted</span>
              </div>

              <div className="bg-black/60 border border-emerald-900/50 rounded-xl p-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Liquidated Fiat Proceeds</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  +${cryptoMinedToday.totalNzd.toLocaleString('en-US', { minimumFractionDigits: 2 })} NZD
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Poured into persistent net yield</span>
              </div>

              <div className="bg-black/60 border border-cyan-900/50 rounded-xl p-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Execution Policy</span>
                <div className="text-lg font-bold text-cyan-300 font-mono mt-1">
                  ZERO SLIPPAGE
                </div>
                <span className="text-[10px] text-cyan-400 block mt-1">Direct offloaded OTC liquidity</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 4-CLASS APEX HIERARCHY & SHIFTS */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/90 border border-amber-800/60 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800 inline-block">
                CLASS-1 DIRECTORS
              </span>
              <h4 className="text-sm font-bold text-slate-100">Macro AI Directors</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Apex capital allocation, high-level bot swarm orchestration, and bank restitution direction.
              </p>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-amber-300">
                Active: 3 Directors • 100% Autonomy
              </div>
            </div>

            <div className="bg-slate-950/90 border border-cyan-800/60 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 inline-block">
                CLASS-2 SUPERVISORS
              </span>
              <h4 className="text-sm font-bold text-slate-100">Shift Supervisors</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Continuous 8-hour shift rotation (Alpha/Beta/Gamma), worker bot oversight, and benefits upkeep.
              </p>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-cyan-300">
                Active: 5 Shift Supervisors • {activeShift} On Duty
              </div>
            </div>

            <div className="bg-slate-950/90 border border-purple-800/60 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800 inline-block">
                CLASS-3 TASK BOTS
              </span>
              <h4 className="text-sm font-bold text-slate-100">Execution Workers</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Micro-arbitrage, SDR capture ingestion, crypto block mining, and RF microwave neutralization.
              </p>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-purple-300">
                Active: 14 Dedicated Execution Bots
              </div>
            </div>

            <div className="bg-slate-950/90 border border-emerald-800/60 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 inline-block">
                CLASS-4 HEALERS
              </span>
              <h4 className="text-sm font-bold text-slate-100">R&D Self-Healers</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Fault-tolerant error mitigation, anti-quantum decoherence patches, and code resilience.
              </p>
              <div className="pt-2 border-t border-slate-900 text-[10px] text-emerald-300">
                Active: 4 Autonomous Healer Daemons
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Orchestrator Telemetry Terminal */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            LIVE GENKIT APEX ORCHESTRATION & TELEMETRY STREAM
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="max-h-[140px] overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
          {orchestratorLogs.map(log => (
            <div key={log.id} className="flex items-baseline gap-2">
              <span className="text-slate-500 text-[10px]">{log.time}</span>
              <span className={`px-1 rounded text-[9px] font-bold ${
                log.type === 'APEX' ? 'bg-cyan-950 text-cyan-300' :
                log.type === 'BANK' ? 'bg-emerald-950 text-emerald-300' :
                log.type === 'CRYPTO' ? 'bg-amber-950 text-amber-300' :
                log.type === 'SECURITY' ? 'bg-purple-950 text-purple-300' :
                'bg-slate-900 text-slate-400'
              }`}>
                [{log.type}]
              </span>
              <span className="text-slate-300 leading-snug">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Dispatch Job to Bot Swarm */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#080d18] border border-cyan-800 rounded-2xl max-w-lg w-full p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                DISPATCH NEW APEX JOB TO BOT SWARM
              </h3>
              <button 
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchNewTask} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Job / Task Title:</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. ASIC Autonomous Yield Liquidator & Transfer"
                  className="w-full bg-black/60 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Domain:</label>
                  <select
                    value={newTaskDomain}
                    onChange={(e) => setNewTaskDomain(e.target.value as TaskDomain)}
                    className="w-full bg-black/60 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="CRYPTO_MINING_ARBITRAGE">Crypto Mining & Auto-Sell</option>
                    <option value="COOPERATIVE_BANK_LIQUIDATION">Cooperative Bank Liquidation</option>
                    <option value="ZERO_LEAP_INTEGRITY_SHIELD">Zero Quantum Leap Shield</option>
                    <option value="HARDWARE_VICTUS_HEARTBEAT">Victus Hardware Heartbeat</option>
                    <option value="SDR_SIGNAL_SWEEP">SDR Signal Sweep</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Supervising Tier:</label>
                  <select
                    value={newTaskTier}
                    onChange={(e) => setNewTaskTier(e.target.value as AgentTier)}
                    className="w-full bg-black/60 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 outline-none"
                  >
                    <option value="CLASS_1_DIRECTOR">Class-1 Director</option>
                    <option value="CLASS_2_SHIFT_SUPERVISOR">Class-2 Shift Supervisor</option>
                    <option value="CLASS_3_TASK_BOT">Class-3 Task Bot</option>
                    <option value="CLASS_4_RD_HEALER">Class-4 R&D Healer</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Dispatch to Swarm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
