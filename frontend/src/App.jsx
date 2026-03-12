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
import ResetPasswordPage from './pages/ResetPasswordPage';
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

/* ── Utility pages ── */
import AIAssistantPage from './pages/AIAssistantPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';

/* ── Student pages ── */
import StudentDashboardRole from './pages/Student/Dashboard';
import StudentMyGrades from './pages/Student/MyGrades';
import StudentMyCourses from './pages/Student/MyCourses';
import StudentMyProjects from './pages/Student/MyProjects';
import StudentMyComplaints from './pages/Student/MyComplaints';
import StudentSchedule from './pages/Student/Schedule';

/* ── Teacher pages ── */
import TeacherDashboardRole from './pages/Teacher/Dashboard';
import TeacherGradeManagement from './pages/Teacher/GradeManagement';
import TeacherMyCourses from './pages/Teacher/MyCourses';
import TeacherMyStudents from './pages/Teacher/MyStudents';
import TeacherProjects from './pages/Teacher/Projects';
import TeacherSchedule from './pages/Teacher/Schedule';

/* ── Delegate pages ── */
import DelegateDashboard from './pages/Delegate/Dashboard';
import DelegateAttendance from './pages/Delegate/Attendance';
import DelegateComplaints from './pages/Delegate/Complaints';
import DelegateGroupManagement from './pages/Delegate/GroupManagement';

/* ── CommitteeMember pages ── */
import CommitteeMemberDashboard from './pages/CommitteeMember/Dashboard';
import CommitteeMemberCases from './pages/CommitteeMember/Cases';
import CommitteeMemberDecisions from './pages/CommitteeMember/Decisions';
import CommitteeMemberDocuments from './pages/CommitteeMember/Documents';
import CommitteeMemberHearings from './pages/CommitteeMember/Hearings';

/* ── CommitteePresident pages ── */
import CommitteePresidentDashboard from './pages/CommitteePresident/Dashboard';
import CommitteePresidentAllCases from './pages/CommitteePresident/AllCases';
import CommitteePresidentMembers from './pages/CommitteePresident/CommitteeMembers';
import CommitteePresidentFinalDecisions from './pages/CommitteePresident/FinalDecisions';
import CommitteePresidentReports from './pages/CommitteePresident/Reports';
import CommitteePresidentScheduleHearings from './pages/CommitteePresident/ScheduleHearings';

/* ── DepartmentChef pages ── */
import DepartmentChefDashboard from './pages/DepartmentChef/Dashboard';
import DepartmentChefDepartmentManagement from './pages/DepartmentChef/DepartmentManagement';
import DepartmentChefTeachers from './pages/DepartmentChef/Teachers';
import DepartmentChefSpecialites from './pages/DepartmentChef/Specialites';
import DepartmentChefBudget from './pages/DepartmentChef/Budget';
import DepartmentChefReports from './pages/DepartmentChef/Reports';

/* ── SpecialiteChef pages ── */
import SpecialiteChefDashboard from './pages/SpecialiteChef/Dashboard';
import SpecialiteChefCourses from './pages/SpecialiteChef/Courses';
import SpecialiteChefTeachers from './pages/SpecialiteChef/Teachers';
import SpecialiteChefSpecialiteManagement from './pages/SpecialiteChef/SpecialiteManagement';
import SpecialiteChefStudentAssignment from './pages/SpecialiteChef/StudentAssignment';

/* ── FacultyAdmin pages ── */
import FacultyAdminDashboard from './pages/FacultyAdmin/Dashboard';
import FacultyAdminDepartments from './pages/FacultyAdmin/Departments';
import FacultyAdminUsers from './pages/FacultyAdmin/Users';
import FacultyAdminSpecialites from './pages/FacultyAdmin/Specialites';
import FacultyAdminReports from './pages/FacultyAdmin/Reports';
import FacultyAdminSettings from './pages/FacultyAdmin/Settings';

/* ── SuperAdmin pages ── */
import SuperAdminDashboardRole from './pages/SuperAdmin/Dashboard';
import SuperAdminUsers from './pages/SuperAdmin/Users';
import SuperAdminRoles from './pages/SuperAdmin/Roles';
import SuperAdminSettings from './pages/SuperAdmin/Settings';
import SuperAdminLogs from './pages/SuperAdmin/Logs';
import SuperAdminBackup from './pages/SuperAdmin/Backup';
import SuperAdminSystemConfig from './pages/SuperAdmin/SystemConfig';

/* ── AssignmentManager pages ── */
import AssignmentManagerDashboard from './pages/AssignmentManager/Dashboard';
import AssignmentManagerStudents from './pages/AssignmentManager/Students';
import AssignmentManagerGroupAssignment from './pages/AssignmentManager/GroupAssignment';
import AssignmentManagerProjectAssignment from './pages/AssignmentManager/ProjectAssignment';
import AssignmentManagerReports from './pages/AssignmentManager/Reports';

