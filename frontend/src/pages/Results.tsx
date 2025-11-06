import { BarChart3 } from 'lucide-react';

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Results & Analytics
          </h1>
          <p className="text-gray-600">
            View performance metrics and detailed results
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Results Yet
          </h3>
          <p className="text-gray-600">
            Results will appear here after students complete tests
          </p>
        </div>
      </div>
    </div>
  );
}
