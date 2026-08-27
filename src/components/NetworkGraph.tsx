import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Search,
  AlertCircle,
  TrendingDown,
  Building,
  Zap,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Business, SupplyRelationship, RiskLevel, BusinessTier } from '../types';
import { formatINR, getRiskColorClass, getTierLabel } from '../utils/formatters';

interface NetworkGraphProps {
  businesses: Business[];
  relationships: SupplyRelationship[];
  selectedNodeId?: string | null;
  onSelectNode: (nodeId: string) => void;
  onSimulateFromNode?: (nodeId: string) => void;
  affectedNodeIds?: string[];
  simulationActive?: boolean;
  currentStepDay?: number;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  tier: BusinessTier;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  businesses,
  relationships,
  selectedNodeId,
  onSelectNode,
  onSimulateFromNode,
  affectedNodeIds = [],
  simulationActive = false,
  currentStepDay = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Measure container dimensions with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width && entry.contentRect.height) {
          setDimensions({
            width: Math.max(600, entry.contentRect.width),
            height: Math.max(500, entry.contentRect.height),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute layered multi-tier positions
  const nodePositions = useMemo(() => {
    const { width, height } = dimensions;
    const positions: Record<string, NodePosition> = {};

    const tiers: BusinessTier[] = ['OEM', 'TIER_1', 'TIER_2', 'TIER_3'];
    const tierColumns: Record<BusinessTier, Business[]> = {
      OEM: [],
      TIER_1: [],
      TIER_2: [],
      TIER_3: [],
    };

    businesses.forEach((b) => {
      if (tierColumns[b.tier]) {
        tierColumns[b.tier].push(b);
      }
    });

    const colWidth = (width - 160) / (tiers.length - 1);
    const startX = 80;

    tiers.forEach((tier, colIdx) => {
      const list = tierColumns[tier];
      const count = list.length;
      const x = startX + colIdx * colWidth;
      const verticalSpacing = (height - 140) / Math.max(1, count + 1);

      list.forEach((biz, rowIdx) => {
        const y = 80 + (rowIdx + 1) * verticalSpacing;
        positions[biz.id] = {
          id: biz.id,
          x,
          y,
          tier: biz.tier,
        };
      });
    });

    return positions;
  }, [businesses, dimensions]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(2.5, z + 0.2));
  const handleZoomOut = () => setZoom((z) => Math.max(0.4, z - 0.2));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const selectedBusiness = useMemo(
    () => businesses.find((b) => b.id === selectedNodeId) || null,
    [businesses, selectedNodeId]
  );

  // Incoming and outgoing relationships for selected node
  const selectedNodeRelationships = useMemo(() => {
    if (!selectedNodeId) return { incoming: [], outgoing: [] };
    const incoming = relationships.filter((r) => r.supplierId === selectedNodeId);
    const outgoing = relationships.filter((r) => r.buyerId === selectedNodeId);
    return { incoming, outgoing };
  }, [relationships, selectedNodeId]);

  return (
    <div className="relative w-full h-[650px] bg-[#0B0E14] rounded-2xl border border-[#2D3748] overflow-hidden flex flex-col shadow-xl">
      {/* Top Graph Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#151921] border-b border-[#2D3748] z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Interactive Supply Chain Graph</span>
          </div>

          {simulationActive && (
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded bg-rose-600/10 border border-rose-500/40 text-rose-400 text-xs font-bold animate-pulse font-mono uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>SIMULATING CONTAGION (Day {currentStepDay})</span>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search MSME / Buyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-36 sm:w-48"
            />
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-2.5 py-1 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Tiers</option>
            <option value="OEM">Anchor OEM</option>
            <option value="TIER_1">Tier 1</option>
            <option value="TIER_2">Tier 2 MSME</option>
            <option value="TIER_3">Tier 3 Micro</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="RED">Critical (Red)</option>
            <option value="ORANGE">High Risk (Orange)</option>
            <option value="YELLOW">Warning (Yellow)</option>
            <option value="GREEN">Normal (Green)</option>
          </select>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#0B0E14] border border-[#2D3748] rounded-lg p-0.5">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              title="Reset View"
              className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tier Column Header Labels */}
      <div className="grid grid-cols-4 px-8 py-1.5 bg-[#151921]/50 border-b border-[#2D3748] text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center pointer-events-none z-10">
        <div className="text-blue-400">Tier 0: Anchor OEMs</div>
        <div className="text-cyan-400">Tier 1: Prime Systems</div>
        <div className="text-amber-400">Tier 2: Component MSMEs</div>
        <div className="text-rose-400">Tier 3: Micro Sub-Suppliers</div>
      </div>

      {/* Main Canvas / SVG Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} overflow-hidden select-none bg-[radial-gradient(#2D3748_1px,transparent_1px)] [background-size:24px_24px]`}
      >
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Standard Arrow Marker */}
            <marker
              id="arrow-normal"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
            </marker>

            {/* Shockwave Active Arrow Marker */}
            <marker
              id="arrow-shock"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
            </marker>

            {/* Selected Node Arrow Marker */}
            <marker
              id="arrow-selected"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* 1. Render Directed Edges (Buyer -> Supplier Orders/Cash flow) */}
          {relationships.map((rel) => {
            const source = nodePositions[rel.buyerId];
            const target = nodePositions[rel.supplierId];
            if (!source || !target) return null;

            const isSourceAffected = affectedNodeIds.includes(rel.buyerId);
            const isTargetAffected = affectedNodeIds.includes(rel.supplierId);
            const isShockEdge = simulationActive && (isSourceAffected || isTargetAffected);
            const isSelectedEdge =
              selectedNodeId && (rel.buyerId === selectedNodeId || rel.supplierId === selectedNodeId);

            // Compute curved bezier path
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const cx1 = source.x + dx * 0.5;
            const cy1 = source.y;
            const cx2 = source.x + dx * 0.5;
            const cy2 = target.y;
            const pathData = `M ${source.x} ${source.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${target.x} ${target.y}`;

            return (
              <g key={rel.id} className="transition-all duration-300">
                {/* Background thicker glow if active */}
                {isShockEdge && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeOpacity="0.4"
                    className="animate-pulse"
                  />
                )}
                {/* Main line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={isShockEdge ? '#ef4444' : isSelectedEdge ? '#06b6d4' : '#334155'}
                  strokeWidth={isShockEdge ? '2.5' : isSelectedEdge ? '2' : '1.5'}
                  strokeDasharray={isShockEdge ? '4 3' : 'none'}
                  markerEnd={
                    isShockEdge ? 'url(#arrow-shock)' : isSelectedEdge ? 'url(#arrow-selected)' : 'url(#arrow-normal)'
                  }
                  className={isShockEdge ? 'animate-dash' : ''}
                />
              </g>
            );
          })}

          {/* 2. Render Nodes */}
          {businesses.map((biz) => {
            const pos = nodePositions[biz.id];
            if (!pos) return null;

            // Filters
            if (tierFilter !== 'ALL' && biz.tier !== tierFilter) return null;
            if (riskFilter !== 'ALL' && biz.riskLevel !== riskFilter) return null;
            if (
              searchQuery &&
              !biz.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !biz.cluster.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return null;
            }

            const isSelected = selectedNodeId === biz.id;
            const isAffected = affectedNodeIds.includes(biz.id);
            const riskColors = getRiskColorClass(biz.riskLevel);

            // Radius by tier hierarchy
            const radius = biz.tier === 'OEM' ? 24 : biz.tier === 'TIER_1' ? 20 : biz.tier === 'TIER_2' ? 18 : 15;

            return (
              <g
                key={biz.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(biz.id);
                }}
                className="cursor-pointer group"
              >
                {/* Shockwave Animated Rings */}
                {isAffected && simulationActive && (
                  <>
                    <circle
                      r={radius + 14}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  </>
                )}

                {/* Selected Node Glow */}
                {isSelected && (
                  <circle
                    r={radius + 7}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    className="animate-spin-slow"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  r={radius}
                  fill={isAffected ? '#450a0a' : '#0f172a'}
                  stroke={isAffected ? '#ef4444' : riskColors.hex}
                  strokeWidth={isSelected || isAffected ? 3 : 2}
                  className="transition-all duration-300 group-hover:scale-110"
                />

                {/* Risk Core Dot */}
                <circle
                  r={radius * 0.45}
                  fill={isAffected ? '#ef4444' : riskColors.hex}
                  opacity="0.9"
                />

                {/* Critical Node Icon / Indicator */}
                {biz.isCriticalNode && (
                  <g transform={`translate(${radius * 0.6}, -${radius * 0.7})`}>
                    <circle r="6" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      dy="2.5"
                      fontSize="7"
                      fontWeight="bold"
                      fill="#0f172a"
                    >
                      ★
                    </text>
                  </g>
                )}

                {/* Node Label Below */}
                <text
                  textAnchor="middle"
                  y={radius + 14}
                  fontSize="11"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  fill={isSelected ? '#38bdf8' : isAffected ? '#fca5a5' : '#cbd5e1'}
                  className="pointer-events-none drop-shadow-md"
                >
                  {biz.name.length > 20 ? `${biz.name.slice(0, 18)}...` : biz.name}
                </text>

                {/* Delay badge */}
                <text
                  textAnchor="middle"
                  y={radius + 25}
                  fontSize="9"
                  fill={biz.currentDelayDays >= 45 ? '#f87171' : '#94a3b8'}
                  className="pointer-events-none"
                >
                  {biz.currentDelayDays}d delay • {formatINR(biz.monthlyOperatingExpenseINR, true)} opex
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Detail Inspector Drawer (Overlay at bottom/right when selected) */}
      {selectedBusiness && (
        <div className="absolute bottom-3 right-3 w-96 max-w-[calc(100%-24px)] bg-slate-900/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md z-20 transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    selectedBusiness.riskLevel === 'RED'
                      ? 'bg-rose-500 ring-2 ring-rose-500/30'
                      : selectedBusiness.riskLevel === 'ORANGE'
                      ? 'bg-orange-500'
                      : selectedBusiness.riskLevel === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <h3 className="text-sm font-bold text-white tracking-tight leading-tight">
                  {selectedBusiness.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {getTierLabel(selectedBusiness.tier)} • {selectedBusiness.cluster}
              </p>
            </div>
            <button
              onClick={() => onSelectNode('')}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-[#0B0E14] p-2.5 rounded-lg border border-[#2D3748]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Risk Score</span>
              <span
                className={`text-base font-bold ${
                  selectedBusiness.riskScore >= 80
                    ? 'text-rose-400'
                    : selectedBusiness.riskScore >= 65
                    ? 'text-orange-400'
                    : selectedBusiness.riskScore >= 40
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {selectedBusiness.riskScore}/100 ({selectedBusiness.riskLevel})
              </span>
            </div>
            <div className="bg-[#0B0E14] p-2.5 rounded-lg border border-[#2D3748]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Payment Delay</span>
              <span className="text-base font-bold text-white">
                {selectedBusiness.currentDelayDays} Days
              </span>
            </div>
            <div className="bg-[#0B0E14] p-2.5 rounded-lg border border-[#2D3748]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Runway</span>
              <span className="text-sm font-bold text-amber-300">
                {selectedBusiness.daysOperatingCoverage} Days
              </span>
            </div>
            <div className="bg-[#0B0E14] p-2.5 rounded-lg border border-[#2D3748]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Buyer Concentration</span>
              <span className="text-sm font-bold text-blue-400">
                {selectedBusiness.buyerConcentrationPercent}%
              </span>
            </div>
          </div>

          {/* Primary Risk Driver Reason */}
          <div className="bg-[#0B0E14] p-2.5 rounded-lg border border-[#2D3748] text-xs mb-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Primary Risk Explanation</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {selectedBusiness.riskReasons[0] || 'Operational cash flow stable across standard credit terms.'}
            </p>
          </div>

          {/* Relationships Breakdown */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between mb-3 px-1">
            <span>
              Direct Suppliers: <strong className="text-slate-200">{selectedNodeRelationships.outgoing.length}</strong>
            </span>
            <span>
              Connected Buyers: <strong className="text-slate-200">{selectedNodeRelationships.incoming.length}</strong>
            </span>
            {selectedBusiness.isCriticalNode && (
              <span className="text-amber-400 font-bold">★ Critical Hub</span>
            )}
          </div>

          {/* Actions */}
          {onSimulateFromNode && (
            <button
              id="btn-simulate-from-node"
              onClick={() => onSimulateFromNode(selectedBusiness.id)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Payment Shock from This Node</span>
            </button>
          )}
        </div>
      )}

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#151921] border-t border-[#2D3748] text-xs text-slate-400 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-300 text-[10px] uppercase tracking-widest">Risk Spectrum:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px]">Normal (&lt;40)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px]">Warning (40-64)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-[11px]">High Risk (65-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span className="text-[11px]">Critical (80+)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-400 font-bold">★</span>
            <span className="text-[11px]">Critical Hub Node</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Click any node to inspect & simulate shockwaves
        </div>
      </div>
    </div>
  );
};
