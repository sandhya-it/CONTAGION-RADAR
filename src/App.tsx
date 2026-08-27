import React, { useState, useEffect } from 'react';
import {
  INITIAL_BUSINESSES,
  INITIAL_RELATIONSHIPS,
  INITIAL_INVOICES,
  INITIAL_EARLY_WARNINGS,
  INITIAL_ACTION_CARDS,
} from './data/seedData';
import {
  Business,
  SupplyRelationship,
  Invoice,
  EarlyWarningAlert,
  ActionCard,
  LanguageCode,
  SimulationResult,
} from './types';
import { runContagionSimulation } from './utils/riskEngine';
import { Navbar } from './components/Navbar';
import { MSMEDashboard } from './components/MSMEDashboard';
import { CommandCenterDashboard } from './components/CommandCenterDashboard';
import { PaymentReminderModal } from './components/PaymentReminderModal';
import { VoiceInputModal } from './components/VoiceInputModal';
import { VoiceRiskExplanationModal } from './components/VoiceRiskExplanationModal';
import { JudgeDemoTour } from './components/JudgeDemoTour';

export function App() {
  const [mode, setMode] = useState<'MSME' | 'COMMAND'>('MSME');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Application Data State
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [relationships, setRelationships] = useState<SupplyRelationship[]>(INITIAL_RELATIONSHIPS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(INITIAL_EARLY_WARNINGS);
  const [actionCards, setActionCards] = useState<ActionCard[]>(INITIAL_ACTION_CARDS);

  // Command Center Navigation State
  const [selectedCommandTab, setSelectedCommandTab] = useState<string>('OVERVIEW');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('biz-t2-1');

  // Simulation Active State
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [affectedNodeIds, setAffectedNodeIds] = useState<string[]>([]);
  const [currentStepDay, setCurrentStepDay] = useState<number>(0);

  // Modal States
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [isVoiceInputOpen, setIsVoiceInputOpen] = useState<boolean>(false);
  const [isVoiceRiskOpen, setIsVoiceRiskOpen] = useState<boolean>(false);
  const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
  const [reminderInvoiceId, setReminderInvoiceId] = useState<string | undefined>('inv-101');

  // Target Focus MSME (Kaveri Precision Auto Components)
  const focusMSME = businesses.find((b) => b.id === 'biz-t2-1') || businesses[5];

  // Fetch initial data from server
  useEffect(() => {
    async function loadData() {
      try {
        const [bizRes, relRes, invRes, alertRes] = await Promise.all([
          fetch('/api/businesses'),
          fetch('/api/relationships'),
          fetch('/api/invoices'),
          fetch('/api/alerts'),
        ]);

        if (bizRes.ok) {
          const bData = await bizRes.json();
          if (bData.businesses) setBusinesses(bData.businesses);
        }
        if (relRes.ok) {
          const rData = await relRes.json();
          if (rData.relationships) setRelationships(rData.relationships);
        }
        if (invRes.ok) {
          const iData = await invRes.json();
          if (iData.invoices) setInvoices(iData.invoices);
        }
        if (alertRes.ok) {
          const aData = await alertRes.json();
          if (aData.alerts) setAlerts(aData.alerts);
        }
      } catch (err) {
        console.warn('API data fetch failed, using built-in seed store:', err);
      }
    }
    loadData();
  }, []);

  // Reset database state to initial baseline
  const handleResetData = async () => {
    try {
      await fetch('/api/simulation/reset', { method: 'POST' });
    } catch (e) {}
    setBusinesses(JSON.parse(JSON.stringify(INITIAL_BUSINESSES)));
    setRelationships(JSON.parse(JSON.stringify(INITIAL_RELATIONSHIPS)));
    setInvoices(JSON.parse(JSON.stringify(INITIAL_INVOICES)));
    setAlerts(JSON.parse(JSON.stringify(INITIAL_EARLY_WARNINGS)));
    setActionCards(JSON.parse(JSON.stringify(INITIAL_ACTION_CARDS)));
    setSimulationActive(false);
    setAffectedNodeIds([]);
    setCurrentStepDay(0);
    setSelectedNodeId('biz-t2-1');
  };

  // Add new invoice
  const handleAddInvoice = async (newInvData: Partial<Invoice>) => {
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvData),
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices((prev) => [data.invoice, ...prev]);

        // If overdue, update local business debt status
        if (data.invoice.daysOverdue > 30) {
          setBusinesses((prev) =>
            prev.map((b) =>
              b.id === 'biz-t2-1'
                ? {
                    ...b,
                    riskLevel: 'RED',
                    riskScore: 89,
                    currentDelayDays: Math.max(b.currentDelayDays, data.invoice.daysOverdue),
                  }
                : b
            )
          );
        }
      }
    } catch (err) {
      console.error('Failed to add invoice to backend:', err);
    }
  };

  // Trigger shock from any node
  const handleTriggerShockFromNode = (originId: string, delayDays: number = 30) => {
    const sim = runContagionSimulation(originId, delayDays, businesses, relationships);
    const lastStep = sim.steps[sim.steps.length - 1];
    setAffectedNodeIds(lastStep.affectedBusinessIds);
    setSimulationActive(true);
    setCurrentStepDay(delayDays);
    setSelectedCommandTab('SIMULATOR');
    setMode('COMMAND');
  };

  // Handle Judge Tour Step Navigation
  const handleTourStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setMode('MSME');
        setIsVoiceRiskOpen(false);
        setIsReminderOpen(false);
        break;
      case 2:
        setMode('MSME');
        break;
      case 3:
        setMode('COMMAND');
        setSelectedCommandTab('SIMULATOR');
        handleTriggerShockFromNode('biz-oem-1', 30);
        break;
      case 4:
        setMode('COMMAND');
        setSelectedCommandTab('GRAPH');
        setSimulationActive(true);
        break;
      case 5:
        setMode('COMMAND');
        setSelectedCommandTab('GRAPH');
        break;
      case 6:
        setMode('COMMAND');
        setSelectedCommandTab('GRAPH');
        setSelectedNodeId('biz-t2-1');
        break;
      case 7:
        setIsVoiceRiskOpen(true);
        break;
      case 8:
        setIsVoiceRiskOpen(false);
        setMode('COMMAND');
        setSelectedCommandTab('ACTIONS');
        break;
      case 9:
        setReminderInvoiceId('inv-101');
        setIsReminderOpen(true);
        break;
      case 10:
        setIsReminderOpen(false);
        setMode('COMMAND');
        setSelectedCommandTab('WHAT_IF');
        break;
      case 11:
        setMode('COMMAND');
        setSelectedCommandTab('WHAT_IF');
        break;
      case 12:
        setMode('COMMAND');
        setSelectedCommandTab('WHAT_IF');
        break;
      case 13:
        setMode('COMMAND');
        setSelectedCommandTab('OVERVIEW');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F7FAFC] font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Fixed Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        currentLanguage={language}
        setLanguage={setLanguage}
        onResetData={handleResetData}
        onStartDemoTour={() => {
          setIsTourOpen(true);
          handleTourStep(1);
        }}
        onOpenVoiceRisk={() => setIsVoiceRiskOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
        {mode === 'MSME' ? (
          <MSMEDashboard
            business={focusMSME}
            invoices={invoices}
            alerts={alerts}
            language={language}
            onOpenVoiceRisk={() => setIsVoiceRiskOpen(true)}
            onOpenVoiceInput={() => setIsVoiceInputOpen(true)}
            onOpenReminderModal={(invId) => {
              setReminderInvoiceId(invId || 'inv-101');
              setIsReminderOpen(true);
            }}
            onTriggerShock={(days) => handleTriggerShockFromNode('biz-oem-1', days)}
            onSwitchToGraph={() => {
              setSelectedNodeId('biz-t2-1');
              setSelectedCommandTab('GRAPH');
              setMode('COMMAND');
            }}
            onSwitchToWhatIf={() => {
              setSelectedCommandTab('WHAT_IF');
              setMode('COMMAND');
            }}
          />
        ) : (
          <CommandCenterDashboard
            businesses={businesses}
            relationships={relationships}
            invoices={invoices}
            alerts={alerts}
            actionCards={actionCards}
            language={language}
            selectedTab={selectedCommandTab}
            setSelectedTab={setSelectedCommandTab}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            onSimulateFromNode={(id) => handleTriggerShockFromNode(id, 30)}
            onAddInvoice={handleAddInvoice}
            onOpenVoiceInput={() => setIsVoiceInputOpen(true)}
            onOpenReminderModal={(invId) => {
              setReminderInvoiceId(invId || 'inv-101');
              setIsReminderOpen(true);
            }}
            onOpenVoiceRisk={() => setIsVoiceRiskOpen(true)}
            simulationActive={simulationActive}
            affectedNodeIds={affectedNodeIds}
            currentStepDay={currentStepDay}
          />
        )}
      </main>

      {/* Floating 13-Step Judge Demo Tour */}
      <JudgeDemoTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateStep={handleTourStep}
      />

      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceInputOpen}
        onClose={() => setIsVoiceInputOpen(false)}
        onInvoiceCreated={handleAddInvoice}
      />

      {/* Voice / AI Risk Explanation Modal */}
      <VoiceRiskExplanationModal
        isOpen={isVoiceRiskOpen}
        onClose={() => setIsVoiceRiskOpen(false)}
        business={focusMSME}
        initialLanguage={language}
        onProceedToActionCenter={() => {
          setMode('COMMAND');
          setSelectedCommandTab('ACTIONS');
        }}
      />

      {/* MSMED Payment Reminder Generator Modal */}
      <PaymentReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        invoices={invoices}
        initialInvoiceId={reminderInvoiceId}
        defaultLanguage={language}
      />
    </div>
  );
}
export default App;
