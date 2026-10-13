import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Activity } from 'lucide-react';

interface YieldChartProps {
  totalYieldPerSec: number;
  qubitLoadStr: string;
}

export const YieldChart: React.FC<YieldChartProps> = ({
  totalYieldPerSec,
  qubitLoadStr
}) => {
  const [dataPoints, setDataPoints] = useState<number[]>(() => {
    // Generate initial historical points around 85 - 105 $/s
    const pts: number[] = [];
    for (let i = 0; i < 28; i++) {
      pts.push(85 + Math.sin(i * 0.4) * 8 + (Math.random() * 6 - 3));
    }
    return pts;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const nextVal = totalYieldPerSec + (Math.random() * 4 - 2);
        return [...prev.slice(1), parseFloat(nextVal.toFixed(2))];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [totalYieldPerSec]);

  const maxVal = Math.max(...dataPoints, 120);
  const minVal = Math.min(...dataPoints, 60);
  const range = maxVal - minVal || 1;

  // Build SVG path
  const width = 800;
  const height = 140;
  const pointsCoords = dataPoints.map((val, idx) => {
    const x = (idx / (dataPoints.length - 1)) * width;
    const y = height - ((val - minVal) / range) * (height - 30) - 15;
    return { x, y, val };
  });

  const pathD = pointsCoords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="bg-slate-900/80 border border-cyan-900/40 rounded-xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold font-mono text-slate-100 tracking-wider">
            Yield vs Qubit Load
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold animate-pulse">
            LIVE FEED
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            SWARM YIELD: ${totalYieldPerSec.toFixed(2)}/s
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            QUBIT DEPTH: {qubitLoadStr}
          </div>
        </div>
      </div>

      {/* SVG Sparkline Graph */}
      <div className="relative w-full h-[140px] bg-black/40 rounded-lg overflow-hidden border border-slate-800/80">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="0" y1={height * 0.50} x2={width} y2={height * 0.50} stroke="#1e293b" strokeDasharray="4 4" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#1e293b" strokeDasharray="4 4" />

          {/* Filled Area */}
          <path d={areaD} fill="url(#yieldGradient)" />

          {/* Stroke Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="url(#strokeGradient)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Glowing Head Point */}
          {pointsCoords.length > 0 && (
            <>
              <circle
                cx={pointsCoords[pointsCoords.length - 1].x}
                cy={pointsCoords[pointsCoords.length - 1].y}
                r="5"
                fill="#10b981"
                className="animate-ping"
              />
              <circle
                cx={pointsCoords[pointsCoords.length - 1].x}
                cy={pointsCoords[pointsCoords.length - 1].y}
                r="3.5"
                fill="#ffffff"
              />
            </>
          )}
        </svg>

        {/* Floating labels */}
        <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-500">
          Max: ${maxVal.toFixed(1)}/s
        </div>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500">
          Min: ${minVal.toFixed(1)}/s
        </div>
      </div>
    </div>
  );
};
