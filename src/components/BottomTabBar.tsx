import React from 'react';
import { 
  Terminal, 
  Layers, 
  BookOpen, 
  User, 
  Radio, 
  Cpu, 
  Sparkles,
  Gamepad2
} from 'lucide-react';

export type MainTabType = 'famicom' | 'suite' | 'blueprint' | 'console' | 'knowledge' | 'settings';

interface BottomTabBarProps {
  currentTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onlineCount?: number;
  totalPipelines?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
  onlineCount = 25,
  totalPipelines = 26
}) => {
  return (
    <nav
      data-mobile-bottom-bar
      role="tablist"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 dark:bg-[#070b13]/95 backdrop-blur-lg border-t border-slate-800/90 shadow-[0_-8px_25px_rgba(0,0,0,0.6)] md:hidden transition-all duration-200 select-none-ui"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-xl mx-auto px-1 pt-1.5">
        {/* Tab 0: Famicom (Termux & Hak5) */}
        <button
          role="tab"
          aria-selected={currentTab === 'famicom'}
          onClick={() => onSelectTab('famicom')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition cursor-pointer ${
            currentTab === 'famicom'
              ? 'text-cyan-400 font-bold bg-cyan-950/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Gamepad2 className="w-4 h-4 mb-0.5" />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[7px] bg-cyan-950 text-cyan-300 font-bold border border-cyan-700">
              Hak5
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-tight">
            Famicom
          </span>
        </button>

        {/* Tab 1: Console */}
        <button
          role="tab"
          aria-selected={currentTab === 'console'}
          onClick={() => onSelectTab('console')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition cursor-pointer ${
            currentTab === 'console'
              ? 'text-cyan-400 font-bold bg-cyan-950/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Terminal className="w-4 h-4 mb-0.5" />
            <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-tight">
            Console
          </span>
        </button>

        {/* Tab 2: Blueprint */}
        <button
          role="tab"
          aria-selected={currentTab === 'blueprint'}
          onClick={() => onSelectTab('blueprint')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition cursor-pointer ${
            currentTab === 'blueprint'
              ? 'text-purple-400 font-bold bg-purple-950/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Layers className="w-4 h-4 mb-0.5" />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[7px] bg-purple-950 text-purple-300 font-bold border border-purple-700">
              SLA
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-tight">
            Blueprint
          </span>
        </button>

        {/* Tab 3: Suite (Hyperion & Domus v4.2.0) */}
        <button
          role="tab"
          aria-selected={currentTab === 'suite'}
          onClick={() => onSelectTab('suite')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition cursor-pointer ${
            currentTab === 'suite'
              ? 'text-amber-400 font-bold bg-amber-950/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Radio className="w-4 h-4 mb-0.5" />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[7px] bg-amber-950 text-amber-300 font-bold border border-amber-700">
              v4.2
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-tight leading-tight">
            Suite
          </span>
        </button>

        {/* Tab 4: Knowledge */}
        <button
          role="tab"
          aria-selected={currentTab === 'knowledge'}
          onClick={() => onSelectTab('knowledge')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition cursor-pointer ${
            currentTab === 'knowledge'
              ? 'text-emerald-400 font-bold bg-emerald-950/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono tracking-tight leading-tight">
            Knowledge
          </span>
        </button>

        {/* Tab 5: Settings / Profile */}
        <button
          role="tab"
          aria-selected={currentTab === 'settings'}
          onClick={() => onSelectTab('settings')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[44px] py-1 rounded-xl transition cursor-pointer ${
            currentTab === 'settings'
              ? 'text-cyan-300 font-bold bg-cyan-950/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono tracking-tight leading-tight">
            Settings
          </span>
        </button>
      </div>
    </nav>
  );
};
