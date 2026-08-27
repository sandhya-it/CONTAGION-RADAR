import React from 'react';
import {
  Activity,
  Layers,
  LayoutDashboard,
  Sparkles,
  RefreshCw,
  Volume2,
  Globe,
  HelpCircle,
  AlertTriangle,
  PlayCircle,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface NavbarProps {
  mode: 'MSME' | 'COMMAND';
  setMode: (mode: 'MSME' | 'COMMAND') => void;
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onResetData: () => void;
  onStartDemoTour: () => void;
  onOpenVoiceRisk: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  currentLanguage,
  setLanguage,
  onResetData,
  onStartDemoTour,
  onOpenVoiceRisk,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2D3748] bg-[#0B0E14]/95 backdrop-blur-md">
      {/* Top Disclaimer & Status Banner */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-1.5 bg-[#151921] border-b border-[#2D3748] text-xs text-slate-300">
        <div className="flex items-center gap-2.5 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600/10 border border-blue-500/30 text-blue-400 tracking-wider uppercase">
              {t.disclaimerBadge}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-400 text-[11px]">{t.disclaimerFull}</span>
          <span className="sm:hidden text-slate-400 text-[11px]">Model simulation &mdash; not guaranteed forecast.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden md:inline text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            Supply Chain Intelligence
          </span>
          <button
            onClick={onResetData}
            title="Reset to initial seed dataset"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[11px] px-2 py-0.5 rounded bg-[#0B0E14] border border-[#2D3748]"
          >
            <RefreshCw className="w-3 h-3 text-blue-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xs italic text-white shadow-sm shadow-blue-900/40">
            CR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center">
                <span>CONTAGION</span>
                <span className="text-blue-500 font-extrabold ml-0.5">RADAR</span>
                <span className="ml-2 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-blue-600/10 text-blue-400 border border-blue-500/30">
                  LIVE
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center bg-[#151921] p-1 rounded-lg border border-[#2D3748]">
          <button
            id="nav-msme-mode-btn"
            onClick={() => setMode('MSME')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              mode === 'MSME'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t.msmeMode}</span>
          </button>
          <button
            id="nav-command-center-btn"
            onClick={() => setMode('COMMAND')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              mode === 'COMMAND'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.commandCenter}</span>
          </button>
        </div>

        {/* Right Tools & Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Judge Tour Trigger */}
          <button
            id="btn-judge-tour"
            onClick={onStartDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">{t.buttons.demoTour}</span>
            <span className="sm:hidden">Judge Tour</span>
          </button>

          {/* Voice Explain Quick Trigger */}
          <button
            onClick={onOpenVoiceRisk}
            title="Listen to AI Risk Explanation"
            className="p-2 rounded-lg bg-[#151921] border border-[#2D3748] hover:border-blue-500/50 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Language Selector */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#151921] border border-[#2D3748] hover:border-slate-600 text-slate-200 text-xs font-medium cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{languages.find((l) => l.code === currentLanguage)?.native}</span>
            </div>
            <div className="absolute right-0 top-full mt-1 w-44 bg-[#151921] border border-[#2D3748] rounded-xl shadow-2xl py-1.5 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-[#2D3748]">
                Select Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors cursor-pointer ${
                    currentLanguage === lang.code ? 'text-blue-400 font-bold bg-blue-600/10' : 'text-slate-300'
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-slate-500">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
