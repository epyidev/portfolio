import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';

// Pages publiques
import HomePage from './pages/HomePage';
import PortfolioPage from './pages/PortfolioPage';
import BlogPage from './pages/BlogPage';

// Pages admin
import AdminLoginPage from './pages/admin/AdminLoginPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes avec layout principal */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
          <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
          
          {/* Route admin sans layout principal */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
