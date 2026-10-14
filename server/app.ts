import express from 'express';
import dotenv from 'dotenv';
import { CourierOrchestrator } from './orchestrator.js';
import {
  authenticateUser,
  registerUser,
  getUserById,
  authenticateAdmin,
  saveMerchantSearch,
} from './auth.js';

dotenv.config();

/**
 * Creates and configures the Express application with all API routes.
 * Used by both standalone Node.js server (server.ts) and Netlify Serverless Functions (netlify/functions/api.ts).
 */
export function createExpressApp() {
  const app = express();
  const orchestrator = new CourierOrchestrator();

  app.use(express.json());

  // URL normalization: handle Netlify Function URL rewrites gracefully
  app.use((req, res, next) => {
    if (req.url.startsWith('/.netlify/functions/api')) {
      req.url = req.url.replace('/.netlify/functions/api', '');
      if (!req.url.startsWith('/')) {
        req.url = '/' + req.url;
      }
    }
    next();
  });

  // Request logger for API calls (redacts sensitive parameters)
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (res.statusCode >= 400) {
        console.warn(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
      }
    });
    next();
  });

  // Helper to get client IP
  function getClientIp(req: express.Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
  }

  // Admin authorization middleware
  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    const passkey = req.headers['x-admin-key'] || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : '');
    if (!passkey || !authenticateAdmin(String(passkey))) {
      return res.status(403).json({
        success: false,
        error: 'Admin access denied. Valid administrative passkey required.',
      });
    }
    next();
  }

  // Common API Router
  const apiRouter = express.Router();

  /**
   * Health Ping / Deployment Verification
   */
  apiRouter.get('/ping', (_req, res) => {
    return res.json({
      success: true,
      service: 'XBZ Intelligence API',
      status: 'operational',
      timestamp: new Date().toISOString(),
      runtime: process.env.NETLIFY ? 'Netlify Serverless Function' : 'Node.js Express Server',
    });
  });

  // -------------------------------------------------------------
  // PUBLIC COURIER INTELLIGENCE ROUTES
  // -------------------------------------------------------------

  /**
   * Universal Public Courier Intelligence Route
   * Automatically detects Phone Number, Consignment ID, or Parcel Tracking Code
   * and queries all official courier APIs simultaneously with zero fake information.
   */
  apiRouter.post('/courier/check', async (req, res) => {
    try {
      const {
        phone,
        identifier,
        reference,
        query,
        search,
        searchType = 'auto',
        courier = 'all',
        sandboxScenario,
      } = req.body;

      const rawInput = (query || identifier || phone || reference || search || '').trim();

      if (!rawInput) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a mobile phone number, consignment ID, or tracking code.',
          messageBn: 'অনুগ্রহ করে মোবাইল নম্বর, কনসাইনমেন্ট আইডি অথবা ট্র্যাকিং কোড দিন।',
        });
      }

      // Check if input is a Bangladeshi mobile number (convert Bangla digits if present)
      const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      let normalizedDigits = rawInput.replace(/[০-৯]/g, (d: string) => String(banglaDigits.indexOf(d)));
      normalizedDigits = normalizedDigits.replace(/[\s\-\(\)\.]/g, '');

      if (normalizedDigits.startsWith('+880')) {
        normalizedDigits = '0' + normalizedDigits.slice(4);
      } else if (normalizedDigits.startsWith('880')) {
        normalizedDigits = '0' + normalizedDigits.slice(3);
      } else if (!normalizedDigits.startsWith('0') && normalizedDigits.length === 10 && /^[1-9]/.test(normalizedDigits)) {
        normalizedDigits = '0' + normalizedDigits;
      }

      const isBangladeshiPhone = normalizedDigits.length === 11 && /^01[3-9]\d{8}$/.test(normalizedDigits);

      // Determine final search routing based on smart auto-detection & user preference
      let effectiveSearchType: 'phone' | 'consignment' | 'parcel';
      if (searchType === 'auto') {
        effectiveSearchType = isBangladeshiPhone ? 'phone' : 'consignment';
      } else if (searchType === 'phone') {
        // If user picked phone, but pasted a tracking ID with letters or non-phone format, auto-route to parcel tracking
        effectiveSearchType = isBangladeshiPhone ? 'phone' : 'consignment';
      } else {
        // User picked consignment or parcel; if they actually entered a phone number, route to phone
        effectiveSearchType = isBangladeshiPhone ? 'phone' : (searchType as 'consignment' | 'parcel');
      }

      // EXECUTION 1: Consignment or Parcel Tracking across Couriers
      if (effectiveSearchType === 'consignment' || effectiveSearchType === 'parcel') {
        const parcelReport = await orchestrator.executeParcelTracking(rawInput, courier, effectiveSearchType);

        // If authenticated, save search to merchant dashboard
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const user = getUserById(token);
          if (user) {
            saveMerchantSearch(user.id, {
              phone: parcelReport.trackingId,
              maskedPhone: `[${parcelReport.courierName}] ${parcelReport.trackingId}`,
              riskLevel: parcelReport.customerRiskTelemetry?.overallRisk || 'low',
              verifiedCouriers: 1,
            });
          }
        }

        return res.json({
          success: true,
          searchType: effectiveSearchType,
          data: parcelReport,
        });
      }

      // EXECUTION 2: Phone Delivery History & Risk Analysis across Couriers
      const clientIp = getClientIp(req);
      const report = await orchestrator.executeLookup(normalizedDigits, clientIp, {
        sandboxScenario,
      });

      // If authenticated, save search to merchant dashboard
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const user = getUserById(token);
        if (user) {
          saveMerchantSearch(user.id, {
            phone: report.normalizedPhone,
            maskedPhone: report.maskedPhone,
            riskLevel: report.riskSummary.level,
            verifiedCouriers: report.verifiedProvidersCount,
          });
        }
      }

      return res.json({
        success: true,
        searchType: 'phone',
        data: report,
      });
    } catch (err: any) {
      const status = err.statusCode || 400;
      return res.status(status).json({
        success: false,
        error: err.message || 'An error occurred during courier lookup',
      });
    }
  });

  /**
   * Get Courier Provider Capabilities & Connection Statuses
   */
  apiRouter.get('/courier/status', (_req, res) => {
    try {
      const capabilities = orchestrator.getCapabilities();
      return res.json({
        success: true,
        providers: capabilities,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  });

  /**
   * Parcel & Consignment Tracking Adapter Endpoint
   */
  apiRouter.post('/courier/track', async (req, res) => {
    try {
      const { identifier, reference, courier = 'all', provider, searchType = 'consignment' } = req.body;
      const targetId = identifier || reference;
      if (!targetId) {
        return res.status(400).json({
          success: false,
          error: 'Consignment ID or Parcel Tracking Reference is required',
          messageBn: 'কনসাইনমেন্ট আইডি অথবা ট্র্যাকিং রেফারেন্স প্রদান করা আবশ্যক।',
        });
      }

      const chosenCourier = courier !== 'all' ? courier : (provider || 'all');
      const parcelReport = await orchestrator.executeParcelTracking(targetId, chosenCourier, searchType);

      // If authenticated, save to merchant history
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const user = getUserById(token);
        if (user) {
          saveMerchantSearch(user.id, {
            phone: parcelReport.trackingId,
            maskedPhone: `[${parcelReport.courierName}] ${parcelReport.trackingId}`,
            riskLevel: parcelReport.customerRiskTelemetry?.overallRisk || 'low',
            verifiedCouriers: 1,
          });
        }
      }

      return res.json({
        success: true,
        data: parcelReport,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to track parcel data',
      });
    }
  });

  /**
   * Aggregated Risk Analytics & Courier Success Rates
   */
  apiRouter.get('/courier/analytics', (req, res) => {
    try {
      const timeframe = typeof req.query.timeframe === 'string' ? req.query.timeframe : '30d';
      const courier = typeof req.query.courier === 'string' ? req.query.courier : 'all';

      const analyticsData = orchestrator.getRiskAnalytics({ timeframe, courier });
      return res.json({
        success: true,
        data: analyticsData,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to retrieve courier risk analytics',
      });
    }
  });

  // -------------------------------------------------------------
  // AUTHENTICATION & MERCHANT ACCOUNT ROUTES
  // -------------------------------------------------------------

  apiRouter.post('/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }
      const user = authenticateUser(email, password);
      const { passwordHash, ...safeUser } = user;
      return res.json({
        success: true,
        token: safeUser.id,
        user: safeUser,
      });
    } catch (err: any) {
      return res.status(401).json({ success: false, error: err.message });
    }
  });

  apiRouter.post('/auth/register', (req, res) => {
    try {
      const { email, password, name, businessName } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, error: 'Missing required registration fields' });
      }
      const user = registerUser(email, password, name, businessName || 'My Online Store');
      const { passwordHash, ...safeUser } = user;
      return res.json({
        success: true,
        token: safeUser.id,
        user: safeUser,
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  apiRouter.get('/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const token = authHeader.substring(7);
    const user = getUserById(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Session expired or invalid' });
    }
    const { passwordHash, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  });

  apiRouter.get('/merchant/searches', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const token = authHeader.substring(7);
    const user = getUserById(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Session invalid' });
    }
    return res.json({ success: true, savedSearches: user.savedSearches });
  });

  // -------------------------------------------------------------
  // ADMIN PANEL PROTECTED ROUTES
  // -------------------------------------------------------------

  apiRouter.get('/admin/health', requireAdmin, (_req, res) => {
    const capabilities = orchestrator.getCapabilities();
    const rateLimiterStats = orchestrator.getRateLimiterStats();
    const auditLogs = orchestrator.getAuditLogs();

    return res.json({
      success: true,
      data: {
        uptimeSeconds: Math.floor(process.uptime()),
        serverTime: new Date().toISOString(),
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        rateLimiter: rateLimiterStats,
        providers: capabilities,
        recentAuditLogs: auditLogs,
      },
    });
  });

  apiRouter.post('/admin/test-provider', requireAdmin, async (req, res) => {
    try {
      const { provider, phone, sandboxScenario } = req.body;
      const testPhone = phone || '01711000001';
      const result = await orchestrator.executeLookup(testPhone, '127.0.0.1', {
        sandboxScenario: sandboxScenario || 'clean',
        forceLive: true,
      });
      return res.json({
        success: true,
        diagnostic: result,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Mount API router at both /api and root /
  // This guarantees that whether Netlify function rewrites to /api/... or strips /api,
  // or is called via local server, every request route resolves correctly.
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  return { app, orchestrator, apiRouter };
}
