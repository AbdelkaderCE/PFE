// List of all pages for dev navigation
import LoginPage from './LoginPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';
import ThemePreviewPage from './ThemePreviewPage';
import DashboardLayout from '../design-system/components/DashboardLayout';

export const DEV_PAGES = [
  { path: '/', label: 'Dashboard (Shell)', element: <DashboardLayout /> },
  { path: '/teacher-dashboard', label: 'Teacher Dashboard', element: <DashboardLayout><TeacherDashboard /></DashboardLayout> },
  { path: '/student-dashboard', label: 'Student Dashboard', element: <DashboardLayout><StudentDashboard /></DashboardLayout> },
  { path: '/login', label: 'Login', element: <LoginPage /> },
  { path: '/forgot-password', label: 'Forgot Password', element: <ForgotPasswordPage /> },
  { path: '/theme', label: 'Theme Preview', element: <ThemePreviewPage /> },
];
