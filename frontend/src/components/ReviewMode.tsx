import { Test, Question } from '../types';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';

interface ReviewModeProps {
  test: Test;
  selectedAnswers: Map<string, string>;
  flaggedQuestions: Set<string>;
  onBack: () => void;
  onSubmit: () => void;
  onQuestionClick: (questionId: string) => void;
}

export default function ReviewMode({
  test,
  selectedAnswers,
  flaggedQuestions,
  onBack,
  onSubmit,
  onQuestionClick
}: ReviewModeProps) {
  const answeredCount = selectedAnswers.size;
  const totalCount = test.questions.length;
  const unansweredCount = totalCount - answeredCount;
  const flaggedCount = flaggedQuestions.size;

  const getQuestionStatus = (question: Question) => {
    const isAnswered = selectedAnswers.has(question.id);
    const isFlagged = flaggedQuestions.has(question.id);
    return { isAnswered, isFlagged };
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">Review Your Answers</h2>
          <p className="text-blue-100">
            Please review your answers before submitting the test
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{answeredCount}</p>
                <p className="text-sm text-gray-600">Answered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{unansweredCount}</p>
                <p className="text-sm text-gray-600">Unanswered</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{flaggedCount}</p>
                <p className="text-sm text-gray-600">Flagged</p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions list */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {test.questions.map((question) => {
              const { isAnswered, isFlagged } = getQuestionStatus(question);
              const selectedAnswer = selectedAnswers.get(question.id);

              return (
                <div
                  key={question.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    hover:shadow-md active:scale-98
                    ${isAnswered
                      ? 'bg-green-50 border-green-300 hover:bg-green-100'
                      : 'bg-red-50 border-red-300 hover:bg-red-100'
                    }
                  `}
                  onClick={() => onQuestionClick(question.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${isAnswered ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                      `}>
                        {question.questionNumber}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Question {question.questionNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          Page {question.pageNumber}
                          {isFlagged && (
                            <span className="ml-2 inline-flex items-center gap-1 text-yellow-700">
                              <AlertCircle className="w-3 h-3" />
                              Flagged
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isAnswered ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Answer:</span>
                          <span className="px-3 py-1 bg-white rounded-full font-bold text-green-700 border-2 border-green-300">
                            {selectedAnswer}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-red-600">
                          No answer selected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning if unanswered */}
        {unansweredCount > 0 && (
          <div className="p-4 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-900">
                  You have {unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  You can still submit, but unanswered questions will be marked as incorrect.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300
                     rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400
                     transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Test
          </button>

          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700
                     rounded-lg font-bold text-white hover:from-green-700 hover:to-emerald-800
                     transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            <Send className="w-5 h-5" />
            Submit Test ({answeredCount}/{totalCount} answered)
          </button>
        </div>
      </div>
    </div>
  );
}
