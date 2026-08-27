import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  Sliders,
  DollarSign,
  FileCheck2,
  RefreshCw,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Business, SupplyRelationship, MitigationScenario } from '../types';
import {
  DEFAULT_MITIGATION_SCENARIOS,
  runContagionSimulation,
  calculateWhatIfComparison,
} from '../utils/riskEngine';
import { formatINR } from '../utils/formatters';

interface WhatIfSimulatorProps {
  businesses: Business[];
  relationships: SupplyRelationship[];
  onOpenReminderModal: () => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  businesses,
  relationships,
  onOpenReminderModal,
}) => {
  const [scenarios, setScenarios] = useState<MitigationScenario[]>(DEFAULT_MITIGATION_SCENARIOS);
  const [originBusinessId, setOriginBusinessId] = useState<string>('biz-oem-1');
  const [shockDays, setShockDays] = useState<number>(30);

  // Toggle individual scenario active state
  const toggleScenario = (id: string) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  // Run simulation & calculate comparison
  const simulationResult = useMemo(
    () => runContagionSimulation(originBusinessId, shockDays, businesses, relationships),
    [originBusinessId, shockDays, businesses, relationships]
  );

  const comparison = useMemo(
    () => calculateWhatIfComparison(scenarios, simulationResult),
    [scenarios, simulationResult]
  );

  const activeInterventionsCount = scenarios.filter((s) => s.active).length;

  // Chart data preparation
  const chartData = [
    {
      metric: 'Affected Businesses',
      'Without Intervention': comparison.withoutIntervention.affectedCount,
      'With Intervention': comparison.withIntervention.affectedCount,
    },
    {
      metric: 'Network Health (pts)',
      'Without Intervention': comparison.withoutIntervention.healthScore,
      'With Intervention': comparison.withIntervention.healthScore,
    },
    {
      metric: 'Critical High-Risk Nodes',
      'Without Intervention': comparison.withoutIntervention.criticalCount,
      'With Intervention': comparison.withIntervention.criticalCount,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Mitigation Sandbox (Re-Simulate)
              </span>
              <span className="text-[11px] text-amber-400 font-mono">
                SIMULATED / MODEL OUTPUT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              What-If Mitigation Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Test real-world financial interventions (TReDS Factoring, Emergency Working Capital, MSMED Act Sec 16) and observe how they halt shockwave propagation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-mono">
              {activeInterventionsCount} of {scenarios.length} Interventions Active
            </span>
          </div>
        </div>
      </div>

      {/* Selectable Interventions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Select Active Interventions to Deploy:</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Click checkboxes to toggle interventions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((scenario) => {
            const isActive = scenario.active;
            return (
              <div
                key={scenario.id}
                onClick={() => toggleScenario(scenario.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isActive
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                    : 'bg-[#151921] border-[#2D3748] hover:border-slate-600 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isActive ? 'text-emerald-300' : 'text-slate-200'
                      }`}
                    >
                      {scenario.name}
                    </h4>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-[#2D3748] text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#2D3748] flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Mitigation Effect:</span>
                  <span className="text-emerald-400 font-bold">
                    -{Math.round(scenario.mitigationFactor * 100)}% Shock Propagation
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison: Without Intervention vs With Intervention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: WITHOUT INTERVENTION */}
        <div className="lg:col-span-6 bg-[#151921] rounded-2xl p-6 border border-rose-900/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                WITHOUT INTERVENTION (Passive Default)
              </h3>
            </div>
            <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase tracking-widest">
              Severe Cascade
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Affected Businesses</span>
              <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
                {comparison.withoutIntervention.affectedCount}
              </span>
              <span className="text-[10px] text-slate-500">Unmitigated domino effect</span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Total Network Exposure</span>
              <span className="text-xl font-bold text-amber-400 mt-1 block">
                {formatINR(comparison.withoutIntervention.exposureINR, true)}
              </span>
              <span className="text-[10px] text-slate-500">Working capital frozen</span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Network Health Score</span>
              <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
                {comparison.withoutIntervention.healthScore} / 100
              </span>
              <span className="text-[10px] text-slate-500">High systemic fragility</span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Critical Nodes (&lt;15d cash)</span>
              <span className="text-2xl font-extrabold text-orange-400 mt-1 block">
                {comparison.withoutIntervention.criticalCount}
              </span>
              <span className="text-[10px] text-slate-500">Imminent default risk</span>
            </div>
          </div>

          <p className="text-xs text-rose-300 leading-relaxed bg-[#0B0E14] p-3 rounded-xl border border-[#2D3748]">
            When payment delay is ignored, liquidity constraints propagate up the supply chain, freezing supplier payments and forcing sub-tier factory cutbacks.
          </p>
        </div>

        {/* Right: WITH INTERVENTION */}
        <div className="lg:col-span-6 bg-[#151921] rounded-2xl p-6 border border-emerald-500/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                WITH INTERVENTION (Active Protection)
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
              Contagion Contained
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Affected Businesses</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {comparison.withIntervention.affectedCount}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {comparison.improvement.businessesProtected} Businesses Protected
              </span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Total Network Exposure</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">
                {formatINR(comparison.withIntervention.exposureINR, true)}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {formatINR(comparison.improvement.exposurePreventedINR, true)} Risk Prevented
              </span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Network Health Score</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {comparison.withIntervention.healthScore} / 100
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                +{comparison.improvement.healthRecovered} pts Health Recovery
              </span>
            </div>

            <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
              <span className="text-[11px] text-slate-400 block">Critical Nodes (&lt;15d cash)</span>
              <span className="text-2xl font-extrabold text-emerald-300 mt-1 block">
                {comparison.withIntervention.criticalCount}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">
                {comparison.withoutIntervention.criticalCount - comparison.withIntervention.criticalCount} Nodes Stabilized
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-300 leading-relaxed bg-[#0B0E14] p-3 rounded-xl border border-[#2D3748]">
            By deploying TReDS invoice discounting and targeted token settlements, liquidity is restored to fragile Tier 3 suppliers, preventing systemic production stoppages.
          </p>
        </div>
      </div>

      {/* Visual Recharts Comparison Chart */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Comparative Impact Metrics (Without vs With Intervention)
            </h3>
            <p className="text-xs text-slate-400">
              Real-time model calculation based on active mitigation scenarios.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Model Engine v2.4
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis dataKey="metric" stroke="#A0AEC0" fontSize={11} />
              <YAxis stroke="#A0AEC0" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#151921',
                  borderColor: '#2D3748',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#F7FAFC',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar
                dataKey="Without Intervention"
                fill="#E11D48"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="With Intervention"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
