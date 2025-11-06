# Quick Start Guide

## Getting Started in 5 Minutes

This guide will help you get the PDF MCQ Test App running locally as quickly as possible.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Git
- Code editor (VS Code recommended)

---

## Option 1: Simple Local Development Setup

### Step 1: Clone and Setup (2 minutes)

```bash
# Navigate to project directory
cd /home/user/pdftest

# Create frontend
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install react-pdf pdfjs-dist react-router-dom zustand axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# Create backend
mkdir backend
cd backend
npm init -y
npm install express cors dotenv multer prisma @prisma/client
npm install -D typescript @types/node @types/express @types/cors @types/multer ts-node nodemon
npx tsc --init
cd ..
```

### Step 2: Configure Tailwind (1 minute)

**File**: `frontend/tailwind.config.js`
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**File**: `frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3: Setup Database (1 minute)

```bash
cd backend

# Create .env file
cat > .env << EOL
DATABASE_URL="postgresql://user:password@localhost:5432/pdftest?schema=public"
PORT=3001
EOL

# Initialize Prisma
npx prisma init
```

Copy the schema from `docs/IMPLEMENTATION_STEPS.md` Phase 1.4 to `backend/prisma/schema.prisma`

```bash
# Run migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate
```

### Step 4: Create Basic Backend (1 minute)

**File**: `backend/src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**File**: `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 5: Run the App

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## Option 2: Docker Setup (Recommended for Production)

### Prerequisites
- Docker and Docker Compose installed

### Quick Docker Start

**File**: `docker-compose.yml` (in project root)
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: pdftest
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/pdftest?schema=public
      PORT: 3001
    depends_on:
      - db
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Run:**
```bash
docker-compose up
```

---

## First Test Run

### 1. Create a Sample Test

Once the app is running:

1. Navigate to Admin Panel: `http://localhost:5173/admin`
2. Click "Create New Test"
3. Upload a sample PDF with MCQs
4. Draw regions around answer choices
5. Set correct answers
6. Save the test

### 2. Take the Test

1. Copy the test URL
2. Open in a new tab or incognito window
3. Click on answer choices
4. Submit the test
5. View results

---

## Development Workflow

### Making Changes

**Frontend:**
```bash
cd frontend
npm run dev
# Make changes - hot reload is enabled
```

**Backend:**
```bash
cd backend
npm run dev
# Make changes - nodemon will restart server
```

### Database Changes

```bash
cd backend

# After modifying schema.prisma
npx prisma migrate dev --name your_migration_name

# To view database
npx prisma studio
```

---

## Common Commands

### Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd backend
npm run dev          # Start dev server with nodemon
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

### Database
```bash
cd backend
npx prisma studio           # Open database GUI
npx prisma migrate dev      # Run migrations
npx prisma generate         # Generate Prisma client
npx prisma db push          # Push schema without migration
```

---

## Project Structure

```
pdftest/
├── docs/                          # Documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   ├── IMPLEMENTATION_STEPS.md
│   ├── FEATURES.md
│   ├── USER_FLOWS.md
│   └── QUICK_START.md
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── PDFViewer.tsx
│   │   │   ├── RegionSelector.tsx
│   │   │   └── AnswerOverlay.tsx
│   │   ├── pages/
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── TakeTest.tsx
│   │   │   └── Results.tsx
│   │   ├── store/
│   │   │   └── testStore.ts
│   │   ├── utils/
│   │   │   └── coordinates.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                       # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── tests.ts
│   │   │   └── sessions.ts
│   │   ├── controllers/
│   │   ├── services/
│   │   │   └── scoringService.ts
│   │   ├── middleware/
│   │   │   └── upload.ts
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── uploads/                   # PDF storage
│   ├── package.json
│   └── tsconfig.json
└── docker-compose.yml
```

---

## Troubleshooting

### PDF Not Rendering
- Check that PDF.js worker is configured correctly
- Verify PDF file is accessible
- Check browser console for errors

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists

### CORS Error
- Ensure backend CORS is configured to allow frontend origin
- Check that both servers are running

### File Upload Not Working
- Check file size limits
- Verify uploads directory exists and has write permissions
- Check multer configuration

---

## Next Steps

1. **Read the Documentation**: Check out the detailed docs in `/docs`
2. **Follow Implementation Steps**: Use `IMPLEMENTATION_STEPS.md` as your guide
3. **Build Features**: Start with Phase 1 and work through systematically
4. **Test Continuously**: Test each feature as you build it

---

## Useful Resources

### PDF.js
- Documentation: https://mozilla.github.io/pdf.js/
- Examples: https://mozilla.github.io/pdf.js/examples/

### React + TypeScript
- React Docs: https://react.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/

### Prisma
- Docs: https://www.prisma.io/docs
- Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### Tailwind CSS
- Docs: https://tailwindcss.com/docs
- Components: https://tailwindui.com/components

---

## Getting Help

1. Check the documentation in `/docs`
2. Review error messages carefully
3. Check browser console and server logs
4. Search for similar issues online
5. Ask in relevant communities (Stack Overflow, Reddit, Discord)

---

## Ready to Build?

You now have everything you need to start building the PDF MCQ Test App!

Start with Phase 1 from `IMPLEMENTATION_STEPS.md` and work your way through systematically.

Good luck! 🚀
