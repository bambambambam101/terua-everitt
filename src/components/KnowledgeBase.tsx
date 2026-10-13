import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Radio, 
  Zap, 
  Atom, 
  ArrowRight, 
  Share2, 
  FileText, 
  TrendingUp, 
  Infinity as InfinityIcon,
  ChevronRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import HardwareSecurityDefense from './HardwareSecurityDefense';

interface Discipline {
  id: string;
  name: string;
  description: string;
}

interface DomainGroup {
  id: string;
  number: string;
  title: string;
  countLabel: string;
  icon: React.ReactNode;
  summary: string;
  disciplines: Discipline[];
}

export const KnowledgeBase: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'framework' | 'interdependency' | 'literature' | 'hardwareDefense'>('framework');
  const [expandedDomain, setExpandedDomain] = useState<string>('05');

  const domainGroups: DomainGroup[] = [
    {
      id: '01',
      number: '01',
      title: 'Core Architectural & System Engineering',
      countLabel: '4 disciplines',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      summary: 'Foundational hardware-software boundaries, kernel abstractions, and resilient compute substrates.',
      disciplines: [
        {
          id: '01-1',
          name: 'Distributed Systems & Microkernel Design',
          description: 'Designing fault-tolerant, isolated compute nodes with formal mathematical IPC isolation guarantees.'
        },
        {
          id: '01-2',
          name: 'Hardware Security Modules & Silicon Roots of Trust',
          description: 'Anchoring cryptographic keys directly into physical silicon fuses and physical unclonable functions (PUFs).'
        },
        {
          id: '01-3',
          name: 'Real-Time Operating Systems (RTOS) Determinism',
          description: 'Guaranteeing hard real-time latency deadlines for mission-critical industrial and avionics controllers.'
        },
        {
          id: '01-4',
          name: 'Fault-Tolerant Consensus Protocols',
          description: 'Formal implementation of Byzantine fault-tolerant state-machine replication under adversarial partition conditions.'
        }
      ]
    },
    {
      id: '02',
      number: '02',
      title: 'Advanced Cryptographic Systems',
      countLabel: '4 disciplines',
      icon: <Lock className="w-5 h-5 text-purple-400" />,
      summary: 'Post-quantum schemes, zero-knowledge constructions, and homomorphic data processing.',
      disciplines: [
        {
          id: '02-1',
          name: 'Post-Quantum Lattice & Code-Based Primitives',
          description: 'Deploying NIST-standardized ML-KEM (Kyber) and ML-DSA (Dilithium) to resist Shor’s algorithm.'
        },
        {
          id: '02-2',
          name: 'Zero-Knowledge Succinct Non-Interactive Proofs (ZK-SNARKs)',
          description: 'Generating succinct computational integrity proofs without disclosing private witness data.'
        },
        {
          id: '02-3',
          name: 'Fully Homomorphic Encryption (FHE)',
          description: 'Executing arbitrary algebraic arithmetic on ciphertext domains without requiring decryption keys.'
        },
        {
          id: '02-4',
          name: 'Quantum Key Distribution (QKD) Protocols',
          description: 'Leveraging quantum no-cloning theorems to achieve information-theoretic key exchange.'
        }
      ]
    },
    {
      id: '03',
      number: '03',
      title: 'Communication, Network, & Optical Security',
      countLabel: '4 disciplines',
      icon: <Radio className="w-5 h-5 text-blue-400" />,
      summary: 'Physical optical interconnects, high-throughput fabrics, and software-defined network segmentation.',
      disciplines: [
        {
          id: '03-1',
          name: 'Free-Space Optics & Physical Photonic Isolation',
          description: 'Directional laser communications eliminating electromagnetic eavesdropping vectors.'
        },
        {
          id: '03-2',
          name: 'Software-Defined Networking (SDN) Microsegmentation',
          description: 'Dynamically isolating data-plane pipelines using programmable eBPF and P4 switch fabrics.'
        },
        {
          id: '03-3',
          name: 'Line-Rate Wire-Speed Deep Packet Inspection',
          description: 'FPGA-accelerated packet parsing maintaining 100 Gbps bisection bandwidth without drop rates.'
        },
        {
          id: '03-4',
          name: 'Post-Quantum Hybrid Transport Layer Security',
          description: 'Dual-encapsulation TLS 1.3 tunnels combining classical ECDHE with Kyber key exchanges.'
        }
      ]
    },
    {
      id: '04',
      number: '04',
      title: 'Defensive Engineering, Operations, & Resilience',
      countLabel: '4 disciplines',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      summary: 'Autonomous threat hunting, telemetry synthesis, and self-healing system recovery.',
      disciplines: [
        {
          id: '04-1',
          name: 'Automated Threat Hunting & Telemetry Synthesis',
          description: 'Ingesting multi-gigabit eBPF and kernel audit event streams into real-time anomaly classifiers.'
        },
        {
          id: '04-2',
          name: 'Digital Forensics & Incident Response (DFIR) Automation',
          description: 'Volatile memory acquisition and automated root-cause chain-of-custody derivation.'
        },
        {
          id: '04-3',
          name: 'Air-Gapped Deception Fabrics & Honeynets',
          description: 'Deploying high-interaction deceptive virtual nodes that capture unauthorized lateral movement.'
        },
        {
          id: '04-4',
          name: 'Chaos Engineering & Adversarial Injection',
          description: 'Continual controlled degradation of nodes to test automated circuit breakers and failovers.'
        }
      ]
    },
    {
      id: '05',
      number: '05',
      title: 'Software Security & Application Engineering',
      countLabel: '4 disciplines',
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      summary: 'Securing the logic layer of software throughout the entire design, build, and deployment lifecycle.',
      disciplines: [
        {
          id: '05-1',
          name: 'Secure Software Development Lifecycle (SSDLC)',
          description: 'Integrating automated security gates (SAST/DAST) directly into CI/CD build pipelines.'
        },
        {
          id: '05-2',
          name: 'Binary Analysis & Reverse Engineering',
          description: 'Deconstructing compiled binaries into assembly and pseudocode to discover undocumented vulnerabilities or malware mechanics.'
        },
        {
          id: '05-3',
          name: 'Vulnerability Research & Exploit Mitigation',
          description: 'Identifying software flaws (e.g., memory corruption) and implementing structural defenses like ASLR, DEP, and control-flow integrity.'
        },
        {
          id: '05-4',
          name: 'API Security Engineering',
          description: 'Designing secure, authenticated, and rate-limited interface gateways for decoupled microservice communications.'
        }
      ]
    }
  ];

  const interdependencyEdges = [
    {
      source: 'Advanced Cryptographic Systems',
      target: 'Core Architectural & System Engineering',
      description: 'Embedding Post-Quantum algorithms into Silicon Roots of Trust.'
    },
    {
      source: 'Software Security & Application Engineering',
      target: 'Defensive Engineering, Operations, & Resilience',
      description: 'Feeding application-layer telemetry into Automated Threat Hunting pipelines.'
    },
    {
      source: 'Communication, Network, & Optical Security',
      target: 'Advanced Cryptographic Systems',
      description: 'Deploying QKD protocols over physical Free-Space Optics channels.'
    },
    {
      source: 'Core Architectural & System Engineering',
      target: 'Communication, Network, & Optical Security',
      description: 'Utilizing Cloud Virtualisation to isolate Software-Defined Networking layers.'
    },
    {
      source: 'Advanced Cryptographic Systems',
      target: 'Software Security & Application Engineering',
      description: 'Implementing Homomorphic Encryption libraries into secure application APIs.'
    },
    {
      source: 'Defensive Engineering, Operations, & Resilience',
      target: 'Core Architectural & System Engineering',
      description: 'Refining Secure Systems Architecture based on Digital Forensics incident data.'
    }
  ];

  const filteredGroups = domainGroups.map(group => {
    if (!searchFilter) return group;
    const q = searchFilter.toLowerCase();
    const matchesGroup = group.title.toLowerCase().includes(q) || group.summary.toLowerCase().includes(q);
    const matchedDisciplines = group.disciplines.filter(
      d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    );
    if (matchesGroup) return group;
    if (matchedDisciplines.length > 0) {
      return { ...group, disciplines: matchedDisciplines };
    }
    return null;
  }).filter(Boolean) as DomainGroup[];

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                KNOWLEDGE BASE
              </span>
              <span className="text-xs font-mono text-slate-400">
                Peer-Reviewed Foundations & Structural References
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-cyan-400" />
              Cyber Engineering Knowledge Framework
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              A structured reference map of the core disciplines, methodologies, and technical domains comprising cyber engineering, quantum bounds, and high-performance interconnects.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('framework')}
              className={`px-3 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center cursor-pointer ${
                activeTab === 'framework' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5 DISCIPLINES
            </button>
            <button
              onClick={() => setActiveTab('interdependency')}
              className={`px-3 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center cursor-pointer ${
                activeTab === 'interdependency' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              INTERDEPENDENCY
            </button>
            <button
              onClick={() => setActiveTab('literature')}
              className={`px-3 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center cursor-pointer ${
                activeTab === 'literature' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              LITERATURE REVIEW
            </button>
            <button
              onClick={() => setActiveTab('hardwareDefense')}
              className={`px-3 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'hardwareDefense' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              HARDWARE & AI DEFENSE
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: 5 DISCIPLINES FRAMEWORK
      ========================================================================= */}
      {activeTab === 'framework' && (
        <div className="space-y-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter disciplines and methodologies…"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 min-h-[44px]"
            />
          </div>

          {/* Domain Cards Accordion */}
          <div className="space-y-4">
            {filteredGroups.map((group) => {
              const isExpanded = expandedDomain === group.id;

              return (
                <div 
                  key={group.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition"
                >
                  {/* Card Header (Accessible 44px tap target) */}
                  <button
                    onClick={() => setExpandedDomain(isExpanded ? '' : group.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer min-h-[52px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold font-mono text-cyan-400 w-8">
                        {group.number}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                          {group.icon}
                          {group.title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 font-sans">
                          {group.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-full bg-black/60 border border-slate-800">
                        {group.countLabel}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded Disciplines List */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-800/80 bg-black/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
                        {group.disciplines.map(d => (
                          <div 
                            key={d.id}
                            className="bg-slate-900/80 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5 hover:border-cyan-800/60 transition"
                          >
                            <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              {d.name}
                            </h3>
                            <p className="text-xs text-slate-300 font-sans leading-relaxed">
                              {d.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: INTERDEPENDENCY MAP
      ========================================================================= */}
      {activeTab === 'interdependency' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5">
            <h2 className="text-base font-bold font-mono text-cyan-300 mb-1 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              Cross-Disciplinary Cyber Engineering Interdependency Map
            </h2>
            <p className="text-xs text-slate-400">
              Illustrates directional telemetry, hardware root-of-trust bindings, and cryptographic feedback loops across domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {interdependencyEdges.map((edge, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-cyan-700/60 transition flex flex-col justify-between"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                    {edge.source}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    {edge.target}
                  </span>
                </div>
                <p className="text-sm text-slate-200 font-sans leading-relaxed pt-1">
                  {edge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: LITERATURE REVIEW
      ========================================================================= */}
      {activeTab === 'literature' && (
        <div className="space-y-6 knowledge-content">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1 font-bold">
                <FileText className="w-4 h-4" />
                ACADEMIC SYNTHESIS & INSTITUTIONAL BENCHMARKS
              </div>
              <h2 className="text-xl font-bold font-mono text-white">
                Comprehensive Research & Literature Review: Quantum Cryptanalysis, High-Performance Fabrics, & Automated Financial Systems
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This document synthesizes current academic literature, institutional benchmarks, and engineering whitepapers relevant to the technical and financial domains explored in this session.
              </p>
            </div>

            {/* Section I */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-base font-bold font-mono text-cyan-300 flex items-center gap-2">
                <Atom className="w-4 h-4 text-cyan-400" />
                I. Quantum Computing & Cryptanalytic Bounds
              </h3>

              <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">
                    1. Shor’s Algorithm Scaling & Fault-Tolerant Overheads
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-xs sm:text-sm">
                    <li>
                      <strong>Resource Estimation:</strong> Modern literature (e.g., Gidney & Ekerå, 2021, "How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits") demonstrates that factoring an RSA-2048 integer via Shor’s algorithm requires approximately $2n + 2$ logical qubits ($n = 2048$), translating to roughly 4,100 logical qubits for the core arithmetic registers.
                    </li>
                    <li>
                      <strong>Surface Code Overhead:</strong> Accounting for Quantum Error Correction (QEC) using surface codes with typical physical-to-logical error thresholds ($\sim 10^{-3}$), fault-tolerant execution requires a physical-to-logical overhead ranging from $1,000:1$ to $10,000:1$. This places total physical qubit requirements in the millions.
                    </li>
                    <li>
                      <strong>Temporal Bottlenecks:</strong> The sequential nature of modular exponentiation ($x^a \pmod N$) and the serialization imposed by $T$-gate distillation factories create an unavoidable temporal floor. Even with parallelized architectures, execution times for RSA-2048 are bound to several hours under realistic physical cycle times (~1 microsecond, or 1 μs). Elliptic Curve Cryptography over 256-bit prime fields (ECDLP) requires significantly fewer logical qubits ($\sim 1,500$ to $2,100$), resulting in shorter operational depths.
                    </li>
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <h4 className="font-semibold text-slate-100 mb-1">
                    2. Grover’s Algorithm & Symmetric Primitives
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-xs sm:text-sm">
                    <li>
                      <strong>Quadratic Speedup Limitations:</strong> Grover’s algorithm offers a theoretical $O(2^(N/2))$ speedup for unstructured search spaces. For AES-128, this reduces classical security from $2^{128}$ to $2^{64}$ operations.
                    </li>
                    <li>
                      <strong>Thermodynamic Constraints:</strong> Evaluating an AES-128 or SHA-256 quantum oracle requires substantial gate depth. Executing $2^{64}$ sequential oracle calls or confronting the $2^{128}$ search space for AES-256 hits physical thermodynamic limits governed by Landauer’s Principle, ensuring that AES-256 and SHA-256 remain robust against quantum brute-force attacks.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section II */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-base font-bold font-mono text-purple-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                II. High-Performance Computing & Memory Interconnects
              </h3>

              <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">
                    1. Exabyte-Scale Memory Fabrics & Inter-Processor Communication (IPC)
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-xs sm:text-sm">
                    <li>
                      <strong>Cache Coherence Scaling:</strong> Distributed memory architectures utilizing global shared memory spaces (such as POSIX shared memory over high-speed fabrics) face severe cache-coherence scaling bottlenecks. Protocols like MESI/MOESI scale at non-linear rates ($O(N^2)$ or worse) as node counts approach the trillion-vCPU scale without strict hierarchical NUMA domain partitioning.
                    </li>
                    <li>
                      <strong>Bisection Bandwidth:</strong> Sustaining data-intensive matrix operations across petabyte-scale memory pools requires optical interconnect topologies and asynchronous direct memory access (DMA) streaming to prevent bus saturation.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section III */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-base font-bold font-mono text-amber-300 flex items-center gap-2">
                <InfinityIcon className="w-4 h-4 text-amber-400" />
                III. Mathematical Physics & Millennium Problems
              </h3>

              <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">
                    1. Analytic Number Theory & Random Matrix Theory
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                    <strong>Hilbert-Pólya Conjecture:</strong> Connects the non-trivial zeros of the Riemann Zeta function ($\zeta(s) = 0$ along Re(s) = 1/2) to the eigenvalues of self-adjoint operators in Hilbert space.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Statistical Analogs:</strong> Random Matrix Theory (RMT), specifically Gaussian Ensembles (GUE), demonstrates that the statistical spacing distributions of Zeta zeros match the energy level spacings of heavy atomic nuclei, bridging number theory with quantum chaos.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <h4 className="font-semibold text-slate-100 mb-1">
                    2. Navier-Stokes & Yang-Mills Rigorous Foundations
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                    <strong>HHL Algorithm Limitations:</strong> While the Harrow-Hassidim-Lloyd (HHL) quantum algorithm provides exponential speedups for solving sparse linear systems ($O(\log N)$), extracting dense vector fields (such as full 3D Navier-Stokes velocity profiles) introduces quantum state tomography readout overheads of $O(N)$, reintroducing classical scaling limits unless macroscopic observables are targeted.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Continuum Limits:</strong> Lattice gauge simulations (e.g., $SU(3)$ Wilson loops for Yang-Mills mass gaps) compute positive mass gaps ($\Delta &gt; 0$) for finite lattice spacings $a$, but require analytical proofs to guarantee validity in the continuum limit ($a \to 0$).
                  </p>
                </div>
              </div>
            </div>

            {/* Section IV */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-base font-bold font-mono text-emerald-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                IV. Multi-Stream Passive Income & Economic Scalability
              </h3>

              <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-100 mb-1">
                    1. Diversification & Portfolio Theory
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
                    <strong>Modern Portfolio Theory (MPT):</strong> Applying asset allocation across uncorrelated or low-correlation categories (Digital Assets, Equities, Real Estate, SaaS, Fixed Income) minimizes systemic volatility.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Asymmetric Risk/Reward Profiles:</strong> Empirical financial research indicates that digital infoproducts and Micro-SaaS offer high initial margin potential with low capital expenditure, whereas real estate and fixed-income assets provide capital preservation and predictable cash-flow stabilization at higher capital entry barriers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: HARDWARE & AI DEFENSE (HP VICTUS & SERVER ATTESTATION)
      ========================================================================= */}
      {activeTab === 'hardwareDefense' && (
        <HardwareSecurityDefense />
      )}
    </div>
  );
};
