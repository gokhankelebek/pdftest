import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import TestConfiguration from './pages/TestConfiguration';
import TestsList from './pages/TestsList';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="admin/test/:testId" element={<TestConfiguration />} />
          <Route path="tests" element={<TestsList />} />
          <Route path="test/:testId" element={<TakeTest />} />
          <Route path="results" element={<Results />} />
          <Route path="results/:sessionId" element={<TestResults />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
