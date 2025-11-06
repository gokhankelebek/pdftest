# PDF Multiple Choice Test App - Project Overview

## Vision
Create an interactive web application that transforms static PDF documents containing multiple choice questions into clickable online tests, without requiring PDF digitization or text extraction.

## Core Concept
Users can take tests by clicking directly on answer choices overlaid on the original PDF document. The app maintains the visual fidelity of the original PDF while adding interactive functionality.

## User Roles

### 1. Admin/Teacher
- Uploads PDF documents containing multiple choice questions
- Defines clickable regions for each answer choice
- Sets correct answers for each question
- Reviews student results and analytics

### 2. Student/Test-Taker
- Views the original PDF document
- Clicks on answer choices directly on the PDF
- Sees visual feedback for selected answers
- Submits test and views results

## Key Features

### Must-Have (MVP)
- PDF upload and rendering
- Visual region selection tool for admins
- Clickable overlay system for students
- Answer selection and deselection
- Basic scoring system
- Results display

### Nice-to-Have (Future)
- Multiple test sessions
- Time limits
- Question randomization
- Detailed analytics
- Export results to CSV
- Multi-page PDF support
- Mobile responsive design

## Technical Approach
The app will use a coordinate-based system where:
1. Admins define rectangular regions on the PDF for each answer choice
2. These regions are stored as coordinates (x, y, width, height) relative to the PDF page
3. Students see transparent overlays at these coordinates
4. Clicks within these regions register as answer selections
5. Visual feedback (highlighting, checkmarks) appears on selection

## Success Criteria
- Users can easily click on any part of an answer choice to select it
- Original PDF quality and formatting is preserved
- Intuitive interface requiring minimal training
- Fast loading and responsive interaction
- Works across modern browsers

## Timeline Estimate
- Phase 1 (Core PDF Viewer): 2-3 days
- Phase 2 (Admin Region Definition): 3-4 days
- Phase 3 (Student Test Interface): 2-3 days
- Phase 4 (Scoring & Results): 1-2 days
- Phase 5 (Polish & Testing): 2-3 days

**Total: ~10-15 days for MVP**
