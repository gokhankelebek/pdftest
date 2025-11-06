import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, PlusCircle, BarChart3, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isTeacherOrAdmin = user && (user.role === 'TEACHER' || user.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">
                PDF MCQ Test
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Home</span>
              </Link>

              {/* Show Admin/Create link only for teachers and admins */}
              {isTeacherOrAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/admin')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="font-medium">Create</span>
                </Link>
              )}

              <Link
                to="/tests"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/tests')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Tests</span>
              </Link>

              <Link
                to="/results"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/results')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Results</span>
              </Link>

              {/* Auth-aware buttons */}
              {isAuthenticated ? (
                <>
                  {/* User menu */}
                  <div className="flex items-center gap-2 px-4 py-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {user?.role}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium">Login</span>
                  </Link>

                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-600">
            PDF MCQ Test App - Transform PDFs into interactive tests
          </p>
        </div>
      </footer>
    </div>
  );
}
