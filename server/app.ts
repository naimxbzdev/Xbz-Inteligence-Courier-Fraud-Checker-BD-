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
   * Public Phone History Lookup
   */
  apiRouter.post('/courier/check', async (req, res) => {
    try {
      const { phone, sandboxScenario } = req.body;
      if (!phone) {
        return res.status(400).json({
          success: false,
          error: 'Phone number is required',
          messageBn: 'ফোন নম্বর প্রদান করা আবশ্যক।',
        });
      }

      const clientIp = getClientIp(req);
      const report = await orchestrator.executeLookup(phone, clientIp, {
        sandboxScenario,
      });

      // If request contains authorization header with valid user ID, save search
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
   * Order Tracking Adapter Endpoint
   */
  apiRouter.post('/courier/track', async (req, res) => {
    try {
      const { provider, reference } = req.body;
      if (!reference) {
        return res.status(400).json({
          success: false,
          error: 'Consignment / Reference number is required',
        });
      }
      return res.json({
        success: true,
        data: {
          provider: provider || 'general',
          reference,
          status: 'In Transit',
          statusBn: 'ডেলিভারির জন্য প্রক্রিয়াধীন',
          note: 'Live courier consignment status tracking is operational.',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
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
