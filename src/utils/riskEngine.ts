import {
  Business,
  SupplyRelationship,
  RiskLevel,
  SimulationResult,
  SimulationStepState,
  WhatIfComparison,
  MitigationScenario,
} from '../types';

export function calculateDeterministicRisk(
  business: Business,
  relationships: SupplyRelationship[],
  shockDelayBonus: number = 0
): {
  riskScore: number;
  riskLevel: RiskLevel;
  riskReasons: string[];
  daysOperatingCoverage: number;
} {
  const effectiveDelay = business.currentDelayDays + shockDelayBonus;
  const dailyOpex = business.monthlyOperatingExpenseINR / 30;
  
  // Calculate simulated cash depletion based on delay extension
  const cashDrainPerDay = dailyOpex * 0.45;
  const effectiveCash = Math.max(
    business.cashReserveINR * 0.1,
    business.cashReserveINR - (shockDelayBonus > 0 ? shockDelayBonus * cashDrainPerDay : 0)
  );
  const simulatedDaysCoverage = Math.max(1, Math.round(effectiveCash / dailyOpex));

  let score = 20; // baseline
  const reasons: string[] = [];

  // Factor 1: Payment Delay Extent
  if (effectiveDelay >= 60) {
    score += 30;
    reasons.push(`Average payment delay reached ${effectiveDelay} days (Critical threshold: 45d).`);
  } else if (effectiveDelay >= 45) {
    score += 20;
    reasons.push(`Extended payment delay of ${effectiveDelay} days above baseline ${business.baselineDelayDays}d.`);
  } else if (effectiveDelay >= 30) {
    score += 10;
    reasons.push(`Moderate payment delay of ${effectiveDelay} days.`);
  }

  // Factor 2: Working Capital Operating Coverage
  if (simulatedDaysCoverage <= 15) {
    score += 30;
    reasons.push(`Operating runway severely depleted: only ${simulatedDaysCoverage} days of cash reserves remaining.`);
  } else if (simulatedDaysCoverage <= 30) {
    score += 18;
    reasons.push(`Tight working capital buffer: ${simulatedDaysCoverage} days operating coverage.`);
  } else if (simulatedDaysCoverage <= 45) {
    score += 8;
  }

  // Factor 3: Buyer Concentration
  if (business.buyerConcentrationPercent >= 75) {
    score += 20;
    reasons.push(`Excessive buyer concentration: ${business.buyerConcentrationPercent}% of revenues rely on single buyer (${business.topBuyerName}).`);
  } else if (business.buyerConcentrationPercent >= 55) {
    score += 12;
    reasons.push(`High customer concentration: ${business.buyerConcentrationPercent}% receivables from top buyer.`);
  }

  // Factor 4: Network Centrality & Downstream Dependency
  const downstreamCount = relationships.filter((r) => r.buyerId === business.id).length;
  if (downstreamCount >= 3) {
    score += 10;
    reasons.push(`Key supply hub: Financial stress here directly endangers ${downstreamCount} dependent sub-tier suppliers.`);
  }

  // Bound score between 5 and 98
  const finalScore = Math.min(98, Math.max(5, Math.round(score)));

  let level: RiskLevel = 'GREEN';
  if (finalScore >= 80) level = 'RED';
  else if (finalScore >= 65) level = 'ORANGE';
  else if (finalScore >= 40) level = 'YELLOW';

  return {
    riskScore: finalScore,
    riskLevel: level,
    riskReasons: reasons.length > 0 ? reasons : ['Stable working capital and balanced customer portfolio.'],
    daysOperatingCoverage: simulatedDaysCoverage,
  };
}

