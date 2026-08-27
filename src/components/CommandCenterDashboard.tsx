import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Zap,
  ShieldCheck,
  AlertTriangle,
  FileText,
  BarChart3,
  Network,
  Users,
  Building,
  CheckCircle2,
  TrendingDown,
  Clock,
  Wallet,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  Business,
  SupplyRelationship,
  Invoice,
  EarlyWarningAlert,
  ActionCard,
  LanguageCode,
  SimulationResult,
} from '../types';
import { formatINR } from '../utils/formatters';
import { NetworkGraph } from './NetworkGraph';
import { ContagionSimulator } from './ContagionSimulator';
import { WhatIfSimulator } from './WhatIfSimulator';
import { EarlyWarningsCenter } from './EarlyWarningsCenter';
import { CriticalNodesView } from './CriticalNodesView';
import { InvoiceModule } from './InvoiceModule';
import { AnalyticsView } from './AnalyticsView';
import { ActionCenter } from './ActionCenter';

interface CommandCenterDashboardProps {
  businesses: Business[];
  relationships: SupplyRelationship[];
  invoices: Invoice[];
  alerts: EarlyWarningAlert[];
  actionCards: ActionCard[];
  language: LanguageCode;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
  onSimulateFromNode: (nodeId: string) => void;
  onAddInvoice: (inv: Partial<Invoice>) => void;
  onOpenVoiceInput: () => void;
  onOpenReminderModal: (invoiceId?: string) => void;
  onOpenVoiceRisk: () => void;
  simulationActive?: boolean;
  affectedNodeIds?: string[];
  currentStepDay?: number;
}

