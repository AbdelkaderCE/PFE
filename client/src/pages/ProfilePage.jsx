/*
  Intent: A student or teacher viewing their own identity within the institution.
          Not a social profile — an academic identity card brought to screen.
          Three zones:
          1. Identity header — avatar, name, role, department (the seal of who you are)
          2. Academic information — enrollment details, supervisor, academic stats
          3. Contact & documents — email, phone, downloadable attestations
  Palette: canvas base, surface cards. Brand for identity accent, semantic for status.
  Depth: shadow-card + border-edge on all cards. No stacked shadows.
  Surfaces: canvas (page bg via layout), surface (card), surface-200 (stat wells).
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-6. gap-6 between sections.
*/

import React, { useState } from 'react';

/* ── Mock Data ──────────────────────────────────────────────── */

const STUDENT_PROFILE = {
  firstName: 'Amira',
  lastName: 'Bensalem',
  email: 'a.bensalem@univ-ibn-khaldoun.dz',
  phone: '+213 5 55 12 34 56',
  role: 'Student',
  studentId: '202300456',
  department: 'Computer Science',
  faculty: 'Faculty of Sciences',
  level: 'Master 1',
  specialty: 'Génie Logiciel',
  group: 'Group A',
  academicYear: '2025 / 2026',
  semester: 'Semester 2',
  enrollmentDate: '2023-09-15',
  supervisor: 'Dr. Boudiaf Rachid',
  status: 'active',
  bio: 'Master 1 student in Software Engineering. Interested in distributed systems, AI, and mobile development. Currently working on a PFE project focused on university platform digitalization.',
};

const TEACHER_PROFILE = {
  firstName: 'Rachid',
  lastName: 'Boudiaf',
  email: 'r.boudiaf@univ-ibn-khaldoun.dz',
  phone: '+213 5 55 98 76 54',
  role: 'Teacher',
  employeeId: 'ENS-2015-042',
  department: 'Computer Science',
  faculty: 'Faculty of Sciences',
  grade: 'Maître de Conférences B',
  specialty: 'Software Engineering',
  office: 'Building B, Room 204',
  academicYear: '2025 / 2026',
  semester: 'Semester 2',
  joinDate: '2015-09-01',
  status: 'active',
  bio: 'Associate Professor in the Computer Science department. Research interests: software engineering, design patterns, and agile methodologies. Supervising 8 PFE projects this year.',
};

const ACADEMIC_STATS_STUDENT = [
  { label: 'Credits Earned', value: '142', total: '180' },
  { label: 'Current GPA', value: '14.72', total: '/20' },
  { label: 'Modules Passed', value: '38', total: '/ 42' },
  { label: 'Absences', value: '3', total: 'this semester' },
];

const ACADEMIC_STATS_TEACHER = [
  { label: 'Students', value: '247', total: 'enrolled' },
  { label: 'Modules', value: '4', total: 'this semester' },
  { label: 'PFE Projects', value: '8', total: 'supervising' },
  { label: 'Publications', value: '12', total: 'total' },
];

const DOCUMENTS_STUDENT = [
  { name: 'Student Certificate', date: '2026-01-15', format: 'PDF' },
  { name: 'S1 Transcript', date: '2026-01-20', format: 'PDF' },
  { name: 'Enrollment Attestation', date: '2025-09-20', format: 'PDF' },
];

const DOCUMENTS_TEACHER = [
  { name: 'Employment Certificate', date: '2026-01-10', format: 'PDF' },
  { name: 'Teaching Schedule S2', date: '2026-02-01', format: 'PDF' },
  { name: 'Research Output Summary', date: '2025-12-15', format: 'PDF' },
];

