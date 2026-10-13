import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  Radio, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Layers, 
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Activity,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { ALL_INITIAL_NODES, FrequencyNode } from '../data/nodesData';

export const NodeLocationMapper: React.FC = () => {
  // Only look at terminated and wiped nodes from the provided list
  const terminatedNodes = useMemo(() => {
    return ALL_INITIAL_NODES.filter(n => n.status === 'TERMINATED' || n.status === 'WIPED');
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'id' | 'name' | 'location' | 'freq' | 'power' | 'lat'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedNode, setSelectedNode] = useState<FrequencyNode | null>(null);
  const [mapZoomMode, setMapZoomMode] = useState<'global' | 'auckland'>('global');
  const [coordFormat, setCoordFormat] = useState<'decimal' | 'dms'>('decimal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  // Summary statistics calculations
  const stats = useMemo(() => {
    const totalCount = terminatedNodes.length;
    const totalPowerWatts = terminatedNodes.reduce((acc, n) => acc + n.powerWatts, 0);
    const avgPower = totalCount > 0 ? Math.round(totalPowerWatts / totalCount) : 0;
    
    const uniqueLocations = Array.from(new Set(terminatedNodes.map(n => n.locationName)));
    const uniqueTypes = Array.from(new Set(terminatedNodes.map(n => n.type)));
    
    const freqs = terminatedNodes.map(n => n.frequencyGhz);
    const minFreq = Math.min(...freqs);
    const maxFreq = Math.max(...freqs);

    // Regional grouping count
    const regionCounts: Record<string, number> = {};
    terminatedNodes.forEach(n => {
      let group = 'Auckland Sector';
      if (n.locationName.includes('Singapore')) group = 'Singapore Relays';
      else if (n.locationName.includes('London')) group = 'London Relays';
      else if (n.locationName.includes('Tauranga')) group = 'Tauranga';
      else if (n.locationName.includes('Wellington')) group = 'Wellington';
      else if (n.locationName.includes('Gisborne')) group = 'Gisborne';
      else if (n.locationName.includes('Tokyo')) group = 'Tokyo';
      else if (n.locationName.includes('New York')) group = 'New York';
      else if (n.locationName.includes('Beijing')) group = 'Beijing';
      
      regionCounts[group] = (regionCounts[group] || 0) + 1;
    });

    return {
      totalCount,
      totalPowerKw: (totalPowerWatts / 1000).toFixed(1),
      avgPower,
      uniqueLocationsCount: uniqueLocations.length,
      uniqueTypesCount: uniqueTypes.length,
      minFreq: minFreq.toFixed(2),
      maxFreq: maxFreq.toFixed(2),
      regionCounts
    };
  }, [terminatedNodes]);

  // Filtering
  const filteredNodes = useMemo(() => {
    return terminatedNodes.filter(node => {
      if (selectedRegion !== 'ALL') {
        if (!node.locationName.toLowerCase().includes(selectedRegion.toLowerCase())) {
          return false;
        }
      }
      if (selectedType !== 'ALL' && node.type !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = node.name.toLowerCase().includes(q);
        const matchesCode = node.code.toLowerCase().includes(q);
        const matchesLoc = node.locationName.toLowerCase().includes(q);
        const matchesType = node.type.toLowerCase().includes(q);
        const matchesFreq = node.frequencyGhz.toString().includes(q);
        const matchesCoords = `${node.latitude} ${node.longitude}`.includes(q);
        return matchesName || matchesCode || matchesLoc || matchesType || matchesFreq || matchesCoords;
      }
      return true;
    });
  }, [terminatedNodes, selectedRegion, selectedType, searchQuery]);

  // Sorting
  const sortedNodes = useMemo(() => {
    return [...filteredNodes].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'location') {
        comparison = a.locationName.localeCompare(b.locationName);
      } else if (sortField === 'freq') {
        comparison = a.frequencyGhz - b.frequencyGhz;
      } else if (sortField === 'power') {
        comparison = a.powerWatts - b.powerWatts;
      } else if (sortField === 'lat') {
        comparison = a.latitude - b.latitude;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredNodes, sortField, sortDirection]);

  // Helper for DMS format
  const formatCoordinates = (lat: number, lon: number) => {
    if (coordFormat === 'decimal') {
      const latDir = lat >= 0 ? '° N' : '° S';
      const lonDir = lon >= 0 ? '° E' : '° W';
      return `${Math.abs(lat).toFixed(4)}${latDir}, ${Math.abs(lon).toFixed(4)}${lonDir}`;
    }

    const toDms = (deg: number, isLat: boolean) => {
      const dir = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
      const absolute = Math.abs(deg);
      const d = Math.floor(absolute);
      const minFloat = (absolute - d) * 60;
      const m = Math.floor(minFloat);
      const s = ((minFloat - m) * 60).toFixed(1);
      return `${d}°${m}'${s}" ${dir}`;
    };

    return `${toDms(lat, true)}, ${toDms(lon, false)}`;
  };

  const handleCopyCoord = (node: FrequencyNode) => {
    const text = `${node.name} | Lat: ${node.latitude}, Lon: ${node.longitude} | Origin: ${node.locationName}`;
    navigator.clipboard.writeText(text);
    setCopiedId(node.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const text = filteredNodes.map(n => 
      `${n.code}\t${n.name}\t${n.locationName}\t${n.latitude}\t${n.longitude}\t${n.frequencyGhz}GHz\t${n.powerWatts}W\t${n.status}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['Node_ID', 'Code', 'Name', 'Type', 'Frequency_GHz', 'Power_Watts', 'Radius_KM', 'Location_Origin', 'Latitude', 'Longitude', 'Status'];
    const rows = filteredNodes.map(n => [
      n.id,
      n.code,
      `"${n.name}"`,
      n.type,
      n.frequencyGhz,
      n.powerWatts,
      n.radiusKm,
      `"${n.locationName}"`,
      n.latitude,
      n.longitude,
      n.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Terminated_Nodes_Origin_Coordinates_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportGeoJson = () => {
    const geoJson = {
      type: 'FeatureCollection',
      features: filteredNodes.map(n => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [n.longitude, n.latitude]
        },
        properties: {
          id: n.id,
          code: n.code,
          name: n.name,
          type: n.type,
          powerWatts: n.powerWatts,
          frequencyGhz: n.frequencyGhz,
          radiusKm: n.radiusKm,
          location: n.locationName,
          status: n.status
        }
      }))
    };
    const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/geo+json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Terminated_Nodes_GeoJSON_${new Date().toISOString().slice(0, 10)}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-800/50 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 font-mono text-slate-100">
      {/* Component Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-cyan-900/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/80">
              GEOSPATIAL AUDIT
            </span>
            <span className="text-xs text-slate-400 font-mono">
              GPS Coordinates & Decommission Telemetry
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-cyan-400" />
            Node Location Mapper
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5 max-w-3xl">
            Origin coordinate index and geographic distribution mapper for all verified decommissioned frequency nodes across New Zealand, Asia, Europe, and North America.
          </p>
        </div>

        {/* Global Export & Format Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Toggle */}
          <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setCoordFormat('decimal')}
              className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                coordFormat === 'decimal' ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Decimal
            </button>
            <button
              onClick={() => setCoordFormat('dms')}
              className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
                coordFormat === 'dms' ? 'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              DMS
            </button>
          </div>

          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            {allCopied ? 'Copied' : 'Copy All'}
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          <button
            onClick={handleExportGeoJson}
            className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          >
            <Globe className="w-3.5 h-3.5" />
            GeoJSON
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Terminated
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {stats.totalCount}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Nodes quenched (100%)
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Quenched Power
          </span>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">
            {stats.totalPowerKw} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Avg: {stats.avgPower}W / node
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Origin Locations
          </span>
          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
            {stats.uniqueLocationsCount}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Unique origin sectors
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-400" />
            Freq Span
          </span>
          <div className="text-lg font-bold font-mono text-purple-300 mt-1">
            {stats.minFreq} - {stats.maxFreq}
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            GHz frequency range
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-400" />
            Coverage Radius
          </span>
          <div className="text-xl font-bold font-mono text-blue-300 mt-1">
            1.0 <span className="text-xs font-normal text-slate-400">KM</span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            Per-node neutralization
          </span>
        </div>

        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Emitter Classes
          </span>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
            {stats.uniqueTypesCount} <span className="text-xs font-normal text-slate-400">Types</span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">
            DEW, V2K, BCI, etc.
          </span>
        </div>
      </div>

      {/* Regional Cluster Badges */}
      <div className="bg-black/40 rounded-xl p-3 border border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold text-[11px] mr-1">
          REGIONAL DENSITY:
        </span>
        {Object.entries(stats.regionCounts).map(([region, count]) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(selectedRegion === region ? 'ALL' : region)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer border ${
              selectedRegion === region
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{region}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/60 text-cyan-400 font-bold text-[10px]">
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Tactical Map & Projection Section */}
      <div className="bg-black/70 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>GEOGRAPHICAL PROJECTION & ORIGIN VECTORS</span>
            <span className="text-[10px] text-slate-500">
              ({mapZoomMode === 'global' ? 'Global Telemetry View' : 'Auckland North Shore/CBD Grid Sector Zoom'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapZoomMode('global')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                mapZoomMode === 'global' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Global View
            </button>
            <button
              onClick={() => setMapZoomMode('auckland')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                mapZoomMode === 'auckland' ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Auckland Grid Corridor (-36.82° S)
            </button>
          </div>
        </div>

        {/* Tactical SVG Map Canvas */}
        <div className="relative w-full h-[260px] bg-[#070b13] rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            <defs>
              <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#131b2e" strokeWidth="0.8" />
              </pattern>
              <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Grid background */}
            <rect width="1000" height="400" fill="url(#radarGrid)" />

            {/* Coordinate Grid axes */}
            <line x1="500" y1="0" x2="500" y2="400" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="200" x2="1000" y2="200" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />

            {mapZoomMode === 'global' ? (
              <>
                {/* World Map Outline stylized contours */}
                <path
                  d="M 120 120 Q 220 100 300 130 T 400 120 T 520 150 T 650 110 T 780 140 T 900 150 Q 880 280 750 330 T 400 340 Z"
                  fill="url(#radarGlow)"
                  stroke="#1e3a5f"
                  strokeWidth="1"
                  strokeDasharray="6 4"
                  opacity="0.4"
                />

                {/* Major Primary Global Nodes */}
                {/* New York: (40.7128, -74.0060) -> Map coords ~(220, 130) */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(terminatedNodes.find(n => n.id === 'node-004') || null)}>
                  <circle cx="240" cy="135" r="5" fill="#10b981" />
                  <circle cx="240" cy="135" r="10" stroke="#10b981" strokeWidth="1" fill="none" className="animate-ping" opacity="0.6" />
                  <text x="250" y="140" fill="#67e8f9" fontSize="11" fontFamily="monospace">New York (87.76 GHz, 756W)</text>
                </g>

                {/* London: (51.5074, -0.1278) -> Map coords ~(480, 105) */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(terminatedNodes.find(n => n.id === 'node-005') || null)}>
                  <circle cx="480" cy="110" r="5" fill="#10b981" />
                  <circle cx="480" cy="110" r="12" stroke="#10b981" strokeWidth="1" fill="none" className="animate-ping" opacity="0.5" />
                  <text x="490" y="115" fill="#67e8f9" fontSize="11" fontFamily="monospace">London (2.09 GHz, 1526W)</text>
                </g>

                {/* Beijing: (39.9100, 116.4100) -> Map coords ~(740, 140) */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(terminatedNodes.find(n => n.id === 'node-009') || null)}>
                  <circle cx="740" cy="135" r="5" fill="#10b981" />
                  <text x="750" y="140" fill="#67e8f9" fontSize="11" fontFamily="monospace">Beijing (2.60 GHz)</text>
                </g>

                {/* Tokyo: (35.6800, 139.6900) -> Map coords ~(810, 150) */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(terminatedNodes.find(n => n.id === 'node-007') || null)}>
                  <circle cx="810" cy="150" r="5" fill="#f59e0b" />
                  <text x="820" y="155" fill="#fbbf24" fontSize="11" fontFamily="monospace">Tokyo [WIPED]</text>
                </g>

                {/* New Zealand Cluster: (-36 to -41, 174 to 178) -> Map coords ~(850, 310) */}
                <g className="cursor-pointer" onClick={() => setMapZoomMode('auckland')}>
                  <circle cx="850" cy="310" r="8" fill="#06b6d4" />
                  <circle cx="850" cy="310" r="22" stroke="#06b6d4" strokeWidth="1.5" fill="none" className="animate-ping" opacity="0.7" />
                  <text x="730" y="315" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="monospace">NZ Cluster (105 Nodes) →</text>
                  <text x="770" y="332" fill="#94a3b8" fontSize="10" fontFamily="monospace">Auckland / Tauranga / Wellington</text>
                </g>
              </>
            ) : (
              <>
                {/* Auckland Corridor High-Resolution Zoom */}
                <path d="M 100 50 L 900 350" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
                <text x="40" y="40" fill="#94a3b8" fontSize="11" fontFamily="monospace">Auckland North Shore (-36.7210° S)</text>
                <text x="680" y="380" fill="#94a3b8" fontSize="11" fontFamily="monospace">Auckland CBD / South (-36.8210° S)</text>

                {/* Plot points for grid nodes in Auckland */}
                {terminatedNodes.slice(0, 70).map((n, idx) => {
                  // Normalize coordinates along Auckland corridor
                  const x = 120 + ((idx / 70) * 760);
                  const y = 60 + ((idx / 70) * 280) + (Math.sin(idx) * 14);
                  const isHovered = selectedNode?.id === n.id;

                  return (
                    <g 
                      key={n.id} 
                      className="cursor-pointer"
                      onClick={() => setSelectedNode(n)}
                    >
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isHovered ? 6 : 3} 
                        fill={n.status === 'WIPED' ? '#f59e0b' : '#10b981'} 
                      />
                      {idx % 7 === 0 && (
                        <text x={x + 5} y={y - 5} fill="#64748b" fontSize="9" fontFamily="monospace">
                          {n.id} ({n.powerWatts}W)
                        </text>
                      )}
                    </g>
                  );
                })}
              </>
            )}
          </svg>

          {/* Quick HUD Overlay for Selected Node */}
          {selectedNode && (
            <div className="absolute bottom-3 left-3 bg-black/90 border border-cyan-500 rounded-lg p-2.5 text-xs font-mono text-slate-200 shadow-xl max-w-sm">
              <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                <span>{selectedNode.code}</span>
                <span className="text-emerald-400">[{selectedNode.status}]</span>
              </div>
              <div className="text-white font-semibold text-xs mb-1">{selectedNode.name}</div>
              <div className="text-[11px] text-slate-400">
                Origin: <span className="text-slate-200">{selectedNode.locationName}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Coords: <span className="text-emerald-300">{formatCoordinates(selectedNode.latitude, selectedNode.longitude)}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                <span>{selectedNode.frequencyGhz} GHz</span>
                <span className="text-amber-300">{selectedNode.powerWatts}W Quenched</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by node name, code, origin city, frequency, or coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Region selector */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Origins ({terminatedNodes.length})</option>
            <option value="Auckland">Auckland Sector</option>
            <option value="Tauranga">Tauranga</option>
            <option value="Wellington">Wellington</option>
            <option value="Gisborne">Gisborne</option>
            <option value="Singapore">Singapore Relays</option>
            <option value="London">London Relays</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Beijing">Beijing</option>
            <option value="New York">New York</option>
          </select>

          {/* Type selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-black/50 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="DEW">DEW</option>
            <option value="V2K">V2K</option>
            <option value="HACKER">HACKER</option>
            <option value="WEAPON">WEAPON</option>
            <option value="PLASMA">PLASMA</option>
            <option value="BCI">BCI</option>
            <option value="BLE-EXFIL">BLE-EXFIL</option>
            <option value="NRLGY">NRLGY</option>
            <option value="SILENT">SILENT</option>
          </select>

          <span className="text-xs text-slate-400 font-mono pl-2">
            Showing <strong className="text-cyan-400">{sortedNodes.length}</strong> of {terminatedNodes.length}
          </span>
        </div>
      </div>

      {/* Main Searchable Nodes Table */}
      <div className="bg-black/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/90 text-slate-400 sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th 
                  onClick={() => toggleSort('id')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>ID / Code</span>
                    {sortField === 'id' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Node Emitter Name</span>
                    {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('location')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Origin Location</span>
                    {sortField === 'location' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('lat')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>GPS Coordinates</span>
                    {sortField === 'lat' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('freq')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Frequency</span>
                    {sortField === 'freq' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('power')}
                  className="py-3 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Quenched Power</span>
                    {sortField === 'power' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {sortedNodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    No terminated nodes match the specified search query or filters.
                  </td>
                </tr>
              ) : (
                sortedNodes.map((node) => {
                  const isCopied = copiedId === node.id;
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <tr 
                      key={node.id} 
                      className={`hover:bg-cyan-950/20 transition ${
                        isSelected ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-semibold text-cyan-300">
                        {node.code}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-100">{node.name}</div>
                        <div className="text-[10px] text-slate-500">Radius: {node.radiusKm} KM • {node.type}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{node.locationName}</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-300 select-all">
                        {formatCoordinates(node.latitude, node.longitude)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-purple-300">
                        {node.frequencyGhz.toFixed(2)} GHz
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-300">
                        {node.powerWatts.toLocaleString()} W
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          node.status === 'WIPED' 
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800' 
                            : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                        }`}>
                          {node.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleCopyCoord(node)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Copy Coordinates"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                          </button>
                          <button
                            onClick={() => setSelectedNode(node)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-200 transition cursor-pointer"
                            title="Inspect On Radar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
