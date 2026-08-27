import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  AlertTriangle,
  TrendingDown,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  Business,
  SupplyRelationship,
  SimulationResult,
  SimulationStepState,
} from '../types';
import { runContagionSimulation } from '../utils/riskEngine';
import { formatINR } from '../utils/formatters';

interface ContagionSimulatorProps {
  businesses: Business[];
  relationships: SupplyRelationship[];
  onSimulationStepChange?: (stepIndex: number, result: SimulationResult) => void;
  onProceedToMitigation: () => void;
  onSelectOriginNode?: (nodeId: string) => void;
}

export const ContagionSimulator: React.FC<ContagionSimulatorProps> = ({
  businesses,
  relationships,
  onSimulationStepChange,
  onProceedToMitigation,
}) => {
  const [originBusinessId, setOriginBusinessId] = useState<string>('biz-oem-1');
  const [shockDays, setShockDays] = useState<number>(30);
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() =>
    runContagionSimulation('biz-oem-1', 30, businesses, relationships)
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(2); // Default at Day 30
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Recalculate simulation when origin or shock days change
  useEffect(() => {
    const result = runContagionSimulation(originBusinessId, shockDays, businesses, relationships);
    setSimulationResult(result);
    setCurrentStepIndex(Math.min(currentStepIndex, result.steps.length - 1));
    if (onSimulationStepChange) {
      onSimulationStepChange(currentStepIndex, result);
    }
  }, [originBusinessId, shockDays, businesses, relationships]);

  // Handle Playback Interval
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= simulationResult.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (onSimulationStepChange) {
            onSimulationStepChange(next, simulationResult);
          }
          return next;
        });
      }, 1600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, simulationResult]);

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
    setIsPlaying(false);
    if (onSimulationStepChange) {
      onSimulationStepChange(index, simulationResult);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (onSimulationStepChange) {
      onSimulationStepChange(0, simulationResult);
    }
  };

  const currentStep: SimulationStepState =
    simulationResult.steps[currentStepIndex] || simulationResult.steps[0];
  const originBusiness = businesses.find((b) => b.id === originBusinessId) || businesses[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Simulator Control Header */}
      <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2D3748] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" />
                Contagion Shock Engine
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                SIMULATED / MODEL OUTPUT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Simulate Supply Chain Payment Shockwave
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inject cash flow delays into any node and observe step-by-step cascading distress across the supplier network.
            </p>
          </div>

          {/* Shock Duration Preset Buttons */}
          <div className="flex items-center gap-2 bg-[#0B0E14] p-1.5 rounded-xl border border-[#2D3748]">
            <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider text-[10px]">Inject Delay:</span>
            {[15, 30, 60].map((days) => (
              <button
                key={days}
                id={`btn-shock-${days}d`}
                onClick={() => {
                  setShockDays(days);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  shockDays === days
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white bg-[#151921] hover:bg-slate-800'
                }`}
              >
                +{days} DAYS
              </button>
            ))}
          </div>
        </div>

        {/* Origin Node Selector & Playback Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 items-center">
          {/* Origin Node Picker */}
          <div className="md:col-span-6">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Origin Stressed Business (Shock Epicenter):
            </label>
            <select
              value={originBusinessId}
              onChange={(e) => {
                setOriginBusinessId(e.target.value);
                setIsPlaying(false);
              }}
              className="w-full px-3 py-2 bg-[#0B0E14] border border-[#2D3748] rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <optgroup label="Anchor OEMs (Tier 0)">
                {businesses
                  .filter((b) => b.tier === 'OEM')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.cluster})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Tier 1 Prime Suppliers">
                {businesses
                  .filter((b) => b.tier === 'TIER_1')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.cluster})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Tier 2 Component MSMEs">
                {businesses
                  .filter((b) => b.tier === 'TIER_2')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.cluster})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Timeline Playback Buttons */}
          <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-2 pt-2 md:pt-0">
            <button
              onClick={handleReset}
              title="Reset Timeline to Day 0"
              className="p-2 rounded-lg bg-[#0B0E14] hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#2D3748]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleStepClick(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg bg-[#0B0E14] hover:bg-slate-900 disabled:opacity-40 text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#2D3748]"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="btn-play-pause-sim"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Propagation</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play Propagation</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleStepClick(Math.min(simulationResult.steps.length - 1, currentStepIndex + 1))
              }
              disabled={currentStepIndex === simulationResult.steps.length - 1}
              className="p-2 rounded-lg bg-[#0B0E14] hover:bg-slate-900 disabled:opacity-40 text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#2D3748]"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step-by-Step Timeline Bar */}
        <div className="mt-6 pt-4 border-t border-[#2D3748]">
          <div className="grid grid-cols-5 gap-2">
            {simulationResult.steps.map((step, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={step.day}
                  onClick={() => handleStepClick(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/30'
                      : isPast
                      ? 'bg-[#0B0E14] border-[#2D3748] text-slate-300 hover:border-slate-600'
                      : 'bg-[#0B0E14]/50 border-[#2D3748]/60 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className={isActive ? 'text-rose-400' : isPast ? 'text-amber-400' : 'text-slate-500'}>
                      Day {step.day}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <div className="text-xs font-semibold truncate">
                    {step.day === 0 ? 'Baseline' : `+${step.day}d Shock`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {step.affectedBusinessIds.length} At-Risk
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Step Real-Time Impact Metric Display */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D3748] pb-3">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              {currentStep.label}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {currentStep.stepDescription}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-[#0B0E14] px-2.5 py-1 rounded-lg border border-[#2D3748] shrink-0">
            Timeline Step: {currentStepIndex + 1} / {simulationResult.steps.length}
          </span>
        </div>

        {/* 4 Big Real-Time Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Businesses Stressed</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1 block">
              {currentStep.affectedBusinessIds.length}
            </span>
            <span className="text-[11px] text-slate-500">
              of {businesses.length} total network nodes
            </span>
          </div>

          <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Network Exposure</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 block">
              {formatINR(currentStep.totalNetworkExposureINR, true)}
            </span>
            <span className="text-[11px] text-slate-500">
              Total monthly working capital at risk
            </span>
          </div>

          <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Network Health Index</span>
            <span
              className={`text-2xl sm:text-3xl font-extrabold mt-1 block ${
                currentStep.networkHealthIndex >= 70
                  ? 'text-emerald-400'
                  : currentStep.networkHealthIndex >= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {currentStep.networkHealthIndex} / 100
            </span>
            <span className="text-[11px] text-slate-500">
              Aggregated system liquidity vitality
            </span>
          </div>

          <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Critical Nodes in Crisis</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-orange-400 mt-1 block">
              {currentStep.criticalRiskCount}
            </span>
            <span className="text-[11px] text-slate-500">
              Runway &lt; 15 days coverage
            </span>
          </div>
        </div>

        {/* Affected Businesses List at this Step */}
        <div className="pt-3 border-t border-[#2D3748]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Businesses Encountering Payment Stress at this Step ({currentStep.affectedBusinessIds.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {currentStep.affectedBusinessIds.map((id) => {
              const b = businesses.find((biz) => biz.id === id);
              if (!b) return null;
              return (
                <div
                  key={id}
                  className="px-3 py-1.5 rounded-lg bg-[#0B0E14] border border-[#2D3748] text-xs flex items-center gap-2"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      b.tier === 'OEM'
                        ? 'bg-blue-400'
                        : b.tier === 'TIER_1'
                        ? 'bg-emerald-400'
                        : b.tier === 'TIER_2'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span className="text-slate-200 font-medium">{b.name}</span>
                  <span className="text-[10px] text-slate-500">({b.tier})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BEFORE vs AFTER Impact Comparison Card */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Simulation Shock Impact Summary ({originBusiness.name} +{shockDays}d Delay)
            </h3>
            <p className="text-xs text-slate-400">
              Comparative analysis of network health before vs after payment delay shockwave propagation.
            </p>
          </div>

          <button
            id="btn-proceed-to-mitigation"
            onClick={onProceedToMitigation}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <span>Proceed to What-If Mitigation Sandbox</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE */}
          <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              <span>BEFORE (Baseline)</span>
              <span className="text-emerald-400">Healthy Network</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#2D3748]">
                <span className="text-slate-400">Stressed Businesses:</span>
                <strong className="text-white">
                  {simulationResult.summary.beforeAffectedCount}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2D3748]">
                <span className="text-slate-400">Total Network Exposure:</span>
                <strong className="text-white">
                  {formatINR(simulationResult.summary.beforeExposureINR, true)}
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Network Health Index:</span>
                <strong className="text-emerald-400">
                  {simulationResult.summary.beforeHealth} / 100
                </strong>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="bg-[#0B0E14] p-4 rounded-xl border border-rose-500/30">
            <div className="flex items-center justify-between text-xs font-bold text-rose-300 uppercase tracking-widest mb-2">
              <span>AFTER (+{shockDays} Days Delay)</span>
              <span className="text-rose-400">Systemic Contagion</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#2D3748]">
                <span className="text-slate-300">Stressed Businesses:</span>
                <strong className="text-rose-300 font-extrabold text-sm">
                  {simulationResult.summary.afterAffectedCount} (+{simulationResult.summary.afterAffectedCount - simulationResult.summary.beforeAffectedCount})
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2D3748]">
                <span className="text-slate-300">Total Network Exposure:</span>
                <strong className="text-rose-300 font-extrabold text-sm">
                  {formatINR(simulationResult.summary.afterExposureINR, true)}
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300">Network Health Index:</span>
                <strong className="text-rose-400 font-extrabold text-sm">
                  {simulationResult.summary.afterHealth} / 100 (-{simulationResult.summary.beforeHealth - simulationResult.summary.afterHealth} pts)
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-4 pt-3 border-t border-[#2D3748] text-[11px] text-slate-500 italic">
          {simulationResult.disclaimer}
        </div>
      </div>
    </div>
  );
};
