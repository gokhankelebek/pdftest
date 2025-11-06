# Implementation Plan - Next 4 Weeks

## 🎯 Goal: Make the app production-ready with core features

---

## Week 1: Multi-Question Support (Critical)

### Day 1-2: Backend Multi-Question Infrastructure
**Files to modify:**
- `backend/src/routes/questions.ts`
- `backend/src/routes/tests.ts`

**Tasks:**
```typescript
// Add endpoints:
GET /api/tests/:testId/questions - Get all questions for a test (ordered)
PUT /api/questions/:id - Update question (correctAnswer, pageNumber)
POST /api/questions/:questionId/regions/bulk - Create multiple regions at once
DELETE /api/questions/:id - Delete question and all regions

// Add validation:
- Ensure question numbers are unique within a test
- Auto-increment question numbers
- Validate correctAnswer is A-F
```

### Day 3-4: Admin Multi-Question UI
**Files to modify:**
- `frontend/src/pages/TestConfiguration.tsx`

**New components to create:**
- `frontend/src/components/QuestionSidebar.tsx`
- `frontend/src/components/QuestionCard.tsx`

**Features:**
```
┌─────────────────────────────────────────┐
│  Test: "Biology Final Exam"            │
├───────────┬─────────────────────────────┤
│ Questions │ PDF Viewer                  │
│           │                             │
│ • Q1 ✓    │   [PDF with regions]        │
│ • Q2 ✓    │                             │
│ • Q3      │   Current: Question 3       │
│ + New     │   Page: 2                   │
│           │   Correct Answer: [A]       │
│           │                             │
│           │   [Draw regions...]         │
└───────────┴─────────────────────────────┘
```

### Day 5: Student Multi-Question Navigation
**Files to modify:**
- `frontend/src/pages/TakeTest.tsx`

**New features:**
```typescript
// Add:
- Question navigation (Next/Previous buttons)
- Question overview (grid showing answered/unanswered)
- Progress bar (Question 3 of 10)
- Review page before submission
- Navigate between questions without losing answers

// State management:
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [answers, setAnswers] = useState<Map<string, string>>(new Map());
```

**Deliverable:** Multi-question tests fully working ✅

---

## Week 2: User Authentication & Authorization

### Day 1-2: Database Schema & Backend Auth
**Files to create/modify:**
- Update `backend/prisma/schema.prisma`
- Create `backend/src/middleware/auth.ts`
- Create `backend/src/routes/auth.ts`
- Update `backend/src/index.ts`

**Prisma schema additions:**
```prisma
model User {
  id            String        @id @default(uuid())
  email         String        @unique
  passwordHash  String
  name          String
  role          UserRole      @default(STUDENT)
  createdAt     DateTime      @default(now())

  // Relations
  createdTests  Test[]        @relation("CreatedBy")
  sessions      TestSession[]
}

enum UserRole {
  ADMIN
  TEACHER
  STUDENT
}

// Update Test model
model Test {
  // ... existing fields
  createdById   String
  createdBy     User          @relation("CreatedBy", fields: [createdById], references: [id])
}

// Update TestSession model
model TestSession {
  // ... existing fields
  studentId     String
  student       User          @relation(fields: [studentId], references: [id])
}
```

**Auth routes:**
```typescript
POST /api/auth/register - Create new user
POST /api/auth/login - Login (returns JWT)
GET /api/auth/me - Get current user
POST /api/auth/logout - Logout
POST /api/auth/refresh - Refresh token
```

**Middleware:**
```typescript
// Protect routes:
router.post('/tests', requireAuth, requireRole('TEACHER'), createTest);
router.get('/tests/:id', requireAuth, getTest);
```

### Day 3-4: Frontend Auth UI
**Files to create:**
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Register.tsx`
- `frontend/src/pages/Profile.tsx`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/components/PrivateRoute.tsx`

**Features:**
```tsx
// Login page
<form onSubmit={handleLogin}>
  <input type="email" />
  <input type="password" />
  <button>Login</button>
  <Link to="/register">Create account</Link>
</form>

// Auth context
const AuthContext = createContext({
  user: null,
  login: async (email, password) => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: false
});

// Protected routes
<PrivateRoute path="/admin" component={AdminPanel} requiredRole="TEACHER" />
```

