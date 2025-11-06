import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import TestConfiguration from './pages/TestConfiguration';
import TestsList from './pages/TestsList';
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
          <Route path="results" element={<Results />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
