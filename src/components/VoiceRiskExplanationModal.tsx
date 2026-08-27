import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Play,
  Square,
  HelpCircle,
  TrendingDown,
  Building,
} from 'lucide-react';
import { Business, LanguageCode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatINR } from '../utils/formatters';

interface VoiceRiskExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  initialLanguage?: LanguageCode;
  onProceedToActionCenter?: () => void;
}

export const VoiceRiskExplanationModal: React.FC<VoiceRiskExplanationModalProps> = ({
  isOpen,
  onClose,
  business,
  initialLanguage = 'en',
  onProceedToActionCenter,
}) => {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<{
    explanation: string;
    bulletPoints: string[];
    recommendedNextStep?: string;
  }>({
    explanation: `Your payment of ₹10 Lakh from ${business.topBuyerName} is 60 days overdue. Because ${business.buyerConcentrationPercent}% of your receivables depend on this single customer, your cash reserves have shrunk to only ${business.daysOperatingCoverage} days. If unaddressed, this will force you to delay payments to your own raw material and packaging suppliers.`,
    bulletPoints: [
      `Overdue payment of ₹10 Lakh has exceeded standard 30-day terms by 30 days.`,
      `${business.buyerConcentrationPercent}% of your incoming cash flow relies on a single buyer.`,
      `Your cash buffer has dropped to ${business.daysOperatingCoverage} days of operating expenses.`,
      `3 micro-suppliers in your downstream chain are at risk of payment halt.`,
    ],
    recommendedNextStep:
      'Submit unpaid invoice to TReDS factoring for immediate 85% liquidity advance.',
  });

  const t = TRANSLATIONS[language];

  // Fetch explanation from Gemini endpoint
  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/explain-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplanationData({
          explanation: data.explanation || t.plainSummaryExample,
          bulletPoints: data.bulletPoints || [
            'Payment delayed past credit terms.',
            'Working capital buffer under pressure.',
            'Downstream suppliers at risk.',
          ],
          recommendedNextStep: data.recommendedNextStep || 'Submit invoice to TReDS portal.',
        });
      }
    } catch (err) {
      console.error('Error fetching risk explanation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchExplanation();
    } else {
      stopAudio();
    }
  }, [isOpen, language, business.id]);

  // Audio Speech Synthesis
  const playAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utteranceText = `${explanationData.explanation}. Key risk factors: ${explanationData.bulletPoints.join(
      '. '
    )}. Recommended next step: ${explanationData.recommendedNextStep}`;

    const utterance = new SpeechSynthesisUtterance(utteranceText);
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'kn') utterance.lang = 'kn-IN';
    else if (language === 'ml') utterance.lang = 'ml-IN';
    else if (language === 'bn') utterance.lang = 'bn-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#151921] border border-[#2D3748] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Voice AI Risk Diagnostic ({business.name})
              </h3>
              <p className="text-xs text-slate-400">
                Plain-language, empathetic financial explanation in your regional language
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-[#0B0E14] border border-[#2D3748] rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Audio Player & Language Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
          {/* Audio controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? stopAudio : playAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-500/40'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Voice Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen to Explanation (Audio)</span>
                </>
              )}
            </button>

            {/* Waveform Visualizer Animation when playing */}
            {isPlaying && (
              <div className="flex items-center gap-1 h-5">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="w-1 bg-blue-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.12}s`,
                      height: `${Math.max(6, (i % 3) * 6 + 6)}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Regional Language Select */}
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={language}
              onChange={(e: any) => setLanguage(e.target.value)}
              className="px-2.5 py-1.5 bg-[#151921] border border-[#2D3748] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="kn">Kannada (ಕನ್ನಡ)</option>
              <option value="ml">Malayalam (മലയാളം)</option>
              <option value="bn">Bengali (বাংলা)</option>
            </select>
          </div>
        </div>

        {/* Plain Language Summary Paragraph */}
        <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748] space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Risk Explanation Summary</span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed font-medium">
            {loading ? 'Synthesizing plain language risk breakdown...' : explanationData.explanation}
          </p>
        </div>

        {/* 4 Bullet Points Matrix */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Key Financial Risk Drivers:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {explanationData.bulletPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0B0E14] border border-[#2D3748] text-xs text-slate-300 flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Next Step Recommendation */}
        {explanationData.recommendedNextStep && (
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-400 block mb-0.5">
                Recommended Immediate Action:
              </span>
              <span className="text-slate-200">
                {explanationData.recommendedNextStep}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#2D3748] flex justify-end gap-2">
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-4 py-2 bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Close
          </button>
          {onProceedToActionCenter && (
            <button
              onClick={() => {
                stopAudio();
                onClose();
                onProceedToActionCenter();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Open Action Center
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
