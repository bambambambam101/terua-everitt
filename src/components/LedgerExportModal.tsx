import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileJson, Copy, Check } from 'lucide-react';
import { YieldNode } from '../types/hyperion';

interface LedgerExportModalProps {
  nodes: YieldNode[];
  onClose: () => void;
  accumulatedTotal: number;
}

export const LedgerExportModal: React.FC<LedgerExportModalProps> = ({
  nodes,
  onClose,
  accumulatedTotal
}) => {
  const [format, setFormat] = useState<'CSV' | 'JSON'>('CSV');
  const [copied, setCopied] = useState(false);

  const generateCsv = () => {
    const headers = [
      'Node_ID',
      'Code',
      'Name',
      'Class',
      'Status',
      'Yield_Per_Sec',
      'Accrued_Earned',
      'Activity_Percent',
      'Qubit_Allocation',
      'Sector'
    ];
    const rows = nodes.map(n => [
      n.id,
      n.code,
      `"${n.name}"`,
      n.classLabel,
      n.status,
      n.currentYieldPerSec.toFixed(2),
      n.accumulatedEarned.toFixed(2),
      n.activityPercent,
      n.qubitAllocation,
      `"${n.sector}"`
    ]);

    // Append Node 26 (Audit Module)
    rows.push([
      26,
      '#26',
      '"Node 26: Cryptanalysis Audit Module"',
      'Cryptanalytic Grover Oracle',
      'ONLINE',
      '0.00',
      '0.00',
      100,
      16384,
      '"Galois Field GF(2) Security Audit"'
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const generateJson = () => {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        accumulatedNetYieldUsd: accumulatedTotal,
        oracleQubitLoad: '2^14.0 Logical Qubits (16,384 Qubits)',
        pipelinesCount: nodes.length + 1,
        nodes: nodes.map(n => ({
          id: n.id,
          code: n.code,
          name: n.name,
          agentClass: n.agentClass,
          classLabel: n.classLabel,
          status: n.status,
          yieldPerSec: n.currentYieldPerSec,
          accumulatedEarned: n.accumulatedEarned,
          activityPercent: n.activityPercent,
          qubitAllocation: n.qubitAllocation,
          sector: n.sector
        })),
        auditModuleNode26: {
          name: 'Node 26: Cryptanalysis Audit Module',
          galoisField: 'GF(2)',
          logicalQubits: 16384,
          circuitSynthesisDepth: '2^27.0',
          linearComplexity: '341 bits'
        }
      },
      null,
      2
    );
  };

  const content = format === 'CSV' ? generateCsv() : generateJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = format === 'CSV' ? 'Hyperion_Production_Ledger.csv' : 'Hyperion_Production_Ledger.json';
    const mime = format === 'CSV' ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b101b] border border-cyan-800/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 font-mono relative text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Download className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100">
            Export Production Streams Matrix Ledger
          </h2>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('CSV')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                format === 'CSV'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-black/50 text-slate-400 border border-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV Format
            </button>
            <button
              onClick={() => setFormat('JSON')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                format === 'JSON'
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-black/50 text-slate-400 border border-slate-800'
              }`}
            >
              <FileJson className="w-4 h-4" />
              JSON Format
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="bg-black/70 border border-slate-800 rounded-xl p-3.5 max-h-80 overflow-y-auto text-xs text-slate-300">
          <pre className="whitespace-pre-wrap break-all font-mono">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};
