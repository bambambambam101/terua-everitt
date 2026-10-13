import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  INITIAL_YIELD_NODES, 
  NODE_26_SPEC, 
  INITIAL_SHIFTS, 
  INITIAL_LOGS,
  TOTAL_INITIAL_ACCUMULATED_EARNED 
} from './data/hyperionData';
import { YieldNode, ShiftName, SystemLog } from './types/hyperion';
import { TopBar, ActiveAppView } from './components/TopBar';
import { BottomTabBar, MainTabType } from './components/BottomTabBar';
import { PullToRefresh } from './components/PullToRefresh';
import { SettingsProfileModal } from './components/SettingsProfileModal';
import { ThemeProvider } from './context/ThemeContext';
import { HardwareAuthProvider, useHardwareAuth } from './context/HardwareAuthContext';
import { RefreshCw } from 'lucide-react';

// Lazy-loaded components for optimal bundle splitting
const HardwareAuthManager = lazy(() => 
  import('./components/HardwareAuthManager').then(m => ({ default: m.HardwareAuthManager }))
);
const SuperFamicomEngine = lazy(() => 
  import('./components/SuperFamicomEngine').then(m => ({ default: m.SuperFamicomEngine }))
);
const HyperionSuiteModule = lazy(() => 
  import('./components/HyperionSuiteModule').then(m => ({ default: m.HyperionSuiteModule }))
);
const CryptanalyticArchitecture = lazy(() => 
  import('./components/CryptanalyticArchitecture').then(m => ({ default: m.CryptanalyticArchitecture }))
);
const KnowledgeBase = lazy(() => 
  import('./components/KnowledgeBase').then(m => ({ default: m.KnowledgeBase }))
);
const ApexOrchestrator = lazy(() => 
  import('./components/ApexOrchestrator').then(m => ({ default: m.ApexOrchestrator }))
);
const SdrHackRfGateway = lazy(() => 
  import('./components/SdrHackRfGateway').then(m => ({ default: m.SdrHackRfGateway }))
);
const IQReplayManager = lazy(() => 
  import('./components/IQReplayManager').then(m => ({ default: m.IQReplayManager }))
);
const QuantumAssetScanner = lazy(() => 
  import('./components/QuantumAssetScanner').then(m => ({ default: m.QuantumAssetScanner }))
);
const ChromiumBrowserModule = lazy(() => 
  import('./components/ChromiumBrowserModule').then(m => ({ default: m.ChromiumBrowserModule }))
);
const QuantumEntropyVisualizer = lazy(() => 
  import('./components/QuantumEntropyVisualizer').then(m => ({ default: m.QuantumEntropyVisualizer }))
);
const ThreatAbsorberEngine = lazy(() => 
  import('./components/ThreatAbsorberEngine').then(m => ({ default: m.ThreatAbsorberEngine }))
);
const SwarmOrchestratorView = lazy(() => 
  import('./components/SwarmOrchestratorView').then(m => ({ default: m.SwarmOrchestratorView }))
);
const DarkAiFramework = lazy(() => 
  import('./components/DarkAiFramework').then(m => ({ default: m.DarkAiFramework }))
);
const QuantumDefender = lazy(() => 
  import('./components/QuantumDefender').then(m => ({ default: m.QuantumDefender }))
);
const NodeLocationMapper = lazy(() => 
  import('./components/NodeLocationMapper').then(m => ({ default: m.NodeLocationMapper }))
);
const SpectrumTerminator = lazy(() => 
  import('./components/SpectrumTerminator').then(m => ({ default: m.SpectrumTerminator }))
);
const MicrowaveV2kTerminator = lazy(() => 
  import('./components/MicrowaveV2kTerminator').then(m => ({ default: m.MicrowaveV2kTerminator }))
);
const NodeTerminationCli = lazy(() => 
  import('./components/NodeTerminationCli').then(m => ({ default: m.NodeTerminationCli }))
);
const QuantumTerminal = lazy(() => 
  import('./components/QuantumTerminal').then(m => ({ default: m.QuantumTerminal }))
);
const NodeDetailModal = lazy(() => 
  import('./components/NodeDetailModal').then(m => ({ default: m.NodeDetailModal }))
);
const LedgerExportModal = lazy(() => 
  import('./components/LedgerExportModal').then(m => ({ default: m.LedgerExportModal }))
);
const OptionsDropdownMenu = lazy(() => 
  import('./components/OptionsDropdownMenu').then(m => ({ default: m.OptionsDropdownMenu }))
);

