# Technology Stack

## Frontend

### Core
- **React 18+**: UI framework
- **TypeScript**: Type safety and better DX
- **Vite**: Build tool and dev server (fast HMR)

### PDF Handling
- **PDF.js**: Mozilla's PDF rendering library
- **react-pdf**: React wrapper for PDF.js

### UI & Styling
- **Tailwind CSS**: Utility-first styling
- **Headless UI**: Accessible UI components
- **React Icons**: Icon library

### State Management
- **Zustand** or **React Context**: Simple state management
- **React Query**: Server state and caching

### Routing
- **React Router**: Client-side routing

### Forms & Validation
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## Backend

### Runtime & Framework
- **Node.js 18+**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety

### Database
- **PostgreSQL**: Relational database
  - Good for structured test data
  - ACID compliance for test results
- **Prisma**: Modern ORM for type-safe database access

Alternative: **MongoDB** if you prefer document-based storage

### File Storage
- **Local Filesystem** (Development)
- **AWS S3** or **Cloudinary** (Production)

### API
- **REST API** (simpler, recommended for MVP)
- Alternative: **GraphQL** with Apollo (if complex queries needed)

### Authentication (Optional for MVP)
- **Passport.js**: Authentication middleware
- **JWT**: Stateless authentication tokens

## Development Tools

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

### Testing
- **Vitest**: Unit testing (Vite-native)
- **React Testing Library**: Component testing
- **Playwright** or **Cypress**: E2E testing

### API Testing
- **Postman** or **Insomnia**: API development
- **Supertest**: API testing in code

## DevOps & Deployment

### Version Control
- **Git**: Version control
- **GitHub**: Code hosting

### Containerization
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

### Deployment Options
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: Railway, Render, AWS EC2, or DigitalOcean
- **Database**: Railway, Supabase, or AWS RDS

### CI/CD
- **GitHub Actions**: Automated testing and deployment

## Utilities

### General
- **Axios**: HTTP client
- **date-fns**: Date manipulation
- **uuid**: Unique ID generation

### PDF Processing (Backend)
- **pdf-lib**: PDF manipulation if needed
- **sharp**: Image processing (for thumbnails)

## Recommended Starter Stack (MVP)

### Simple Setup
```
Frontend:
- React + TypeScript + Vite
- Tailwind CSS
- react-pdf
- React Router
- Zustand for state

Backend:
- Express + TypeScript
- PostgreSQL + Prisma
- Local file storage
- JWT for auth (optional)

Development:
- ESLint + Prettier
- Vitest for testing
```

### File Structure
```
pdf-mcq-test/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   └── types/ (shared TypeScript types)
└── docker-compose.yml
```

## Dependencies Size Estimate

### Frontend (~500-600 MB node_modules)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-pdf": "^7.5.0",
  "pdfjs-dist": "^3.11.0",
  "react-router-dom": "^6.20.0",
  "zustand": "^4.4.0",
  "axios": "^1.6.0",
  "tailwindcss": "^3.3.0"
}
```

### Backend (~200-300 MB node_modules)
```json
{
  "express": "^4.18.0",
  "prisma": "^5.7.0",
  "@prisma/client": "^5.7.0",
  "multer": "^1.4.5",
  "cors": "^2.8.5",
  "dotenv": "^16.3.0"
}
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

(PDF.js requires modern browser features)