export const CommandCenterDashboard: React.FC<CommandCenterDashboardProps> = ({
  businesses,
  relationships,
  invoices,
  alerts,
  actionCards,
  language,
  selectedTab,
  setSelectedTab,
  selectedNodeId,
  setSelectedNodeId,
  onSimulateFromNode,
  onAddInvoice,
  onOpenVoiceInput,
  onOpenReminderModal,
  onOpenVoiceRisk,
  simulationActive = false,
  affectedNodeIds = [],
  currentStepDay = 0,
}) => {
  const tabs = [
    { id: 'OVERVIEW', label: 'Command Overview', icon: Activity },
    { id: 'GRAPH', label: 'Supply Chain Graph', icon: Network },
    { id: 'SIMULATOR', label: 'Shockwave Simulator', icon: Zap },
    { id: 'WHAT_IF', label: 'What-If Mitigation', icon: ShieldCheck },
    { id: 'ALERTS', label: 'Early Warnings Feed', icon: AlertTriangle },
    { id: 'CRITICAL', label: 'Critical Hub Nodes', icon: Building },
    { id: 'INVOICES', label: 'Invoices & Aging', icon: FileText },
    { id: 'ANALYTICS', label: 'Macro Analytics', icon: BarChart3 },
    { id: 'ACTIONS', label: 'Action Center', icon: CheckCircle2 },
  ];

  // Overview calculations
  const totalExposure = businesses.reduce((acc, b) => acc + b.monthlyOperatingExpenseINR, 0);
  const highRiskCount = businesses.filter((b) => b.riskLevel === 'RED' || b.riskLevel === 'ORANGE').length;
  const criticalCount = businesses.filter((b) => b.riskLevel === 'RED').length;
  const avgDelay = Math.round(businesses.reduce((acc, b) => acc + b.currentDelayDays, 0) / businesses.length);
  const criticalHubsCount = businesses.filter((b) => b.isCriticalNode).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#2D3748] scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id.toLowerCase()}`}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#151921] bg-[#151921]/60 border border-[#2D3748]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.id === 'ALERTS' && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {criticalCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {selectedTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top 8 Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {/* 1. Total Network Exposure */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Network Exposure
              </span>
              <span className="text-base sm:text-lg font-extrabold text-white mt-1 block">
                {formatINR(totalExposure, true)}
              </span>
              <span className="text-[10px] text-slate-500">Monthly Opex</span>
            </div>

            {/* 2. Businesses at Risk */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                Businesses At Risk
              </span>
              <span className="text-base sm:text-lg font-extrabold text-rose-400 mt-1 block">
                {highRiskCount} / {businesses.length}
              </span>
              <span className="text-[10px] text-rose-400/80">Stressed MSMEs</span>
            </div>

            {/* 3. Contagion Window */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Contagion Window
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-300 mt-1 block">
                15 - 30 Days
              </span>
              <span className="text-[10px] text-slate-500">Till Sub-Tier Halt</span>
            </div>

            {/* 4. Potential Exposure */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                Potential Exposure
              </span>
              <span className="text-base sm:text-lg font-extrabold text-blue-400 mt-1 block">
                ₹21.5 Cr
              </span>
              <span className="text-[10px] text-slate-500">At +30d Shock</span>
            </div>

            {/* 5. Network Health */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Network Health
              </span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400 mt-1 block">
                74 / 100
              </span>
              <span className="text-[10px] text-slate-500">Vitality Index</span>
            </div>

            {/* 6. Avg Payment Delay */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Avg Payment Delay
              </span>
              <span className="text-base sm:text-lg font-extrabold text-amber-400 mt-1 block">
                {avgDelay} Days
              </span>
              <span className="text-[10px] text-slate-500">Past Term Baseline</span>
            </div>

            {/* 7. Critical Hubs */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Critical Hubs
              </span>
              <span className="text-base sm:text-lg font-extrabold text-white mt-1 block">
                {criticalHubsCount} Nodes
              </span>
              <span className="text-[10px] text-slate-500">Bottlenecks</span>
            </div>

            {/* 8. Critical Red Nodes */}
            <div className="bg-[#151921] rounded-xl p-3.5 border border-[#2D3748] shadow-sm">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">
                Critical Crisis
              </span>
              <span className="text-base sm:text-lg font-extrabold text-rose-500 mt-1 block">
                {criticalCount} Entities
              </span>
              <span className="text-[10px] text-slate-500">&lt;15d cash buffer</span>
            </div>
          </div>

          {/* Interactive Graph Mini-Preview & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Interactive Graph */}
            <div className="lg:col-span-8 space-y-3">
              <NetworkGraph
                businesses={businesses}
                relationships={relationships}
                selectedNodeId={selectedNodeId}
                onSelectNode={(id) => setSelectedNodeId(id)}
                onSimulateFromNode={onSimulateFromNode}
                simulationActive={simulationActive}
                affectedNodeIds={affectedNodeIds}
                currentStepDay={currentStepDay}
              />
            </div>

            {/* Right 4 cols: Live Shock Trigger & Top Alerts Snapshot */}
            <div className="lg:col-span-4 space-y-4">
              {/* Quick Shock Launch Card */}
              <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Contagion Simulation Engine</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  Test Shockwave Propagation
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inject payment delay into anchor OEMs or Tier-1 systems to forecast multi-tier supplier stress.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedTab('SIMULATOR');
                      onSimulateFromNode('biz-oem-1');
                    }}
                    className="py-2 bg-[#0B0E14] border border-[#2D3748] hover:border-rose-500 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    +15 Days
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTab('SIMULATOR');
                      onSimulateFromNode('biz-oem-1');
                    }}
                    className="py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
                  >
                    +30 Days
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTab('SIMULATOR');
                      onSimulateFromNode('biz-oem-1');
                    }}
                    className="py-2 bg-[#0B0E14] border border-[#2D3748] hover:border-rose-500 rounded-lg text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    +60 Days
                  </button>
                </div>
              </div>

              {/* Top Early Warnings Feed Snapshot */}
              <div className="bg-[#151921] rounded-2xl p-5 border border-[#2D3748] shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Top Early Signals</span>
                  </div>
                  <button
                    onClick={() => setSelectedTab('ALERTS')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    View All ({alerts.length})
                  </button>
                </div>

                <div className="space-y-2">
                  {alerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setSelectedNodeId(alert.businessId);
                        setSelectedTab('GRAPH');
                      }}
                      className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#2D3748] hover:border-slate-600 transition-colors cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white truncate">{alert.title}</span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            alert.severity === 'RED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                        {alert.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: GRAPH */}
      {selectedTab === 'GRAPH' && (
        <div className="space-y-3">
          <NetworkGraph
            businesses={businesses}
            relationships={relationships}
            selectedNodeId={selectedNodeId}
            onSelectNode={(id) => setSelectedNodeId(id)}
            onSimulateFromNode={onSimulateFromNode}
            simulationActive={simulationActive}
            affectedNodeIds={affectedNodeIds}
            currentStepDay={currentStepDay}
          />
        </div>
      )}

      {/* Tab 3: SHOCK SIMULATOR */}
      {selectedTab === 'SIMULATOR' && (
        <ContagionSimulator
          businesses={businesses}
          relationships={relationships}
          onProceedToMitigation={() => setSelectedTab('WHAT_IF')}
        />
      )}

      {/* Tab 4: WHAT-IF SANDBOX */}
      {selectedTab === 'WHAT_IF' && (
        <WhatIfSimulator
          businesses={businesses}
          relationships={relationships}
          onOpenReminderModal={() => onOpenReminderModal()}
        />
      )}

      {/* Tab 5: EARLY WARNINGS */}
      {selectedTab === 'ALERTS' && (
        <EarlyWarningsCenter
          alerts={alerts}
          onSelectBusiness={(id) => {
            setSelectedNodeId(id);
            setSelectedTab('GRAPH');
          }}
          onOpenReminderModal={() => onOpenReminderModal()}
          onSwitchToWhatIf={() => setSelectedTab('WHAT_IF')}
        />
      )}

      {/* Tab 6: CRITICAL HUBS */}
      {selectedTab === 'CRITICAL' && (
        <CriticalNodesView
          businesses={businesses}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            setSelectedTab('GRAPH');
          }}
          onSimulateFromNode={onSimulateFromNode}
        />
      )}

      {/* Tab 7: INVOICES */}
      {selectedTab === 'INVOICES' && (
        <InvoiceModule
          invoices={invoices}
          onAddInvoice={onAddInvoice}
          onOpenVoiceInput={onOpenVoiceInput}
          onOpenReminderModal={(id) => onOpenReminderModal(id)}
        />
      )}

      {/* Tab 8: ANALYTICS */}
      {selectedTab === 'ANALYTICS' && <AnalyticsView businesses={businesses} />}

      {/* Tab 9: ACTION CENTER */}
      {selectedTab === 'ACTIONS' && (
        <ActionCenter
          actionCards={actionCards}
          business={businesses.find((b) => b.id === 'biz-t2-1') || businesses[5]}
          language={language}
          onOpenReminderModal={() => onOpenReminderModal()}
          onSwitchToWhatIf={() => setSelectedTab('WHAT_IF')}
        />
      )}
    </div>
  );
};
