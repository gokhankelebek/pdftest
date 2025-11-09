import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Import routes
import authRouter from './routes/auth';
import testsRouter from './routes/tests';
import questionsRouter from './routes/questions';
import regionsRouter from './routes/regions';
import sessionsRouter from './routes/sessions';

// Import security middleware
import { apiLimiter, authLimiter } from './middleware/security';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resource loading
  contentSecurityPolicy: false // Disable CSP for now (can be configured later)
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'PDF MCQ Test API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'PDF MCQ Test API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tests: '/api/tests',
      questions: '/api/questions',
      regions: '/api/regions',
      sessions: '/api/sessions'
    }
  });
});

// API Routes with rate limiting
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/tests', apiLimiter, testsRouter);
app.use('/api', apiLimiter, questionsRouter);  // Includes /api/tests/:testId/questions
app.use('/api', apiLimiter, regionsRouter);    // Includes /api/questions/:questionId/regions
app.use('/api/sessions', apiLimiter, sessionsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

export default app;
