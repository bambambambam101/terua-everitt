import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Play, 
  Trash2, 
  CornerDownLeft, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  ShieldCheck,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { FrequencyNode } from '../data/nodesData';

interface TerminalSimulatorProps {
  nodes: FrequencyNode[];
  onShutdownNode: (nodeId: string) => void;
  onShutdownAll: () => void;
  initialCommand?: string;
  onExportCoordinates: () => void;
}

interface TerminalLine {
  id: string;
  type: 'prompt' | 'info' | 'success' | 'warn' | 'error' | 'header' | 'action';
  text: string;
  timestamp?: string;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  nodes,
  onShutdownNode,
  onShutdownAll,
  initialCommand = '',
  onExportCoordinates
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: '1', type: 'header', text: 'Windows PowerShell 7.4.2' },
    { id: '2', type: 'header', text: 'Copyright (c) Microsoft Corporation. All rights reserved.' },
    { id: '3', type: 'info', text: 'PowerShell RF Frequency Node Administration Module loaded.' },
    { id: '4', type: 'success', text: '[AUTH] Administrative operator verified. Ownership credentials active.' },
    { id: '5', type: 'info', text: 'Ready. Type "help" or run .\\Scan-FrequencyNodes.ps1' }
  ]);

  const [inputVal, setInputVal] = useState(initialCommand || '.\\Scan-FrequencyNodes.ps1 -AutoShutdownActive');
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCommand) {
      setInputVal(initialCommand);
    }
  }, [initialCommand]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, isRunning]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines(prev => [...prev, { id: Math.random().toString(), type, text }]);
  };

  const runScanSimulation = async (cmdString: string, autoShutdown: boolean) => {
    setIsRunning(true);
    addLine('prompt', `PS C:\\RF-Admin> ${cmdString}`);
    
    addLine('header', '======================================================================');
    addLine('header', ' [RF-SEC] FREQUENCY NODE TELEMETRY SCANNER & ADMINISTRATIVE SHUTDOWN ');
    addLine('header', '======================================================================');
    
    await new Promise(r => setTimeout(r, 150));
    addLine('success', '[AUTH] Administrator authenticated as: AdminOperator (Ownership Verified)');
    addLine('info', '[CONF] Target Log Output : C:\\RF-Logs\\FrequencyNode_Coordinates.csv');
    addLine('info', '[CONF] Frequency Range   : 1.00 GHz - 92.54 GHz');
    addLine(autoShutdown ? 'warn' : 'info', `[CONF] Auto-Shutdown     : ${autoShutdown ? 'ENABLED (Force Terminate)' : 'DISABLED (Monitor Only)'}`);
    addLine('info', '[SCAN] Interrogating RF spectrum for active nodes...');
    
    await new Promise(r => setTimeout(r, 200));

    // Sample scan through key nodes
    const sampleNodes = nodes.slice(0, 15);
    let terminated = 0;

    for (let i = 0; i < sampleNodes.length; i++) {
      const node = sampleNodes[i];
      await new Promise(r => setTimeout(r, 70));

      const statusTag = node.status === 'ACTIVE' ? '[ACTIVE - TRANSMITTING]' : `[${node.status}]`;
      const lineText = `  [${node.id}] ${node.frequencyGhz.toFixed(2)} GHz | ${node.powerWatts}W | Lat: ${node.latitude.toFixed(4)}, Lon: ${node.longitude.toFixed(4)} | ${node.locationName} | ${statusTag}`;

      if (node.status === 'ACTIVE') {
        addLine('error', lineText);
        if (autoShutdown) {
          await new Promise(r => setTimeout(r, 120));
          addLine('action', `  -> [AUTH-KILL] Sending Carrier Quench to ${node.id} (${node.name})...`);
          addLine('action', `  -> [BREAKER-CUT] Dropping RF power: ${node.powerWatts}W -> 0W`);
          addLine('success', `  -> [TERMINATED] Hardware emitter quenched. Administrative lock set.`);
          onShutdownNode(node.id);
          terminated++;
        }
      } else {
        addLine(node.status === 'WIPED' ? 'warn' : 'info', lineText);
      }
    }

    if (nodes.length > 15) {
      addLine('info', `  ... [Compressed Output: Evaluated ${nodes.length - 15} additional grid nodes in Auckland/NZ corridor] ...`);
    }

    await new Promise(r => setTimeout(r, 200));
    addLine('header', '----------------------------------------------------------------------');
    addLine('info', `[SCAN-SUMMARY] Total Nodes Examined : ${nodes.length}`);
    addLine('info', `[SCAN-SUMMARY] Coordinates Logged   : ${nodes.length} records`);
    addLine(terminated > 0 ? 'success' : 'info', `[SCAN-SUMMARY] Active Nodes Quenched: ${terminated}`);
    
    await new Promise(r => setTimeout(r, 100));
    addLine('success', `[LOGGING] Successfully exported coordinates to C:\\RF-Logs\\FrequencyNode_Coordinates.csv`);
    addLine('header', '======================================================================');
    setIsRunning(false);
  };

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isRunning) return;

    const trimmed = inputVal.trim();

    if (trimmed.toLowerCase() === 'cls' || trimmed.toLowerCase() === 'clear-host') {
      setLines([
        { id: '1', type: 'header', text: 'Windows PowerShell 7.4.2' },
        { id: '2', type: 'info', text: 'Console cleared.' }
      ]);
      return;
    }

    if (trimmed.toLowerCase() === 'help') {
      addLine('prompt', `PS C:\\RF-Admin> ${trimmed}`);
      addLine('info', 'Available Commands:');
      addLine('info', '  .\\Scan-FrequencyNodes.ps1 -AutoShutdownActive   : Scan spectrum, log coordinates, shutdown transmitters');
      addLine('info', '  .\\Scan-FrequencyNodes.ps1 -DryRun              : Scan and test credentials without altering hardware');
      addLine('info', '  .\\Stop-FrequencyNode.ps1 -NodeId <ID>          : Direct administrative shutdown of specific node');
      addLine('info', '  Get-RFNodeCoordinates -Path <path>             : Read logged coordinates from CSV file');
      addLine('info', '  Stop-AllActiveNodes                            : Emergency kill switch for all active emitters');
      addLine('info', '  Clear-Host / cls                               : Clear console output');
      return;
    }

    if (trimmed.toLowerCase().includes('stop-allactivenodes')) {
      addLine('prompt', `PS C:\\RF-Admin> ${trimmed}`);
      addLine('warn', '[EMERGENCY-OVERRIDE] Dispatched simultaneous shutdown across all active transmitters.');
      onShutdownAll();
      addLine('success', '[SUCCESS] All active RF nodes successfully de-energized.');
      return;
    }

    if (trimmed.toLowerCase().includes('get-rfnodecoordinates')) {
      addLine('prompt', `PS C:\\RF-Admin> ${trimmed}`);
      addLine('info', 'Reading coordinates log from C:\\RF-Logs\\FrequencyNode_Coordinates.csv ...');
      sampleCoordinatesOutput();
      return;
    }

    const autoShutdown = trimmed.includes('-AutoShutdownActive');
    runScanSimulation(trimmed, autoShutdown);
  };

  const sampleCoordinatesOutput = () => {
    addLine('header', 'NodeId    Frequency  Power   Latitude   Longitude  Location');
    addLine('header', '------    ---------  -----   --------   ---------  --------');
    nodes.slice(0, 8).forEach(n => {
      addLine('info', `${n.id.padEnd(9)} ${n.frequencyGhz.toFixed(2).padStart(5)} GHz ${n.powerWatts.toString().padStart(5)}W   ${n.latitude.toFixed(4).padStart(8)}   ${n.longitude.toFixed(4).padStart(9)}  ${n.locationName}`);
    });
    addLine('info', `... and ${nodes.length - 8} more rows.`);
  };

  const clearTerminal = () => {
    setLines([
      { id: '1', type: 'header', text: 'Windows PowerShell 7.4.2' },
      { id: '2', type: 'info', text: 'Console buffer cleared.' }
    ]);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
      {/* Top action header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
              PowerShell Administrative Execution Console
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 font-semibold">
                ACTIVE SESSION
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Simulate script execution with real-time stream logging, coordinate capture, and transmitter deactivation.
            </p>
          </div>
        </div>

        {/* Action presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            onClick={() => runScanSimulation('.\\Scan-FrequencyNodes.ps1 -AutoShutdownActive', true)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <Play className="w-3.5 h-3.5" />
            RUN SCAN & SHUTDOWN
          </button>

          <button
            onClick={() => runScanSimulation('.\\Scan-FrequencyNodes.ps1 -DryRun', false)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            DRY RUN (MONITOR ONLY)
          </button>

          <button
            onClick={onExportCoordinates}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            VIEW CSV LOG
          </button>

          <button
            onClick={clearTerminal}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="rounded-xl border border-slate-800 bg-[#0c1017] shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="px-4 py-2 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="ml-2 text-slate-300 font-semibold">
              Administrator: Windows PowerShell (RF-Admin)
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Encoding: UTF-8</span>
            <span>Auth: OK</span>
          </div>
        </div>

        {/* Terminal Screen */}
        <div 
          ref={scrollRef}
          className="p-4 overflow-y-auto max-h-[500px] min-h-[400px] space-y-1 text-slate-200 leading-relaxed font-mono"
        >
          {lines.map((l) => {
            let color = 'text-slate-300';
            if (l.type === 'prompt') color = 'text-cyan-400 font-bold';
            if (l.type === 'header') color = 'text-cyan-500 font-semibold';
            if (l.type === 'success') color = 'text-emerald-400 font-medium';
            if (l.type === 'warn') color = 'text-yellow-400';
            if (l.type === 'error') color = 'text-red-400 font-bold';
            if (l.type === 'action') color = 'text-purple-300';

            return (
              <div key={l.id} className={`${color} whitespace-pre-wrap break-all`}>
                {l.text}
              </div>
            );
          })}

          {isRunning && (
            <div className="flex items-center gap-2 text-cyan-400 py-1 animate-pulse">
              <span className="inline-block w-2 h-4 bg-cyan-400"></span>
              <span>Scanning frequencies and processing shutdown queue...</span>
            </div>
          )}
        </div>

        {/* Terminal Input Bar */}
        <form onSubmit={handleExecute} className="p-3 bg-[#13171f] border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold pl-2 select-none">
            PS C:\RF-Admin&gt;
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isRunning}
            className="flex-1 bg-transparent text-slate-100 focus:outline-none font-mono text-xs placeholder:text-slate-600"
            placeholder="Type command or press Enter to run..."
          />
          <button
            type="submit"
            disabled={isRunning}
            className="px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-300 border border-cyan-700/60 rounded text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            Execute
          </button>
        </form>
      </div>

      {/* Quick Command Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div 
          onClick={() => setInputVal('.\\Scan-FrequencyNodes.ps1 -AutoShutdownActive')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg cursor-pointer transition"
        >
          <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1">
            <Play className="w-3.5 h-3.5" />
            Scan & Terminate Active
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Scans 1.0 GHz - 92.5 GHz, logs all coordinates to CSV and de-energizes any active carrier.
          </div>
        </div>

        <div 
          onClick={() => setInputVal('.\\Scan-FrequencyNodes.ps1 -DryRun -LogPath "C:\\Logs\\Coords.csv"')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg cursor-pointer transition"
        >
          <div className="text-yellow-400 font-semibold mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Dry-Run Audit Only
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Harvests all node coordinates and status without sending termination signals to hardware.
          </div>
        </div>

        <div 
          onClick={() => setInputVal('Get-RFNodeCoordinates -Path "C:\\RF-Logs\\FrequencyNode_Coordinates.csv"')}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-lg cursor-pointer transition"
        >
          <div className="text-cyan-400 font-semibold mb-1 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Inspect Logged Coordinates
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            Dumps parsed latitude, longitude, power and frequency records from the output file.
          </div>
        </div>
      </div>
    </div>
  );
};