### Day 5: Auth Integration & Testing
**Tasks:**
- Integrate auth with all existing pages
- Update API client to send JWT tokens
- Add token refresh logic
- Test all auth flows
- Handle expired tokens gracefully

**Deliverable:** Full authentication system working ✅

---

## Week 3: Student & Admin Dashboards

### Day 1-2: Student Dashboard
**Files to create:**
- `frontend/src/pages/StudentDashboard.tsx`
- `frontend/src/components/TestCard.tsx`
- `frontend/src/components/ResultCard.tsx`

**Features:**
```
┌─────────────────────────────────────────┐
│  Welcome back, John!                    │
├─────────────────────────────────────────┤
│  Available Tests                        │
│  ┌───────────────────────────────────┐  │
│  │ Biology Final Exam                │  │
│  │ 10 questions • Due: Dec 15        │  │
│  │ [Start Test]                      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Completed Tests                        │
│  ┌───────────────────────────────────┐  │
│  │ Math Quiz 1                       │  │
│  │ Score: 8/10 (80%) • Nov 28        │  │
│  │ [View Results]                    │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Backend endpoints:**
```typescript
GET /api/students/dashboard - Get available and completed tests
GET /api/students/results - Get all test results for current user
GET /api/students/stats - Get performance statistics
```

### Day 3-4: Admin Dashboard & Analytics
**Files to create:**
- `frontend/src/pages/AdminDashboard.tsx`
- `frontend/src/components/StatsCard.tsx`
- `frontend/src/components/RecentActivity.tsx`

**Features:**
```
┌─────────────────────────────────────────┐
│  Admin Dashboard                        │
├─────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 25      │ │ 150     │ │ 1,234   │   │
│  │ Tests   │ │ Students│ │ Sessions│   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  Recent Tests                           │
│  ┌───────────────────────────────────┐  │
│  │ Biology Final • 45 students       │  │
│  │ Avg: 75% • Created: Nov 28        │  │
│  │ [Edit] [View Results] [Delete]    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Test Performance                       │
│  ┌───────────────────────────────────┐  │
│  │ Math Quiz 1                       │  │
│  │ ████████░░ 85% average            │  │
│  │ 120 completions                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Backend endpoints:**
```typescript
GET /api/admin/stats - Overall statistics
GET /api/admin/tests/:id/analytics - Test-specific analytics
GET /api/admin/students - List all students
GET /api/admin/recent-activity - Recent sessions/completions
```

### Day 5: Data Export & Reporting
**Files to create:**
- `frontend/src/utils/exportCSV.ts`
- `frontend/src/utils/exportPDF.ts`

**Features:**
- Export test results to CSV
- Export student roster to Excel
- Generate PDF report for test results
- Print-friendly result pages

**Deliverable:** Complete dashboard system for students and admins ✅

---

## Week 4: Production Deployment & Security

### Day 1-2: Security Hardening
**Tasks:**

1. **Input Validation**
```typescript
// Install Zod
npm install zod

// Create schemas
const createTestSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  pdfFile: z.custom<File>((file) => file.type === 'application/pdf')
});

// Use in routes
router.post('/tests', validate(createTestSchema), createTest);
```

2. **Rate Limiting**
```typescript
// Install express-rate-limit
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, try again later'
});

router.post('/auth/login', loginLimiter, login);
```

3. **Security Headers**
```typescript
// Install helmet
import helmet from 'helmet';
app.use(helmet());
```

4. **File Upload Security**
```typescript
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  }
});
```

### Day 3: Database Migration to PostgreSQL
**Tasks:**

1. **Set up PostgreSQL** (choose one):
   - Railway: https://railway.app (easiest)
   - Supabase: https://supabase.com (free tier)
   - Neon: https://neon.tech (serverless)

2. **Update Prisma schema**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Create migration**:
```bash
npx prisma migrate dev --name switch_to_postgresql
```

4. **Update .env**:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

### Day 4: Deployment Setup
**Files to create:**
- `Dockerfile` (frontend)
- `Dockerfile` (backend)
- `docker-compose.yml`
- `.github/workflows/deploy.yml`

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

**Deploy options (choose one):**

**Option A: Railway (Easiest)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
railway up
```

**Option B: Vercel + Railway**
```bash
# Frontend to Vercel
vercel --prod

