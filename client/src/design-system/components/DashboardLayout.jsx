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
import Sidebar from './navigation/Sidebar';
import Topbar from './navigation/Topbar';
import TeacherDashboard from '../../pages/TeacherDashboard';
import StudentDashboard from '../../pages/StudentDashboard';

/* ── 11 Modules ─────────────────────────────────────────────── */
const ALL_MODULES = [
  { name: 'Dashboard',     path: '/dashboard',     roles: ['student', 'teacher'] },
  { name: 'Actualités',    path: '/actualites',    roles: ['student', 'teacher'] },
  { name: 'Projects',      path: '/projects',      roles: ['student', 'teacher'] },
  { name: 'Grades',        path: '/grades',        roles: ['student', 'teacher'] },
  { name: 'AI Assistant',  path: '/ai',            roles: ['student', 'teacher'] },
  { name: 'Documents',     path: '/documents',     roles: ['student', 'teacher'] },
  { name: 'Calendar',      path: '/calendar',      roles: ['student', 'teacher'] },
  { name: 'Attendance',    path: '/attendance',     roles: ['teacher'] },
  { name: 'Disciplinary',  path: '/disciplinary',  roles: ['teacher'] },
  { name: 'Requests',      path: '/requests',      roles: ['student', 'teacher'] },
  { name: 'Messages',      path: '/messages',      roles: ['student', 'teacher'] },
  { name: 'Notifications', path: '/notifications', roles: ['student', 'teacher'] },
  { name: 'Settings',      path: '/settings',      roles: ['student', 'teacher'] },
  { name: 'Support',       path: '/support',       roles: ['student', 'teacher'] },
];

const DashboardLayout = ({ children }) => {
  const [role, setRole] = useState('student');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('/dashboard');

  /* Filter modules by active role */
  const visibleModules = ALL_MODULES.filter((m) => m.roles.includes(role));

  return (
    <div className="flex flex-1 w-full min-h-0 bg-canvas overflow-hidden">
      {/* Sidebar — same canvas bg, separated by border only */}
      <Sidebar
        modules={visibleModules}
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(path) => { setActiveKey(path); setSidebarOpen(false); }}
        activeKey={activeKey}
      />

      {/* Right column: topbar + content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          role={role}
          onRoleChange={setRole}
          onHamburger={() => setSidebarOpen(true)}
          onNavigate={(path) => { setActiveKey(path); setSidebarOpen(false); }}
          activeKey={activeKey}
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
