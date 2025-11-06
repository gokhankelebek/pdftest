# User Flows

## Admin Flow: Creating a Test

### Flow Diagram
```
Start
  ↓
[Login] (if auth enabled)
  ↓
[Navigate to Admin Panel]
  ↓
[Click "Create New Test"]
  ↓
[Upload PDF File]
  ↓
[PDF Preview Loads]
  ↓
[Enter Test Metadata]
  - Title
  - Description
  ↓
[Configure Questions]
  ├→ [Select Question Number]
  ├→ [Draw Regions for Each Answer]
  │   ├→ Click and drag to draw rectangle
  │   ├→ Label region (A, B, C, D, etc.)
  │   └→ Repeat for all answer choices
  ├→ [Select Correct Answer]
  └→ [Move to Next Question]
  ↓
[Review Configuration]
  ↓
[Save Test]
  ↓
[Get Shareable Test Link]
  ↓
End
```

### Detailed Steps

#### 1. Access Admin Panel
- User navigates to `/admin` or clicks "Create Test" button
- If authentication is enabled, user must log in

#### 2. Create New Test
- Click "New Test" button
- Upload PDF file
  - Drag and drop or click to browse
  - File validation occurs
  - Progress bar shows upload status
- Preview of PDF appears

#### 3. Configure Test Metadata
- Enter test title (required)
- Enter description (optional)
- Set options (time limit, pass score, etc.) - optional for MVP

#### 4. Define Questions and Regions

**For Each Question:**

a. **Select Question**
   - Input question number or auto-increment
   - Specify page number (if multi-page)

b. **Draw Answer Regions**
   - Zoom/pan to question area for precision
   - Enable "Draw Mode"
   - Click and drag to create rectangle around first answer (e.g., A)
   - Label appears - select "A" from dropdown
   - Rectangle turns color-coded (e.g., blue for A)
   - Repeat for B, C, D, etc.
   - Can edit region by clicking on it
   - Can delete region with delete button

c. **Set Correct Answer**
   - Radio buttons or dropdown to select correct answer
   - Correct answer region gets special indicator (e.g., star icon)

d. **Move to Next Question**
   - Click "Next Question" or "Add Question"
   - Previous question configuration is saved
   - Repeat process

#### 5. Review and Save
- Review summary:
  - Total questions configured
  - Each question's correct answer
  - Visual preview of regions
- Click "Save Test"
- Confirmation message
- Test link is generated and displayed
- Option to copy link to clipboard

#### 6. Share Test
- Copy test URL
- Share with students via email, LMS, etc.

---

## Student Flow: Taking a Test

### Flow Diagram
```
Start
  ↓
[Receive Test Link]
  ↓
[Click Link / Navigate to Test]
  ↓
[Landing Page]
  - Test title
  - Description
  - Instructions
  ↓
[Click "Start Test"]
  ↓
[Enter Name] (optional)
  ↓
[Test Session Begins]
  ↓
[View PDF with Questions]
  ↓
For Each Question:
  ├→ [Read Question]
  ├→ [Hover Over Answer Choice]
  │   └→ Visual feedback (highlight)
  ├→ [Click Answer Choice]
  │   └→ Answer selected (checkmark/highlight)
  ├→ [Optional: Change Answer]
  │   └→ Click different choice
  └→ [Move to Next Question]
  ↓
[Review Answers] (optional)
  ↓
[Click "Submit Test"]
  ↓
[Confirmation Dialog]
  - "Are you sure?"
  - List unanswered questions if any
  ↓
[Confirm Submission]
  ↓
[Test is Graded]
  ↓
[View Results]
  - Score
  - Breakdown
  ↓
End
```

### Detailed Steps

#### 1. Access Test
- Student receives test URL from teacher
- Clicks link or pastes in browser
- Lands on test introduction page

#### 2. Test Introduction
- Displays:
  - Test title
  - Description
  - Number of questions
  - Time limit (if applicable)
  - Instructions
- "Start Test" button

#### 3. Start Test
- Student clicks "Start Test"
- Optional: Enter student name or ID
- Test session is created in database
- Timer starts (if applicable)
- PDF loads with first question

#### 4. Answer Questions

**For Each Question:**

