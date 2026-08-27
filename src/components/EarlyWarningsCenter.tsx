import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  TrendingDown,
  Building,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { EarlyWarningAlert } from '../types';
import { getRiskColorClass } from '../utils/formatters';

interface EarlyWarningsCenterProps {
  alerts: EarlyWarningAlert[];
  onSelectBusiness: (businessId: string) => void;
  onOpenReminderModal: () => void;
  onSwitchToWhatIf: () => void;
}

export const EarlyWarningsCenter: React.FC<EarlyWarningsCenterProps> = ({
  alerts,
  onSelectBusiness,
  onOpenReminderModal,
  onSwitchToWhatIf,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    if (categoryFilter !== 'ALL' && alert.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-widest">
              Telemetry Feed
            </span>
            <span className="text-[11px] text-amber-400 font-mono">
              SIMULATED / MODEL OUTPUT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Early Warning Signal Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time proactive triggers for payment delays, buyer concentration spikes, and downstream domino threats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-400 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800/40 font-mono">
            {alerts.filter((a) => a.severity === 'RED').length} Critical Signals Active
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#151921] p-4 rounded-xl border border-[#2D3748] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Filter Severity:
          </span>
          {['ALL', 'RED', 'ORANGE', 'YELLOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-[#0B0E14] text-white border border-[#2D3748] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev === 'ALL' ? 'All Alerts' : sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="PAYMENT_DELAY">Payment Delinquency</option>
            <option value="LIQUIDITY_DROP">Liquidity & Runway Exhaustion</option>
            <option value="BUYER_CONCENTRATION">Buyer Concentration Spike</option>
            <option value="CONTAGION_CASCADE">Contagion Cascade Trigger</option>
            <option value="SUPPLIER_DISTRESS">Sub-Supplier Distress</option>
          </select>
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const riskColors = getRiskColorClass(alert.severity);
          return (
            <div
              key={alert.id}
              className={`rounded-2xl p-5 border ${riskColors.border} bg-[#151921] shadow-sm space-y-3 transition-all`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D3748] pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${riskColors.ring} ${
                      alert.severity === 'RED' ? 'animate-ping' : ''
                    }`}
                  />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {alert.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${riskColors.badge}`}
                  >
                    {alert.severity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {alert.businessName}
                  </span>
                </div>
              </div>

              {/* Reason & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0B0E14] p-3 rounded-xl border border-[#2D3748]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Trigger Cause / Signal:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{alert.reason}</p>
                </div>

                <div className="bg-[#0B0E14] p-3 rounded-xl border border-[#2D3748]">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">
                    Systemic Downstream Impact:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{alert.impact}</p>
                </div>
              </div>

              {/* Recommended Action & Toolbar */}
              <div className="bg-[#0B0E14] p-3 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-slate-200 font-medium leading-tight">
                    {alert.recommendedAction}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectBusiness(alert.businessId)}
                    className="px-2.5 py-1 bg-[#151921] hover:bg-slate-900 border border-[#2D3748] text-slate-300 text-[11px] font-semibold rounded-lg cursor-pointer"
                  >
                    Inspect Node
                  </button>
                  <button
                    onClick={onSwitchToWhatIf}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg cursor-pointer shadow-sm"
                  >
                    Deploy Fix
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
