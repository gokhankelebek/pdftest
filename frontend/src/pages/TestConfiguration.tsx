import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';
import PDFControls from '../components/PDFControls';
import RegionDrawer from '../components/RegionDrawer';
import RegionOverlay from '../components/RegionOverlay';
import { getTest, createQuestion, createRegion, deleteRegion } from '../api/client';
import type { Test, Question, Region as RegionType } from '../types';
import { Save, Plus, Trash2, Check } from 'lucide-react';

const ANSWER_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function TestConfiguration() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PDF state
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

  // Question state
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>('A');
  const [currentAnswerId, setCurrentAnswerId] = useState<string>('A');

  // Region state
  const [drawingMode, setDrawingMode] = useState(false);
  const [regions, setRegions] = useState<RegionType[]>([]);

  // Get next available answer option
  const getNextAnswerId = (): string => {
    const usedAnswers = new Set(regions.map(r => r.answerId));
    const nextAnswer = ANSWER_OPTIONS.find(opt => !usedAnswers.has(opt));
    return nextAnswer || ANSWER_OPTIONS[regions.length % ANSWER_OPTIONS.length];
  };

  // Load test
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

      // Load existing questions and regions
      if (data.questions && data.questions.length > 0) {
        const question = data.questions[0];
        const loadedRegions = question.regions || [];
        setCurrentQuestion(question);
        setCurrentQuestionNumber(question.questionNumber);
        setCorrectAnswer(question.correctAnswer);
        setRegions(loadedRegions);
        
        // Set currentAnswerId to next available answer based on loaded regions
        const usedAnswers = new Set(loadedRegions.map(r => r.answerId));
        const nextAnswer = ANSWER_OPTIONS.find(opt => !usedAnswers.has(opt)) || 'A';
        setCurrentAnswerId(nextAnswer);
      } else {
        // No existing questions, reset to A
        setCurrentAnswerId('A');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading test:', err);
      setError('Failed to load test');
      setLoading(false);
    }
  };

  const handleDocumentLoad = (pages: number) => {
    setNumPages(pages);
  };

  const handleRegionComplete = async (rect: any) => {
    // Always use getNextAnswerId() to ensure we get the correct next answer
    // currentAnswerId should already be set to the next available answer
    const answerIdToUse = getNextAnswerId();
    
    console.log('Creating region:', {
      answerIdToUse,
      currentAnswerId,
      usedAnswers: Array.from(new Set(regions.map(r => r.answerId))),
      regionsCount: regions.length
    });
    
    if (!currentQuestion) {
      // Create question first if it doesn't exist
      try {
        const question = await createQuestion(testId!, {
          questionNumber: currentQuestionNumber,
          pageNumber: currentPage,
          correctAnswer
        });
        setCurrentQuestion(question);

        // Create region with assigned answer
        const region = await createRegion(question.id, {
          answerId: answerIdToUse,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        });

        const updatedRegions = [...regions, region];
        setRegions(updatedRegions);
        
        // Calculate next answer based on updated regions
        const usedAnswersAfter = new Set(updatedRegions.map(r => r.answerId));
        const nextAnswer = ANSWER_OPTIONS.find(opt => !usedAnswersAfter.has(opt)) || ANSWER_OPTIONS[updatedRegions.length % ANSWER_OPTIONS.length];
        console.log('Next answer will be:', nextAnswer, 'Used answers:', Array.from(usedAnswersAfter));
        setCurrentAnswerId(nextAnswer);
      } catch (err) {
        console.error('Error creating question/region:', err);
        alert('Failed to create region');
      }
    } else {
      // Create region for existing question
      try {
        const region = await createRegion(currentQuestion.id, {
          answerId: answerIdToUse,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        });

        const updatedRegions = [...regions, region];
        setRegions(updatedRegions);
        
        // Calculate next answer based on updated regions
        const usedAnswersAfter = new Set(updatedRegions.map(r => r.answerId));
        const nextAnswer = ANSWER_OPTIONS.find(opt => !usedAnswersAfter.has(opt)) || ANSWER_OPTIONS[updatedRegions.length % ANSWER_OPTIONS.length];
        console.log('Next answer will be:', nextAnswer, 'Used answers:', Array.from(usedAnswersAfter));
        setCurrentAnswerId(nextAnswer);
      } catch (err) {
        console.error('Error creating region:', err);
        alert('Failed to create region');
      }
    }
  };

  const handleDeleteRegion = async (regionId: string) => {
    try {
      await deleteRegion(regionId);
      const updatedRegions = regions.filter(r => r.id !== regionId);
      setRegions(updatedRegions);
      // Recalculate next answer after deletion based on updated regions
      const usedAnswers = new Set(updatedRegions.map(r => r.answerId));
      const nextAnswer = ANSWER_OPTIONS.find(opt => !usedAnswers.has(opt)) || ANSWER_OPTIONS[updatedRegions.length % ANSWER_OPTIONS.length];
      setCurrentAnswerId(nextAnswer);
    } catch (err) {
      console.error('Error deleting region:', err);
      alert('Failed to delete region');
    }
  };

  const handleSaveQuestion = async () => {
    if (!currentQuestion) {
      try {
        const question = await createQuestion(testId!, {
          questionNumber: currentQuestionNumber,
          pageNumber: currentPage,
          correctAnswer
        });
        setCurrentQuestion(question);
        alert('Question saved successfully!');
      } catch (err) {
        console.error('Error saving question:', err);
        alert('Failed to save question');
      }
    } else {
      alert('Question already saved!');
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionNumber(currentQuestionNumber + 1);
    setCurrentQuestion(null);
    setRegions([]);
    setCorrectAnswer('A');
    setCurrentAnswerId('A');
  };

  // Reset to first available answer when entering drawing mode
  const handleToggleDrawingMode = () => {
    const newDrawingMode = !drawingMode;
    setDrawingMode(newDrawingMode);
    if (newDrawingMode) {
      // Set to next available answer when entering drawing mode
      setCurrentAnswerId(getNextAnswerId());
    }
  };

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
          <p className="text-red-600 mb-4">{error || 'Test not found'}</p>
          <button
            onClick={() => navigate('/admin')}
            className="text-blue-600 hover:underline"
          >
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h1>
          <p className="text-gray-600">Configure questions and clickable regions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* PDF Viewer Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <PDFControls
              currentPage={currentPage}
              totalPages={numPages}
              zoom={zoom}
              onPageChange={setCurrentPage}
              onZoomChange={setZoom}
            />

            <div className="mt-6 flex justify-center relative">
              <div className="relative inline-block">
                <PDFViewer
                  fileUrl={test.pdfUrl}
                  pageNumber={currentPage}
                  zoom={zoom}
                  onDocumentLoadSuccess={handleDocumentLoad}
                  onPageDimensionsChange={(width, height) => {
                    setPdfDimensions({ width, height });
                  }}
                >
                  {drawingMode && pdfDimensions.width > 0 && pdfDimensions.height > 0 ? (
                    <RegionDrawer
                      width={pdfDimensions.width}
                      height={pdfDimensions.height}
                      onRegionComplete={handleRegionComplete}
                      existingRegions={regions}
                      enabled={drawingMode}
                      currentAnswerId={currentAnswerId}
                    />
                  ) : drawingMode ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none z-10">
                      <div className="bg-white px-6 py-3 rounded-lg">
                        <p className="text-gray-700">Loading PDF dimensions...</p>
                      </div>
                    </div>
                  ) : null}
                  {!drawingMode && pdfDimensions.width > 0 && pdfDimensions.height > 0 && (
                    <RegionOverlay
                      regions={regions}
                      width={pdfDimensions.width}
                      height={pdfDimensions.height}
                      interactive={true}
                      onRegionDelete={handleDeleteRegion}
                    />
                  )}
                </PDFViewer>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Question {currentQuestionNumber}</h2>

            {/* Question Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Number
              </label>
              <input
                type="number"
                value={currentQuestionNumber}
                onChange={(e) => setCurrentQuestionNumber(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min={1}
              />
            </div>

            {/* Correct Answer */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {ANSWER_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Drawing Controls */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Drawing Mode
              </label>
              <button
                onClick={handleToggleDrawingMode}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  drawingMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {drawingMode ? 'Exit Drawing Mode' : 'Enter Drawing Mode'}
              </button>
            </div>

            {/* Next Answer Indicator */}
            {drawingMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Next region will be assigned to:</strong>
                </p>
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">{getNextAnswerId()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Draw regions one after another (A → B → C → D...)
                </p>
              </div>
            )}

            {/* Answer Selection (Optional Override) */}
            {drawingMode && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manual Override (Optional)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ANSWER_OPTIONS.map(option => {
                    const isUsed = regions.some(r => r.answerId === option);
                    return (
                      <button
                        key={option}
                        onClick={() => setCurrentAnswerId(option)}
                        className={`px-3 py-2 rounded font-medium transition-colors text-sm ${
                          currentAnswerId === option
                            ? 'bg-blue-600 text-white'
                            : isUsed
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title={isUsed ? `Already assigned (${option})` : `Assign to ${option}`}
                      >
                        {option}
                        {isUsed && <span className="ml-1">✓</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Regions are auto-assigned sequentially. Use this to override if needed.
                </p>
              </div>
            )}

            {/* Region List */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Regions ({regions.length})
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {regions.map(region => (
                  <div
                    key={region.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">Answer {region.answerId}</span>
                    <button
                      onClick={() => handleDeleteRegion(region.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleSaveQuestion}
                disabled={!!currentQuestion}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {currentQuestion ? 'Question Saved' : 'Save Question'}
              </button>

              <button
                onClick={handleNextQuestion}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Next Question
              </button>

              <button
                onClick={() => navigate('/admin')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700"
              >
                Finish Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
