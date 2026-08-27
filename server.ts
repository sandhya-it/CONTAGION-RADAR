import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_BUSINESSES,
  INITIAL_RELATIONSHIPS,
  INITIAL_INVOICES,
  INITIAL_EARLY_WARNINGS,
  INITIAL_ACTION_CARDS,
} from './src/data/seedData';
import {
  calculateDeterministicRisk,
  runContagionSimulation,
  calculateWhatIfComparison,
  DEFAULT_MITIGATION_SCENARIOS,
} from './src/utils/riskEngine';
import { Business, Invoice, EarlyWarningAlert, SupplyRelationship } from './src/types';

dotenv.config();

// In-Memory Database Store for Prototype
let businesses: Business[] = JSON.parse(JSON.stringify(INITIAL_BUSINESSES));
let relationships: SupplyRelationship[] = JSON.parse(JSON.stringify(INITIAL_RELATIONSHIPS));
let invoices: Invoice[] = JSON.parse(JSON.stringify(INITIAL_INVOICES));
let alerts: EarlyWarningAlert[] = JSON.parse(JSON.stringify(INITIAL_EARLY_WARNINGS));
let actionCards = JSON.parse(JSON.stringify(INITIAL_ACTION_CARDS));

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // REST API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), disclaimer: 'SIMULATED / MODEL OUTPUT' });
  });

  // 1. Business Directory & Network Graph Data
  app.get('/api/businesses', (req, res) => {
    res.json({ businesses });
  });

  app.get('/api/relationships', (req, res) => {
    res.json({ relationships });
  });

  app.get('/api/network', (req, res) => {
    res.json({
      nodes: businesses,
      edges: relationships,
      meta: {
        totalBusinesses: businesses.length,
        totalEdges: relationships.length,
        criticalHubs: businesses.filter((b) => b.isCriticalNode).length,
      },
    });
  });

  // 2. Risk Calculation per Business
  app.get('/api/risk/:businessId', (req, res) => {
    const biz = businesses.find((b) => b.id === req.params.businessId);
    if (!biz) {
      return res.status(404).json({ error: 'Business not found' });
    }
    const risk = calculateDeterministicRisk(biz, relationships);
    res.json({
      businessId: biz.id,
      name: biz.name,
      ...risk,
    });
  });

  // 3. Invoice Management
  app.get('/api/invoices', (req, res) => {
    const { buyerId, supplierId, status } = req.query;
    let filtered = [...invoices];
    if (buyerId) filtered = filtered.filter((i) => i.buyerId === buyerId);
    if (supplierId) filtered = filtered.filter((i) => i.supplierId === supplierId);
    if (status) filtered = filtered.filter((i) => i.status === status);
    res.json({ invoices: filtered });
  });

  app.post('/api/invoices', (req, res) => {
    const { buyerName, supplierName, amountINR, invoiceDate, dueDate, goodsDescription } = req.body;
    
    if (!buyerName || !amountINR) {
      return res.status(400).json({ error: 'buyerName and amountINR are required' });
    }

    const today = new Date('2026-08-27');
    const due = new Date(dueDate || '2026-07-27');
    const diffDays = Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
    const status = diffDays > 0 ? 'OVERDUE' : 'PENDING';

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: 'biz-t1-1',
      buyerName,
      supplierId: 'biz-t2-1',
      supplierName: supplierName || 'Kaveri Precision Auto Components',
      amountINR: Number(amountINR),
      invoiceDate: invoiceDate || '2026-07-01',
      dueDate: dueDate || '2026-07-31',
      status,
      daysOverdue: diffDays,
      goodsDescription: goodsDescription || 'Precision Machined Auto Components Batch',
      msmeSamadhaanEligible: diffDays > 45,
      interestCalculatedINR: diffDays > 45 ? Math.round(Number(amountINR) * 0.0006 * diffDays) : 0,
    };

    invoices.unshift(newInvoice);

    // If overdue, trigger real-time early warning alert
    if (diffDays > 30) {
      alerts.unshift({
        id: `alert-${Date.now()}`,
        businessId: newInvoice.supplierId,
        businessName: newInvoice.supplierName,
        title: `₹${(newInvoice.amountINR / 100000).toFixed(1)} Lakh Overdue (${diffDays}d) from ${buyerName}`,
        severity: diffDays > 60 ? 'RED' : 'ORANGE',
        category: 'PAYMENT_DELAY',
        reason: `New invoice registered with ${diffDays} days payment delinquency past credit terms.`,
        impact: `Increases working capital cash drain and threatens supplier payment commitments.`,
        recommendedAction: `Generate MSMED Act Section 16 formal demand notice and submit invoice to TReDS factoring portal.`,
        createdAt: new Date().toISOString(),
        isSimulated: true,
      });
    }

    res.status(201).json({ invoice: newInvoice });
  });

  // Reset demo data to default baseline
  app.post('/api/simulation/reset', (req, res) => {
    businesses = JSON.parse(JSON.stringify(INITIAL_BUSINESSES));
    relationships = JSON.parse(JSON.stringify(INITIAL_RELATIONSHIPS));
    invoices = JSON.parse(JSON.stringify(INITIAL_INVOICES));
    alerts = JSON.parse(JSON.stringify(INITIAL_EARLY_WARNINGS));
    actionCards = JSON.parse(JSON.stringify(INITIAL_ACTION_CARDS));
    res.json({ success: true, message: 'Database reset to initial healthy baseline' });
  });

  // 4. Contagion Simulation Engine
  app.post('/api/simulation/start', (req, res) => {
    const { originBusinessId = 'biz-oem-1', shockDays = 30 } = req.body;
    const result = runContagionSimulation(originBusinessId, Number(shockDays), businesses, relationships);
    res.json(result);
  });

  // 5. What-If Mitigation Sandbox
  app.post('/api/simulation/mitigate', (req, res) => {
    const { scenarios = DEFAULT_MITIGATION_SCENARIOS, shockDays = 30, originBusinessId = 'biz-oem-1' } = req.body;
    const simResult = runContagionSimulation(originBusinessId, Number(shockDays), businesses, relationships);
    const comparison = calculateWhatIfComparison(scenarios, simResult);
    res.json({
      comparison,
      scenarios,
      simResult,
    });
  });

  // 6. Early Warning Alerts & Action Center
  app.get('/api/alerts', (req, res) => {
    res.json({ alerts });
  });

  app.get('/api/actions', (req, res) => {
    res.json({ actionCards });
  });

  // 7. Analytics Data
  app.get('/api/analytics', (req, res) => {
    const totalExposure = businesses.reduce((acc, b) => acc + b.monthlyOperatingExpenseINR, 0);
    const highRiskCount = businesses.filter((b) => b.riskLevel === 'RED' || b.riskLevel === 'ORANGE').length;
    const avgDelay = Math.round(businesses.reduce((acc, b) => acc + b.currentDelayDays, 0) / businesses.length);

    res.json({
      totalExposureINR: totalExposure,
      highRiskCount,
      avgDelayDays: avgDelay,
      networkHealth: 74,
      agingBrackets: [
        { bracket: '0-30 Days (Normal)', amountINR: 42000000, count: 18 },
        { bracket: '31-45 Days (Grace)', amountINR: 28000000, count: 12 },
        { bracket: '46-60 Days (Warning)', amountINR: 19500000, count: 7 },
        { bracket: '60+ Days (Critical)', amountINR: 34800000, count: 9 },
      ],
      tierRiskDistribution: [
        { tier: 'Anchor OEM', normal: 1, warning: 0, high: 1, critical: 0 },
        { tier: 'Tier 1 Prime', normal: 1, warning: 1, high: 1, critical: 0 },
        { tier: 'Tier 2 MSME', normal: 1, warning: 1, high: 1, critical: 2 },
        { tier: 'Tier 3 Micro', normal: 2, warning: 2, high: 2, critical: 2 },
      ],
    });
  });

  // ==========================================
  // AI INTEGRATION ENDPOINTS (Gemini)
  // ==========================================

  // A. Voice / Plain-Language Risk Explanation
  app.post('/api/ai/explain-risk', async (req, res) => {
    const { businessId = 'biz-t2-1', language = 'en' } = req.body;
    const biz = businesses.find((b) => b.id === businessId) || businesses[5];

    try {
      const ai = getAI();
      if (!ai) {
        // Fallback explanation if API key not available
        return res.json({
          explanation: `Your payment of ₹10 Lakh from ${biz.topBuyerName} is 60 days overdue. Because ${biz.buyerConcentrationPercent}% of your receivables depend on this single customer, your cash reserves have shrunk to only ${biz.daysOperatingCoverage} days. If unaddressed, this will force you to delay payments to your own raw material and packaging suppliers.`,
          bulletPoints: [
            `Overdue payment of ₹10 Lakh has exceeded normal 30-day terms by 30 days.`,
            `78% of your monthly incoming cash relies on a single buyer.`,
            `Your cash runway has fallen to 15 days of operating expenses.`,
            `Downstream risk: 3 micro-suppliers in your chain are at risk of payment halt.`,
          ],
          audioText: `Your payment has been delayed for 60 days. This has reduced your available cash buffer to 15 days. We recommend using TReDS factoring and sending a formal reminder immediately.`,
        });
      }

      const prompt = `You are the AI Risk Specialist for CONTAGION RADAR, an early warning system for Indian MSMEs.
Explain the financial risk situation for the following MSME in simple, empathetic, non-jargon terms for a non-technical small factory owner.

Business Details:
- Name: ${biz.name}
- Cluster: ${biz.cluster}
- Sector: ${biz.sector}
- Top Buyer: ${biz.topBuyerName} (${biz.buyerConcentrationPercent}% concentration)
- Current Payment Delay: ${biz.currentDelayDays} days (Baseline: ${biz.baselineDelayDays} days)
- Cash Reserve Coverage: ${biz.daysOperatingCoverage} days remaining
- Risk Score: ${biz.riskScore}/100 (${biz.riskLevel})
- Risk Reasons: ${biz.riskReasons.join('; ')}

Language requested: ${language} (if non-English, provide natural translation in that regional Indian language).

Respond in JSON format with:
{
  "explanation": "A clear 2-3 sentence paragraph in simple language",
  "bulletPoints": ["3-4 clear concise bullet points of what happened and why"],
  "recommendedNextStep": "One immediate high-impact action to take today"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Explain Risk error:', err?.message);
      res.json({
        explanation: `Your payment of ₹10 Lakh from ${biz.topBuyerName} has been delayed for ${biz.currentDelayDays} days. This creates severe liquidity pressure on your working capital.`,
        bulletPoints: biz.riskReasons,
        recommendedNextStep: 'Submit unpaid invoice to TReDS factoring for immediate 85% liquidity advance.',
      });
    }
  });

  // B. AI Payment Reminder & MSMED Notice Generator
  app.post('/api/ai/generate-reminder', async (req, res) => {
    const {
      invoiceId = 'inv-101',
      language = 'en',
      tone = 'statutory_msme',
      includeMsmedInterest = true,
    } = req.body;

    const inv = invoices.find((i) => i.id === invoiceId) || invoices[0];
    const supplier = businesses.find((b) => b.id === inv.supplierId) || businesses[5];

    try {
      const ai = getAI();
      if (!ai) {
        // Deterministic template fallback
        const interestStr = includeMsmedInterest ? ` Also note that under Section 16 of the MSMED Act 2006, delayed payments beyond 45 days attract mandatory monthly compounded interest at 3x the RBI Bank Rate.` : '';
        return res.json({
          subject: `Payment Reminder: Overdue Invoice ${inv.invoiceNumber} (₹${(inv.amountINR / 100000).toFixed(2)} Lakhs)`,
          body: `Dear Accounts Team at ${inv.buyerName},\n\nThis is a gentle reminder regarding invoice ${inv.invoiceNumber} dated ${inv.invoiceDate} for ₹${inv.amountINR.toLocaleString('en-IN')} towards '${inv.goodsDescription}', which was due on ${inv.dueDate} and is now ${inv.daysOverdue} days overdue.\n\nAs an MSME manufacturing enterprise (${supplier.udyamNumber}), steady cash flow is vital to maintain our factory operations and upstream component supplies.${interestStr}\n\nKindly process this disbursement or share the UTR payment reference at your earliest convenience.\n\nWarm regards,\nFinance & Accounts\n${supplier.name}`,
          channelSuggestions: ['WhatsApp PDF Notice', 'Registered Email', 'MSME Samadhaan Formal Intimation'],
        });
      }

      const prompt = `You are generating a payment reminder letter for an Indian MSME supplier to send to their buyer.

Details:
- Supplier: ${supplier.name} (Udyam: ${supplier.udyamNumber}, GSTIN: ${supplier.gstin})
- Buyer: ${inv.buyerName}
- Invoice Number: ${inv.invoiceNumber}
- Invoice Date: ${inv.invoiceDate}, Due Date: ${inv.dueDate}
- Amount: ₹${inv.amountINR.toLocaleString('en-IN')}
- Days Overdue: ${inv.daysOverdue} days
- Goods: ${inv.goodsDescription}
- Tone: ${tone} (Options: polite, firm, statutory_msme)
- Include MSMED Act Section 16 interest reference: ${includeMsmedInterest}
- Language: ${language}

Generate a professional, culturally appropriate, and legally sound payment reminder.
Return JSON with:
{
  "subject": "Email/letter subject line",
  "body": "Complete letter text with appropriate linebreaks",
  "whatsappSnippet": "Short 3-4 sentence message suitable for WhatsApp/SMS",
  "statutoryClause": "Exact statutory clause referencing MSMED Act Section 15/16 (if applicable)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (err: any) {
      console.error('AI Reminder Generator error:', err?.message);
      res.json({
        subject: `Payment Reminder: Invoice ${inv.invoiceNumber}`,
        body: `Dear ${inv.buyerName},\n\nKindly note invoice ${inv.invoiceNumber} for ₹${inv.amountINR.toLocaleString('en-IN')} is overdue by ${inv.daysOverdue} days. Please release payment.`,
        whatsappSnippet: `Dear ${inv.buyerName}, invoice ${inv.invoiceNumber} for ₹${inv.amountINR} is ${inv.daysOverdue} days past due. Please release payment.`,
      });
    }
  });

  // C. Voice Input Natural Language Parser
  app.post('/api/ai/voice-parse', async (req, res) => {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript text is required' });
    }

    try {
      const ai = getAI();
      if (!ai) {
        // Fallback regex parser for common patterns
        let amount = 1000000;
        if (transcript.toLowerCase().includes('ten lakh') || transcript.includes('10 lakh')) amount = 1000000;
        else if (transcript.includes('lakh')) {
          const match = transcript.match(/(\d+(\.\d+)?)\s*lakh/i);
          if (match) amount = parseFloat(match[1]) * 100000;
        }

        let delay = 60;
        if (transcript.toLowerCase().includes('two month') || transcript.toLowerCase().includes('2 month')) delay = 60;
        else if (transcript.toLowerCase().includes('month')) delay = 30;

        return res.json({
          buyerName: 'Varroc Systems & Assemblies Pvt Ltd',
          amountINR: amount,
          approxDelayDays: delay,
          goodsDescription: 'CNC Machined Precision Components',
          rawTranscript: transcript,
          confidence: 0.92,
        });
      }

      const prompt = `A small Indian business owner spoke the following sentence into the microphone:
"${transcript}"

Extract structured invoice and buyer debt information from this text.
Convert any Lakhs, Crores, or Thousands into full INR numeric values (e.g. "ten lakh rupees" -> 1000000, "50 thousand" -> 50000).
Convert relative time like "for two months" or "3 weeks late" into approximate days overdue (e.g. 2 months -> 60 days).

Respond with JSON:
{
  "buyerName": "Name of buyer mentioned or inferred",
  "amountINR": 1000000,
  "approxDelayDays": 60,
  "goodsDescription": "Description of goods/services if mentioned, or general auto components",
  "confidence": 0.95
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              buyerName: { type: Type.STRING },
              amountINR: { type: Type.NUMBER },
              approxDelayDays: { type: Type.NUMBER },
              goodsDescription: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
            },
            required: ['buyerName', 'amountINR', 'approxDelayDays'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        ...parsed,
        rawTranscript: transcript,
      });
    } catch (err: any) {
      console.error('AI Voice Parse error:', err?.message);
      res.json({
        buyerName: 'ABC Enterprises',
        amountINR: 1000000,
        approxDelayDays: 60,
        goodsDescription: 'Industrial Components',
        rawTranscript: transcript,
        confidence: 0.85,
      });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CONTAGION RADAR] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Contagion Radar server:', err);
});