# Backend to Railway
railway up
```

**Option C: DigitalOcean App Platform**
- Connect GitHub repo
- Configure build settings
- Deploy with one click

### Day 5: Monitoring & Launch Prep
**Tasks:**

1. **Error Tracking (Sentry)**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV
});
```

2. **Analytics (Plausible)**
```html
<script defer data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"></script>
```

3. **Health Check Endpoint**
```typescript
router.get('/health', async (req, res) => {
  // Check database connection
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok', timestamp: new Date() });
});
```

4. **Environment Variables Checklist**
```env
# Backend
DATABASE_URL=
JWT_SECRET=
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_SENTRY_DSN=
```

5. **Pre-launch Testing**
- [ ] All auth flows work
- [ ] Can create multi-question test
- [ ] Students can take test
- [ ] Results are accurate
- [ ] Works on mobile
- [ ] No console errors
- [ ] Fast loading (< 3s)

**Deliverable:** App deployed to production! 🚀

---

## After Launch: Iteration Plan

### Month 1: Stability & Feedback
- Monitor errors and fix critical bugs
- Collect user feedback (surveys)
- Optimize performance bottlenecks
- Add missing features based on feedback

### Month 2: Advanced Features
- Test timer and time limits
- Randomization options
- Email notifications
- Bulk operations

### Month 3: Scale & Polish
- Load testing (100+ concurrent users)
- UI/UX improvements
- Mobile app exploration (React Native)
- Integrations (Google Classroom, LMS)

---

## Development Tools & Workflow

### Recommended VSCode Extensions
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens

### Git Workflow
```bash
# Feature branches
git checkout -b feature/multi-question-support
git commit -m "feat: add multi-question navigation"
git push origin feature/multi-question-support

# Commit conventions
feat: New feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code restructuring
test: Adding tests
chore: Maintenance
```

### Code Quality Tools
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json}\"",
    "test": "vitest",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Success Checklist

### Week 1 ✅
- [ ] Can create test with 10+ questions
- [ ] Questions can be on different pages
- [ ] Each question has its own regions
- [ ] Students can navigate between questions
- [ ] All answers are saved correctly

### Week 2 ✅
- [ ] Users can register and login
- [ ] Teachers can only access admin panel
- [ ] Students can only see their own results
- [ ] JWT tokens work correctly
- [ ] Protected routes are secure

### Week 3 ✅
- [ ] Students see available and completed tests
- [ ] Admins see overall statistics
- [ ] Can export results to CSV
- [ ] Dashboard loads in < 2 seconds
- [ ] Mobile-friendly design

### Week 4 ✅
- [ ] App deployed to production URL
- [ ] HTTPS enabled
- [ ] Database backups configured
- [ ] Error tracking active
- [ ] 10 beta users testing successfully

---

## Budget & Resources

### Development Costs
- **Your time**: 4 weeks @ 40 hrs/week = 160 hours
- **Hosting**: $5-20/month (Railway/Vercel)
- **Domain**: $12/year
- **SSL**: Free (Let's Encrypt)
- **Monitoring**: Free tier (Sentry, Plausible)

### Total First Year Cost: ~$100-300

### Potential Revenue Models (Future)
1. **Freemium**: Free for 5 tests, $10/month for unlimited
2. **Per-student pricing**: $1/student/month
3. **Institution licensing**: $500/year for schools
4. **White-label**: $2000+ for custom branding

---

## Questions to Answer

Before starting, decide:

1. **Who is your target user?**
   - Teachers in schools?
   - Corporate trainers?
   - Online course creators?

2. **What's your pricing strategy?**
   - Free and ad-supported?
   - Freemium with paid tiers?
   - Completely free (open source)?

3. **How will users discover this?**
   - SEO (rank for "online PDF test maker")?
   - Social media marketing?
   - Direct sales to schools?

4. **What's your unique value proposition?**
   - "Create tests from PDFs in 5 minutes - no digitization needed"
   - "The easiest way to turn printed exams into online tests"
   - "Preserve your PDF layouts while adding interactivity"

5. **What's the long-term vision?**
   - Build and sell to education company?
   - Grow into full LMS platform?
   - Keep as side project?

---

## Let's Get Started! 🚀

Ready to begin? Let's start with **Week 1, Day 1** - multi-question backend support.

Just say the word and I'll help you implement each feature step by step!
