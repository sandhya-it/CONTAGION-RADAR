import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Wallet,
  TrendingDown,
  Building2,
  Users,
  Mic,
  Volume2,
  FileText,
  Zap,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Business, Invoice, EarlyWarningAlert, LanguageCode } from '../types';
import { formatINR, getRiskColorClass } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

interface MSMEDashboardProps {
  business: Business;
  invoices: Invoice[];
  alerts: EarlyWarningAlert[];
  language: LanguageCode;
  onOpenVoiceRisk: () => void;
  onOpenVoiceInput: () => void;
  onOpenReminderModal: (invoiceId?: string) => void;
  onTriggerShock: (days: number) => void;
  onSwitchToGraph: () => void;
  onSwitchToWhatIf: () => void;
}

export const MSMEDashboard: React.FC<MSMEDashboardProps> = ({
  business,
  invoices,
  alerts,
  language,
  onOpenVoiceRisk,
  onOpenVoiceInput,
  onOpenReminderModal,
  onTriggerShock,
  onSwitchToGraph,
  onSwitchToWhatIf,
}) => {
  const t = TRANSLATIONS[language];
  const riskClass = getRiskColorClass(business.riskLevel);

  // Filter invoices for this MSME
  const incomingInvoices = invoices.filter((i) => i.supplierId === business.id);
  const totalReceivables = incomingInvoices.reduce((acc, i) => acc + i.amountINR, 0);
  const overdueInvoices = incomingInvoices.filter((i) => i.status === 'OVERDUE');
  const overdueAmount = overdueInvoices.reduce((acc, i) => acc + i.amountINR, 0);
  const maxDelay = overdueInvoices.length > 0 ? Math.max(...overdueInvoices.map((i) => i.daysOverdue)) : 0;

  // Primary top warning
  const primaryAlert = alerts.find((a) => a.businessId === business.id) || alerts[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: MSME Welcome & Udyam ID */}
      <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
              MSME Simplified Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {business.udyamNumber || 'UDYAM-MH-26-0078129'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            {business.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {business.sector} &bull; {business.cluster}
          </p>
        </div>

        {/* Quick MSME Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-voice-input-msme"
            onClick={onOpenVoiceInput}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B0E14] hover:bg-slate-900 text-blue-400 border border-[#2D3748] text-xs font-semibold transition-all cursor-pointer hover:border-blue-500/40"
          >
            <Mic className="w-4 h-4 text-blue-400" />
            <span>{t.buttons.voiceInput}</span>
          </button>

          <button
            id="btn-explain-risk-msme"
            onClick={onOpenVoiceRisk}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{t.buttons.explainMyRisk}</span>
          </button>

          <button
            id="btn-reminder-gen-msme"
            onClick={() => onOpenReminderModal()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B0E14] hover:bg-slate-900 text-slate-200 border border-[#2D3748] text-xs font-semibold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{t.buttons.generateReminder}</span>
          </button>
        </div>
      </div>

      {/* Hero Diagnostic Card: Business Health Score & Risk Level */}
      <div className={`rounded-2xl p-6 border border-[#2D3748] bg-[#151921] shadow-sm relative overflow-hidden`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Health Gauge & Risk Badge */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left border-b lg:border-b-0 lg:border-r border-[#2D3748] pb-6 lg:pb-0 lg:pr-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t.businessHealthScore}
              </span>
              <span className="text-[10px] text-slate-500">(0 - 100)</span>
            </div>

            <div className="flex items-baseline gap-3 my-1">
              <span className={`text-5xl sm:text-6xl font-extrabold tracking-tight ${riskClass.text}`}>
                {business.riskScore}
              </span>
              <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>

            {/* Risk Badge */}
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${riskClass.badge}`}
              >
                <span className={`w-2 h-2 rounded-full ${riskClass.ring} animate-pulse`} />
                <span>{t.riskLevels[business.riskLevel]}</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-3">
              Calculated from payment delays, customer dependency, and cash buffer.
            </p>
          </div>

          {/* Right: Plain-Language Explanation */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{t.metrics.topWarning}</span>
              </div>
              <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                &ldquo;{formatINR(1000000)} payment is 60 days overdue from {business.topBuyerName}. This may create severe pressure on your daily working capital.&rdquo;
              </p>
            </div>

            {/* Plain Risk Drivers Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2D3748]">
              <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t.metrics.operatingCoverage}</div>
                <div className="text-base font-bold text-amber-400 mt-1">
                  {business.daysOperatingCoverage} {t.metrics.daysOfCash}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Down from healthy 60-day baseline buffer
                </div>
              </div>

              <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t.metrics.buyerConcentration}</div>
                <div className="text-base font-bold text-blue-400 mt-1">
                  {business.buyerConcentrationPercent}% on {business.topBuyerName.slice(0, 18)}...
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Single customer controls majority of incoming cash
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Financial Reality Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Money Waiting */}
        <div className="bg-[#151921] rounded-xl p-4 border border-[#2D3748] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t.metrics.moneyWaiting}</span>
            <Wallet className="w-4 h-4 text-blue-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white">
            {formatINR(totalReceivables || 4830000, true)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">3 active PO invoices</div>
        </div>

        {/* 2. Overdue Amount */}
        <div className="bg-[#151921] rounded-xl p-4 border border-[#2D3748] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t.metrics.overdueAmount}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-rose-400">
            {formatINR(overdueAmount || 2480000, true)}
          </div>
          <div className="text-[10px] text-rose-400/80 mt-1">2 invoices past due date</div>
        </div>

        {/* 3. Days Overdue */}
        <div className="bg-[#151921] rounded-xl p-4 border border-[#2D3748] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t.metrics.daysOverdue}</span>
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-300">
            {maxDelay || 60} Days
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Standard terms: 30 days</div>
        </div>

        {/* 4. Operating Coverage */}
        <div className="bg-[#151921] rounded-xl p-4 border border-[#2D3748] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t.metrics.operatingCoverage}</span>
            <TrendingDown className="w-4 h-4 text-orange-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-orange-400">
            {business.daysOperatingCoverage} Days
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Monthly: {formatINR(business.monthlyOperatingExpenseINR, true)}</div>
        </div>

        {/* 5. Buyer Concentration */}
        <div className="bg-[#151921] rounded-xl p-4 border border-[#2D3748] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t.metrics.buyerConcentration}</span>
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-blue-400">
            {business.buyerConcentrationPercent}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Single buyer reliance</div>
        </div>

        {/* 6. Supplier Dependency */}
        <div className="bg-[#151921] rounded-xl p-4 border border-[#2D3748] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{t.metrics.supplierDependency}</span>
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400">
            {business.supplierCount} Vendors
          </div>
          <div className="text-[10px] text-slate-500 mt-1">3 critical single-source</div>
        </div>
      </div>

      {/* Downstream Cascade & Preventive Action Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Downstream Micro-Suppliers at Risk */}
        <div className="lg:col-span-5 bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  {t.metrics.downstreamAffected}
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                3 Micro MSMEs Stressed
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Because your customer hasn&apos;t paid you, your delay in paying your sub-suppliers is now threatening these local businesses:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#0B0E14] border border-[#2D3748] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Ramesh Metal Alloys</div>
                  <div className="text-[11px] text-slate-400">EN8D Steel Billets &bull; ₹8.6 Lakh overdue (55d)</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-400">9d Cash Buffer</span>
                  <div className="text-[10px] text-slate-500">Ingot credit paused</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E14] border border-[#2D3748] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Karthik Packaging & Boxes</div>
                  <div className="text-[11px] text-slate-400">Corrugated Pallets &bull; ₹4.8 Lakh overdue (48d)</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-orange-400">20d Cash Buffer</span>
                  <div className="text-[10px] text-slate-500">Paper mill dues pending</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0E14] border border-[#2D3748] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">National Precision Springs</div>
                  <div className="text-[11px] text-slate-400">Wire Springs &bull; ₹5.2 Lakh overdue (52d)</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-400">12d Cash Buffer</span>
                  <div className="text-[10px] text-slate-500">Wire advance demanded</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2D3748]">
            <button
              onClick={onSwitchToGraph}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-blue-400 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t.buttons.viewGraph}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Recommended Preventive Actions (Action Center Snapshot) */}
        <div className="lg:col-span-7 bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {t.metrics.recommendedActions}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                Actionable Today
              </span>
            </div>

            <div className="space-y-3">
              {/* Action 1 */}
              <div className="p-3.5 rounded-xl bg-[#0B0E14] border border-[#2D3748] hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Discount Unpaid Invoice on TReDS (RXIL / M1xchange)
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Submit Varroc invoice (₹10 Lakh) for immediate factoring. Receive ~85% (₹8.5 Lakh) within 48 hours without pledging collateral.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onSwitchToWhatIf}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Simulate Relief
                  </button>
                </div>
              </div>

              {/* Action 2 */}
              <div className="p-3.5 rounded-xl bg-[#0B0E14] border border-[#2D3748] hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Send MSMED Act Section 16 Formal Payment Notice
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Generate a formal reminder citing mandatory 3x RBI bank rate compounding interest on payments overdue past 45 days.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenReminderModal('inv-101')}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Generate Notice
                  </button>
                </div>
              </div>

              {/* Action 3 */}
              <div className="p-3.5 rounded-xl bg-[#0B0E14] border border-[#2D3748] hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Protect Ramesh Metal Alloys (Token Settlement)
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Release partial token payment of ₹2.5 Lakh to keep virgin ingot line active while factoring clearance arrives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Simulation Trigger */}
          <div className="mt-4 pt-3 border-t border-[#2D3748] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Want to see what happens if the buyer delays another 30 days?
            </span>
            <button
              id="btn-quick-simulate-30d"
              onClick={() => onTriggerShock(30)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.buttons.simulateShock} (+30 Days)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
