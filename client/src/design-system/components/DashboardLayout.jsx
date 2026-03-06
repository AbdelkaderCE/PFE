/*
  Intent: University staff/students navigating academic modules.
          Shell stays fixed — sidebar + topbar frame the workspace.
          Content scrolls independently. Feels like a well-organized office.
  Palette: canvas bg throughout — sidebar is NOT a different world.
  Depth: border-edge separates sidebar/topbar from content. No heavy shadows on shell.
  Surfaces: canvas (base) for shell, surface (white) for content cards within.
  Typography: Inter. Subheading in topbar, labels in sidebar.
  Spacing: 4px base.
*/

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './navigation/Sidebar';
import Topbar from './navigation/Topbar';
import TeacherDashboard from '../../pages/TeacherDashboard';
import StudentDashboard from '../../pages/StudentDashboard';
import { useAuth } from '../../contexts/AuthContext';

/* ── 11 Modules ─────────────────────────────────────────────── */
const ALL_MODULES = [
  { name: 'Dashboard',     path: '/dashboard',                roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'SPECIALITE_CHEF', 'DEPARTEMENT_CHEF', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Actualités',    path: '/dashboard/actualites',     roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'SPECIALITE_CHEF', 'DEPARTEMENT_CHEF', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Projects',      path: '/dashboard/projects',       roles: ['STUDENT', 'DELEGATE', 'TEACHER'] },
  { name: 'Grades',        path: '/dashboard/grades',         roles: ['STUDENT', 'DELEGATE', 'TEACHER'] },
  { name: 'AI Assistant',  path: '/dashboard/ai',             roles: ['STUDENT', 'DELEGATE', 'TEACHER'] },
  { name: 'Documents',     path: '/dashboard/documents',      roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Calendar',      path: '/dashboard/calendar',       roles: ['STUDENT', 'DELEGATE', 'TEACHER'] },
  { name: 'Attendance',    path: '/dashboard/attendance',     roles: ['TEACHER', 'SPECIALITE_CHEF', 'DEPARTEMENT_CHEF'] },
  { name: 'Disciplinary',  path: '/dashboard/disciplinary',   roles: ['TEACHER', 'COMMITTEE_MEMBER', 'COMMITTEE_PRESIDENT', 'ADMIN_FACULTY'] },
  { name: 'Requests',      path: '/dashboard/requests',       roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'SPECIALITE_CHEF', 'DEPARTEMENT_CHEF', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Messages',      path: '/dashboard/messages',       roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Notifications', path: '/dashboard/notifications',  roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Settings',      path: '/dashboard/settings',       roles: ['STUDENT', 'DELEGATE', 'TEACHER', 'SPECIALITE_CHEF', 'DEPARTEMENT_CHEF', 'ADMIN_FACULTY', 'ADMIN_SUPER'] },
  { name: 'Support',       path: '/dashboard/support',        roles: ['STUDENT', 'DELEGATE', 'TEACHER'] },
];

/* Map DB roles to the UI role token used by children (student | teacher | admin) */
function uiRole(dbRole) {
  if (!dbRole) return 'student';
  const r = dbRole.toUpperCase();
  if (['TEACHER', 'SPECIALITE_CHEF', 'DEPARTEMENT_CHEF'].includes(r)) return 'teacher';
  if (['ADMIN_FACULTY', 'ADMIN_SUPER'].includes(r)) return 'admin';
  return 'student'; // STUDENT, DELEGATE, etc.
}

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* Derive activeKey from the current URL */
  const activeKey = location.pathname;

  const role = uiRole(user?.role);

  /* Filter modules by the user's actual DB role */
  const visibleModules = ALL_MODULES.filter((m) =>
    user?.role ? m.roles.includes(user.role) : m.roles.includes('STUDENT')
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  /* Navigate to the clicked module path */
  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-canvas overflow-hidden">
      {/* Sidebar — same canvas bg, separated by border only */}
      <Sidebar
        modules={visibleModules}
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        activeKey={activeKey}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(v => !v)}
      />

      {/* Right column: topbar + content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          role={role}
          user={user}
          onLogout={handleLogout}
          onHamburger={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          activeKey={activeKey}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(v => !v)}
        />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children
            ? React.Children.map(children, (child) =>
                React.isValidElement(child) ? React.cloneElement(child, { role }) : child
              )
            : (role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />)
          }
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
