import React from 'react';
import {
  ShieldAlert,
  Building,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Business, BusinessTier } from '../types';
import { formatINR, getRiskColorClass, getTierLabel } from '../utils/formatters';

interface CriticalNodesViewProps {
  businesses: Business[];
  onSelectNode: (nodeId: string) => void;
  onSimulateFromNode: (nodeId: string) => void;
}

export const CriticalNodesView: React.FC<CriticalNodesViewProps> = ({
  businesses,
  onSelectNode,
  onSimulateFromNode,
}) => {
  // Sort businesses by systemic criticality (critical nodes first, then by risk score * monthly expense)
  const rankedBusinesses = [...businesses].sort((a, b) => {
    if (a.isCriticalNode && !b.isCriticalNode) return -1;
    if (!a.isCriticalNode && b.isCriticalNode) return 1;
    const aImpact = a.riskScore * a.monthlyOperatingExpenseINR;
    const bImpact = b.riskScore * b.monthlyOperatingExpenseINR;
    return bImpact - aImpact;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                Systemic Vulnerability Index
              </span>
              <span className="text-[11px] text-slate-400">
                Network Centrality & Bottleneck Analysis
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Critical Hub Nodes & Chokepoints
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identify key supplier enterprises whose liquidity failure will trigger disproportionate contagion shockwaves across the network.
            </p>
          </div>
        </div>
      </div>

      {/* Critical Hub Cards Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rankedBusinesses
          .filter((b) => b.isCriticalNode)
          .slice(0, 3)
          .map((node, idx) => {
            const riskColors = getRiskColorClass(node.riskLevel);
            return (
              <div
                key={node.id}
                className="bg-[#151921] rounded-2xl p-5 border border-amber-500/30 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                      ★ Centrality Rank #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${riskColors.badge} border`}
                    >
                      {node.riskLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {node.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {getTierLabel(node.tier)} • {node.cluster}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="bg-[#0B0E14] p-2 rounded-lg border border-[#2D3748]">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Monthly Opex</span>
                      <strong className="text-white">
                        {formatINR(node.monthlyOperatingExpenseINR, true)}
                      </strong>
                    </div>
                    <div className="bg-[#0B0E14] p-2 rounded-lg border border-[#2D3748]">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Payment Delay</span>
                      <strong className="text-rose-400">{node.currentDelayDays} Days</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-3 leading-relaxed bg-[#0B0E14] p-2.5 rounded-lg border border-[#2D3748]">
                    {node.riskReasons[0]}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#2D3748]">
                  <button
                    onClick={() => onSelectNode(node.id)}
                    className="text-xs text-slate-300 hover:text-white font-medium cursor-pointer"
                  >
                    View in Graph
                  </button>
                  <button
                    onClick={() => onSimulateFromNode(node.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Simulate Shock</span>
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Full Network Centrality Table */}
      <div className="bg-[#151921] rounded-2xl border border-[#2D3748] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#2D3748] flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            All Network Entities Ranked by Vulnerability Exposure
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {businesses.length} Total Registered Nodes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0E14] text-slate-400 uppercase tracking-widest text-[10px] border-b border-[#2D3748]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Tier & Cluster</th>
                <th className="py-3 px-4">Monthly Exposure</th>
                <th className="py-3 px-4">Cash Runway</th>
                <th className="py-3 px-4">Buyer Dependency</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3748]">
              {rankedBusinesses.map((biz, idx) => {
                const riskColors = getRiskColorClass(biz.riskLevel);
                return (
                  <tr key={biz.id} className="hover:bg-[#0B0E14]/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      #{idx + 1}
                      {biz.isCriticalNode && (
                        <span className="ml-1 text-amber-400 font-bold" title="Critical Hub Node">
                          ★
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {biz.name}
                      <div className="text-[10px] text-slate-500 font-normal font-mono">
                        {biz.udyamNumber || 'UDYAM Registered'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300">{getTierLabel(biz.tier)}</span>
                      <div className="text-[10px] text-slate-500">{biz.cluster}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {formatINR(biz.monthlyOperatingExpenseINR, true)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          biz.daysOperatingCoverage < 15
                            ? 'text-rose-400'
                            : biz.daysOperatingCoverage < 30
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {biz.daysOperatingCoverage} Days
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">
                        {biz.buyerConcentrationPercent}%
                      </span>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {biz.topBuyerName}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${riskColors.badge} border`}
                      >
                        {biz.riskScore} ({biz.riskLevel})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSimulateFromNode(biz.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Simulate
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