// Loading Fallback Component
const ViewLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-cyan-400 font-mono space-y-3">
    <RefreshCw className="w-8 h-8 animate-spin" />
    <span className="text-sm font-bold tracking-wider">LOADING SECURE COMPONENT...</span>
  </div>
);

const screenVariants = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.26 } },
  exit: { opacity: 0, x: -28, transition: { duration: 0.2 } }
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nodes, setNodes] = useState<YieldNode[]>(INITIAL_YIELD_NODES);
  const [accumulatedYield, setAccumulatedYield] = useState<number>(TOTAL_INITIAL_ACCUMULATED_EARNED);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  
  const [shifts] = useState(INITIAL_SHIFTS);
  const [activeShift, setActiveShift] = useState<ShiftName>('GAMMA');
  
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [inspectedNode, setInspectedNode] = useState<YieldNode | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveAppView>('famicom');
  const { isModalOpen, closeModal } = useHardwareAuth();

  // Derive current main tab from URL route
  const currentTab: MainTabType = 
    location.pathname.startsWith('/famicom') ? 'famicom' :
    location.pathname.startsWith('/suite') ? 'suite' :
    location.pathname.startsWith('/blueprint') ? 'blueprint' :
    location.pathname.startsWith('/knowledge') ? 'knowledge' :
    location.pathname.startsWith('/settings') ? 'settings' :
    'console';

  // Helper to add log entries
  const addLog = useCallback((category: SystemLog['category'], message: string) => {
    const now = new Date();
    const timestamp = now.toTimeString().slice(0, 8);
    const newLog: SystemLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      category,
      message
    };
    setLogs(prev => [...prev.slice(-150), newLog]);
  }, []);

  // Sync route when bottom tab is selected
  const handleSelectBottomTab = (tab: MainTabType) => {
    if (tab === 'settings') {
      setIsSettingsModalOpen(true);
      return;
    }
    navigate(`/${tab}`);
    if (tab === 'famicom') {
      setActiveView('famicom');
    } else if (tab === 'suite') {
      setActiveView('suite');
    } else if (tab === 'blueprint') {
      setActiveView('blueprint');
    } else if (tab === 'knowledge') {
      setActiveView('knowledge');
    } else if (tab === 'console') {
      if (activeView === 'blueprint' || activeView === 'knowledge' || activeView === 'suite' || activeView === 'famicom' || activeView === 'hardware') {
        setActiveView('sdr');
      }
    }
  };

  // Sync activeView changes with URL
  const handleSetActiveView = (view: ActiveAppView) => {
    setActiveView(view);
    if (view === 'hardware') {
      navigate('/hardware');
    } else if (view === 'famicom') {
      navigate('/famicom');
    } else if (view === 'suite') {
      navigate('/suite');
    } else if (view === 'blueprint') {
      navigate('/blueprint');
    } else if (view === 'knowledge') {
      navigate('/knowledge');
    } else {
      if (location.pathname !== '/console') {
        navigate('/console');
      }
    }
  };

  // Pull to refresh handler
  const handlePullToRefresh = async () => {
    await new Promise(res => setTimeout(res, 600));
    addLog('SYSTEM', 'PULL-TO-REFRESH: Synchronized node states and refreshed telemetry.');
  };

  // Real-time yield accumulation engine
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setNodes(prevNodes => {
        const totalPerSec = prevNodes.reduce((sum, n) => {
          if (n.status === 'OFFLINE' || n.status === 'ANOMALY') return sum;
          return sum + n.currentYieldPerSec;
        }, 0);

        const tickEarned = totalPerSec * speedMultiplier;
        setAccumulatedYield(prev => prev + tickEarned);

        return prevNodes.map(n => {
          if (n.status === 'OFFLINE' || n.status === 'ANOMALY') return n;
          return {
            ...n,
            accumulatedEarned: n.accumulatedEarned + (n.currentYieldPerSec * speedMultiplier)
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, speedMultiplier]);

  // Periodic ambient telemetry events
  useEffect(() => {
    if (!isRunning) return;

    const ambientInterval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.40) {
        addLog('QUANTUM', 'Grover oracle depth benchmark verified at 2^27.0 iterations.');
      } else if (roll < 0.70) {
        const macroTick = (401.50 + (Math.random() * 36 - 18)).toFixed(2);
        addLog('YIELD', `Macro yield tick generated +$${macroTick}/s across pipelines.`);
      } else {
        addLog('SYSTEM', 'Class-2 Shift Agent re-balanced liquidity pathways.');
      }
    }, 7000);

    return () => clearInterval(ambientInterval);
  }, [isRunning, addLog]);

  // Boost toggle action
  const handleToggleBoost = useCallback((nodeId: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id !== nodeId) return n;
      const willBoost = !n.isBoosted;
      const nextYield = willBoost ? n.baseYieldPerSec * 2.5 : n.baseYieldPerSec;
      const nextStatus = willBoost ? 'BOOST 2.5x' : 'ONLINE';

      if (willBoost) {
        addLog('YIELD', `Node #${n.id} (${n.name}) boosted! Yield multiplied by 2.5x.`);
      } else {
        addLog('SYSTEM', `Node #${n.id} (${n.name}) boost mode deactivated.`);
      }

      const updated = {
        ...n,
        isBoosted: willBoost,
        currentYieldPerSec: parseFloat(nextYield.toFixed(2)),
        status: nextStatus as YieldNode['status']
      };

      if (inspectedNode && inspectedNode.id === nodeId) {
        setInspectedNode(updated);
      }
      return updated;
    }));
  }, [addLog, inspectedNode]);

  // Force terminate node action
  const handleForceTerminate = useCallback((nodeId: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id !== nodeId) return n;
      const terminatedNode: YieldNode = {
        ...n,
        status: 'OFFLINE',
        healthPercent: 0,
        currentYieldPerSec: 0,
        isBoosted: false
      };
      return terminatedNode;
    }));
    const target = nodes.find(n => n.id === nodeId);
    addLog('ANOMALY', `EMERGENCY FORCE TERMINATE: Node #${nodeId} (${target ? target.name : 'Target'}) zeroized and shut down.`);
  }, [nodes, addLog]);

  // Shift Rotation action
  const handleRotateShift = useCallback(() => {
    const shiftOrder: ShiftName[] = ['ALPHA', 'BETA', 'GAMMA'];
    const nextIdx = (shiftOrder.indexOf(activeShift) + 1) % shiftOrder.length;
    const nextShift = shiftOrder[nextIdx];
    setActiveShift(nextShift);

    const sup = shifts.find(s => s.name === nextShift)?.supervisor || 'AGENT_SUPERVISOR';
    addLog('SYSTEM', `Shift rotated to ${nextShift}. Active supervisor: ${sup}`);
  }, [activeShift, shifts, addLog]);

  // CLI command executor
  const handleRunCliCommand = useCallback((cmd: string) => {
    const lower = cmd.toLowerCase().trim();
    if (lower === 'clear' || lower === 'cls') {
      setLogs([]);
      addLog('SYSTEM', 'Log buffer cleared.');
      return;
    }
    if (lower === 'rotate' || lower === 'rotate-shift') {
      handleRotateShift();
      return;
    }
    if (lower.startsWith('boost ')) {
      const targetId = parseInt(lower.replace('boost ', '').replace('#', ''), 10);
      if (!isNaN(targetId) && targetId >= 1 && targetId <= 25) {
        handleToggleBoost(targetId);
        return;
      }
    }
    addLog('SYSTEM', `CLI Command executed: ${cmd}`);
  }, [handleRotateShift, handleToggleBoost, addLog]);

  // Deduct yield
  const handleDeductYield = useCallback((amount: number, description: string) => {
    setAccumulatedYield(prev => {
      const next = Math.max(0, prev - amount);
      addLog('YIELD', `DEBIT CARD PAYMENT: -$${amount.toFixed(2)} for ${description}. Remaining: $${next.toFixed(2)}`);
      return next;
    });
  }, [addLog]);

  // Add yield
  const handleAddYield = useCallback((amount: number, reason: string) => {
    setAccumulatedYield(prev => {
      const next = prev + amount;
      if (Math.random() < 0.2) {
        addLog('YIELD', `SWARM HARVEST: +$${amount.toFixed(2)} NZD (${reason}). Net: $${next.toFixed(2)}`);
      }
      return next;
    });
  }, [addLog]);

  const currentSupervisor = shifts.find(s => s.name === activeShift)?.supervisor || 'AGENT_GAMMA_14';

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#070b13)] text-[var(--text-primary,#f8fafc)] flex flex-col font-sans selection:bg-cyan-500 selection:text-black pb-16 md:pb-0">
      {/* Top Telemetry & Global Controls Header */}
      <TopBar
        nodes={nodes}
        accumulatedYield={accumulatedYield}
        speedMultiplier={speedMultiplier}
        setSpeedMultiplier={setSpeedMultiplier}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onResetYield={() => {
          setAccumulatedYield(0);
          addLog('YIELD', 'Net accumulated yields reset to zero.');
        }}
        onExportLedger={() => setShowExportModal(true)}
        activeShiftSupervisor={currentSupervisor}
        activeView={activeView}
        setActiveView={handleSetActiveView}
        onOpenOptionsMenu={() => setIsOptionsMenuOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Main Content with Native Pull-To-Refresh */}
      <main className="flex-1 p-3 sm:p-5 max-w-[1680px] w-full mx-auto space-y-6">
        <PullToRefresh onRefresh={handlePullToRefresh}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Route: HP Victus Hardware Authentication Manager */}
              <Route 
                path="/hardware" 
                element={
                  <motion.div
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      <HardwareAuthManager />
                    </Suspense>
                  </motion.div>
                } 
              />

              {/* Route: Project Super Famicom & Hak5 Arsenal */}
              <Route 
                path="/famicom" 
                element={
                  <motion.div
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      <SuperFamicomEngine />
                    </Suspense>
                  </motion.div>
                } 
              />

              {/* Route: Suite (Hyperion & Domus v4.2.0) */}
              <Route 
                path="/suite" 
                element={
                  <motion.div
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      <HyperionSuiteModule />
                    </Suspense>
                  </motion.div>
                } 
              />

              {/* Route: Blueprint */}
              <Route 
                path="/blueprint" 
                element={
                  <motion.div
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      <CryptanalyticArchitecture />
                    </Suspense>
                  </motion.div>
                } 
              />

              {/* Route: Knowledge */}
              <Route 
                path="/knowledge" 
                element={
                  <motion.div
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full"
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      <KnowledgeBase />
                    </Suspense>
                  </motion.div>
                } 
              />

              {/* Route: Console */}
              <Route 
                path="/console" 
                element={
                  <motion.div
                    variants={screenVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-full space-y-6"
                  >
                    <Suspense fallback={<ViewLoadingFallback />}>
                      {activeView === 'hardware' && (
                        <HardwareAuthManager />
                      )}

                      {activeView === 'famicom' && (
                        <SuperFamicomEngine />
                      )}

                      {activeView === 'suite' && (
                        <HyperionSuiteModule />
                      )}

                      {activeView === 'apex' && (
                        <ApexOrchestrator 
                          accumulatedYield={accumulatedYield}
                          onAddYield={handleAddYield}
                          activeShift={activeShift}
                        />
                      )}

                      {activeView === 'sdr' && (
                        <SdrHackRfGateway />
                      )}

                      {activeView === 'iqreplay' && (
                        <IQReplayManager />
                      )}

                      {activeView === 'scanner' && (
                        <QuantumAssetScanner accumulatedYield={accumulatedYield} />
                      )}

                      {activeView === 'browser' && (
                        <ChromiumBrowserModule 
                          accumulatedYield={accumulatedYield}
                          onDeductYield={handleDeductYield}
                          onNavigateToReplay={() => handleSetActiveView('iqreplay')}
                        />
                      )}

                      {activeView === 'entropy' && (
                        <QuantumEntropyVisualizer />
                      )}

                      {activeView === 'absorbers' && (
                        <ThreatAbsorberEngine />
                      )}

                      {activeView === 'engine' && (
                        <SwarmOrchestratorView />
                      )}

                      {activeView === 'darkai' && (
                        <DarkAiFramework />
                      )}

                      {activeView === 'defender' && (
                        <QuantumDefender />
                      )}

                      {activeView === 'mapper' && (
                        <NodeLocationMapper />
                      )}

                      {activeView === 'terminator' && (
                        <SpectrumTerminator />
                      )}

                      {activeView === 'v2k' && (
                        <MicrowaveV2kTerminator />
                      )}

                      {activeView === 'cli' && (
                        <NodeTerminationCli onLogEvent={(msg) => addLog('SYSTEM', msg)} />
                      )}

                      {activeView === 'all' && (
                        <div className="space-y-6">
                          <CryptanalyticArchitecture />
                          <KnowledgeBase />
                          <SdrHackRfGateway />
                          <ApexOrchestrator 
                            accumulatedYield={accumulatedYield}
                            onAddYield={handleAddYield}
                            activeShift={activeShift}
                          />
                        </div>
                      )}
                    </Suspense>
                  </motion.div>
                } 
              />

              {/* Default redirect to suite */}
              <Route path="*" element={<Navigate to="/suite" replace />} />
            </Routes>
          </AnimatePresence>

          {/* Live Quantum Orchestrator Log Terminal */}
          <div className="mt-6">
            <Suspense fallback={<div className="h-24 bg-black/60 rounded-xl" />}>
              <QuantumTerminal
                logs={logs}
                onClearLogs={() => setLogs([])}
                onRunCliCommand={handleRunCliCommand}
              />
            </Suspense>
          </div>
        </PullToRefresh>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Safe Area Compliant) */}
      <BottomTabBar
        currentTab={currentTab}
        onSelectTab={handleSelectBottomTab}
        onlineCount={nodes.filter(n => n.status !== 'OFFLINE' && n.status !== 'ANOMALY').length}
        totalPipelines={nodes.length + 1}
      />

      {/* Footer (Desktop) */}
      <footer className="border-t border-slate-900 bg-black/60 py-4 px-6 text-center text-xs font-mono text-slate-500 hidden md:block">
        <div className="flex flex-wrap items-center justify-between max-w-[1680px] mx-auto gap-2">
          <span>
            HYPERION QUANTUM ORCHESTRATOR • MULTI-ENGINE CRYPTANALYTIC ARCHITECTURE
          </span>
          <span className="text-slate-400">
            SYSTEM STATE: <span className="text-emerald-400 font-bold">25/26 PIPELINES SYNCHRONIZED</span>
          </span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <Suspense fallback={null}>
        {inspectedNode && (
          <NodeDetailModal
            node={inspectedNode}
            onClose={() => setInspectedNode(null)}
            onToggleBoost={handleToggleBoost}
            onForceTerminate={handleForceTerminate}
          />
        )}

        {showExportModal && (
          <LedgerExportModal
            nodes={nodes}
            onClose={() => setShowExportModal(false)}
            accumulatedTotal={accumulatedYield}
          />
        )}

        {isOptionsMenuOpen && (
          <OptionsDropdownMenu
            isOpen={isOptionsMenuOpen}
            onClose={() => setIsOptionsMenuOpen(false)}
          />
        )}

        {isSettingsModalOpen && (
          <SettingsProfileModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            userEmail="bbamm4088@gmail.com"
          />
        )}

        {isModalOpen && (
          <HardwareAuthManager
            isModal
            onClose={closeModal}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <HardwareAuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </HardwareAuthProvider>
    </ThemeProvider>
  );
}
