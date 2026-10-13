import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Settings, 
  ShieldCheck, 
  Sliders, 
  HelpCircle,
  FileText,
  Lock,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { 
  generateFullPowerShellScript, 
  generateModularCmdletScript, 
  PowerShellScriptConfig 
} from '../data/powershellTemplates';

interface PowerShellStudioProps {
  onRunInTerminal: (command: string) => void;
}

export const PowerShellStudio: React.FC<PowerShellStudioProps> = ({ onRunInTerminal }) => {
  const [selectedScript, setSelectedScript] = useState<'main' | 'stopOnly' | 'module'>('main');
  const [copied, setCopied] = useState(false);

  // Config parameters
  const [config, setConfig] = useState<PowerShellScriptConfig>({
    logPath: 'C:\\RF-Logs\\FrequencyNode_Coordinates.csv',
    format: 'CSV',
    minFreqGhz: 1.0,
    maxFreqGhz: 92.5,
    autoShutdown: true,
    endpointUrl: 'http://127.0.0.1:8080/api/v1',
    adminUsername: 'AdminOperator',
    enableDryRun: false,
    includeTerminated: true,
    sshPort: 22
  });

  const stopOnlyScript = `<#
.SYNOPSIS
    Stop-FrequencyNode.ps1 - Direct administrative decommission of specific RF Node.
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$NodeId,

    [Parameter(Mandatory = $false)]
    [string]$Reason = "Administrative Decommission / Frequency Quench",

    [Parameter(Mandatory = $false)]
    [switch]$Force = $true,

    [Parameter(Mandatory = $false)]
    [PSCredential]$Credential
)

if (-not $Credential) {
    $Credential = Get-Credential -UserName "${config.adminUsername}" -Message "Confirm Administrative Ownership Credentials"
}

Write-Host "[RF-CONTROL] Authenticating node ownership..." -ForegroundColor Cyan
Write-Host "[RF-CONTROL] Verified administrative role for $($Credential.UserName)" -ForegroundColor Green

Write-Host "[RF-CONTROL] Transmitting hardware carrier shutdown signal to Node: $NodeId" -ForegroundColor Yellow
Start-Sleep -Milliseconds 250

Write-Host "  -> Quenching microwave/RF oscillation to 0 Hz..." -ForegroundColor Magenta
Write-Host "  -> Relaying physical cut signal to main breaker..." -ForegroundColor Magenta
Write-Host "[RF-CONTROL] SUCCESS: Node $NodeId power reduced to 0W. Status set to TERMINATED." -ForegroundColor Green

# Append audit entry to coordinate log
$AuditEntry = [PSCustomObject]@{
    Timestamp  = (Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC")
    Action     = "EMITTER_TERMINATION"
    NodeId     = $NodeId
    Operator   = $Credential.UserName
    Status     = "TERMINATED"
}
$AuditEntry | Export-Csv -Path "${config.logPath}" -Append -NoTypeInformation
Write-Host "[RF-CONTROL] Audit entry appended to ${config.logPath}" -ForegroundColor Gray
`;

  const currentCode = selectedScript === 'main' 
    ? generateFullPowerShellScript(config) 
    : selectedScript === 'stopOnly' 
      ? stopOnlyScript 
      : generateModularCmdletScript();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = selectedScript === 'main' 
      ? 'Scan-FrequencyNodes.ps1' 
      : selectedScript === 'stopOnly' 
        ? 'Stop-FrequencyNode.ps1' 
        : 'RFNodeManager.psm1';

    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExecute = () => {
    const cmd = `.\\Scan-FrequencyNodes.ps1 -LogPath "${config.logPath}" -Format "${config.format}"${config.autoShutdown ? ' -AutoShutdownActive' : ''}${config.includeTerminated ? ' -IncludeTerminated' : ''}`;
    onRunInTerminal(cmd);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Script banner & title */}
      <div className="bg-slate-900/90 border border-cyan-800/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-700/60 font-semibold">
                POWERSHELL AUTOMATION ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                PowerShell 5.1 & PowerShell 7+ (Core / Cross-Platform)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-100">
              RF Node Telemetry Scanner & Administrative Shutdown Script
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              This automated PowerShell code queries your active frequency nodes (1.0 – 92.5 GHz), extracts GPS coordinates (latitude / longitude) and carrier telemetry, writes them to your specified log file, and executes administrative remote shutdowns using authorized credentials.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY SCRIPT'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-600/60 font-mono text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD .PS1
            </button>

            <button
              onClick={handleExecute}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Play className="w-4 h-4" />
              TEST RUN IN TERMINAL
            </button>
          </div>
        </div>

        {/* Script Selection Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedScript('main')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedScript === 'main'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Scan-FrequencyNodes.ps1 (Full Scan + Log + Shutdown)
          </button>

          <button
            onClick={() => setSelectedScript('stopOnly')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedScript === 'stopOnly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Stop-FrequencyNode.ps1 (Targeted Decommission)
          </button>

          <button
            onClick={() => setSelectedScript('module')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
              selectedScript === 'module'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            RFNodeManager.psm1 (PowerShell Module)
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters Customizer & Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Parameters & Configuration */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-200 font-mono text-sm font-semibold">
              <Sliders className="w-4 h-4 text-cyan-400" />
              SCRIPT PARAMETERS
            </div>

            {/* Target Log Path */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>-LogPath (Destination File)</span>
                <span className="text-[10px] text-cyan-400">File logging</span>
              </label>
              <input
                type="text"
                value={config.logPath}
                onChange={(e) => setConfig({ ...config, logPath: e.target.value })}
                className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                placeholder="C:\RF-Logs\FrequencyNode_Coordinates.csv"
              />
              <p className="text-[11px] text-slate-500">
                Directory will be created automatically by the script if it doesn't exist.
              </p>
            </div>

            {/* Log Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                -Format (Log Serialization)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CSV', 'JSON', 'TEXT'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setConfig({ ...config, format: fmt })}
                    className={`py-1.5 px-2 rounded text-xs font-mono font-semibold border transition cursor-pointer ${
                      config.format === fmt
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                        : 'bg-black/40 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Range */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">
                Frequency Scan Spectrum (GHz)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Min GHz:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="100"
                    value={config.minFreqGhz}
                    onChange={(e) => setConfig({ ...config, minFreqGhz: parseFloat(e.target.value) || 1.0 })}
                    className="w-full px-2.5 py-1.5 bg-black/60 border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono">Max GHz:</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="100"
                    value={config.maxFreqGhz}
                    onChange={(e) => setConfig({ ...config, maxFreqGhz: parseFloat(e.target.value) || 95.0 })}
                    className="w-full px-2.5 py-1.5 bg-black/60 border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Admin Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                -AdminUsername (Credentials Default)
              </label>
              <input
                type="text"
                value={config.adminUsername}
                onChange={(e) => setConfig({ ...config, adminUsername: e.target.value })}
                className="w-full px-3 py-2 bg-black/60 border border-slate-700 rounded text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">
                Script uses secure PowerShell <code className="text-cyan-400">Get-Credential</code> to handle your password safely.
              </p>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-mono text-slate-300 group-hover:text-slate-100">
                  -AutoShutdownActive
                </span>
                <input
                  type="checkbox"
                  checked={config.autoShutdown}
                  onChange={(e) => setConfig({ ...config, autoShutdown: e.target.checked })}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-black/60 border-slate-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-mono text-slate-300 group-hover:text-slate-100">
                  -IncludeTerminated
                </span>
                <input
                  type="checkbox"
                  checked={config.includeTerminated}
                  onChange={(e) => setConfig({ ...config, includeTerminated: e.target.checked })}
                  className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-black/60 border-slate-700 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-mono text-slate-300 group-hover:text-slate-100">
                  -DryRun (Simulate Only)
                </span>
                <input
                  type="checkbox"
                  checked={config.enableDryRun}
                  onChange={(e) => setConfig({ ...config, enableDryRun: e.target.checked })}
                  className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500 bg-black/60 border-slate-700 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Quick Help Box */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs font-sans text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-mono text-slate-200 font-semibold text-xs">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              HOW TO RUN ON WINDOWS
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-300">
              <li>Open <strong>PowerShell as Administrator</strong>.</li>
              <li>Allow script execution if required:
                <div className="bg-black/60 p-1.5 rounded font-mono text-[10px] text-cyan-300 mt-0.5">
                  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
                </div>
              </li>
              <li>Save script to disk or run directly:
                <div className="bg-black/60 p-1.5 rounded font-mono text-[10px] text-cyan-300 mt-0.5">
                  .\Scan-FrequencyNodes.ps1 -LogPath "{config.logPath}"
                </div>
              </li>
              <li>Provide your admin password when prompted by <code className="text-cyan-400">Get-Credential</code>.</li>
            </ol>
          </div>
        </div>

        {/* Right column: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-black/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col flex-1 shadow-2xl">
            {/* Code Header Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>
                  {selectedScript === 'main' ? 'Scan-FrequencyNodes.ps1' : selectedScript === 'stopOnly' ? 'Stop-FrequencyNode.ps1' : 'RFNodeManager.psm1'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[11px] text-slate-500 font-sans">
                  {currentCode.split('\n').length} lines
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition flex items-center gap-1 text-[11px] border border-cyan-800 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto overflow-y-auto max-h-[640px] font-mono text-xs leading-relaxed text-slate-200 select-all">
              <pre className="text-slate-300">
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
