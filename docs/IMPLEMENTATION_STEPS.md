# Implementation Steps

## Phase 1: Project Setup (Day 1)

### 1.1 Initialize Project Structure
```bash
# Create project directory
mkdir pdf-mcq-test
cd pdf-mcq-test

# Initialize frontend
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Initialize backend
mkdir backend
cd backend
npm init -y
npm install typescript @types/node ts-node nodemon --save-dev
npx tsc --init

# Create shared types folder
mkdir ../shared
```

### 1.2 Install Frontend Dependencies
```bash
cd frontend
npm install react-pdf pdfjs-dist
npm install react-router-dom
npm install zustand
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.3 Install Backend Dependencies
```bash
cd backend
npm install express cors dotenv multer
npm install @types/express @types/cors @types/multer --save-dev
npm install prisma @prisma/client
npx prisma init
```

### 1.4 Setup Database Schema
Create `backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Test {
  id          String   @id @default(uuid())
  title       String
  description String?
  pdfUrl      String
  createdAt   DateTime @default(now())
  questions   Question[]
  sessions    TestSession[]
}

model Question {
  id             String   @id @default(uuid())
  testId         String
  questionNumber Int
  pageNumber     Int
  correctAnswer  String
  test           Test     @relation(fields: [testId], references: [id])
  regions        Region[]
}

model Region {
  id         String   @id @default(uuid())
  questionId String
  answerId   String
  x          Float
  y          Float
  width      Float
  height     Float
  question   Question @relation(fields: [questionId], references: [id])
}

model TestSession {
  id             String   @id @default(uuid())
  testId         String
  studentName    String?
  startTime      DateTime @default(now())
  endTime        DateTime?
  score          Int?
  totalQuestions Int
  test           Test     @relation(fields: [testId], references: [id])
  answers        Answer[]
}

