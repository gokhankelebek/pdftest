# PDF Multiple Choice Test App

Transform static PDF documents with multiple choice questions into interactive online tests - no digitization required!

## 📋 Overview

This application allows educators to create interactive tests from PDF documents by defining clickable regions on the original PDF. Students can then take tests by clicking directly on answer choices, maintaining the visual fidelity of the original document.

## ✨ Key Features

- **PDF Upload**: Upload any PDF containing multiple choice questions
- **Interactive Region Definition**: Draw clickable areas around answer choices
- **Visual Test Taking**: Students click directly on the PDF to answer questions
- **Automatic Grading**: Instant scoring and detailed results
- **No PDF Parsing Required**: Works with any PDF layout - no text extraction needed

## 🚀 Quick Start

```bash
# See docs/QUICK_START.md for detailed setup instructions

# Quick setup:
1. Install dependencies (Node.js 18+, PostgreSQL)
2. Setup frontend and backend
3. Configure database
4. Run the application
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** - High-level vision and concepts
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design and technical architecture
- **[TECH_STACK.md](docs/TECH_STACK.md)** - Technologies and dependencies
- **[IMPLEMENTATION_STEPS.md](docs/IMPLEMENTATION_STEPS.md)** - Step-by-step build guide
- **[FEATURES.md](docs/FEATURES.md)** - Detailed feature breakdown
- **[USER_FLOWS.md](docs/USER_FLOWS.md)** - User journey diagrams
- **[QUICK_START.md](docs/QUICK_START.md)** - Get started in 5 minutes

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↓
Backend (Node.js + Express)
    ↓
Database (PostgreSQL + Prisma)
```

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, PDF.js
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **PDF Rendering**: PDF.js

## 🎯 How It Works

### For Teachers/Admins:
1. Upload a PDF containing multiple choice questions
2. Draw rectangular regions around each answer choice (A, B, C, D, etc.)
3. Specify which answer is correct
4. Share the test link with students

### For Students:
1. Click the test link
2. View the original PDF
3. Click on answer choices to select them
4. Submit the test
5. View instant results with detailed feedback

## 🛠️ Development

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

### Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd backend
npm install

# Setup database
cd backend
npx prisma migrate dev
npx prisma generate

# Run development servers
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📖 Implementation Guide

Follow the detailed implementation steps in `/docs/IMPLEMENTATION_STEPS.md`:

- **Phase 1**: Project Setup (Day 1)
- **Phase 2**: PDF Viewer Component (Days 2-3)
- **Phase 3**: Admin Interface - Region Definition (Days 4-6)
- **Phase 4**: Student Test Interface (Days 7-9)
- **Phase 5**: Scoring & Results (Days 10-11)
- **Phase 6**: Polish & Testing (Days 12-13)
- **Phase 7**: Deployment (Day 14)

## 🎨 User Interface

### Admin Panel
- Clean, intuitive interface for uploading PDFs
- Visual region drawing tool
- Color-coded answer regions
- Test configuration management

### Student Test View
- High-quality PDF rendering
- Transparent clickable overlays
- Clear visual feedback on selection
- Progress tracking

### Results Page
- Prominent score display
- Question-by-question breakdown
- Visual indicators for correct/incorrect answers

## 🔐 Security

- File upload validation
- File size limits
- Input sanitization
- Secure PDF storage
- (Optional) Role-based authentication

## 🚢 Deployment

Multiple deployment options:

- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, AWS EC2
- **Database**: Railway, Supabase, AWS RDS
- **Docker**: Full containerized deployment

See deployment section in documentation for details.

## 📊 Database Schema

```prisma
model Test {
  id          String   @id @default(uuid())
  title       String
  pdfUrl      String
  questions   Question[]
  sessions    TestSession[]
}

model Question {
  questionNumber Int
  correctAnswer  String
  regions        Region[]
}

model Region {
  answerId   String
  x          Float
  y          Float
  width      Float
  height     Float
}

model TestSession {
  score          Int
  answers        Answer[]
}
```

## 🤝 Contributing

This is currently a planned project. Contributions welcome once development begins!

## 📝 License

MIT License (or your preferred license)

## 🎓 Use Cases

- **Education**: Create online quizzes from existing PDFs
- **Training**: Corporate training assessments
- **Certifications**: Practice tests for certifications
- **Homework**: Digital homework assignments
- **Exams**: Remote examination platform

## 🔮 Future Enhancements

- Multi-page PDF support
- Time-limited tests
- Question randomization
- Advanced analytics
- Mobile app
- LMS integration
- AI-powered region detection

## 💡 Why This App?

Traditional online test platforms require manually re-entering questions or complex PDF parsing. This app bridges the gap by:

- ✅ Preserving original PDF formatting
- ✅ No text extraction or OCR needed
- ✅ Works with any PDF layout
- ✅ Simple visual interface
- ✅ Quick test creation
- ✅ Authentic document appearance

## 📞 Support

For detailed setup and development help, see:
- `/docs/QUICK_START.md` - Setup guide
- `/docs/IMPLEMENTATION_STEPS.md` - Development guide
- `/docs/ARCHITECTURE.md` - Technical details

---

**Status**: Planning Phase Complete ✅
**Next**: Begin Phase 1 Implementation

Start building by following `/docs/IMPLEMENTATION_STEPS.md`!
