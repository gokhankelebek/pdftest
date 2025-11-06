import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Import routes
import testsRouter from './routes/tests';
import questionsRouter from './routes/questions';
import regionsRouter from './routes/regions';
import sessionsRouter from './routes/sessions';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      tests: '/api/tests',
      questions: '/api/questions',
      regions: '/api/regions',
      sessions: '/api/sessions'
    }
  });
});

// API Routes
app.use('/api/tests', testsRouter);
app.use('/api', questionsRouter);  // Includes /api/tests/:testId/questions
app.use('/api', regionsRouter);    // Includes /api/questions/:questionId/regions and /api/regions/:id
app.use('/api/sessions', sessionsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

export default app;
