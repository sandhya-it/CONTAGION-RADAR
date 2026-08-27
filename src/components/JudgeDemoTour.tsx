import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Layers,
  LayoutDashboard,
  FileText,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JudgeDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateStep: (stepNumber: number) => void;
}

export const JudgeDemoTour: React.FC<JudgeDemoTourProps> = ({
  isOpen,
  onClose,
  onNavigateStep,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: 'Step 1: Open MSME Dashboard',
      desc: 'View how a non-technical factory owner (Kaveri Precision Auto) monitors their health score and key liquidity buffers.',
      targetView: 'MSME',
      actionLabel: 'Go to MSME View',
    },
    {
      num: 2,
      title: 'Step 2: Inspect Financial Stressors',
      desc: 'See the ₹10 Lakh overdue payment from buyer Varroc Systems, cutting operating runway to only 15 days.',
      targetView: 'MSME',
      actionLabel: 'Highlight Stressors',
    },
    {
      num: 3,
      title: 'Step 3: Click "Simulate +30 Day Shock"',
      desc: 'Trigger our deterministic contagion engine to simulate what happens if the buyer delays payment another 30 days.',
      targetView: 'SIMULATOR',
      actionLabel: 'Launch Simulator',
    },
    {
      num: 4,
      title: 'Step 4: Watch Risk Propagate Across Network',
      desc: 'Watch the animated red shockwave expand through Tier 0 -> Tier 1 -> Tier 2 -> Tier 3 suppliers.',
      targetView: 'GRAPH',
      actionLabel: 'View Shockwave Graph',
    },
    {
      num: 5,
      title: 'Step 5: Identify Stressed Downstream Suppliers',
      desc: 'The shock expands to 17 at-risk businesses, threatening sub-tier suppliers like Ramesh Metal and Karthik Packaging.',
      targetView: 'GRAPH',
      actionLabel: 'Inspect Downstream',
    },
    {
      num: 6,
      title: 'Step 6: Select MSME Node (Kaveri Precision)',
      desc: 'Click into the Tier-2 component node to inspect financial exposure, dependencies, and risk metrics.',
      targetView: 'GRAPH',
      actionLabel: 'Select MSME Node',
    },
    {
      num: 7,
      title: 'Step 7: AI Plain-Language Risk Explanation',
      desc: 'Open "Explain My Risk" with audio speech synthesis and regional Indian language support (Tamil, Hindi, etc.).',
      targetView: 'VOICE_RISK',
      actionLabel: 'Open Voice AI Risk',
    },
    {
      num: 8,
      title: 'Step 8: Action Diagnostic Matrix',
      desc: 'Explore the 4-part framework: WHAT HAPPENED -> WHY IT MATTERS -> WHAT COULD HAPPEN -> WHAT SHOULD I DO.',
      targetView: 'ACTIONS',
      actionLabel: 'Open Action Matrix',
    },
    {
      num: 9,
      title: 'Step 9: Generate MSMED Act Statutory Notice',
      desc: 'Draft an official demand notice with mandatory 3x RBI bank rate compounding interest clause in 1-click.',
      targetView: 'REMINDER',
      actionLabel: 'Draft Statutory Notice',
    },
    {
      num: 10,
      title: 'Step 10: Open What-If Mitigation Sandbox',
      desc: 'Compare WITHOUT INTERVENTION vs WITH INTERVENTION in real-time side-by-side simulation.',
      targetView: 'WHAT_IF',
      actionLabel: 'Open Sandbox',
    },
    {
      num: 11,
      title: 'Step 11: Deploy TReDS & Working Capital',
      desc: 'Activate invoice discounting and token supplier settlements to contain the domino effect.',
      targetView: 'WHAT_IF',
      actionLabel: 'Deploy Interventions',
    },
    {
      num: 12,
      title: 'Step 12: Re-Simulate & Observe Containment',
      desc: 'Stressed businesses drop from 17 down to 6, and network health score rebounds by +28 points!',
      targetView: 'WHAT_IF',
      actionLabel: 'Verify Recovery',
    },
    {
      num: 13,
      title: 'Step 13: Core Value Proposition',
      desc: '“DON’T WAIT FOR THE SHOCK. DETECT IT. UNDERSTAND IT. ACT EARLY.” Contagion Radar protects MSME supply chains.',
      targetView: 'COMMAND',
      actionLabel: 'Finish Tour',
    },
  ];

  const activeStepObj = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep === 12) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }

    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onNavigateStep(nextStep);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onNavigateStep(prevStep);
    }
  };

  const handleJump = (stepNum: number) => {
    setCurrentStep(stepNum);
    onNavigateStep(stepNum);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[calc(100%-32px)] bg-[#151921]/95 border border-[#2D3748] rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#2D3748] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
            {currentStep}
          </span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>{activeStepObj.title}</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                2-Min Judge Tour
              </span>
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs p-1 rounded-lg bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description Content */}
      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        {activeStepObj.desc}
      </p>

      {/* Progress Dots / Bars */}
      <div className="grid grid-cols-13 gap-1 mb-4">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => handleJump(s.num)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              s.num === currentStep
                ? 'bg-blue-500 ring-2 ring-blue-400/30 scale-110'
                : s.num < currentStep
                ? 'bg-emerald-500'
                : 'bg-[#0B0E14] border border-[#2D3748] hover:bg-slate-800'
            }`}
            title={`Step ${s.num}: ${s.title}`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2D3748]">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] disabled:opacity-30 text-slate-300 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-[11px] text-slate-400 font-mono">
          Step {currentStep} of {steps.length}
        </div>

        <button
          id="btn-judge-tour-next"
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm cursor-pointer"
        >
          <span>{currentStep === steps.length ? 'Complete Tour' : activeStepObj.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