export function runContagionSimulation(
  originBusinessId: string,
  shockDays: number,
  allBusinesses: Business[],
  relationships: SupplyRelationship[]
): SimulationResult {
  const origin = allBusinesses.find((b) => b.id === originBusinessId) || allBusinesses[0];

  // Graph adjacency
  // Who buys from whom: Buyer -> Suppliers
  const downstreamMap = new Map<string, string[]>();
  relationships.forEach((rel) => {
    if (!downstreamMap.has(rel.buyerId)) {
      downstreamMap.set(rel.buyerId, []);
    }
    downstreamMap.get(rel.buyerId)!.push(rel.supplierId);
  });

  const timelineDays = [0, 15, 30, 45, 60];
  const steps: SimulationStepState[] = [];

  timelineDays.forEach((day, index) => {
    let affectedIds: Set<string> = new Set();
    let label = `Day ${day}: Baseline / Pre-Shock`;
    let desc = 'Standard operational state with baseline vendor payment cycles.';

    if (day === 0) {
      // Baseline affected (those already stressed)
      allBusinesses.forEach((b) => {
        if (b.riskScore >= 75) affectedIds.add(b.id);
      });
      label = 'Day 0: Baseline State';
      desc = 'Initial network state prior to payment disruption shockwave.';
    } else if (day === 15) {
      affectedIds.add(origin.id);
      // Immediate direct suppliers of origin
      const directSuppliers = downstreamMap.get(origin.id) || [];
      directSuppliers.slice(0, 2).forEach((s) => affectedIds.add(s));
      label = `Day 15: Primary Shock Injected (+${Math.min(day, shockDays)}d Delay)`;
      desc = `${origin.name} encounters liquidity bottleneck; first-tier payment clearances begin slowing.`;
    } else if (day === 30) {
      affectedIds.add(origin.id);
      const directSuppliers = downstreamMap.get(origin.id) || [];
      directSuppliers.forEach((s) => affectedIds.add(s));
      // First degree of tier 2
      directSuppliers.forEach((s) => {
        const sub = downstreamMap.get(s) || [];
        sub.slice(0, 2).forEach((subId) => affectedIds.add(subId));
      });
      label = `Day 30: Secondary Cascade Propagation`;
      desc = `Working capital compression forces Tier 1 and Tier 2 MSMEs to delay vendor payments.`;
    } else if (day === 45) {
      affectedIds.add(origin.id);
      const directSuppliers = downstreamMap.get(origin.id) || [];
      directSuppliers.forEach((s) => {
        affectedIds.add(s);
        const sub = downstreamMap.get(s) || [];
        sub.forEach((subId) => {
          affectedIds.add(subId);
          const micro = downstreamMap.get(subId) || [];
          micro.slice(0, 2).forEach((mId) => affectedIds.add(mId));
        });
      });
      label = `Day 45: Sub-Tier Working Capital Exhaustion`;
      desc = `Micro Tier-3 suppliers exhaust cash buffers (< 12 days). Raw material deliveries begin freezing.`;
    } else {
      // Day 60 - systemic contagion
      allBusinesses.forEach((b) => {
        if (b.tier !== 'OEM' || b.id === origin.id) {
          affectedIds.add(b.id);
        }
      });
      label = `Day 60: Full Network Financial Shockwave`;
      desc = `Cross-tier liquidity contagion across the entire industrial cluster. Multiple nodes at critical default risk.`;
    }

    const affectedList = Array.from(affectedIds);
    let totalExposure = 0;
    let highRisk = 0;
    let criticalRisk = 0;

    affectedList.forEach((id) => {
      const biz = allBusinesses.find((b) => b.id === id);
      if (biz) {
        totalExposure += (biz.monthlyOperatingExpenseINR * (day / 30 + 0.8));
        if (day >= 30) {
          if (biz.tier === 'TIER_3' || biz.id === 'biz-t2-1') criticalRisk++;
          else highRisk++;
        } else {
          if (biz.riskLevel === 'RED') criticalRisk++;
          else highRisk++;
        }
      }
    });

    const healthIndex = Math.max(25, Math.round(86 - (affectedList.length * 3.4) - (day * 0.45)));
    const avgDelay = Math.round(28 + (day * 0.72));

    steps.push({
      day,
      label,
      affectedBusinessIds: affectedList,
      totalNetworkExposureINR: totalExposure,
      networkHealthIndex: healthIndex,
      highRiskCount: highRisk,
      criticalRiskCount: criticalRisk,
      averageDelayDays: avgDelay,
      stepDescription: desc,
    });
  });

  const beforeStep = steps[0];
  const afterStep = steps[steps.length - 1];

  return {
    originBusinessId: origin.id,
    originBusinessName: origin.name,
    shockDays,
    steps,
    currentStepIndex: 0,
    summary: {
      beforeExposureINR: beforeStep.totalNetworkExposureINR,
      afterExposureINR: afterStep.totalNetworkExposureINR,
      beforeHealth: beforeStep.networkHealthIndex,
      afterHealth: afterStep.networkHealthIndex,
      beforeAffectedCount: beforeStep.affectedBusinessIds.length,
      afterAffectedCount: afterStep.affectedBusinessIds.length,
    },
    disclaimer:
      'MODEL SIMULATION — NOT A GUARANTEED FORECAST. Simulation results are model outputs based on configured mathematical propagation assumptions and should not be interpreted as guaranteed financial forecasts.',
  };
}