/* ── Role Profile pages ── */
import StudentProfile from './pages/Student/Profile';
import TeacherProfile from './pages/Teacher/Profile';
import DelegateProfile from './pages/Delegate/Profile';
import CommitteeMemberProfile from './pages/CommitteeMember/Profile';
import CommitteePresidentProfile from './pages/CommitteePresident/Profile';
import DepartmentChefProfile from './pages/DepartmentChef/Profile';
import SpecialiteChefProfile from './pages/SpecialiteChef/Profile';
import FacultyAdminProfile from './pages/FacultyAdmin/Profile';
import AssignmentManagerProfile from './pages/AssignmentManager/Profile';
import SuperAdminProfile from './pages/SuperAdmin/Profile';

/* ── Admin & Detail pages ── */
import AdminRequestsPage from './pages/AdminRequestsPage';
import RequestDetailPage from './pages/RequestDetailPage';
import CaseDetailPage from './pages/CaseDetailPage';
import StudentDisciplinaryView from './pages/StudentDisciplinaryView';

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
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* ── Protected routes (DashboardLayout: sidebar + topbar) ── */}
              <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/dashboard/admin" replace /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/disciplinary" element={<ProtectedRoute><DashboardLayout><DisciplinaryCasesPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/actualites" element={<ProtectedRoute><DashboardLayout><ActualitesPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/calendar" element={<ProtectedRoute><DashboardLayout><CalendarPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/requests" element={<ProtectedRoute><DashboardLayout><RequestsPage /></DashboardLayout></ProtectedRoute>} />

              <Route path="/dashboard/change-password" element={<ProtectedRoute><DashboardLayout><ChangePasswordPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/disciplinary/student" element={<ProtectedRoute><DashboardLayout><StudentDisciplinaryView /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/disciplinary/:id" element={<ProtectedRoute><DashboardLayout><CaseDetailPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/requests/:id" element={<ProtectedRoute><DashboardLayout><RequestDetailPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── Admin / SuperAdmin routes ── */}
              <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardLayout><SuperAdminDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/users" element={<ProtectedRoute><DashboardLayout><UsersManagementPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/roles" element={<ProtectedRoute><DashboardLayout><RolesPermissionsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/announcements" element={<ProtectedRoute><DashboardLayout><AnnonceManagementPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/admin/requests" element={<ProtectedRoute><DashboardLayout><AdminRequestsPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── SuperAdmin role pages ── */}
              <Route path="/dashboard/super-admin" element={<ProtectedRoute><DashboardLayout><SuperAdminDashboardRole /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/users" element={<ProtectedRoute><DashboardLayout><SuperAdminUsers /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/roles" element={<ProtectedRoute><DashboardLayout><SuperAdminRoles /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/settings" element={<ProtectedRoute><DashboardLayout><SuperAdminSettings /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/logs" element={<ProtectedRoute><DashboardLayout><SuperAdminLogs /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/backup" element={<ProtectedRoute><DashboardLayout><SuperAdminBackup /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/system" element={<ProtectedRoute><DashboardLayout><SuperAdminSystemConfig /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/super-admin/profile" element={<ProtectedRoute><DashboardLayout><SuperAdminProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Module routes ── */}
              <Route path="/dashboard/projects" element={<ProtectedRoute><DashboardLayout><PFEProjectsPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/affectation" element={<ProtectedRoute><DashboardLayout><AffectationPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/documents" element={<ProtectedRoute><DashboardLayout><DocumentsPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── Error pages ── */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<NotFoundPage />} />

              {/* ── Utility routes ── */}
              <Route path="/dashboard/ai" element={<ProtectedRoute><DashboardLayout><AIAssistantPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/messages" element={<ProtectedRoute><DashboardLayout><MessagesPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/notifications" element={<ProtectedRoute><DashboardLayout><NotificationsPage /></DashboardLayout></ProtectedRoute>} />

              {/* ── Student routes ── */}
              <Route path="/dashboard/student" element={<ProtectedRoute><DashboardLayout><StudentDashboardRole /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/student/grades" element={<ProtectedRoute><DashboardLayout><StudentMyGrades /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/student/courses" element={<ProtectedRoute><DashboardLayout><StudentMyCourses /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/student/projects" element={<ProtectedRoute><DashboardLayout><StudentMyProjects /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/student/complaints" element={<ProtectedRoute><DashboardLayout><StudentMyComplaints /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/student/schedule" element={<ProtectedRoute><DashboardLayout><StudentSchedule /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/student/profile" element={<ProtectedRoute><DashboardLayout><StudentProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Teacher routes ── */}
              <Route path="/dashboard/teacher" element={<ProtectedRoute><DashboardLayout><TeacherDashboardRole /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/teacher/grades" element={<ProtectedRoute><DashboardLayout><TeacherGradeManagement /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/teacher/courses" element={<ProtectedRoute><DashboardLayout><TeacherMyCourses /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/teacher/students" element={<ProtectedRoute><DashboardLayout><TeacherMyStudents /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/teacher/projects" element={<ProtectedRoute><DashboardLayout><TeacherProjects /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/teacher/schedule" element={<ProtectedRoute><DashboardLayout><TeacherSchedule /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/teacher/profile" element={<ProtectedRoute><DashboardLayout><TeacherProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Delegate routes ── */}
              <Route path="/dashboard/delegate" element={<ProtectedRoute><DashboardLayout><DelegateDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/delegate/attendance" element={<ProtectedRoute><DashboardLayout><DelegateAttendance /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/delegate/complaints" element={<ProtectedRoute><DashboardLayout><DelegateComplaints /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/delegate/group" element={<ProtectedRoute><DashboardLayout><DelegateGroupManagement /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/delegate/profile" element={<ProtectedRoute><DashboardLayout><DelegateProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Committee Member routes ── */}
              <Route path="/dashboard/committee-member" element={<ProtectedRoute><DashboardLayout><CommitteeMemberDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-member/cases" element={<ProtectedRoute><DashboardLayout><CommitteeMemberCases /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-member/decisions" element={<ProtectedRoute><DashboardLayout><CommitteeMemberDecisions /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-member/documents" element={<ProtectedRoute><DashboardLayout><CommitteeMemberDocuments /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-member/hearings" element={<ProtectedRoute><DashboardLayout><CommitteeMemberHearings /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-member/profile" element={<ProtectedRoute><DashboardLayout><CommitteeMemberProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Committee President routes ── */}
              <Route path="/dashboard/committee-president" element={<ProtectedRoute><DashboardLayout><CommitteePresidentDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-president/cases" element={<ProtectedRoute><DashboardLayout><CommitteePresidentAllCases /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-president/members" element={<ProtectedRoute><DashboardLayout><CommitteePresidentMembers /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-president/decisions" element={<ProtectedRoute><DashboardLayout><CommitteePresidentFinalDecisions /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-president/reports" element={<ProtectedRoute><DashboardLayout><CommitteePresidentReports /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-president/hearings" element={<ProtectedRoute><DashboardLayout><CommitteePresidentScheduleHearings /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/committee-president/profile" element={<ProtectedRoute><DashboardLayout><CommitteePresidentProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Department Chef routes ── */}
              <Route path="/dashboard/department-chef" element={<ProtectedRoute><DashboardLayout><DepartmentChefDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/department-chef/management" element={<ProtectedRoute><DashboardLayout><DepartmentChefDepartmentManagement /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/department-chef/teachers" element={<ProtectedRoute><DashboardLayout><DepartmentChefTeachers /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/department-chef/specialites" element={<ProtectedRoute><DashboardLayout><DepartmentChefSpecialites /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/department-chef/budget" element={<ProtectedRoute><DashboardLayout><DepartmentChefBudget /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/department-chef/reports" element={<ProtectedRoute><DashboardLayout><DepartmentChefReports /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/department-chef/profile" element={<ProtectedRoute><DashboardLayout><DepartmentChefProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Specialite Chef routes ── */}
              <Route path="/dashboard/specialite-chef" element={<ProtectedRoute><DashboardLayout><SpecialiteChefDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/specialite-chef/courses" element={<ProtectedRoute><DashboardLayout><SpecialiteChefCourses /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/specialite-chef/teachers" element={<ProtectedRoute><DashboardLayout><SpecialiteChefTeachers /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/specialite-chef/management" element={<ProtectedRoute><DashboardLayout><SpecialiteChefSpecialiteManagement /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/specialite-chef/assignments" element={<ProtectedRoute><DashboardLayout><SpecialiteChefStudentAssignment /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/specialite-chef/profile" element={<ProtectedRoute><DashboardLayout><SpecialiteChefProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Faculty Admin routes ── */}
              <Route path="/dashboard/faculty-admin" element={<ProtectedRoute><DashboardLayout><FacultyAdminDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/faculty-admin/departments" element={<ProtectedRoute><DashboardLayout><FacultyAdminDepartments /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/faculty-admin/users" element={<ProtectedRoute><DashboardLayout><FacultyAdminUsers /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/faculty-admin/specialites" element={<ProtectedRoute><DashboardLayout><FacultyAdminSpecialites /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/faculty-admin/reports" element={<ProtectedRoute><DashboardLayout><FacultyAdminReports /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/faculty-admin/settings" element={<ProtectedRoute><DashboardLayout><FacultyAdminSettings /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/faculty-admin/profile" element={<ProtectedRoute><DashboardLayout><FacultyAdminProfile /></DashboardLayout></ProtectedRoute>} />

              {/* ── Assignment Manager routes ── */}
              <Route path="/dashboard/assignment-manager" element={<ProtectedRoute><DashboardLayout><AssignmentManagerDashboard /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/assignment-manager/students" element={<ProtectedRoute><DashboardLayout><AssignmentManagerStudents /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/assignment-manager/group" element={<ProtectedRoute><DashboardLayout><AssignmentManagerGroupAssignment /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/assignment-manager/project" element={<ProtectedRoute><DashboardLayout><AssignmentManagerProjectAssignment /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/assignment-manager/reports" element={<ProtectedRoute><DashboardLayout><AssignmentManagerReports /></DashboardLayout></ProtectedRoute>} />
              <Route path="/dashboard/assignment-manager/profile" element={<ProtectedRoute><DashboardLayout><AssignmentManagerProfile /></DashboardLayout></ProtectedRoute>} />
            </Routes>
            <AIChatbot />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
