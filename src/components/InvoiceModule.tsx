import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Mic,
  Send,
  Download,
  DollarSign,
  Percent,
  Building,
} from 'lucide-react';
import { Invoice, LanguageCode } from '../types';
import { formatINR } from '../utils/formatters';

interface InvoiceModuleProps {
  invoices: Invoice[];
  onAddInvoice: (inv: Partial<Invoice>) => void;
  onOpenVoiceInput: () => void;
  onOpenReminderModal: (invoiceId: string) => void;
}

export const InvoiceModule: React.FC<InvoiceModuleProps> = ({
  invoices,
  onAddInvoice,
  onOpenVoiceInput,
  onOpenReminderModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [agingFilter, setAgingFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for manual invoice entry
  const [buyerName, setBuyerName] = useState('Varroc Systems & Assemblies Pvt Ltd');
  const [amountINR, setAmountINR] = useState('1000000');
  const [dueDate, setDueDate] = useState('2026-07-27');
  const [goodsDescription, setGoodsDescription] = useState('CNC Machined Precision Flanges');

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
    if (agingFilter === '0-30' && (inv.daysOverdue < 0 || inv.daysOverdue > 30)) return false;
    if (agingFilter === '31-45' && (inv.daysOverdue <= 30 || inv.daysOverdue > 45)) return false;
    if (agingFilter === '46-60' && (inv.daysOverdue <= 45 || inv.daysOverdue > 60)) return false;
    if (agingFilter === '60+' && inv.daysOverdue <= 60) return false;

    if (
      searchQuery &&
      !inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !inv.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !amountINR) return;

    onAddInvoice({
      buyerName,
      supplierName: 'Kaveri Precision Auto Components',
      amountINR: parseFloat(amountINR),
      dueDate,
      goodsDescription,
    });

    setShowAddModal(false);
    setAmountINR('');
  };

  const totalAmount = invoices.reduce((acc, i) => acc + i.amountINR, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'OVERDUE')
    .reduce((acc, i) => acc + i.amountINR, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#151921] rounded-2xl p-6 border border-[#2D3748] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              Receivables Ledger
            </span>
            <span className="text-xs text-slate-400">
              MSMED Act Section 15/16 Monitored
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Invoices & Payment Aging Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track receivables aging, statutory delayed payment interest (3x RBI rate), and trigger formal reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenVoiceInput}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B0E14] hover:bg-slate-900 text-blue-400 border border-[#2D3748] text-xs font-semibold transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4 text-blue-400" />
            <span>Voice Entry</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#151921] p-4 rounded-xl border border-[#2D3748] shadow-sm">
          <span className="text-xs text-slate-400 block">Total Active Receivables</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white mt-1 block">
            {formatINR(totalAmount, true)}
          </span>
          <span className="text-[11px] text-slate-500">{invoices.length} invoices registered</span>
        </div>

        <div className="bg-[#151921] p-4 rounded-xl border border-[#2D3748] shadow-sm">
          <span className="text-xs text-slate-400 block">Overdue Cash Delayed</span>
          <span className="text-xl sm:text-2xl font-extrabold text-rose-400 mt-1 block">
            {formatINR(totalOverdue, true)}
          </span>
          <span className="text-[11px] text-rose-400">
            {invoices.filter((i) => i.status === 'OVERDUE').length} delinquent invoices
          </span>
        </div>

        <div className="bg-[#151921] p-4 rounded-xl border border-[#2D3748] shadow-sm">
          <span className="text-xs text-slate-400 block">MSMED Act Statutory Interest</span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1 block">
            {formatINR(
              invoices.reduce((acc, i) => acc + (i.interestCalculatedINR || 0), 0),
              true
            )}
          </span>
          <span className="text-[11px] text-slate-500">Compounded monthly at 3x RBI rate</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#151921] p-4 rounded-xl border border-[#2D3748] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice number, buyer, goods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="OVERDUE">Overdue Only</option>
            <option value="PENDING">Pending (Within terms)</option>
            <option value="PAID">Paid / Cleared</option>
          </select>

          <select
            value={agingFilter}
            onChange={(e) => setAgingFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="ALL">All Aging Brackets</option>
            <option value="0-30">0 - 30 Days (Standard)</option>
            <option value="31-45">31 - 45 Days (Grace)</option>
            <option value="46-60">46 - 60 Days (Warning)</option>
            <option value="60+">60+ Days (Critical / MSMED)</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-[#151921] rounded-2xl border border-[#2D3748] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0B0E14] text-slate-400 uppercase tracking-widest text-[10px] border-b border-[#2D3748]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Buyer (Debtor)</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Days Overdue</th>
                <th className="py-3.5 px-4">MSMED Interest</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3748]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#0B0E14]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {inv.invoiceNumber}
                    <div className="text-[10px] font-sans text-slate-500 font-normal">
                      {inv.goodsDescription}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    {inv.buyerName}
                  </td>
                  <td className="py-3 px-4 font-bold text-white text-sm">
                    {formatINR(inv.amountINR)}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{inv.dueDate}</td>
                  <td className="py-3 px-4">
                    {inv.daysOverdue > 0 ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-xs ${
                          inv.daysOverdue > 45
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        +{inv.daysOverdue} Days
                      </span>
                    ) : (
                      <span className="text-slate-500">Current</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {inv.interestCalculatedINR ? (
                      <span className="text-amber-400 font-medium font-mono">
                        +{formatINR(inv.interestCalculatedINR)}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inv.status === 'OVERDUE'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : inv.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenReminderModal(inv.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Remind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#151921] border border-[#2D3748] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2D3748] pb-3">
              <h3 className="text-base font-bold text-white">Add New Receivable Invoice</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-[#0B0E14] border border-[#2D3748] rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Buyer Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Invoice Amount (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={amountINR}
                  onChange={(e) => setAmountINR(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Goods Description</label>
                <input
                  type="text"
                  value={goodsDescription}
                  onChange={(e) => setGoodsDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0E14] border border-[#2D3748] rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-[#2D3748] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 bg-[#0B0E14] hover:bg-slate-900 border border-[#2D3748] text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
