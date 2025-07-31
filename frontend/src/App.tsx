import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage, PortfolioPage, BlogPage, AdminLoginPage, AdminDashboard } from './pages';
import AdminProjects from './pages/AdminProjects';
import AdminSettings from './pages/AdminSettings';
import AdminBlog from './pages/AdminBlog';
import AdminCV from './pages/AdminCV';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Pages publiques avec layout */}
          <Route path="/" element={
            <Layout>
              <HomePage />
            </Layout>
          } />
          <Route path="/portfolio" element={
            <Layout>
              <PortfolioPage />
            </Layout>
          } />
          <Route path="/blog" element={
            <Layout>
              <BlogPage />
            </Layout>
          } />
          
          {/* Page de connexion admin avec layout */}
          <Route path="/admin/login" element={
            <Layout>
              <AdminLoginPage />
            </Layout>
          } />
          
          {/* Routes admin avec layout */}
          <Route path="/admin" element={
            <Layout>
              <AdminDashboard />
            </Layout>
          } />
          <Route path="/admin/projects" element={
            <Layout>
              <AdminProjects />
            </Layout>
          } />
          <Route path="/admin/blog" element={
            <Layout>
              <AdminBlog />
            </Layout>
          } />
          <Route path="/admin/cv" element={
            <Layout>
              <AdminCV />
            </Layout>
          } />
          <Route path="/admin/settings" element={
            <Layout>
              <AdminSettings />
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
