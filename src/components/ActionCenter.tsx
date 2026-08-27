import React from 'react';
import {
  HelpCircle,
  AlertCircle,
  TrendingDown,
  CheckCircle2,
  FileText,
  Building,
  Zap,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Send,
  Sparkles,
} from 'lucide-react';
import { ActionCard, Business, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatINR } from '../utils/formatters';

interface ActionCenterProps {
  actionCards: ActionCard[];
  business: Business;
  language: LanguageCode;
  onOpenReminderModal: () => void;
  onSwitchToWhatIf: () => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  actionCards,
  business,
  language,
  onOpenReminderModal,
  onSwitchToWhatIf,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                Decision Support Framework
              </span>
              <span className="text-[11px] text-slate-400">
                Tailored for {business.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Action & Intervention Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured diagnostic breakdown and high-leverage steps to safeguard MSME working capital.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReminderModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t.buttons.generateReminder}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Part Diagnostic Cards Grid */}
      <div className="space-y-6">
        {actionCards.map((card, idx) => (
          <div
            key={card.id}
            className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm space-y-5"
          >
            {/* Card Top Title & Severity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D3748] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  {idx + 1}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {card.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    card.priority === 'CRITICAL'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : card.priority === 'HIGH'
                      ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                >
                  {card.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {card.targetEntity}
                </span>
              </div>
            </div>

            {/* 4-Box Matrix (What Happened / Why It Matters / What Could Happen / What Should I Do) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. WHAT HAPPENED? */}
              <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{t.actionFramework.whatHappened}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.whatHappened}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#2D3748] text-[10px] text-slate-500 uppercase tracking-wider">
                  Observed Event Trigger
                </div>
              </div>

              {/* 2. WHY IT MATTERS? */}
              <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t.actionFramework.whyItMatters}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.whyItMatters}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#2D3748] text-[10px] text-slate-500 uppercase tracking-wider">
                  Direct Cash Buffer Impact
                </div>
              </div>

              {/* 3. WHAT COULD HAPPEN? */}
              <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{t.actionFramework.whatCouldHappen}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.whatCouldHappen}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#2D3748] text-[10px] text-slate-500 uppercase tracking-wider">
                  Downstream Shockwave Risk
                </div>
              </div>

              {/* 4. WHAT SHOULD I DO NOW? */}
              <div className="bg-[#0B0E14] p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.actionFramework.whatShouldIDo}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {card.whatShouldIDo}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#2D3748] text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Recommended Immediate Action
                </div>
              </div>
            </div>

            {/* Action Execution Toolbar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Available Channels:</span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-[#0B0E14] border border-[#2D3748] text-slate-300">
                  TReDS Factoring
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-[#0B0E14] border border-[#2D3748] text-slate-300">
                  MSMED Act Sec 16
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] bg-[#0B0E14] border border-[#2D3748] text-slate-300">
                  MSME Samadhaan Portal
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onSwitchToWhatIf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Relief Impact</span>
                </button>
                <button
                  onClick={onOpenReminderModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Formal Notice</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
