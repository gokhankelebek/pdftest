import { FileText, Calendar, ArrowRight } from 'lucide-react';

export default function TestsList() {
  // Mock data for now
  const tests = [
    {
      id: '1',
      title: 'Sample Math Test',
      description: 'Basic algebra and geometry questions',
      createdAt: '2024-01-15',
      questionCount: 10
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Tests
          </h1>
          <p className="text-gray-600">
            Select a test to begin
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {test.title}
              </h3>

              {test.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {test.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  {test.questionCount} questions
                </div>
              </div>
            </div>
          ))}

          {tests.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tests available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
