import rateLimit from 'express-rate-limit';

// Strict rate limit for link creation: 30 requests per 15 minutes per IP
export const linkCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many links created from this IP. Please try again after 15 minutes.'
  }
});

// Looser rate limit for public redirects: 300 requests per 1 minute per IP
export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many redirection requests. Slow down.'
  }
});

// General auth rate limit: 15 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please wait a few minutes before trying again.'
  }
});