model Answer {
  id             String      @id @default(uuid())
  sessionId      String
  questionId     String
  selectedAnswer String
  isCorrect      Boolean
  session        TestSession @relation(fields: [sessionId], references: [id])
}
```

### 1.5 Setup Development Scripts
Add to `backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate"
  }
}
```

---

## Phase 2: PDF Viewer Component (Days 2-3)

### 2.1 Create Basic PDF Viewer
**File**: `frontend/src/components/PDFViewer.tsx`

Features to implement:
- Load PDF from URL
- Display PDF page
- Handle loading states
- Error handling
- Zoom controls
- Page navigation (if multi-page)

### 2.2 Calculate Coordinate System
**File**: `frontend/src/utils/coordinates.ts`

Create utilities for:
- Converting pixel coordinates to percentages
- Converting percentages back to pixels
- Scaling coordinates based on zoom
- Handling different screen sizes

### 2.3 Test PDF Viewer
- Upload sample PDF
- Verify rendering quality
- Test zoom functionality
- Test on different screen sizes

---

## Phase 3: Admin Interface - Region Definition (Days 4-6)

### 3.1 Create Region Drawing Component
**File**: `frontend/src/components/RegionSelector.tsx`

Features:
- Click and drag to draw rectangles
- Visual feedback while drawing
- Display drawn regions
- Edit existing regions
- Delete regions
- Color coding for different answers

### 3.2 Create Test Configuration Form
**File**: `frontend/src/pages/AdminPanel.tsx`

Features:
- Upload PDF file
- Add test metadata (title, description)
- Navigate through questions
- Assign regions to answer choices
- Set correct answer for each question
- Save test configuration

### 3.3 Backend API - Save Test Configuration
**File**: `backend/src/routes/tests.ts`

Endpoints:
- `POST /api/tests` - Create new test
- `POST /api/tests/:id/questions` - Add questions
- `POST /api/questions/:id/regions` - Add regions
- `GET /api/tests/:id` - Get test configuration
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

### 3.4 File Upload Handler
**File**: `backend/src/middleware/upload.ts`

Features:
- Handle PDF upload with multer
- Validate file type (PDF only)
- Store file securely
- Generate unique filename
- Return file URL

---

## Phase 4: Student Test Interface (Days 7-9)

### 4.1 Create Answer Overlay Component
**File**: `frontend/src/components/AnswerOverlay.tsx`

Features:
- Position transparent divs over PDF based on regions
- Handle click events
- Visual feedback on selection (highlight, checkmark)
- Prevent multiple selections per question
- Clear visual distinction between states:
  - Unselected
  - Hovered
  - Selected

### 4.2 Create Test Taking Page
**File**: `frontend/src/pages/TakeTest.tsx`

Features:
- Load test and PDF
- Display PDF with overlays
- Track selected answers
- Progress indicator
- Submit button
- Confirmation dialog

### 4.3 State Management
**File**: `frontend/src/store/testStore.ts`

Manage:
- Current test data
- Selected answers
- Test session state
- Loading states
- Errors

### 4.4 Backend API - Test Sessions
**File**: `backend/src/routes/sessions.ts`

Endpoints:
- `POST /api/sessions` - Create new test session
- `PUT /api/sessions/:id/answers` - Update answers
- `POST /api/sessions/:id/submit` - Submit test
- `GET /api/sessions/:id` - Get session data

---

## Phase 5: Scoring & Results (Days 10-11)

### 5.1 Scoring Service
**File**: `backend/src/services/scoringService.ts`

Features:
- Compare student answers with correct answers
- Calculate score
- Calculate percentage
- Store results in database

### 5.2 Results Display Page
**File**: `frontend/src/pages/Results.tsx`

Features:
- Display score and percentage
- Show correct vs incorrect answers
- Visual review of each question
- Highlight correct and wrong selections
- Show correct answer for missed questions

### 5.3 Admin Analytics Dashboard
**File**: `frontend/src/pages/Analytics.tsx`

Features:
- List all test sessions
- View individual results
- Statistics (average score, pass rate)
- Question difficulty analysis
- Export results

---

## Phase 6: Polish & Testing (Days 12-13)

### 6.1 UI/UX Improvements
- Responsive design
- Loading animations
- Error messages
- Success notifications
- Keyboard shortcuts
- Accessibility improvements

### 6.2 Testing
- Unit tests for utilities
- Component tests
- API endpoint tests
- E2E test scenarios:
  - Admin creates test
  - Student takes test
  - Results are accurate

### 6.3 Performance Optimization
- Lazy load PDF pages
- Optimize region rendering
- Add caching
- Minimize re-renders
- Optimize database queries

### 6.4 Documentation
- README with setup instructions
- API documentation
- User guide
- Deployment guide

---

## Phase 7: Deployment (Day 14)

### 7.1 Docker Setup
**File**: `docker-compose.yml`

Create containers for:
- Frontend
- Backend
- PostgreSQL database

### 7.2 Environment Configuration
- Setup environment variables
- Configure production database
- Setup file storage (S3 or similar)
- Configure CORS

### 7.3 Deploy
- Deploy backend to hosting service
- Deploy frontend to Vercel/Netlify
- Setup database on cloud provider
- Configure CDN for PDFs
- Setup monitoring

---

## Testing Checklist

### Functional Testing
- [ ] PDF uploads successfully
- [ ] Regions can be drawn accurately
- [ ] Regions save and load correctly
- [ ] Clicks register on correct regions
- [ ] Only one answer per question can be selected
- [ ] Score calculates correctly
- [ ] Results display accurately

### UI/UX Testing
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works on Chrome, Firefox, Safari
- [ ] Clear visual feedback for all interactions
- [ ] Intuitive navigation
- [ ] Error messages are helpful

### Performance Testing
- [ ] Large PDFs load in reasonable time
- [ ] No lag when clicking regions
- [ ] Smooth scrolling and zooming
- [ ] Database queries are optimized

### Security Testing
- [ ] File upload validation works
- [ ] Only PDFs can be uploaded
- [ ] File size limits enforced
- [ ] Input sanitization works
- [ ] No SQL injection vulnerabilities

---

## Future Enhancements

### Short-term
- Multi-page PDF support
- Time limits for tests
- Randomize question order
- Mobile app (React Native)

### Medium-term
- Question bank system
- Automatic grading with explanations
- Student accounts and history
- Test scheduling

### Long-term
- AI-powered question extraction from PDFs
- Automatic region detection
- Advanced analytics and insights
- Integration with LMS systems
- Support for other question types (fill-in-blank, matching)
