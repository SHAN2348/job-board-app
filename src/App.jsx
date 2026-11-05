import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import JobListingPage from './pages/JobListingPage/JobListingPage';
import JobDetailsPage from './pages/JobDetailsPage/JobDetailsPage';
import AdminPage from './pages/AdminPage/AdminPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MyApplicationsPage from './pages/MyApplicationsPage/MyApplicationsPage';
import ManageApplicationsPage from './pages/ManageApplicationsPage/ManageApplicationsPage';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['job_seeker']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />
          <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                    path="/admin/applications"
                    element={
                      <ProtectedRoute allowedRoles={['recruiter']}>
                        <ManageApplicationsPage />
                      </ProtectedRoute>
                    }
                  />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;