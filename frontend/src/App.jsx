import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

/* ── Public (guest-accessible) pages ── */
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ActualitesPage from './pages/ActualitesPage';
import RequestsPage from './pages/RequestsPage';
import PublicLayout from './components/public/PublicLayout';

/* ── Auth pages ── */
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

/* ── Protected (requires login) ── */
import DashboardLayout from './layouts/DashboardLayout';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import DisciplinaryCasesPage from './pages/DisciplinaryCasesPage';
import CalendarPage from './pages/CalendarPage';

/* ── Module pages ── */
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UsersManagementPage from './pages/UsersManagementPage';
import RolesPermissionsPage from './pages/RolesPermissionsPage';
import PFEProjectsPage from './pages/PFEProjectsPage';
import AffectationPage from './pages/AffectationPage';
import DocumentsPage from './pages/DocumentsPage';
import AnnonceManagementPage from './pages/AnnonceManagementPage';

/* ── Misc ── */
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import AIChatbot from './components/ai/AIChatbot';

function App() {
  const { i18n } = useTranslation();

  /* Keep document dir & lang in sync with the active language */
  useEffect(() => {
    const lang = i18n.language?.substring(0, 2) || 'fr';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-full">
            <Routes>
              {/* ── Public / Guest routes (PublicLayout: navbar + footer, no sidebar) ── */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/actualites" element={<PublicLayout contained><ActualitesPage role="guest" /></PublicLayout>} />
              <Route path="/requests" element={<PublicLayout contained><RequestsPage role="guest" /></PublicLayout>} />

              {/* ── Auth routes (standalone — no sidebar, no navbar) ── */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />

              {/* ── Protected routes (DashboardLayout: sidebar + topbar) ── */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/disciplinary" element={<ProtectedRoute><DashboardLayout><DisciplinaryCasesPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/actualites" element={<ProtectedRoute><DashboardLayout><ActualitesPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/calendar" element={<ProtectedRoute><DashboardLayout><CalendarPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/requests" element={<ProtectedRoute><DashboardLayout><RequestsPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── Admin / SuperAdmin routes ── */}
              <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardLayout><SuperAdminDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/users" element={<ProtectedRoute><DashboardLayout><UsersManagementPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/roles" element={<ProtectedRoute><DashboardLayout><RolesPermissionsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/announcements" element={<ProtectedRoute><DashboardLayout><AnnonceManagementPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── Module routes ── */}
              <Route path="/dashboard/projects" element={<ProtectedRoute><DashboardLayout><PFEProjectsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/affectation" element={<ProtectedRoute><DashboardLayout><AffectationPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/documents" element={<ProtectedRoute><DashboardLayout><DocumentsPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── Error pages ── */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <AIChatbot />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