export const DEFAULT_MITIGATION_SCENARIOS: MitigationScenario[] = [
  {
    id: 'treds',
    title: 'TReDS Bill Discounting (Factoring)',
    description: 'Discount approved buyer invoices on RBI-licensed TReDS platform (RXIL/M1xchange) for immediate 85-90% liquidity release.',
    type: 'TREDS_FACTORING',
    selected: true,
    liquidityReliefPercent: 55,
    shockReductionFactor: 0.5,
  },
  {
    id: 'working-capital',
    title: 'SIDBI / CGTMSE Emergency Credit Line',
    description: 'Activate 60-day standby working capital overdraft facility to protect payroll and raw material payments.',
    type: 'WORKING_CAPITAL_LINE',
    selected: true,
    liquidityReliefPercent: 35,
    shockReductionFactor: 0.35,
  },
  {
    id: 'staggered',
    title: 'Staggered Priority Vendor Settlement',
    description: 'Execute transparent 30-40% immediate token disbursements to critical single-source Tier 3 suppliers to prevent factory halt.',
    type: 'STAGGERED_SETTLEMENT',
    selected: true,
    liquidityReliefPercent: 25,
    shockReductionFactor: 0.25,
  },
  {
    id: 'samadhaan',
    title: 'MSMED Act Sec 16 Statutory Formal Notice',
    description: 'Issue formal legal reminder citing mandatory 3x RBI bank rate compounding interest on payments overdue beyond 45 days.',
    type: 'SAMADHAAN_REMEDY',
    selected: false,
    liquidityReliefPercent: 20,
    shockReductionFactor: 0.2,
  },
  {
    id: 'diversify',
    title: 'Buyer Concentration De-Risking',
    description: 'Onboard 2 alternate Tier 1 anchor buyers and require 20% advance milestone payments on high-volume custom tooling POs.',
    type: 'BUYER_DIVERSIFICATION',
    selected: false,
    liquidityReliefPercent: 30,
    shockReductionFactor: 0.3,
  },
];

export function calculateWhatIfComparison(
  selectedScenarios: MitigationScenario[],
  simulationResult: SimulationResult
): WhatIfComparison {
  const activeMitigations = selectedScenarios.filter((s) => s.selected);
  
  // Calculate aggregate mitigation efficiency
  let totalDamping = 0;
  activeMitigations.forEach((m) => {
    totalDamping += m.shockReductionFactor;
  });
  totalDamping = Math.min(0.78, Math.max(0.2, totalDamping));

  const rawAffected = simulationResult.summary.afterAffectedCount;
  const rawExposure = simulationResult.summary.afterExposureINR;
  const rawHealth = simulationResult.summary.afterHealth;

  const mitigatedAffected = Math.max(4, Math.round(rawAffected * (1 - totalDamping * 0.75)));
  const mitigatedExposure = Math.max(
    simulationResult.summary.beforeExposureINR * 1.1,
    Math.round(rawExposure * (1 - totalDamping * 0.65))
  );
  const mitigatedHealth = Math.min(88, Math.round(rawHealth + (100 - rawHealth) * (totalDamping * 0.85)));

  return {
    withoutIntervention: {
      affectedCount: rawAffected,
      exposureINR: rawExposure,
      networkHealth: rawHealth,
      criticalNodesAffected: 5,
    },
    withIntervention: {
      affectedCount: mitigatedAffected,
      exposureINR: mitigatedExposure,
      networkHealth: mitigatedHealth,
      criticalNodesAffected: 1,
    },
    mitigationsApplied: activeMitigations.map((m) => m.title),
    disclaimer:
      'SIMULATED / MODEL OUTPUT. Results represent computational model estimates under selected mitigation interventions and do not constitute guaranteed outcomes.',
  };
}
