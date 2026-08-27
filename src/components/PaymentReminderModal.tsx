import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  Send,
  Download,
  Sparkles,
  ShieldAlert,
  Languages,
  Sliders,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { Invoice, LanguageCode } from '../types';
import { formatINR } from '../utils/formatters';

interface PaymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  initialInvoiceId?: string;
  defaultLanguage?: LanguageCode;
}

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  isOpen,
  onClose,
  invoices,
  initialInvoiceId,
  defaultLanguage = 'en',
}) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    initialInvoiceId || (invoices[0]?.id ?? 'inv-101')
  );
  const [language, setLanguage] = useState<LanguageCode>(defaultLanguage);
  const [tone, setTone] = useState<'polite' | 'firm' | 'statutory_msme'>('statutory_msme');
  const [includeInterest, setIncludeInterest] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedWa, setCopiedWa] = useState<boolean>(false);

  const [reminderContent, setReminderContent] = useState({
    subject: 'Payment Reminder: Overdue Invoice INV/2026/4921 (₹10.00 Lakhs)',
    body: `Dear Accounts Team at Varroc Systems & Assemblies Pvt Ltd,\n\nThis is a formal payment reminder regarding invoice INV/2026/4921 dated 2026-06-27 for ₹10,00,000 towards 'CNC Machined Precision Flanges & Bushings', which was due on 2026-07-27 and is now 60 days overdue.\n\nAs a registered Micro/Small Manufacturing Enterprise (UDYAM-MH-26-0078129), timely cash flow is essential to maintain our precision machining shop operations and upstream supplier payments.\n\nStatutory Note: Under Section 15 and 16 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, payments delayed beyond 45 days attract mandatory monthly compounded interest at three times the RBI Bank Rate from the appointed due date.\n\nWe request you to kindly expedite this disbursement or furnish the UTR transaction reference number at your earliest convenience.\n\nWarm regards,\nFinance & Accounts Department\nKaveri Precision Auto Components`,
    whatsappSnippet: `Dear Varroc Systems, invoice INV/2026/4921 for ₹10,00,000 is 60 days past its due date. Under MSMED Act guidelines, kindly release payment or share the UTR reference number. Thank you - Kaveri Precision Auto.`,
  });

  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  const generateReminder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoiceId,
          language,
          tone,
          includeMsmedInterest: includeInterest,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReminderContent({
          subject: data.subject || reminderContent.subject,
          body: data.body || reminderContent.body,
          whatsappSnippet: data.whatsappSnippet || reminderContent.whatsappSnippet,
        });
      }
    } catch (err) {
      console.error('Error generating reminder:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateReminder();
    }
  }, [isOpen, selectedInvoiceId, language, tone, includeInterest]);

  if (!isOpen) return null;

  const handleCopyBody = () => {
    navigator.clipboard.writeText(`${reminderContent.subject}\n\n${reminderContent.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyWhatsapp = () => {
    navigator.clipboard.writeText(reminderContent.whatsappSnippet);
    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-[#151921] border border-[#2D3748] rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                MSMED Act Payment Reminder Generator
              </h3>
              <p className="text-xs text-slate-400">
                AI-crafted formal, polite, and statutory demand letters for Indian MSMEs
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

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0B0E14] p-3.5 rounded-xl border border-[#2D3748]">
          {/* Invoice Picker */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Select Overdue Invoice:
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#151921] border border-[#2D3748] rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.buyerName.slice(0, 16)} ({formatINR(inv.amountINR)})
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Tone & Legal Posture:
            </label>
            <select
              value={tone}
              onChange={(e: any) => setTone(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#151921] border border-[#2D3748] rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="statutory_msme">Statutory (MSMED Act Sec 16 Interest)</option>
              <option value="firm">Firm (Commercial Credit Hold)</option>
              <option value="polite">Polite (Friendly Reminder)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Language:
            </label>
            <select
              value={language}
              onChange={(e: any) => setLanguage(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#151921] border border-[#2D3748] rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
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

        {/* Generated Email / Letter Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-widest">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Letter / Email Notice</span>
            </div>
            <button
              onClick={handleCopyBody}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Letter'}</span>
            </button>
          </div>

          <div className="bg-[#0B0E14] p-4 rounded-xl border border-[#2D3748] text-xs font-mono space-y-2 select-all">
            <div className="text-amber-300 font-bold border-b border-[#2D3748] pb-1.5">
              Subject: {reminderContent.subject}
            </div>
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {loading ? (
                <div className="flex items-center gap-2 text-slate-500 py-6 justify-center">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Drafting localized statutory notice...</span>
                </div>
              ) : (
                reminderContent.body
              )}
            </div>
          </div>
        </div>

        {/* WhatsApp Short Snippet */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp / SMS Instant Reminder</span>
            </div>
            <button
              onClick={handleCopyWhatsapp}
              className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
            >
              {copiedWa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWa ? 'Copied' : 'Copy WhatsApp Text'}</span>
            </button>
          </div>
          <div className="bg-[#0B0E14] p-3 rounded-xl border border-[#2D3748] text-xs text-slate-300 font-mono">
            {reminderContent.whatsappSnippet}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-[#2D3748] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Compliant with Section 15 & 16 of the MSMED Act (3x RBI Bank Rate Interest)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopyBody}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Copy & Send Notice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
