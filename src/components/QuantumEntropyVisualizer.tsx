import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { 
  Zap, 
  Activity, 
  RefreshCw, 
  RotateCw, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface QuantumNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  coherence: number; // 0.0 to 1.0
  entropy: number;
  basis: string;
  tier: number;
  // 3D coordinates
  x3: number;
  y3: number;
  z3: number;
}

interface QuantumLink extends d3.SimulationLinkDatum<QuantumNode> {
  source: string | QuantumNode;
  target: string | QuantumNode;
  weight: number;
}

export const QuantumEntropyVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quantum Telemetry States
  const [qubitCount, setQubitCount] = useState<number>(36);
  const [systemEntropy, setSystemEntropy] = useState<number>(0.142);
  const [qubitCoherence, setQubitCoherence] = useState<number>(98.7);
  const [vonNeumannEntropy, setVonNeumannEntropy] = useState<number>(0.089);
  const [statePurity, setStatePurity] = useState<number>(0.994);
  const [groverIteration, setGroverIteration] = useState<number>(1420);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<QuantumNode | null>(null);

  // 3D Euler Angles for orbit projection
  const anglesRef = useRef({ rotX: 0.35, rotY: 0.0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // Generate Initial Quantum Basis Nodes and Entanglement Links
  const graphData = useRef<{ nodes: QuantumNode[]; links: QuantumLink[] }>({ nodes: [], links: [] });

  const initGraph = useCallback(() => {
    const nodes: QuantumNode[] = [];
    const links: QuantumLink[] = [];

    // Create 36 representative Grover Oracle qubit eigenstates across 3 concentric spherical shells
    for (let i = 0; i < qubitCount; i++) {
      const theta = Math.acos(-1 + (2 * i) / qubitCount);
      const phi = Math.sqrt(qubitCount * Math.PI) * theta;
      const radius = 120 + (i % 3) * 45;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      const coherenceVal = 0.88 + Math.random() * 0.12;
      const basisState = `|ψ_${i}⟩ GF(2)^${i % 8}`;

      nodes.push({
        id: `q-${i}`,
        label: `Qubit #${i}`,
        coherence: coherenceVal,
        entropy: parseFloat(((1 - coherenceVal) * 1.5).toFixed(4)),
        basis: basisState,
        tier: (i % 3) + 1,
        x3: x,
        y3: y,
        z3: z,
        x: 0,
        y: 0
      });
    }

    // Connect nodes via Grover oracle entanglement links
    for (let i = 0; i < nodes.length; i++) {
      // Connect to adjacent neighbors
      const next = (i + 1) % nodes.length;
      links.push({
        source: nodes[i].id,
        target: nodes[next].id,
        weight: 0.7 + Math.random() * 0.3
      });

      // Cross-shell entanglement link
      if (i % 2 === 0) {
        const cross = (i + 7) % nodes.length;
        links.push({
          source: nodes[i].id,
          target: nodes[cross].id,
          weight: 0.5 + Math.random() * 0.5
        });
      }
    }

    graphData.current = { nodes, links };
  }, [qubitCount]);

  useEffect(() => {
    initGraph();
  }, [initGraph]);

  // Main 3D D3 force layout and canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (canvas && containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = Math.max(containerRef.current.clientHeight, 480);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Setup D3 Force Simulation for elastic lattice equilibrium
    const simulation = d3.forceSimulation<QuantumNode>(graphData.current.nodes)
      .force('charge', d3.forceManyBody().strength(-40))
      .force('center', d3.forceCenter(0, 0))
      .force('radial', d3.forceRadial(160, 0, 0).strength(0.3))
      .alphaDecay(0.01);

    // Render loop with 3D perspective projection
    const render = () => {
      if (!ctx || !canvas) return;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 450;

      // Update rotation angles if auto-rotating
      if (isRotating && !isDraggingRef.current) {
        anglesRef.current.rotY += 0.006 * rotationSpeed;
      }

      const cosY = Math.cos(anglesRef.current.rotY);
      const sinY = Math.sin(anglesRef.current.rotY);
      const cosX = Math.cos(anglesRef.current.rotX);
      const sinX = Math.sin(anglesRef.current.rotX);

      // Clear Canvas with subtle spatial grid
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      // Draw faint coordinate grid circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
      ctx.stroke();

      const { nodes, links } = graphData.current;

      // Project 3D nodes to 2D screen coordinates
      const projectedNodes: Array<QuantumNode & { px: number; py: number; pz: number; scale: number }> = [];

      nodes.forEach(node => {
        // Rotate around Y axis
        const x1 = node.x3 * cosY - node.z3 * sinY;
        const z1 = node.x3 * sinY + node.z3 * cosY;

        // Rotate around X axis
        const y2 = node.y3 * cosX - z1 * sinX;
        const z2 = node.y3 * sinX + z1 * cosX;

        // Perspective division
        const distance = focalLength + z2;
        const scale = distance > 50 ? focalLength / distance : 0.2;
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        projectedNodes.push({
          ...node,
          px,
          py,
          pz: z2,
          scale
        });
      });

      // Sort nodes and links by depth (Z-buffer painters algorithm)
      projectedNodes.sort((a, b) => b.pz - a.pz);

      // Draw Entanglement Links
      links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : (link.source as QuantumNode).id;
        const targetId = typeof link.target === 'string' ? link.target : (link.target as QuantumNode).id;

        const src = projectedNodes.find(n => n.id === sourceId);
        const tgt = projectedNodes.find(n => n.id === targetId);

        if (src && tgt) {
          const avgScale = (src.scale + tgt.scale) / 2;
          const alpha = Math.max(0.1, Math.min(0.65, avgScale * 0.45));
          
          // Entanglement link gradient
          const grad = ctx.createLinearGradient(src.px, src.py, tgt.px, tgt.py);
          grad.addColorStop(0, `rgba(6, 182, 212, ${alpha})`);
          grad.addColorStop(1, `rgba(168, 85, 247, ${alpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(0.8, 1.6 * avgScale);
          ctx.beginPath();
          ctx.moveTo(src.px, src.py);
          ctx.lineTo(tgt.px, tgt.py);
          ctx.stroke();
        }
      });

      // Draw Qubit Eigenstate Nodes
      projectedNodes.forEach(node => {
        const radius = Math.max(3, 7.5 * node.scale);

        // Core glow
        const glow = ctx.createRadialGradient(node.px, node.py, 1, node.px, node.py, radius * 2.8);
        if (node.coherence > 0.95) {
          glow.addColorStop(0, 'rgba(52, 211, 153, 0.9)'); // High coherence green
          glow.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
          glow.addColorStop(1, 'rgba(6, 182, 212, 0)');
        } else {
          glow.addColorStop(0, 'rgba(168, 85, 247, 0.9)'); // Decoherence purple
          glow.addColorStop(0.5, 'rgba(239, 68, 68, 0.3)');
          glow.addColorStop(1, 'rgba(168, 85, 247, 0)');
        }

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = node.coherence > 0.95 ? '#34d399' : '#c084fc';
        ctx.beginPath();
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
        ctx.fill();

        // White nucleus
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.px, node.py, Math.max(1, radius * 0.35), 0, Math.PI * 2);
        ctx.fill();

        // Text label on closer nodes
        if (node.scale > 0.85) {
          ctx.font = '10px monospace';
          ctx.fillStyle = 'rgba(226, 232, 240, 0.85)';
          ctx.fillText(node.basis, node.px + radius + 4, node.py + 3);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse drag controls for 3D rotation
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      anglesRef.current.rotY += dx * 0.008;
      anglesRef.current.rotX += dy * 0.008;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      simulation.stop();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [qubitCount, isRotating, rotationSpeed]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemEntropy(prev => Math.max(0.08, Math.min(0.24, prev + (Math.random() * 0.01 - 0.005))));
      setQubitCoherence(prev => Math.max(96.5, Math.min(99.8, prev + (Math.random() * 0.2 - 0.1))));
      setVonNeumannEntropy(prev => Math.max(0.05, Math.min(0.14, prev + (Math.random() * 0.006 - 0.003))));
      setStatePurity(prev => Math.max(0.985, Math.min(0.999, prev + (Math.random() * 0.001 - 0.0005))));
      setGroverIteration(prev => prev + 1);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Stabilize Coherence Action
  const handleStabilize = () => {
    setQubitCoherence(99.8);
    setSystemEntropy(0.082);
    setVonNeumannEntropy(0.051);
    setStatePurity(0.999);
    graphData.current.nodes.forEach(n => {
      n.coherence = 0.98 + Math.random() * 0.02;
      n.entropy = 0.02;
    });
  };

  // Inject Decoherence Spike
  const handleInjectDecoherence = () => {
    setQubitCoherence(94.2);
    setSystemEntropy(0.315);
    setVonNeumannEntropy(0.22);
    setStatePurity(0.965);
    graphData.current.nodes.slice(0, 10).forEach(n => {
      n.coherence = 0.72;
      n.entropy = 0.42;
    });
  };

  return (
    <div className="bg-[#070b14] border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700/80">
              D3.JS 3D ENGINE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              QUANTUM GROVER ORACLE ENTROPY & COHERENCE DYNAMICS
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            QUANTUM ENTROPY & QUBIT COHERENCE VISUALIZER
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Live 3D force-directed graph illustrating real-time topological entanglement, quantum decoherence vectors, and Galois Field GF(2) eigenstates within the Grover cryptanalytic oracle.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <button
            onClick={handleStabilize}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          >
            <ShieldCheck className="w-4 h-4" />
            Stabilize Coherence (QEC Pulse)
          </button>

          <button
            onClick={handleInjectDecoherence}
            className="px-3.5 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 border border-purple-700 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Zap className="w-4 h-4 text-purple-300" />
            Simulate Decoherence Spike
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            {isRotating ? 'Pause Orbit' : 'Resume Orbit'}
          </button>
        </div>
      </div>

      {/* Real-Time Quantum Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Qubit Coherence</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {qubitCoherence.toFixed(1)}%
          </div>
          <span className="text-[10px] text-emerald-300/80">T1/T2 Relaxation Stable</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Shannon Entropy H</span>
          <div className="text-lg font-bold text-cyan-300 mt-0.5">
            {systemEntropy.toFixed(3)} bits
          </div>
          <span className="text-[10px] text-slate-500">Low Decoherence Bias</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">von Neumann S(ρ)</span>
          <div className="text-lg font-bold text-purple-400 mt-0.5">
            {vonNeumannEntropy.toFixed(3)}
          </div>
          <span className="text-[10px] text-purple-300/80">Pure Eigenstate Limit</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">State Purity γ</span>
          <div className="text-lg font-bold text-amber-300 mt-0.5">
            {statePurity.toFixed(4)}
          </div>
          <span className="text-[10px] text-slate-500">Tr(ρ²) ≈ 1.0 (Ideal)</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Grover Iterations</span>
          <div className="text-lg font-bold text-indigo-400 mt-0.5">
            {groverIteration.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">O(√N) Optimum Target</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Active Shell Nodes</span>
          <div className="text-lg font-bold text-slate-200 mt-0.5">
            {qubitCount} Nodes
          </div>
          <span className="text-[10px] text-slate-500">2^14.0 Logical Basis</span>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div 
        ref={containerRef}
        className="relative bg-slate-950/90 border border-cyan-900/50 rounded-2xl overflow-hidden min-h-[480px] shadow-inner select-none cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Orbit Instructions & Legend Overlay */}
        <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 pointer-events-none">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
            3D INTERACTION CONTROL
          </div>
          <div className="text-slate-300 text-[11px]">
            • Click & drag to rotate 3D entanglement lattice
          </div>
          <div className="flex items-center gap-3 pt-1 text-[10px]">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Coherent Eigenstate
            </span>
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Entangled Decoherence Vector
            </span>
          </div>
        </div>

        {/* Bottom Tuning Controls Drawer */}
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Speed:</span>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.2"
              value={rotationSpeed}
              onChange={e => setRotationSpeed(parseFloat(e.target.value))}
              className="w-24 accent-purple-500"
            />
            <span className="text-purple-300 text-[11px]">{rotationSpeed}x</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Density:</span>
            <select
              value={qubitCount}
              onChange={e => setQubitCount(parseInt(e.target.value, 10))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-0.5"
            >
              <option value="24">24 Qubits</option>
              <option value="36">36 Qubits (Default)</option>
              <option value="48">48 Qubits</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
