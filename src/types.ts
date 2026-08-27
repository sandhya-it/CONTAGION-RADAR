export type RiskLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
export type BusinessTier = 'OEM' | 'TIER_1' | 'TIER_2' | 'TIER_3';
export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'DISPUTED';
export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'kn' | 'ml' | 'bn';

export interface Business {
  id: string;
  name: string;
  legalName?: string;
  udyamNumber?: string;
  gstin?: string;
  sector: string;
  cluster: string; // e.g. "Pune Auto Cluster", "Chennai Sriperumbudur", "Coimbatore Machining"
  tier: BusinessTier;
  annualTurnoverINR: number;
  monthlyOperatingExpenseINR: number;
  cashReserveINR: number;
  daysOperatingCoverage: number; // calculated cash / daily opex
  baselineDelayDays: number;
  currentDelayDays: number;
  buyerConcentrationPercent: number; // % of receivables from top 1 buyer
  topBuyerName: string;
  supplierCount: number;
  buyerCount: number;
  
  // Risk metrics
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskReasons: string[];
  isCriticalNode?: boolean;
  centralityScore?: number; // 0 - 1
  
  // Stressed / Simulation state
  isStressed?: boolean;
  shockDelayAdded?: number;
  simulatedExposureINR?: number;
  simulatedRiskScore?: number;
  simulatedRiskLevel?: RiskLevel;
  simulatedDaysOperatingCoverage?: number;
  propagationStep?: number; // at which step (0, 15, 30, 45, 60) shock reached this node
}

export interface SupplyRelationship {
  id: string;
  buyerId: string;
  supplierId: string;
  productOrService: string;
  annualVolumeINR: number;
  creditTermsDays: number; // standard payment term (e.g. 30, 45 days)
  currentAverageDelayDays: number;
  dependencyScore: number; // 0 - 100 (how critical this supplier is to buyer or vice versa)
  activeReceivableINR: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  amountINR: number;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string;
  paymentDate?: string;
  status: InvoiceStatus;
  daysOverdue: number;
  goodsDescription: string;
  msmeSamadhaanEligible?: boolean;
  interestCalculatedINR?: number; // 3x RBI bank rate under MSMED Act
}

export interface EarlyWarningAlert {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  severity: RiskLevel;
  category: 'PAYMENT_DELAY' | 'LIQUIDITY_DROP' | 'BUYER_CONCENTRATION' | 'CONTAGION_CASCADE' | 'SUPPLIER_DISTRESS';
  reason: string;
  impact: string;
  recommendedAction: string;
  createdAt: string;
  isSimulated?: boolean;
}

export interface ActionCardItem {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  severity: RiskLevel;
  whatHappened: string;
  whyItMatters: string;
  whatCouldHappen: string;
  whatShouldIDo: string[];
  actionType: 'SEND_REMINDER' | 'TREDS_FACTORING' | 'DIVERSIFY_BUYER' | 'SAMADHAAN_PETITION' | 'WORKING_CAPITAL_CREDIT';
}

export type ActionCard = ActionCardItem;

export interface SimulationStepState {
  day: number; // 0, 15, 30, 45, 60
  label: string;
  affectedBusinessIds: string[];
  totalNetworkExposureINR: number;
  networkHealthIndex: number; // 0 - 100
  highRiskCount: number;
  criticalRiskCount: number;
  averageDelayDays: number;
  stepDescription: string;
}

export interface SimulationResult {
  originBusinessId: string;
  originBusinessName: string;
  shockDays: number;
  steps: SimulationStepState[];
  currentStepIndex: number;
  summary: {
    beforeExposureINR: number;
    afterExposureINR: number;
    beforeHealth: number;
    afterHealth: number;
    beforeAffectedCount: number;
    afterAffectedCount: number;
  };
  disclaimer: string;
}

export interface MitigationScenario {
  id: string;
  title: string;
  description: string;
  type: 'TREDS_FACTORING' | 'WORKING_CAPITAL_LINE' | 'STAGGERED_SETTLEMENT' | 'BUYER_DIVERSIFICATION' | 'SAMADHAAN_REMEDY';
  selected: boolean;
  liquidityReliefPercent: number;
  shockReductionFactor: number;
}

export interface WhatIfComparison {
  withoutIntervention: {
    affectedCount: number;
    exposureINR: number;
    networkHealth: number;
    criticalNodesAffected: number;
  };
  withIntervention: {
    affectedCount: number;
    exposureINR: number;
    networkHealth: number;
    criticalNodesAffected: number;
  };
  mitigationsApplied: string[];
  disclaimer: string;
}

export interface PaymentReminderPayload {
  invoiceId: string;
  language: LanguageCode;
  tone: 'polite' | 'firm' | 'statutory_msme';
  includeMsmedInterest: boolean;
}

export interface VoiceParsedInvoice {
  buyerName: string;
  supplierName?: string;
  amountINR: number;
  approxDelayDays: number;
  rawTranscript: string;
  confidence: number;
}
