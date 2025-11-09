import { rateLimit } from 'express-rate-limit';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production';

// General API rate limiter - More lenient in development
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 100, // 1000 in dev, 100 in production
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false
});

// Strict rate limiter for auth endpoints - More lenient in development
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 5, // 100 in dev, 5 in production
  message: {
    error: 'Too many authentication attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful auth attempts
});

// Moderate rate limiter for test creation - More lenient in development
export const testCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 100 : 10, // 100 in dev, 10 in production
  message: {
    error: 'Too many tests created from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for file uploads - More lenient in development
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 100 : 20, // 100 in dev, 20 in production
  message: {
    error: 'Too many file uploads from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

