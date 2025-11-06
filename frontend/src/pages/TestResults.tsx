import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../api/client';
import { TestSession, Test } from '../types';
import { CheckCircle, XCircle, Trophy, AlertCircle, Home } from 'lucide-react';

export default function TestResults() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<TestSession | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadResults();
    }
  }, [sessionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await getSession(sessionId!);
      setSession(data);
      // @ts-ignore - Backend returns test data with session
      setTest(data.test);
      setLoading(false);
    } catch (err) {
      console.error('Error loading results:', err);
      setError('Failed to load results');
      setLoading(false);
    }
  };

  const getScorePercentage = (): number => {
    if (!session) return 0;
    return Math.round((session.score! / session.totalQuestions) * 100);
  };

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage: number): string => {
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 70) return 'Good job! 👍';
    if (percentage >= 50) return 'Not bad! 📚';
    return 'Keep practicing! 💪';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !session || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'Results not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const percentage = getScorePercentage();
  const scoreColor = getScoreColor(percentage);
  const message = getScoreMessage(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className="mb-6">
            <Trophy className={`w-20 h-20 mx-auto mb-4 ${scoreColor}`} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Complete!</h1>
            <p className="text-xl text-gray-600">{message}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>
                {session.score} / {session.totalQuestions}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Percentage</p>
              <p className={`text-4xl font-bold ${scoreColor}`}>
                {percentage}%
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Correct Answers</p>
              <p className="text-4xl font-bold text-green-600">
                {session.score}
              </p>
            </div>
          </div>

          {session.studentName && (
            <p className="text-gray-600">
              Student: <span className="font-semibold">{session.studentName}</span>
            </p>
          )}
        </div>

        {/* Test Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h2>
          {test.description && (
            <p className="text-gray-600 mb-4">{test.description}</p>
          )}

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Started:</span>
              <span className="font-medium">
                {new Date(session.startTime).toLocaleString()}
              </span>
            </div>
            {session.endTime && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">
                  {new Date(session.endTime).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Answer Breakdown</h3>
          <div className="space-y-3">
            {session.answers.map((answer, index) => {
              const question = test.questions.find(q => q.id === answer.questionId);
              return (
                <div
                  key={answer.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border-2
                    ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        Question {question?.questionNumber || index + 1}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your answer: <span className="font-semibold">{answer.selectedAnswer}</span>
                        {!answer.isCorrect && question && (
                          <span className="ml-2 text-green-600">
                            (Correct: {question.correctAnswer})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-medium
                    ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  `}>
                    {answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/tests')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Take Another Test
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