a. **Read Question**
   - Student sees original PDF
   - Question is visible on PDF

b. **Interact with Answers**
   - Hover over answer choice area
   - Transparent overlay highlights (subtle color/border)
   - Cursor changes to pointer

c. **Select Answer**
   - Click anywhere on answer choice
   - Visual feedback:
     - Checkmark appears
     - Background color changes
     - Border highlight
   - Only one answer can be selected

d. **Change Answer**
   - Click different answer
   - Previous selection is cleared
   - New selection is highlighted

e. **Navigate**
   - Scroll to next question (same page)
   - Or navigate to next page (if multi-page)

#### 5. Progress Tracking
- Progress bar shows completion
- Question counter (e.g., "5/10 answered")
- Visual indicators for answered questions

#### 6. Submit Test

a. **Initiate Submission**
   - Click "Submit Test" button (sticky/floating button)
   - Available at any time

b. **Confirmation**
   - Dialog appears:
     - "You've answered X of Y questions"
     - "Are you sure you want to submit?"
   - Options: "Go Back" or "Submit"

c. **Final Submit**
   - Loading state
   - Answers sent to server
   - Session marked complete

#### 7. View Results

**Immediate Results Page:**
- Large score display: "8/10 - 80%"
- Pass/Fail indicator (if threshold set)
- Message (e.g., "Great job!")

**Detailed Review:**
- List of all questions
- For each question:
  - Question number
  - Student's answer
  - Correct answer
  - ✓ or ✗ indicator
- Option to view on PDF:
  - Student's selections highlighted in red (wrong) or green (correct)
  - Correct answers shown

#### 8. Post-Test
- Option to print results
- Option to share results (if feature exists)
- Return to home or exit

---

## Admin Flow: Viewing Results

### Flow Diagram
```
Start
  ↓
[Login to Admin Panel]
  ↓
[Navigate to "Results" or "Analytics"]
  ↓
[View List of Tests]
  ↓
[Select a Test]
  ↓
[View Test Analytics]
  - Total sessions
  - Average score
  - Pass rate
  ↓
[View Individual Sessions]
  ↓
[Select a Session]
  ↓
[View Student Results]
  - Student name
  - Score
  - Time taken
  - Question-by-question breakdown
  ↓
[Optional: Export Data]
  ↓
End
```

### Detailed Steps

#### 1. Access Results
- Navigate to "Results" or "Analytics" section
- See list of all created tests

#### 2. Select Test
- Click on a test
- View aggregate statistics:
  - Number of students who took test
  - Average score
  - Highest/lowest score
  - Pass rate

#### 3. View Sessions
- List of all test sessions:
  - Student name
  - Date/time taken
  - Score
  - Status (completed/in progress)
- Sort by score, date, name

#### 4. Individual Session
- Click on a session
- View detailed results:
  - All answers
  - Which were correct/incorrect
  - Visual on PDF

#### 5. Export (Optional)
- Export all results to CSV
- Include fields: student name, score, date, individual answers
- Download file

---

## Edge Cases and Error Flows

### Upload Error Flow
```
[Upload PDF]
  ↓
[Error Occurs]
  ├→ File too large → Show error message
  ├→ Invalid file type → Show error message
  ├→ Network error → Show retry button
  └→ Server error → Show error message
  ↓
[User can retry upload]
```

### Test Taking Error Flow
```
[Taking Test]
  ↓
[Error Occurs]
  ├→ Network disconnected → Save state locally, show offline message
  ├→ Session expired → Show message, allow restart
  ├→ PDF fails to load → Show error, retry button
  └→ Submit fails → Show error, retry submission
  ↓
[Appropriate recovery action]
```

### No Regions Defined Flow
```
[Student clicks on PDF]
  ↓
[No clickable regions]
  ↓
[Show message: "This test is not configured yet"]
  ↓
[Contact administrator]
```

---

## Mobile-Specific Flows

### Mobile Test Taking
- Pinch to zoom for better visibility
- Tap answer choices (larger touch targets)
- Swipe between pages
- Fixed navigation bar
- Optimized button sizes

### Mobile Admin
- Simplified interface
- Touch-friendly region drawing
- May recommend desktop for better experience
