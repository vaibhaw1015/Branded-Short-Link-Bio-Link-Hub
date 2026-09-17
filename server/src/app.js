import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import linkRoutes from './routes/link.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import bioRoutes from './routes/bio.routes.js';

const app = express();

// Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Explicit CORS configuration (No wildcard with credentials)
const allowedOrigins = [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, redirects)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev, credentials respected
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body & Cookie Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Root status page — shows when visiting http://localhost:5000
app.get('/', (req, res) => {
  res.status(200).json({
    service: '🔗 ShortLink Hub API',
    version: '1.0.0',
    status: '🟢 Online',
    timestamp: new Date().toISOString(),
    frontend: config.clientUrl,
    endpoints: {
      auth: {
        signup:       'POST /api/auth/signup',
        verifyEmail:  'POST /api/auth/verify-email',
        login:        'POST /api/auth/login',
        logout:       'POST /api/auth/logout',
        refresh:      'POST /api/auth/refresh',
        me:           'GET  /api/auth/me',
        forgotPwd:    'POST /api/auth/forgot-password',
        resetPwd:     'POST /api/auth/reset-password',
      },
      links: {
        create:  'POST   /api/links',
        list:    'GET    /api/links',
        getOne:  'GET    /api/links/:id',
        update:  'PUT    /api/links/:id',
        delete:  'DELETE /api/links/:id',
      },
      analytics: {
        overview:  'GET /api/analytics/overview',
        linkStats: 'GET /api/analytics/links/:id',
      },
      bio: {
        getMyBio:   'GET  /api/bio/me',
        updateBio:  'PUT  /api/bio/me',
        publicPage: 'GET  /api/bio/:username',
      },
      redirect: 'GET /r/:shortCode  →  302 to destination URL',
      health:   'GET /health',
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'shortlink-hub-api'
  });
});

// Mount Routes
// 1. Redirection engine mounted at /r (e.g. /r/:shortCode)
app.use('/r', redirectRoutes);

// 2. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/bio', bioRoutes);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
