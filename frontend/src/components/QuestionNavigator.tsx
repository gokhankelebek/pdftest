import { Question } from '../types';
import { CheckCircle2, Circle, Flag, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  answeredQuestions: Set<string>;
  flaggedQuestions: Set<string>;
  onQuestionSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onNextUnanswered: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export default function QuestionNavigator({
  questions,
  currentQuestionIndex,
  answeredQuestions,
  flaggedQuestions,
  onQuestionSelect,
  onPrevious,
  onNext,
  onNextUnanswered,
  canGoPrevious,
  canGoNext
}: QuestionNavigatorProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion && answeredQuestions.has(currentQuestion.id);
  const isFlagged = currentQuestion && flaggedQuestions.has(currentQuestion.id);

  return (
    <div className="space-y-4">
      {/* Current question info */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h3>
          {isFlagged && (
            <Flag className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isAnswered ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Answered</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              <span>Not answered</span>
            </>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300
                   rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                   hover:shadow-md active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600
                   rounded-lg font-medium text-white hover:bg-blue-700
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                   hover:shadow-md active:scale-95"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jump to next unanswered */}
      <button
        onClick={onNextUnanswered}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r
                 from-green-500 to-emerald-600 rounded-lg font-medium text-white
                 hover:from-green-600 hover:to-emerald-700 transition-all duration-200
                 hover:shadow-md active:scale-95"
      >
        <SkipForward className="w-4 h-4" />
        Next Unanswered
      </button>

      {/* Question grid */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">All Questions</h4>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isAnswered = answeredQuestions.has(question.id);
            const isFlagged = flaggedQuestions.has(question.id);
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(index)}
                className={`
                  relative aspect-square rounded-lg font-medium text-sm transition-all duration-200
                  hover:shadow-md active:scale-95
                  ${isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-110'
                    : isAnswered
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                  }
                `}
                aria-label={`Question ${question.questionNumber}`}
              >
                {question.questionNumber}
                {isFlagged && !isCurrent && (
                  <Flag className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 fill-yellow-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-700 mb-2">⌨️ Keyboard Shortcuts</p>
        <p>• <kbd className="px-1 py-0.5 bg-white border rounded">←→</kbd> Navigate questions</p>
        <p>• <kbd className="px-1 py-0.5 bg-white border rounded">A-F</kbd> Select answer</p>
        <p>• <kbd className="px-1 py-0.5 bg-white border rounded">F</kbd> Flag question</p>
        <p>• <kbd className="px-1 py-0.5 bg-white border rounded">N</kbd> Next unanswered</p>
      </div>
    </div>
  );
}
