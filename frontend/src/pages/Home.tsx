import { Link } from 'react-router-dom';
import { FileText, PlusCircle, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PDF MCQ Test App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your PDF multiple choice questions into interactive online tests.
            No digitization required - just click and select!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Admin Panel */}
          <Link
            to="/admin"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <PlusCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Create Test
              </h2>
              <p className="text-gray-600">
                Upload PDFs, define clickable regions, and configure your tests
              </p>
            </div>
          </Link>

          {/* Take Test */}
          <Link
            to="/tests"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Take Test
              </h2>
              <p className="text-gray-600">
                Browse available tests and start answering questions
              </p>
            </div>
          </Link>

          {/* Results */}
          <Link
            to="/results"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                View Results
              </h2>
              <p className="text-gray-600">
                Check scores, analytics, and detailed performance metrics
              </p>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Upload PDF
                </h4>
                <p className="text-gray-600 text-sm">
                  Upload any PDF containing multiple choice questions
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Define Regions
                </h4>
                <p className="text-gray-600 text-sm">
                  Draw clickable areas around each answer choice
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Set Correct Answers
                </h4>
                <p className="text-gray-600 text-sm">
                  Mark which answer is correct for each question
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Share & Test
                </h4>
                <p className="text-gray-600 text-sm">
                  Share the test link and students can start clicking!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
