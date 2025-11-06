import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import PDFControls from '../components/PDFControls';
import ClickableRegion from '../components/ClickableRegion';
import { getTest, createSession, submitSession } from '../api/client';
import type { Test, Question, Region, SelectedAnswer } from '../types';
import { CheckCircle, Circle, Send, AlertCircle } from 'lucide-react';

export default function TakeTest() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // PDF state
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const pdfDimensionsRef = useRef({ width: 0, height: 0 });

  // Answer tracking
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(new Map());
  const [studentName, setStudentName] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (testId) {
      loadTest();
    }
  }, [testId]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const data = await getTest(testId!);
      setTest(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading test:', err);
      setError('Failed to load test');
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (!test) return;

    try {
      const session = await createSession({
        testId: test.id,
        studentName: studentName || undefined
      });
      setSessionId(session.id);
      setStarted(true);
    } catch (err) {
      console.error('Error creating session:', err);
      alert('Failed to start test. Please try again.');
    }
  };

  const handleRegionSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => {
      const newMap = new Map(prev);
      // If clicking the same answer, deselect it
      if (newMap.get(questionId) === answerId) {
        newMap.delete(questionId);
      } else {
        newMap.set(questionId, answerId);
      }
      return newMap;
    });
  };

  const handleSubmitTest = async () => {
    if (!sessionId || !test) return;

    // Check if all questions are answered
    const unansweredCount = test.questions.length - selectedAnswers.size;
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Submit anyway?`
      );
      if (!confirmed) return;
    }

    try {
      setSubmitting(true);

      // Format answers for submission
      const answers = Array.from(selectedAnswers.entries()).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const result = await submitSession(sessionId, answers);

      // Navigate to results page
      navigate(`/results/${sessionId}`);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  };

  const getQuestionsForPage = (page: number): Question[] => {
    if (!test) return [];
    return test.questions.filter(q => q.pageNumber === page);
  };

  const isQuestionAnswered = (questionId: string): boolean => {
    return selectedAnswers.has(questionId);
  };

  const getProgress = (): { answered: number; total: number; percentage: number } => {
    const total = test?.questions.length || 0;
    const answered = selectedAnswers.size;
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    return { answered, total, percentage };
  };

  // Memoize the callback to prevent infinite loops
  const handlePageDimensionsChange = useCallback((width: number, height: number) => {
    // Only update if dimensions actually changed
    if (
      pdfDimensionsRef.current.width !== width ||
      pdfDimensionsRef.current.height !== height
    ) {
      pdfDimensionsRef.current = { width, height };
      setPdfDimensions({ width, height });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Test not found'}</p>
          <button
            onClick={() => navigate('/tests')}
            className="text-blue-600 hover:underline"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full mx-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
          {test.description && (
            <p className="text-gray-600 mb-6">{test.description}</p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Test Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Total Questions: {test.questions.length}</li>
              <li>• Click on your answer choice directly on the PDF</li>
              <li>• You can change your answers before submitting</li>
              <li>• Your score will be shown immediately after submission</li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <button
            onClick={handleStartTest}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  const progress = getProgress();
  const currentPageQuestions = getQuestionsForPage(currentPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600">Click on your answer choices</p>
            </div>
            <button
              onClick={handleSubmitTest}
              disabled={submitting || selectedAnswers.size === 0}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress: {progress.answered} of {progress.total} answered</span>
              <span>{Math.round(progress.percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* PDF Viewer */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
            <PDFControls
              currentPage={currentPage}
              totalPages={numPages}
              zoom={zoom}
              onPageChange={setCurrentPage}
              onZoomChange={setZoom}
            />

            <div className="mt-6 flex justify-center">
              <div className="relative inline-block">
                <PDFViewer
                  fileUrl={test.pdfUrl}
                  pageNumber={currentPage}
                  zoom={zoom}
                  onDocumentLoadSuccess={(pages) => setNumPages(pages)}
                  onPageDimensionsChange={handlePageDimensionsChange}
                >
                  {/* Render clickable regions for current page questions */}
                  {pdfDimensions.width > 0 && pdfDimensions.height > 0 && currentPageQuestions.map(question =>
                    question.regions.map(region => {
                      const isSelected = selectedAnswers.get(question.id) === region.answerId;
                      return (
                        <ClickableRegion
                          key={region.id}
                          region={region}
                          width={pdfDimensions.width}
                          height={pdfDimensions.height}
                          isSelected={isSelected}
                          onSelect={() => handleRegionSelect(question.id, region.answerId)}
                        />
                      );
                    })
                  )}
                </PDFViewer>
              </div>
            </div>
          </div>

          {/* Question list sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Questions</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {test.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                    ${isQuestionAnswered(question.id) ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}
                    hover:bg-blue-50
                  `}
                  onClick={() => setCurrentPage(question.pageNumber)}
                >
                  {isQuestionAnswered(question.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Question {question.questionNumber}
                    </p>
                    {isQuestionAnswered(question.id) && (
                      <p className="text-xs text-green-600">
                        Answer: {selectedAnswers.get(question.id)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    Page {question.pageNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
