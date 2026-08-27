import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Business } from '../types';
import { formatINR } from '../utils/formatters';

interface AnalyticsViewProps {
  businesses: Business[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ businesses }) => {
  // Aggregate Aging Distribution Data
  const agingData = [
    { bracket: '0-30d (Standard)', amountCr: 4.2, count: 18, color: '#10b981' },
    { bracket: '31-45d (Grace)', amountCr: 2.8, count: 12, color: '#f59e0b' },
    { bracket: '46-60d (Warning)', amountCr: 1.95, count: 7, color: '#f97316' },
    { bracket: '60+d (Critical)', amountCr: 3.48, count: 9, color: '#ef4444' },
  ];

  // Aggregate Risk Distribution
  const riskCounts = {
    GREEN: businesses.filter((b) => b.riskLevel === 'GREEN').length,
    YELLOW: businesses.filter((b) => b.riskLevel === 'YELLOW').length,
    ORANGE: businesses.filter((b) => b.riskLevel === 'ORANGE').length,
    RED: businesses.filter((b) => b.riskLevel === 'RED').length,
  };

  const riskPieData = [
    { name: 'Normal (Green)', value: riskCounts.GREEN, color: '#10b981' },
    { name: 'Warning (Yellow)', value: riskCounts.YELLOW, color: '#f59e0b' },
    { name: 'High Risk (Orange)', value: riskCounts.ORANGE, color: '#f97316' },
    { name: 'Critical (Red)', value: riskCounts.RED, color: '#ef4444' },
  ];

  // Working Capital Coverage by Tier
  const tierCoverageData = [
    { tier: 'Anchor OEM', avgCoverageDays: 105, avgDelayDays: 15 },
    { tier: 'Tier 1 Prime', avgCoverageDays: 48, avgDelayDays: 32 },
    { tier: 'Tier 2 MSME', avgCoverageDays: 24, avgDelayDays: 52 },
    { tier: 'Tier 3 Micro', avgCoverageDays: 14, avgDelayDays: 58 },
  ];

  // Cluster Exposure
  const clusterData = [
    { cluster: 'Pune Auto', exposureCr: 5.8, businesses: 4 },
    { cluster: 'Chennai Auto Hub', exposureCr: 4.2, businesses: 3 },
    { cluster: 'Coimbatore Machining', exposureCr: 2.4, businesses: 3 },
    { cluster: 'Peenya Bangalore CNC', exposureCr: 1.8, businesses: 2 },
    { cluster: 'Gurgaon Auto Cluster', exposureCr: 3.5, businesses: 2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                Macro Diagnostics
              </span>
              <span className="text-[11px] text-slate-400">
                Network-Wide Analytics
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Supply Chain Financial Health Analytics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive telemetry across receivables aging, liquidity runway, and cluster vulnerability.
            </p>
          </div>
        </div>
      </div>

      {/* Chart Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Receivables Aging Distribution */}
        <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Receivables Aging Analysis (₹ Crores)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">MSMED 45-Day Threshold</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="bracket" stroke="#A0AEC0" fontSize={10} />
                <YAxis stroke="#A0AEC0" fontSize={10} unit=" Cr" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151921',
                    borderColor: '#2D3748',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F7FAFC',
                  }}
                  formatter={(val: any) => [`₹${val} Crores`, 'Amount']}
                />
                <Bar dataKey="amountCr" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Risk Level Distribution (Donut) */}
        <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Network Risk Distribution ({businesses.length} Nodes)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Current Health Profile</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151921',
                    borderColor: '#2D3748',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F7FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Operating Coverage vs Payment Delays by Tier */}
        <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Operating Coverage vs Delay by Tier
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Days of Runway</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierCoverageData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="tier" stroke="#A0AEC0" fontSize={10} />
                <YAxis stroke="#A0AEC0" fontSize={10} unit="d" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151921',
                    borderColor: '#2D3748',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F7FAFC',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgCoverageDays" name="Cash Buffer (Days)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgDelayDays" name="Payment Delay (Days)" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Cluster Vulnerability Exposure */}
        <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Working Capital Exposure by Cluster
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Geographic Spread</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clusterData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis type="number" stroke="#A0AEC0" fontSize={10} unit=" Cr" />
                <YAxis dataKey="cluster" type="category" stroke="#A0AEC0" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151921',
                    borderColor: '#2D3748',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#F7FAFC',
                  }}
                  formatter={(val: any) => [`₹${val} Crores`, 'Exposure']}
                />
                <Bar dataKey="exposureCr" name="Exposure (₹ Cr)" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
