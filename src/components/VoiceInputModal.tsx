import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Volume2,
  ArrowRight,
} from 'lucide-react';
import { Invoice } from '../types';
import { formatINR } from '../utils/formatters';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: Partial<Invoice>) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onInvoiceCreated,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    buyerName: string;
    amountINR: number;
    approxDelayDays: number;
    goodsDescription: string;
    confidence: number;
  } | null>(null);

  const samplePresets = [
    'Varroc Systems delayed ten lakh rupees payment for two months for CNC precision flanges',
    'Tata AutoComp payment of 15 lakh rupees is 45 days overdue for machined gear blanks',
    'Sundram Fasteners invoice eight lakh rupees delayed 60 days for high tensile bolts',
  ];

  // Speech Recognition Setup
  useEffect(() => {
    if (!isOpen) {
      setTranscript('');
      setParsedResult(null);
      setIsRecording(false);
    }
  }, [isOpen]);

  const handleStartSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: load sample preset
      setTranscript(samplePresets[0]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setTranscript(text);
      };
      recognition.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };
      recognition.onend = () => setIsRecording(false);

      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setTranscript(samplePresets[0]);
    }
  };

  const handleParseTranscript = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/ai/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      if (res.ok) {
        const data = await res.json();
        setParsedResult(data);
      }
    } catch (err) {
      console.error('Voice parsing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAndSave = () => {
    if (!parsedResult) return;

    // Calculate due date from delay
    const today = new Date();
    const dueDate = new Date(today.getTime() - parsedResult.approxDelayDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    onInvoiceCreated({
      buyerName: parsedResult.buyerName,
      supplierName: 'Kaveri Precision Auto Components',
      amountINR: parsedResult.amountINR,
      dueDate,
      goodsDescription: parsedResult.goodsDescription,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#151921] border border-[#2D3748] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Voice Invoice & Debt Ingestion
              </h3>
              <p className="text-xs text-slate-400">
                Speak your delayed invoice details in natural language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-[#0B0E14] border border-[#2D3748] rounded-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Microphone Interactive Pulse Button */}
        <div className="flex flex-col items-center justify-center py-4 bg-[#0B0E14] rounded-2xl border border-[#2D3748] space-y-3">
          <button
            onClick={handleStartSpeech}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-600/30 scale-110'
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <div className="text-center">
            <span className="text-xs font-bold text-white block">
              {isRecording ? 'Listening... Speak now' : 'Click to Speak into Microphone'}
            </span>
            <span className="text-[11px] text-slate-500">
              Example: &ldquo;Buyer Varroc delayed 10 lakh payment for 2 months&rdquo;
            </span>
          </div>
        </div>

        {/* Quick Voice Simulation Presets */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
            Or Click a Sample Spoken Phrase:
          </span>
          <div className="space-y-1.5">
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setTranscript(preset)}
                className="w-full text-left text-xs p-2 rounded-lg bg-[#0B0E14] border border-[#2D3748] hover:border-blue-500/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                &ldquo;{preset}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Live Spoken Transcript Input */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Recorded Transcript:
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={2}
            placeholder="Your spoken transcript will appear here..."
            className="w-full p-2.5 bg-[#0B0E14] border border-[#2D3748] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-mono"
          />
        </div>

        {/* Parse Button */}
        {!parsedResult && (
          <button
            onClick={handleParseTranscript}
            disabled={!transcript || isProcessing}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                <span>Extracting Structured Invoice with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Extract Structured Invoice</span>
              </>
            )}
          </button>
        )}

        {/* Structured Result Confirmation Card */}
        {parsedResult && (
          <div className="bg-[#0B0E14] p-4 rounded-xl border border-blue-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#2D3748] pb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Structured Extraction Result</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Confidence: {Math.round(parsedResult.confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-[#151921] border border-[#2D3748]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Buyer Name</span>
                <strong className="text-white font-semibold">{parsedResult.buyerName}</strong>
              </div>
              <div className="p-2 rounded bg-[#151921] border border-[#2D3748]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Invoice Amount</span>
                <strong className="text-blue-400 font-bold text-sm">
                  {formatINR(parsedResult.amountINR)}
                </strong>
              </div>
              <div className="p-2 rounded bg-[#151921] border border-[#2D3748]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimated Delay</span>
                <strong className="text-rose-400 font-bold">
                  +{parsedResult.approxDelayDays} Days
                </strong>
              </div>
              <div className="p-2 rounded bg-[#151921] border border-[#2D3748]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Goods</span>
                <strong className="text-slate-300 truncate block">
                  {parsedResult.goodsDescription}
                </strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setParsedResult(null)}
                className="px-3 py-1.5 bg-[#151921] border border-[#2D3748] text-slate-400 text-xs rounded-lg cursor-pointer"
              >
                Re-Record
              </button>
              <button
                onClick={handleConfirmAndSave}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Add to Ledger</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
