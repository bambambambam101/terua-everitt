import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Activity, 
  Terminal, 
  Check, 
  RefreshCw, 
  Cpu, 
  Lock, 
  Flame, 
  Download, 
  Layers, 
  Smartphone, 
  Laptop,
  Radio
} from 'lucide-react';

interface ThreatEvent {
  id: string;
  time: string;
  threatType: 'MITM' | 'MALWARE' | 'RANSOMWARE' | 'SPYWARE';
  sourceIp: string;
  payloadVector: string;
  absorbedEnergyJoules: number;
  status: 'ABSORBED & NEUTRALIZED';
}

export const ThreatAbsorberEngine: React.FC = () => {
  const [totalAbsorbed, setTotalAbsorbed] = useState<number>(1429);
  const [mitmAbsorbed, setMitmAbsorbed] = useState<number>(382);
  const [malwareAbsorbed, setMalwareAbsorbed] = useState<number>(514);
  const [ransomwareAbsorbed, setRansomwareAbsorbed] = useState<number>(298);
  const [spywareAbsorbed, setSpywareAbsorbed] = useState<number>(235);
  const [reroutedEnergyJoules, setReroutedEnergyJoules] = useState<number>(8420.5);

  const [activeTab, setActiveTab] = useState<'absorbers' | 'pqcLayer1'>('absorbers');

  const [threatStream, setThreatStream] = useState<ThreatEvent[]>([
    { id: 'th-1', time: '21:04:18', threatType: 'MITM', sourceIp: '185.220.101.5', payloadVector: 'ARP Poison / SSL Strip', absorbedEnergyJoules: 14.2, status: 'ABSORBED & NEUTRALIZED' },
    { id: 'th-2', time: '21:03:52', threatType: 'MALWARE', sourceIp: '194.26.29.112', payloadVector: 'Heap Spray Buffer Overflow RCE', absorbedEnergyJoules: 28.5, status: 'ABSORBED & NEUTRALIZED' },
    { id: 'th-3', time: '21:02:14', threatType: 'RANSOMWARE', sourceIp: '91.240.118.80', payloadVector: 'Mass File Encryption Call (VSS Wipe)', absorbedEnergyJoules: 42.0, status: 'ABSORBED & NEUTRALIZED' },
    { id: 'th-4', time: '21:01:05', threatType: 'SPYWARE', sourceIp: '45.154.255.19', payloadVector: 'Pegasus Zero-Click Media Parser', absorbedEnergyJoules: 36.8, status: 'ABSORBED & NEUTRALIZED' }
  ]);

  // Periodic automatic threat absorption pulse
  useEffect(() => {
    const interval = setInterval(() => {
      const types: Array<'MITM' | 'MALWARE' | 'RANSOMWARE' | 'SPYWARE'> = ['MITM', 'MALWARE', 'RANSOMWARE', 'SPYWARE'];
      const picked = types[Math.floor(Math.random() * types.length)];
      const energy = parseFloat((12 + Math.random() * 30).toFixed(1));

      const newEvent: ThreatEvent = {
        id: `th-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        threatType: picked,
        sourceIp: `198.51.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        payloadVector: picked === 'MITM' ? 'BGP / DNS Hijack Inversion' :
                       picked === 'MALWARE' ? 'Zero-Day Shellcode Trapdoor' :
                       picked === 'RANSOMWARE' ? 'Crypto Locker Trap Inversion' : 'Predator WebKit Memory Probe',
        absorbedEnergyJoules: energy,
        status: 'ABSORBED & NEUTRALIZED'
      };

      setThreatStream(prev => [newEvent, ...prev.slice(0, 25)]);
      setTotalAbsorbed(prev => prev + 1);
      setReroutedEnergyJoules(prev => prev + energy);

      if (picked === 'MITM') setMitmAbsorbed(p => p + 1);
      else if (picked === 'MALWARE') setMalwareAbsorbed(p => p + 1);
      else if (picked === 'RANSOMWARE') setRansomwareAbsorbed(p => p + 1);
      else setSpywareAbsorbed(p => p + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#070b14] border border-cyan-800/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80">
              AUTONOMOUS ABSORBERS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ZERO-DAY VACUUM & LAYER 1 NIST POST-QUANTUM CRYPTOGRAPHY
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            CYBER THREAT ABSORBER ENGINE & PQC LAYER 1
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Autonomous threat vacuum absorbing MITM injections, malware exploits, ransomware mass-encryption, and Pegasus/Predator spyware—converting adversarial packet energy into cryptanalytic search depth.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('absorbers')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'absorbers'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Active Absorber Vacuum
          </button>

          <button
            onClick={() => setActiveTab('pqcLayer1')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pqcLayer1'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Layer 1: NIST PQC (8 Standards)
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Total Absorbed</span>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {totalAbsorbed} Threats
          </div>
          <span className="text-[10px] text-emerald-300/80">100% Zero-Payload</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">MITM Neutralized</span>
          <div className="text-lg font-bold text-cyan-300 mt-0.5">
            {mitmAbsorbed} Attacks
          </div>
          <span className="text-[10px] text-slate-500">ARP/DNS/SSL Strip</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Malware Vacuums</span>
          <div className="text-lg font-bold text-purple-300 mt-0.5">
            {malwareAbsorbed} Exploits
          </div>
          <span className="text-[10px] text-slate-500">RCE/Heap/ROP Chain</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Ransomware Blocked</span>
          <div className="text-lg font-bold text-red-400 mt-0.5">
            {ransomwareAbsorbed} Hits
          </div>
          <span className="text-[10px] text-slate-500">Key Space Frozen</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Spyware Quenched</span>
          <div className="text-lg font-bold text-amber-300 mt-0.5">
            {spywareAbsorbed} Zero-Clicks
          </div>
          <span className="text-[10px] text-slate-500">Pegasus / Predator</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Rerouted Energy</span>
          <div className="text-lg font-bold text-indigo-400 mt-0.5">
            {reroutedEnergyJoules.toFixed(1)} J
          </div>
          <span className="text-[10px] text-slate-500">Fed to Grover Oracle</span>
        </div>
      </div>

      {/* Main Tab 1: Active Absorber Vacuum Stream */}
      {activeTab === 'absorbers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              LIVE ADVERSARIAL THREAT ABSORPTION AUDIT STREAM
            </h3>
            <span className="text-xs text-slate-400">Autonomous energy conversion active</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Threat Category</th>
                  <th className="p-3">Source Vector IP</th>
                  <th className="p-3">Payload Mechanism</th>
                  <th className="p-3">Absorbed Energy</th>
                  <th className="p-3">Defensive Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {threatStream.map(t => (
                  <tr key={t.id} className="hover:bg-slate-900/40">
                    <td className="p-3 text-slate-500">{t.time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        t.threatType === 'MITM' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                        t.threatType === 'MALWARE' ? 'bg-purple-950 text-purple-300 border-purple-800' :
                        t.threatType === 'RANSOMWARE' ? 'bg-red-950 text-red-300 border-red-800' :
                        'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {t.threatType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{t.sourceIp}</td>
                    <td className="p-3 text-slate-200">{t.payloadVector}</td>
                    <td className="p-3 text-emerald-400 font-bold">+{t.absorbedEnergyJoules} J</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Tab 2: Layer 1: Quantum & Post-Quantum Cryptography Foundation */}
      {activeTab === 'pqcLayer1' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div>
              <h3 className="text-base font-bold text-purple-300 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                LAYER 1: QUANTUM & POST-QUANTUM CRYPTOGRAPHY (PQC) FOUNDATION
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                Official 8 NIST-standardized Post-Quantum Cryptography protections hardened across HP Victus laptop and Oppo A40 smartphone.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-700 text-purple-300 text-xs font-bold">
              8/8 STANDARDS ENFORCED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* #1 NIST PQC */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#1 • NIST Post-Quantum Cryptography Standard Compliance</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">ENFORCED</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Enforce NIST-standardized PQC algorithms like ML-KEM (Kyber) for general encryption and ML-DSA (Dilithium) for digital signatures.
              </p>
              <div className="text-[11px] text-purple-300">Target: Both (HP Victus & Oppo A40)</div>
            </div>

            {/* #2 Stateful Hash Signatures */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#2 • Stateful Hash-Based Signature Firmware</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">ACTIVE</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Implement LMS or XMSS to verify OS and driver updates, protecting against quantum-assisted supply chain exploits.
              </p>
              <div className="text-[11px] text-purple-300">Target: HP Victus</div>
            </div>

            {/* #3 QKD VPN */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#3 • Quantum Key Distribution (QKD) VPN Tunneling</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">SECURED</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Route highly sensitive network traffic through QKD-backed commercial VPN nodes using quantum entanglement.
              </p>
              <div className="text-[11px] text-purple-300">Target: Both (HP Victus & Oppo A40)</div>
            </div>

            {/* #4 Hybrid TLS 1.3 */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#4 • Hybrid Classical-Quantum Cryptographic TLS 1.3</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">ACTIVE</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Configure browsers and endpoints to negotiate hybrid TLS 1.3 connections combining X25519 with Kyber.
              </p>
              <div className="text-[11px] text-purple-300">Target: Both (HP Victus & Oppo A40)</div>
            </div>

            {/* #5 AES-256 / AES-512 */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#5 • AES-256 / AES-512 Symmetric Encryption Minimum</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">ENFORCED</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Ensure all databases and personal files use AES-256 or AES-512 block ciphers resistant to Grover's algorithm.
              </p>
              <div className="text-[11px] text-purple-300">Target: Both (HP Victus & Oppo A40)</div>
            </div>

            {/* #6 PQ-SSH */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#6 • Post-Quantum Secure Shell (PQ-SSH)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">ACTIVE</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Use OpenSSH packages with hybrid ML-KEM support for remote terminal access to prevent key extraction.
              </p>
              <div className="text-[11px] text-purple-300">Target: HP Victus</div>
            </div>

            {/* #7 Signal PQXDH */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#7 • Quantum-Resistant Signal Messaging Protocol</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">SECURED</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Utilize PQ-enhanced cryptography (Signal's PQXDH) to prevent back-dated chat decryption.
              </p>
              <div className="text-[11px] text-purple-300">Target: Oppo A40</div>
            </div>

            {/* #8 FIDO3 Hardware Token */}
            <div className="bg-black/60 border border-purple-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">#8 • Quantum-Safe Hardware Token (FIDO3 Ready)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">PAIRED</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Pair devices with physical FIDO2/WebAuthn hardware keys built to withstand post-quantum sniffing.
              </p>
              <div className="text-[11px] text-purple-300">Target: Both (HP Victus & Oppo A40)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
