import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import TestConfiguration from './pages/TestConfiguration';
import TestsList from './pages/TestsList';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Admin routes - require TEACHER or ADMIN role */}
            <Route
              path="admin"
              element={
                <PrivateRoute requiredRole={['TEACHER', 'ADMIN']}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/test/:testId"
              element={
                <PrivateRoute requiredRole={['TEACHER', 'ADMIN']}>
                  <TestConfiguration />
                </PrivateRoute>
              }
            />

            {/* Student/Public routes - TODO: Add authentication for test taking */}
            <Route path="tests" element={<TestsList />} />
            <Route path="test/:testId" element={<TakeTest />} />
            <Route path="results" element={<Results />} />
            <Route path="results/:sessionId" element={<TestResults />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
