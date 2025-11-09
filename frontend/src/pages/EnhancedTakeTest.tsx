import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import PDFControls from '../components/PDFControls';
import EnhancedClickableRegion from '../components/EnhancedClickableRegion';
import QuestionNavigator from '../components/QuestionNavigator';
import ReviewMode from '../components/ReviewMode';
import { getTest, createSession, submitSession } from '../api/client';
import { Test, Question, Region } from '../types';
import { AlertCircle, Flag, Eye, Sparkles } from 'lucide-react';
import { useAutoSave, loadFromLocalStorage, clearFromLocalStorage } from '../hooks/useAutoSave';

export default function EnhancedTakeTest() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // PDF state
  const [numPages, setNumPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Question navigation state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answer tracking
  const [selectedAnswers, setSelectedAnswers] = useState<Map<string, string>>(new Map());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [studentName, setStudentName] = useState('');
  const [started, setStarted] = useState(false);

  // Review mode
  const [showReviewMode, setShowReviewMode] = useState(false);

  // Refs
  const hasUnsavedChanges = useRef(false);

  // Auto-save key
  const autoSaveKey = `test_session_${testId}`;

  // Load test
  useEffect(() => {
    if (testId) {
      loadTest();
    }
  }, [testId]);

  // Load saved session
  useEffect(() => {
    if (testId && started) {
      const saved = loadFromLocalStorage<{
        answers: [string, string][];
        flagged: string[];
        questionIndex: number;
        sessionId: string;
      } | null>(autoSaveKey, null);

      if (saved) {
        setSelectedAnswers(new Map(saved.answers));
        setFlaggedQuestions(new Set(saved.flagged));
        setCurrentQuestionIndex(saved.questionIndex);
        if (saved.sessionId) {
          setSessionId(saved.sessionId);
        }
        console.log('Restored from auto-save');
      }
    }
  }, [testId, started]);

  // Auto-save
  useAutoSave({
    key: autoSaveKey,
    data: {
      answers: Array.from(selectedAnswers.entries()),
      flagged: Array.from(flaggedQuestions),
      questionIndex: currentQuestionIndex,
      sessionId
    },
    enabled: started && !submitting,
    delay: 2000
  });

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (started && !submitting && selectedAnswers.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [started, submitting, selectedAnswers.size]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!started || !test || showReviewMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentQuestion = test.questions[currentQuestionIndex];
      if (!currentQuestion) return;

      // Navigation shortcuts
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNextUnanswered();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFlag(currentQuestion.id);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setShowReviewMode(true);
      }

      // Answer selection shortcuts (A-F or 1-6)
      const answerKeys: { [key: string]: string } = {
        'a': 'A', '1': 'A',
        'b': 'B', '2': 'B',
        'c': 'C', '3': 'C',
        'd': 'D', '4': 'D',
        'e': 'E', '5': 'E',
        'f': 'F', '6': 'F'
      };

      const answerId = answerKeys[e.key.toLowerCase()];
      if (answerId) {
        e.preventDefault();
        const region = currentQuestion.regions.find(r => r.answerId === answerId);
        if (region) {
          handleRegionSelect(currentQuestion.id, answerId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, test, currentQuestionIndex, showReviewMode]);

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

  const handleRegionSelect = useCallback((questionId: string, answerId: string) => {
    setSelectedAnswers(prev => {
      const newMap = new Map(prev);
      if (newMap.get(questionId) === answerId) {
        newMap.delete(questionId);
      } else {
        newMap.set(questionId, answerId);
      }
      hasUnsavedChanges.current = true;
      return newMap;
    });
  }, []);

  const toggleFlag = useCallback((questionId: string) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (test && currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [test, currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleNextUnanswered = useCallback(() => {
    if (!test) return;

    const nextUnanswered = test.questions.findIndex(
      (q, idx) => idx > currentQuestionIndex && !selectedAnswers.has(q.id)
    );

    if (nextUnanswered !== -1) {
      setCurrentQuestionIndex(nextUnanswered);
    } else {
      // Wrap around to find first unanswered
      const firstUnanswered = test.questions.findIndex(q => !selectedAnswers.has(q.id));
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      } else {
        alert('All questions answered!');
      }
    }
  }, [test, currentQuestionIndex, selectedAnswers]);

  const handleQuestionSelect = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const handleSubmitTest = async () => {
    if (!sessionId || !test) return;

    try {
      setSubmitting(true);

      const answers = Array.from(selectedAnswers.entries()).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      await submitSession(sessionId, answers);

      // Clear auto-save
      clearFromLocalStorage(autoSaveKey);
      hasUnsavedChanges.current = false;

      navigate(`/results/${sessionId}`);
    } catch (err) {
      console.error('Error submitting test:', err);
      alert('Failed to submit test. Please try again.');
      setSubmitting(false);
    }
  };

  const handleReviewQuestionClick = (questionId: string) => {
    const index = test?.questions.findIndex(q => q.id === questionId);
    if (index !== undefined && index !== -1) {
      setCurrentQuestionIndex(index);
      setShowReviewMode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Test</h2>
          <p className="text-gray-600 mb-6">{error || 'Test not found'}</p>
          <button
            onClick={() => navigate('/tests')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                     transition-colors font-medium"
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full animate-scale-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{test.title}</h1>
              {test.description && (
                <p className="text-gray-600 mt-1">{test.description}</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Test Information
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span><strong>{test.questions.length}</strong> questions total</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Click on answer choices directly on the PDF</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Use keyboard shortcuts for faster navigation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Your progress is auto-saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Review all answers before final submission</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition-all duration-200"
              placeholder="Enter your name"
            />
          </div>

          <button
            onClick={handleStartTest}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6
                     rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700
                     transition-all duration-200 hover:shadow-lg active:scale-98
                     flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6" />
            Start Test
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const currentPage = currentQuestion?.pageNumber || 1;
  const progress = {
    answered: selectedAnswers.size,
    total: test.questions.length,
    percentage: (selectedAnswers.size / test.questions.length) * 100
  };
  const answeredQuestions = new Set(selectedAnswers.keys());

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Question {currentQuestionIndex + 1} of {test.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    hover:shadow-md active:scale-95 flex items-center gap-2
                    ${flaggedQuestions.has(currentQuestion.id)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  title="Flag this question (F)"
                >
                  <Flag className="w-4 h-4" />
                  Flag
                </button>
                <button
                  onClick={() => setShowReviewMode(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium
                           hover:bg-indigo-700 transition-all duration-200 hover:shadow-md
                           active:scale-95 flex items-center gap-2"
                  title="Review all answers (R)"
                >
                  <Eye className="w-4 h-4" />
                  Review
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">
                  Progress: {progress.answered} of {progress.total} answered
                </span>
                <span className="font-bold text-blue-600">
                  {Math.round(progress.percentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full
                           transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* PDF Viewer */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 animate-slide-up">
              <PDFControls
                currentPage={currentPage}
                totalPages={numPages}
                zoom={zoom}
                onPageChange={() => {}} // Controlled by question navigation
                onZoomChange={setZoom}
              />

              <div className="mt-6 flex justify-center">
                <div className="relative inline-block">
                  <PDFViewer
                    fileUrl={test.pdfUrl}
                    pageNumber={currentPage}
                    zoom={zoom}
                    onDocumentLoadSuccess={(pages) => setNumPages(pages)}
                  >
                    {currentQuestion.regions.map(region => {
                      const isSelected = selectedAnswers.get(currentQuestion.id) === region.answerId;
                      return (
                        <EnhancedClickableRegion
                          key={region.id}
                          region={region}
                          width={800 * zoom}
                          height={1000 * zoom}
                          isSelected={isSelected}
                          onSelect={() => handleRegionSelect(currentQuestion.id, region.answerId)}
                          showLabel={true}
                        />
                      );
                    })}
                  </PDFViewer>
                </div>
              </div>
            </div>

            {/* Question Navigator Sidebar */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <QuestionNavigator
                questions={test.questions}
                currentQuestionIndex={currentQuestionIndex}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                onQuestionSelect={handleQuestionSelect}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onNextUnanswered={handleNextUnanswered}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={currentQuestionIndex < test.questions.length - 1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Review Mode Modal */}
      {showReviewMode && (
        <ReviewMode
          test={test}
          selectedAnswers={selectedAnswers}
          flaggedQuestions={flaggedQuestions}
          onBack={() => setShowReviewMode(false)}
          onSubmit={handleSubmitTest}
          onQuestionClick={handleReviewQuestionClick}
        />
      )}
    </>
  );
}