/* ── Helpers ────────────────────────────────────────────────── */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Info Row ──────────────────────────────────────────────── */
function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {icon && <span className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5">{icon}</span>}
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="text-sm font-medium text-ink mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────── */
export default function ProfilePage() {
  /* Mock role toggle — in production this comes from auth context */
  const [viewRole, setViewRole] = useState('student');

  const profile = viewRole === 'student' ? STUDENT_PROFILE : TEACHER_PROFILE;
  const stats = viewRole === 'student' ? ACADEMIC_STATS_STUDENT : ACADEMIC_STATS_TEACHER;
  const docs = viewRole === 'student' ? DOCUMENTS_STUDENT : DOCUMENTS_TEACHER;
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

  return (
    <div className="space-y-6 max-w-3xl">

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Profile</h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            Your academic identity and personal information.
          </p>
        </div>
        {/* Edit button */}
        <button className="px-4 py-2 text-sm font-medium text-ink-secondary bg-surface border border-edge rounded-md hover:bg-surface-200 transition-colors duration-150 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit profile
        </button>
      </div>

      {/* ── Identity Card ──────────────────────────────────── */}
      <div className="relative bg-surface rounded-lg border border-edge shadow-card">
        {/* Brand banner */}
        <div className="h-24 bg-gradient-to-r from-brand to-brand-hover relative rounded-t-lg overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 96" fill="none" preserveAspectRatio="xMidYMid slice">
              <circle cx="350" cy="20" r="80" fill="white" opacity="0.1" />
              <circle cx="50" cy="80" r="60" fill="white" opacity="0.05" />
            </svg>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar — overlaps the banner */}
          <div className="-mt-10 relative z-10">
            <div className="shrink-0 w-20 h-20 rounded-full bg-brand-light border-4 border-surface flex items-center justify-center shadow-card">
              <span className="text-2xl font-bold text-brand">{initials}</span>
            </div>
          </div>
          {/* Name & role — below the avatar, clear of the banner */}
          <div className="mt-3 min-w-0">
            <h2 className="text-lg font-bold text-ink tracking-tight">
              {profile.firstName} {profile.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50">
                {profile.role}
              </span>
              <span className="text-sm text-ink-secondary">{profile.department}</span>
              <span className="text-ink-muted">·</span>
              <span className="text-sm text-ink-tertiary">{profile.faculty}</span>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-sm text-ink-secondary leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Status badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-green-50 dark:bg-green-950/40 text-success border border-green-200 dark:border-green-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Active
            </span>
            <span className="text-xs text-ink-muted">
              {viewRole === 'student'
                ? `Enrolled since ${formatDate(profile.enrollmentDate)}`
                : `Member since ${formatDate(profile.joinDate)}`
              }
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-lg border border-edge shadow-card p-4 text-center"
          >
            <p className="text-2xl font-bold text-brand tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">{stat.total}</p>
            <p className="text-xs font-medium text-ink-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Two Column: Academic Info + Contact ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Academic Information */}
        <div className="bg-surface rounded-lg border border-edge shadow-card">
          <div className="px-6 py-4 border-b border-edge-subtle flex items-center gap-2">
            <svg className="w-5 h-5 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            <h2 className="text-base font-semibold text-ink">Academic Information</h2>
          </div>
          <div className="px-6 py-2 divide-y divide-edge-subtle">
            {viewRole === 'student' ? (
              <>
                <InfoRow label="Student ID" value={profile.studentId} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                } />
                <InfoRow label="Level & Specialty" value={`${profile.level} — ${profile.specialty}`} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>
                } />
                <InfoRow label="Group" value={profile.group} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                } />
                <InfoRow label="Supervisor" value={profile.supervisor} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                } />
                <InfoRow label="Academic Year" value={`${profile.academicYear} — ${profile.semester}`} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                } />
              </>
            ) : (
              <>
                <InfoRow label="Employee ID" value={profile.employeeId} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                } />
                <InfoRow label="Grade" value={profile.grade} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>
                } />
                <InfoRow label="Specialty" value={profile.specialty} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>
                } />
                <InfoRow label="Office" value={profile.office} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                } />
                <InfoRow label="Academic Year" value={`${profile.academicYear} — ${profile.semester}`} icon={
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                } />
              </>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-surface rounded-lg border border-edge shadow-card">
            <div className="px-6 py-4 border-b border-edge-subtle flex items-center gap-2">
              <svg className="w-5 h-5 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <h2 className="text-base font-semibold text-ink">Contact</h2>
            </div>
            <div className="px-6 py-2 divide-y divide-edge-subtle">
              <InfoRow label="Email" value={profile.email} icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              } />
              <InfoRow label="Phone" value={profile.phone} icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              } />
              <InfoRow label="Department" value={`${profile.department} — ${profile.faculty}`} icon={
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21" /></svg>
              } />
            </div>
          </div>

          {/* Documents */}
          <div className="bg-surface rounded-lg border border-edge shadow-card">
            <div className="px-6 py-4 border-b border-edge-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h2 className="text-base font-semibold text-ink">Documents</h2>
              </div>
              <button className="text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150">
                Request new
              </button>
            </div>
            <ul className="divide-y divide-edge-subtle">
              {docs.map((doc) => (
                <li key={doc.name} className="px-6 py-3 flex items-center justify-between hover:bg-surface-200/50 transition-colors duration-100">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{doc.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {formatDate(doc.date)} · {doc.format}
                    </p>
                  </div>
                  <button className="shrink-0 p-2 rounded-md text-ink-tertiary hover:text-brand hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors duration-150" title="Download">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Role Preview Toggle (Dev Only) ─────────────────── */}
      <div className="bg-surface-200 rounded-lg border border-edge p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Dev: Profile preview</p>
          <p className="text-xs text-ink-tertiary mt-0.5">Toggle between student and teacher profiles</p>
        </div>
        <div className="flex items-center bg-surface rounded-md p-0.5 border border-edge">
          <button
            onClick={() => setViewRole('student')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
              viewRole === 'student' ? 'bg-brand text-white shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setViewRole('teacher')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-150 ${
              viewRole === 'teacher' ? 'bg-brand text-white shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
