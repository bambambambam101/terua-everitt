import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Laptop, 
  Key, 
  Activity, 
  Terminal, 
  Copy, 
  Check, 
  RefreshCw, 
  Radio, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Play, 
  Power, 
  Code, 
  ExternalLink,
  ChevronRight,
  Wifi,
  Zap
} from 'lucide-react';
import { useHardwareAuth, HardwareTrustStatus } from '../context/HardwareAuthContext';

interface HardwareAuthManagerProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const HardwareAuthManager: React.FC<HardwareAuthManagerProps> = ({ 
  isModal = false, 
  onClose 
}) => {
  const {
    status,
    trustScore,
    lastVerifiedAt,
    hardwareFingerprint,
    signature,
    challenge,
    latencyMs,
    port,
    protocol,
    logs,
    isSimulated,
    machineModel,
    tpmProvider,
    connectAndVerify,
    disconnect,
    simulateHandshake,
    clearLogs,
    setProtocol
  } = useHardwareAuth();

  const [activeTab, setActiveTab] = useState<'handshake' | 'inspector' | 'agentCode'>('handshake');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getStatusBadge = (s: HardwareTrustStatus) => {
    switch (s) {
      case 'AUTHENTICATED':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            HARDWARE TRUSTED · 100%
            {isSimulated && <span className="text-[10px] bg-emerald-900/80 px-1.5 py-0.2 rounded text-emerald-200">SIMULATED</span>}
          </div>
        );
      case 'CHALLENGING':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            SIGNING CHALLENGE...
          </div>
        );
      case 'CONNECTING':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            CONNECTING TO :8443
          </div>
        );
      case 'ERROR':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            ATTESTATION FAILED
          </div>
        );
      case 'DISCONNECTED':
      case 'STANDBY':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            AGENT STANDBY · PORT 8443
          </div>
        );
    }
  };

  const csSourceCode = `// ==============================================================================
// VictusHardwareAgent.cs - HP Victus TPM 2.0 & WMI Local Loopback Agent
// ==============================================================================
using System;
using System.Management;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;

class VictusHardwareAgent
{
    private static string CngProviderName = "Microsoft Platform Crypto Provider"; // Forces TPM 2.0
    private static string KeyName = "VictusAppHardwareKey_v1";

    static async Task Main(string[] args)
    {
        Console.WriteLine("🛡️ HP Victus Hardware Security Agent Starting...");
        InitializeTpmKey();
        
        TcpListener server = new TcpListener(IPAddress.Loopback, 8443);
        server.Start();
        Console.WriteLine("📡 Listening for local browser app requests on port 8443...");

        while (true)
        {
            using TcpClient client = await server.AcceptTcpClientAsync();
            using NetworkStream stream = client.GetStream();
            
            byte[] buffer = new byte[2048];
            int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
            string requestStr = Encoding.UTF8.GetString(buffer, 0, bytesRead);

            if (requestStr.StartsWith("SIGN:"))
            {
                string challenge = requestStr.Replace("SIGN:", "").Trim();
                string hardwareHash = GetHardwareFingerprint();
                string dataToSign = $"{challenge}|{hardwareHash}";
                
                string signature = SignDataWithTpm(dataToSign);
                string response = $"{signature}|{hardwareHash}";

                byte[] responseBytes = Encoding.UTF8.GetBytes(response);
                await stream.WriteAsync(responseBytes, 0, responseBytes.Length);
                Console.WriteLine($"[✓] Handshake served for challenge: {challenge.Substring(0, 8)}...");
            }
        }
    }

    private static void InitializeTpmKey()
    {
        CngProvider tpmProvider = new CngProvider(CngProviderName);
        if (!CngKey.Exists(KeyName, tpmProvider))
        {
            CngKeyCreationParameters creationParams = new CngKeyCreationParameters
            {
                Provider = tpmProvider,
                ExportPolicy = CngExportPolicies.None // Non-exportable hardware key
            };
            CngKey.Create(CngAlgorithm.ECDsaP256, KeyName, creationParams);
            Console.WriteLine("🔑 New hardware-bound keypair successfully generated inside TPM 2.0.");
        }
    }

    private static string SignDataWithTpm(string data)
    {
        CngProvider tpmProvider = new CngProvider(CngProviderName);
        using CngKey key = CngKey.Open(KeyName, tpmProvider);
        using ECDsaCng dsa = new ECDsaCng(key);
        
        byte[] dataBytes = Encoding.UTF8.GetBytes(data);
        byte[] signature = dsa.SignData(dataBytes, HashAlgorithmName.SHA256);
        return Convert.ToBase64String(signature);
    }

    private static string GetHardwareFingerprint()
    {
        string motherboardSerial = "";
        string cpuId = "";

        using (ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BaseBoard"))
        {
            foreach (ManagementObject obj in searcher.Get())
                motherboardSerial = obj["SerialNumber"]?.ToString() ?? "";
        }

        using (ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT ProcessorId FROM Win32_Processor"))
        {
            foreach (ManagementObject obj in searcher.Get())
                cpuId = obj["ProcessorId"]?.ToString() ?? "";
        }

        using SHA256 sha256 = SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes($"{motherboardSerial}-{cpuId}"));
        return Convert.ToBase64String(hashBytes);
    }
}`;

  const content = (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/50 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Laptop className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-mono text-white tracking-wide">
                  HARDWARE AUTH MANAGER
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  HP VICTUS TPM 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Local Agent Handshake via WebSocket • Port {port} • Hardware-Locked Non-Exportable Key
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(status)}
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Real Connection Button */}
            <button
              onClick={connectAndVerify}
              disabled={status === 'CONNECTING' || status === 'CHALLENGING'}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md min-h-[44px]"
            >
              <Wifi className="w-4 h-4" />
              {status === 'AUTHENTICATED' ? 'RE-VERIFY HANDSHAKE' : 'CONNECT TO LOCAL AGENT (8443)'}
            </button>

            {/* Instant Simulation Button */}
            <button
              onClick={simulateHandshake}
              disabled={status === 'CONNECTING' || status === 'CHALLENGING'}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-900/60 font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              TEST LOCAL AGENT SIMULATOR
            </button>

            {/* Disconnect Button */}
            {status !== 'STANDBY' && status !== 'DISCONNECTED' && (
              <button
                onClick={disconnect}
                className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Power className="w-3.5 h-3.5" />
                DISCONNECT
              </button>
            )}
          </div>

          {/* Protocol Toggle */}
          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Endpoint:</span>
            <span className="text-indigo-400 font-bold">{protocol}://127.0.0.1:{port}</span>
            <button
              onClick={() => setProtocol(protocol === 'ws' ? 'wss' : 'ws')}
              className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Toggle ws:// vs wss://"
            >
              SWITCH TO {protocol === 'ws' ? 'WSS' : 'WS'}
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('handshake')}
          className={`px-3.5 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center gap-2 cursor-pointer ${
            activeTab === 'handshake' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          TRUST STATUS &amp; TELEMETRY
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-3.5 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center gap-2 cursor-pointer ${
            activeTab === 'inspector' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          PAYLOAD &amp; CRYPTO INSPECTOR
        </button>

        <button
          onClick={() => setActiveTab('agentCode')}
          className={`px-3.5 py-2 rounded-lg font-bold transition min-h-[44px] flex items-center gap-2 cursor-pointer ${
            activeTab === 'agentCode' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          C# LOCAL AGENT CODE
        </button>
      </div>

      {/* =========================================================================
          TAB 1: TRUST STATUS & TELEMETRY
      ========================================================================= */}
      {activeTab === 'handshake' && (
        <div className="space-y-5">
          {/* KPI Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Trust Score */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>HARDWARE TRUST LEVEL</span>
                <ShieldCheck className={`w-4 h-4 ${trustScore === 100 ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>
              <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
                <span className={trustScore === 100 ? 'text-emerald-400' : 'text-slate-400'}>
                  {trustScore}%
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {status === 'AUTHENTICATED' ? 'Enforced' : 'Pending'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {lastVerifiedAt ? `Verified: ${lastVerifiedAt}` : 'No active session'}
              </div>
            </div>

            {/* TPM Chip Status */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>SILICON CRYPTO ENGINE</span>
                <Cpu className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-base font-bold font-mono text-indigo-300 truncate">
                TPM 2.0 Physical
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                MS_PLATFORM_CRYPTO_PROVIDER
              </div>
            </div>

            {/* Target Machine */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>BOUND HARDWARE</span>
                <Laptop className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-base font-bold font-mono text-cyan-300 truncate">
                HP Victus Gaming
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                Motherboard &amp; CPU Lock
              </div>
            </div>

            {/* Loopback Ping Latency */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>LOOPBACK LATENCY</span>
                <Radio className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
                {latencyMs !== null ? `${latencyMs}ms` : '--'}
                <span className="text-xs text-slate-500 font-sans">TCP 127.0.0.1</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Direct Host IPC
              </div>
            </div>
          </div>

          {/* WebSocket Frame Logger */}
          <div className="bg-black/80 rounded-2xl border border-slate-800 p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-slate-200">LOCAL WEBSOCKET HANDSHAKE TELEMETRY</span>
                <span className="text-slate-500">(:8443)</span>
              </div>
              <button
                onClick={clearLogs}
                className="text-[11px] px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="space-y-1 max-h-56 overflow-y-auto text-xs pr-1">
              {logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed ${
                    log.includes('SUCCESS') || log.includes('VERIFIED') 
                      ? 'text-emerald-400 font-semibold' 
                      : log.includes('RX') 
                      ? 'text-cyan-300' 
                      : log.includes('TX') 
                      ? 'text-indigo-300' 
                      : log.includes('ERR') || log.includes('WARN') 
                      ? 'text-amber-300' 
                      : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PAYLOAD & CRYPTO INSPECTOR
      ========================================================================= */}
      {activeTab === 'inspector' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Challenge Nonce */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-indigo-400" />
                  CHALLENGE NONCE DISPATCHED
                </span>
                <button
                  onClick={() => challenge && handleCopy(challenge, 'chal')}
                  disabled={!challenge}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer min-h-[44px] flex items-center gap-1"
                >
                  {copiedText === 'chal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'chal' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="p-3 bg-black/60 rounded-lg border border-slate-800/80 text-cyan-300 break-all select-all font-mono">
                {challenge ? `SIGN:${challenge}` : 'No challenge sent yet. Click "Connect to Local Agent" to dispatch.'}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Generated via <code>window.crypto.getRandomValues</code> to prevent replay attacks across sessions.
              </p>
            </div>

            {/* Hardware Fingerprint Hash */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  HP VICTUS HARDWARE HASH
                </span>
                <button
                  onClick={() => hardwareFingerprint && handleCopy(hardwareFingerprint, 'hw')}
                  disabled={!hardwareFingerprint}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer min-h-[44px] flex items-center gap-1"
                >
                  {copiedText === 'hw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedText === 'hw' ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <div className="p-3 bg-black/60 rounded-lg border border-slate-800/80 text-emerald-300 break-all select-all font-mono">
                {hardwareFingerprint || 'Pending agent handshake...'}
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Computed by C# agent as <code>SHA256(Win32_BaseBoard.SerialNumber + "-" + Win32_Processor.ProcessorId)</code>.
              </p>
            </div>
          </div>

          {/* Full TPM Signature */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                TPM 2.0 PHYSICAL ECDSA P-256 SIGNATURE (BASE64)
              </span>
              <button
                onClick={() => signature && handleCopy(signature, 'sig')}
                disabled={!signature}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer min-h-[44px] flex items-center gap-1"
              >
                {copiedText === 'sig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedText === 'sig' ? 'COPIED' : 'COPY'}
              </button>
            </div>
            <div className="p-3.5 bg-black/70 rounded-lg border border-slate-800 text-purple-300 break-all select-all font-mono leading-relaxed">
              {signature || 'No signature captured. Launch local agent or test simulation.'}
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Signed by the non-exportable private key housed inside your HP Victus physical TPM 2.0 silicon.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: C# LOCAL AGENT CODE & COMPILATION GUIDE
      ========================================================================= */}
      {activeTab === 'agentCode' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  VictusHardwareAgent.cs Source Code
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compile and run this file on your HP Victus laptop to bind this browser app to your hardware.
                </p>
              </div>

              <button
                onClick={() => handleCopy(csSourceCode, 'cs_code')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow min-h-[44px]"
              >
                {copiedText === 'cs_code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedText === 'cs_code' ? 'COPIED C# CODE' : 'COPY SOURCE CODE'}
              </button>
            </div>

            {/* Quick Compilation Steps */}
            <div className="bg-black/60 p-3.5 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-indigo-400 font-bold">QUICK START ON HP VICTUS:</div>
              <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                <li>Create directory: <code>mkdir VictusAgent &amp;&amp; cd VictusAgent</code></li>
                <li>Initialize console: <code>dotnet new console</code></li>
                <li>Add WMI library: <code>dotnet add package System.Management</code></li>
                <li>Replace <code>Program.cs</code> with the code below and run: <code>dotnet run</code></li>
                <li>The agent will start on <code>127.0.0.1:8443</code> and complete the handshake with this app!</li>
              </ol>
            </div>

            <div className="bg-black/90 p-4 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-96">
              <pre>{csSourceCode}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div className="bg-[#0b101b] border border-indigo-900/80 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default HardwareAuthManager;
