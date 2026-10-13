import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Radio, 
  Zap, 
  RotateCcw, 
  Download, 
  X,
  Server,
  Layers,
  Sparkles,
  Terminal
} from 'lucide-react';
import { 
  SettingItem, 
  VM_HYPERVISOR_25_OPTIONS, 
  TRADE_SECRET_25_SETTINGS, 
  THREAT_ABSORBER_25_OPTIONS, 
  SDR_HACKRF_25_PARAMETERS 
} from '../data/optionsMatrixData';

interface OptionsDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingChange?: (id: string, value: any) => void;
}

export const OptionsDropdownMenu: React.FC<OptionsDropdownMenuProps> = ({
  isOpen,
  onClose,
  onSettingChange
}) => {
  // State for the 4 matrices of 25 items each (100 total)
  const [vmSettings, setVmSettings] = useState<SettingItem[]>(VM_HYPERVISOR_25_OPTIONS);
  const [tradeSecretSettings, setTradeSecretSettings] = useState<SettingItem[]>(TRADE_SECRET_25_SETTINGS);
  const [absorberSettings, setAbsorberSettings] = useState<SettingItem[]>(THREAT_ABSORBER_25_OPTIONS);
  const [sdrSettings, setSdrSettings] = useState<SettingItem[]>(SDR_HACKRF_25_PARAMETERS);

  // Active Category / Sub-option Navigation
  const [activeCategory, setActiveCategory] = useState<'vm' | 'absorbers' | 'tradesecret' | 'sdr'>('vm');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTarget, setFilterTarget] = useState<string>('ALL');

  const currentList = useMemo(() => {
    let list: SettingItem[] = [];
    if (activeCategory === 'vm') list = vmSettings;
    else if (activeCategory === 'absorbers') list = absorberSettings;
    else if (activeCategory === 'tradesecret') list = tradeSecretSettings;
    else if (activeCategory === 'sdr') list = sdrSettings;

    return list.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTarget = filterTarget === 'ALL' || item.target === filterTarget;
      return matchesSearch && matchesTarget;
    });
  }, [activeCategory, vmSettings, absorberSettings, tradeSecretSettings, sdrSettings, searchQuery, filterTarget]);

  const handleToggle = (id: string) => {
    const updater = (prev: SettingItem[]) => prev.map(s => {
      if (s.id === id) {
        const nextVal = !s.value;
        if (onSettingChange) onSettingChange(id, nextVal);
        return { ...s, value: nextVal };
      }
      return s;
    });

    if (activeCategory === 'vm') setVmSettings(updater);
    else if (activeCategory === 'absorbers') setAbsorberSettings(updater);
    else if (activeCategory === 'tradesecret') setTradeSecretSettings(updater);
    else if (activeCategory === 'sdr') setSdrSettings(updater);
  };

  const handleSliderChange = (id: string, val: number) => {
    const updater = (prev: SettingItem[]) => prev.map(s => {
      if (s.id === id) {
        if (onSettingChange) onSettingChange(id, val);
        return { ...s, value: val };
      }
      return s;
    });

    if (activeCategory === 'vm') setVmSettings(updater);
    else if (activeCategory === 'absorbers') setAbsorberSettings(updater);
    else if (activeCategory === 'tradesecret') setTradeSecretSettings(updater);
    else if (activeCategory === 'sdr') setSdrSettings(updater);
  };

  const handleSelectChange = (id: string, val: string) => {
    const updater = (prev: SettingItem[]) => prev.map(s => {
      if (s.id === id) {
        if (onSettingChange) onSettingChange(id, val);
        return { ...s, value: val };
      }
      return s;
    });

    if (activeCategory === 'vm') setVmSettings(updater);
    else if (activeCategory === 'absorbers') setAbsorberSettings(updater);
    else if (activeCategory === 'tradesecret') setTradeSecretSettings(updater);
    else if (activeCategory === 'sdr') setSdrSettings(updater);
  };

  const handleExportJson = () => {
    const fullConfig = {
      virtualizedHardwareHypervisor: vmSettings,
      tradeSecretObfuscation: tradeSecretSettings,
      threatAbsorberEngines: absorberSettings,
      hackRfTransceiverParameters: sdrSettings,
      exportTimestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secops_full_100_options_matrix_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#080d1a] border border-cyan-800/80 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl font-mono text-slate-100 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-cyan-900/40 bg-black/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-700 text-cyan-300">
                  DEEP CASCADE MENU
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  100-POINT OPTIONS & SETTINGS MATRIX (25 PER CATEGORY)
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                OPTIONS & SUB-OPTIONS // SETTINGS & SUB-SETTINGS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export 100 Settings (.JSON)
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Options & Sub-Options, Settings & Sub-Settings) */}
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center overflow-x-auto gap-2 text-xs">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold pr-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Category:
          </div>

          <button
            onClick={() => setActiveCategory('vm')}
            className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeCategory === 'vm'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            OPTIONS: VM Virtual Hardware (25)
          </button>

          <button
            onClick={() => setActiveCategory('absorbers')}
            className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeCategory === 'absorbers'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SUB-OPTIONS: Threat Absorbers (25)
          </button>

          <button
            onClick={() => setActiveCategory('tradesecret')}
            className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeCategory === 'tradesecret'
                ? 'bg-purple-950 text-purple-300 border border-purple-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            SETTINGS: HP Victus & Trade Secret (25)
          </button>

          <button
            onClick={() => setActiveCategory('sdr')}
            className={`px-3.5 py-2 rounded-lg font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeCategory === 'sdr'
                ? 'bg-amber-950 text-amber-300 border border-amber-600'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            SUB-SETTINGS: HackRF SDR Tuner (25)
          </button>
        </div>

        {/* Search & Target Filter Strip */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex-1 min-w-[220px] max-w-md relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search 25 items in this section...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">Hardware Target:</span>
            {['ALL', 'HP Victus', 'Oppo A40', 'Virtual VM', 'HackRF One'].map(tgt => (
              <button
                key={tgt}
                onClick={() => setFilterTarget(tgt)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                  filterTarget === tgt
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tgt}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Matrix Content List (25 Items per category) */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3 max-h-[60vh]">
          {currentList.map(item => (
            <div 
              key={item.id}
              className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-900/60 transition"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-400 font-bold">{item.id.toUpperCase()}</span>
                  <span className="text-sm font-bold text-slate-100">{item.name}</span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${
                    item.target === 'HP Victus' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                    item.target === 'Oppo A40' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                    item.target === 'HackRF One' ? 'bg-red-950 text-red-300 border-red-800' :
                    'bg-slate-900 text-slate-300 border-slate-700'
                  }`}>
                    {item.target}
                  </span>
                  <span className="text-[10px] text-slate-500">[{item.category}]</span>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Dynamic Value Controls */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.type === 'toggle' && (
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      item.value
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {item.value ? <Check className="w-3.5 h-3.5" /> : null}
                    {item.value ? 'ENFORCED' : 'DISABLED'}
                  </button>
                )}

                {item.type === 'slider' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={item.min || 0}
                      max={item.max || 100}
                      value={Number(item.value)}
                      onChange={e => handleSliderChange(item.id, parseFloat(e.target.value))}
                      className="w-28 accent-cyan-500"
                    />
                    <span className="text-xs font-bold text-cyan-300 w-16 text-right">
                      {item.value} {item.unit || ''}
                    </span>
                  </div>
                )}

                {item.type === 'select' && item.options && (
                  <select
                    value={String(item.value)}
                    onChange={e => handleSelectChange(item.id, e.target.value)}
                    className="bg-black/60 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
                  >
                    {item.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {item.type === 'input' && (
                  <input
                    type="text"
                    value={String(item.value)}
                    onChange={e => handleSelectChange(item.id, e.target.value)}
                    className="bg-black/60 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 w-32 focus:border-cyan-500 focus:outline-none"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-black/60 flex items-center justify-between text-xs text-slate-500">
          <span>
            HP VICTUS HARDWARE ATTESTATION • STRICT SMBIOS SEAL • ZERO TRACE ACTIVE
          </span>
          <span className="text-cyan-400 font-bold">
            {currentList.length} of 25 parameters rendered
          </span>
        </div>
      </div>
    </div>
  );
};
