# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Admin Panel  │  │ Test Viewer  │  │ Results Page │  │
│  │              │  │              │  │              │  │
│  │ - Upload PDF │  │ - View PDF   │  │ - Scores     │  │
│  │ - Define     │  │ - Click      │  │ - Analytics  │  │
│  │   Regions    │  │   Answers    │  │ - Review     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │          PDF.js (PDF Rendering Engine)             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            │
                            │ REST API / GraphQL
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PDF Storage  │  │ Test Config  │  │ Results      │  │
│  │ Service      │  │ Service      │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  PostgreSQL / MongoDB                              │ │
│  │  - PDF metadata                                    │ │
│  │  - Test configurations (regions, correct answers) │ │
│  │  - Student responses                               │ │
│  │  - Session data                                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Frontend Components

#### 1. PDFViewer Component
- Renders PDF using PDF.js
- Handles zoom, pan, and navigation
- Emits click coordinates
- Manages canvas rendering

#### 2. RegionSelector Component (Admin)
- Drawing interface for selecting regions
- Visual feedback for drawn regions
- Edit/delete region functionality
- Save region coordinates

#### 3. AnswerOverlay Component (Student)
- Transparent clickable divs positioned over PDF
- Visual feedback on hover and click
- State management for selections
- Prevents multiple selections per question

#### 4. TestConfigForm Component (Admin)
- PDF upload interface
- Question and answer metadata input
- Correct answer designation
- Test settings (time limit, etc.)

#### 5. ResultsDashboard Component
- Score display
- Question-by-question review
- Correct vs incorrect visualization
- Performance metrics

### Backend Services

#### 1. PDF Service
- File upload handling
- PDF storage (filesystem or cloud)
- PDF metadata extraction
- Serve PDF files securely

#### 2. Test Configuration Service
- Store region coordinates
- Manage test metadata
- Associate regions with questions
- Store correct answer mappings

#### 3. Test Session Service
- Create test sessions for students
- Track student progress
- Store student answers
- Calculate scores

#### 4. Results Service
- Retrieve test results
- Generate analytics
- Export functionality
- Historical data access

## Data Models

### Test Configuration
```javascript
{
  id: string,
  pdfUrl: string,
  title: string,
  description: string,
  createdAt: timestamp,
  questions: [
    {
      questionId: string,
      questionNumber: number,
      pageNumber: number,
      correctAnswer: string, // e.g., "A", "B", "C", "D"
      regions: [
        {
          answerId: string, // e.g., "A", "B", "C", "D"
          x: number,        // percentage or pixels
          y: number,
          width: number,
          height: number
        }
      ]
    }
  ]
}
```

### Test Session
```javascript
{
  sessionId: string,
  testId: string,
  studentId: string,
  startTime: timestamp,
  endTime: timestamp,
  answers: [
    {
      questionId: string,
      selectedAnswer: string,
      isCorrect: boolean
    }
  ],
  score: number,
  totalQuestions: number
}
```

## Technology Decisions

### Why PDF.js?
- Industry standard for PDF rendering in browsers
- No server-side PDF processing needed
- Maintains original PDF quality
- Open source and well-maintained

### Why React?
- Component-based architecture fits our UI needs
- Strong ecosystem for state management
- Easy to manage complex UI interactions
- Great developer experience

### Coordinate System
- Use percentage-based coordinates for responsiveness
- Store relative to PDF page dimensions
- Scale coordinates based on current zoom level
- Ensures consistency across different screen sizes

## Security Considerations

1. **PDF Upload**: Validate file type and size
2. **Storage**: Secure PDF storage with access controls
3. **Authentication**: Role-based access (admin vs student)
4. **Data Privacy**: Protect student responses
5. **Input Validation**: Sanitize all user inputs

## Scalability Considerations

1. **Static Asset CDN**: Serve PDFs from CDN
2. **Caching**: Cache rendered PDF pages
3. **Database Indexing**: Index on testId, sessionId
4. **Load Balancing**: For high concurrent users
5. **Pagination**: For large result sets
