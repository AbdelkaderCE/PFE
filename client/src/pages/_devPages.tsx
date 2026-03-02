// List of all pages for dev navigation
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ActualitesPage from './ActualitesPage';
import SettingsPage from './SettingsPage';
import ProfilePage from './ProfilePage';
import ThemePreviewPage from './ThemePreviewPage';
import DisciplinaryCasesPage from './DisciplinaryCasesPage';
import RequestsPage from './RequestsPage';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import NotFoundPage from './NotFoundPage';
import DashboardLayout from '../design-system/components/DashboardLayout';

/* ── New pages from merge ── */
import UnauthorizedPage from './UnauthorizedPage';
import ChangePasswordPage from './ChangePasswordPage';
import ComponentShowcasePage from './ComponentShowcasePage';

export const DEV_PAGES = [
  /* ── Public pages ── */
  { path: '/home', label: 'Home', element: <div className="flex-1 overflow-y-auto"><HomePage /></div> },
  { path: '/about', label: 'About', element: <div className="flex-1 overflow-y-auto"><AboutPage /></div> },
  { path: '/contact', label: 'Contact', element: <div className="flex-1 overflow-y-auto"><ContactPage /></div> },

  /* ── Dashboard pages ── */
  { path: '/', label: 'Dashboard (Shell)', element: <DashboardLayout /> },
  { path: '/teacher-dashboard', label: 'Teacher Dashboard', element: <DashboardLayout><TeacherDashboard /></DashboardLayout> },
  { path: '/student-dashboard', label: 'Student Dashboard', element: <DashboardLayout><StudentDashboard /></DashboardLayout> },
  { path: '/actualites', label: 'Actualités', element: <DashboardLayout><ActualitesPage /></DashboardLayout> },
  { path: '/disciplinary', label: 'Disciplinary Cases', element: <DashboardLayout><DisciplinaryCasesPage /></DashboardLayout> },
  { path: '/requests', label: 'Requests & Appeals', element: <DashboardLayout><RequestsPage /></DashboardLayout> },
  { path: '/settings', label: 'Settings', element: <DashboardLayout><SettingsPage /></DashboardLayout> },
  { path: '/profile', label: 'Profile', element: <DashboardLayout><ProfilePage /></DashboardLayout> },

  /* ── Auth pages ── */
  { path: '/login', label: 'Login', element: <div className="flex-1 overflow-y-auto"><LoginPage /></div> },
  { path: '/register', label: 'Register', element: <div className="flex-1 overflow-y-auto"><RegisterPage /></div> },
  { path: '/forgot-password', label: 'Forgot Password', element: <div className="flex-1 overflow-y-auto"><ForgotPasswordPage /></div> },
  { path: '/change-password', label: 'Change Password', element: <div className="flex-1 overflow-y-auto"><ChangePasswordPage /></div> },
  { path: '/unauthorized', label: '403 Unauthorized', element: <div className="flex-1 overflow-y-auto"><UnauthorizedPage /></div> },

  /* ── Dev / Preview ── */
  { path: '/theme', label: 'Theme Preview', element: <div className="flex-1 overflow-y-auto"><ThemePreviewPage /></div> },
  { path: '/components', label: '🧩 Components', element: <div className="flex-1 overflow-y-auto"><ComponentShowcasePage /></div> },
  { path: '/404', label: '404 Page', element: <div className="flex-1 overflow-y-auto"><NotFoundPage /></div> },
];
