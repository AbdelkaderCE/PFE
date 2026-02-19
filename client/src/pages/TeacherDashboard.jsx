/*
  Intent: A teacher opening this at 7am with coffee. They need a calm, scannable overview —
          not a celebration, not a wall of numbers. Three concerns surface immediately:
          1. How many students do I have? (stat cards — glanceable)
          2. Which projects need my approval? (pending validations — actionable table)
          3. Are students complaining about anything? (recent claims — notification feed)
  Palette: canvas base, surface cards. Brand for primary stats, semantic colors for status.
  Depth: shadow-card + border-edge on all cards. No stacked shadows.
  Surfaces: canvas (page bg via layout), surface (card), surface-200 (badge wells).
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-6. Grid gap-4 on stats, gap-6 between sections.
*/

import React from 'react';

/* ── Mock Data ──────────────────────────────────────────────── */
const STATS = [
  {
    label: 'Total Students',
    value: '247',
    change: '+12 this semester',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    color: 'brand',
  },
  {
    label: 'Pending Validations',
    value: '8',
    change: '3 urgent',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'warning',
  },
  {
    label: 'Active Projects',
    value: '34',
    change: '6 submitted this week',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
    ),
    color: 'brand',
  },
  {
    label: 'Open Claims',
    value: '5',
    change: '2 new today',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: 'danger',
  },
];

const PENDING_PROJECTS = [
  { id: 1, title: 'Smart Irrigation System',     student: 'Amira Bensalem',   group: 'L3 Info',   submitted: '2026-02-17', priority: 'urgent' },
  { id: 2, title: 'E-Commerce Platform',          student: 'Youcef Kaddour',   group: 'M1 GL',     submitted: '2026-02-16', priority: 'urgent' },
  { id: 3, title: 'Hospital Management App',      student: 'Fatima Zohra Mahi', group: 'M1 SI',    submitted: '2026-02-16', priority: 'urgent' },
  { id: 4, title: 'Library Catalog System',        student: 'Ahmed Benali',     group: 'L3 Info',   submitted: '2026-02-15', priority: 'normal' },
  { id: 5, title: 'Student Attendance Tracker',    student: 'Sara Medjdoub',    group: 'M2 GL',     submitted: '2026-02-14', priority: 'normal' },
  { id: 6, title: 'AI Chatbot for Admissions',     student: 'Mohamed Cherif',   group: 'M1 IA',     submitted: '2026-02-13', priority: 'normal' },
  { id: 7, title: 'Campus Map Mobile App',         student: 'Rania Boudiaf',    group: 'L3 Info',   submitted: '2026-02-12', priority: 'normal' },
  { id: 8, title: 'Online Exam Platform',          student: 'Karim Touati',     group: 'M2 SI',     submitted: '2026-02-11', priority: 'normal' },
];

const RECENT_CLAIMS = [
  { id: 1, student: 'Amira Bensalem',    subject: 'Grade discrepancy — TD Module 4',           time: '2 hours ago',  status: 'new',         module: 'Databases' },
  { id: 2, student: 'Youcef Kaddour',    subject: 'Missing attendance mark — Feb 10',           time: '5 hours ago',  status: 'new',         module: 'Operating Systems' },
  { id: 3, student: 'Sara Medjdoub',     subject: 'Project deadline extension request',         time: '1 day ago',    status: 'in-progress', module: 'Software Engineering' },
  { id: 4, student: 'Ahmed Benali',      subject: 'Incorrect exam room assignment',             time: '2 days ago',   status: 'in-progress', module: 'Networks' },
  { id: 5, student: 'Fatima Zohra Mahi', subject: 'Request to change project supervisor',       time: '3 days ago',   status: 'resolved',    module: 'AI & Machine Learning' },
];

/* ── Helpers ────────────────────────────────────────────────── */
const STAT_COLORS = {
  brand:   { bg: 'bg-blue-50',   text: 'text-brand',  icon: 'text-brand' },
  warning: { bg: 'bg-amber-50',  text: 'text-warning', icon: 'text-warning' },
  danger:  { bg: 'bg-red-50',    text: 'text-danger',  icon: 'text-danger' },
};

const STATUS_STYLES = {
  'new':         'bg-blue-50 text-brand border border-blue-200',
  'in-progress': 'bg-amber-50 text-warning border border-amber-200',
  'resolved':    'bg-green-50 text-success border border-green-200',
};

const PRIORITY_STYLES = {
  urgent: 'bg-red-50 text-danger border border-red-200',
  normal: 'bg-surface-200 text-ink-tertiary border border-edge',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ── Component ──────────────────────────────────────────────── */
export default function TeacherDashboard() {
  return (
    <div className="space-y-6">

      {/* ── Page Header ────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">Good morning, Professor</h1>
        <p className="mt-1 text-sm text-ink-tertiary">
          Here's what needs your attention today — {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.
        </p>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const c = STAT_COLORS[stat.color];
          return (
            <div
              key={stat.label}
              className="bg-surface rounded-lg border border-edge shadow-card p-5 flex items-start gap-4"
            >
              <div className={`shrink-0 w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center ${c.icon}`}>
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-secondary">{stat.label}</p>
                <p className={`text-2xl font-bold tracking-tight ${c.text} mt-0.5`}>{stat.value}</p>
                <p className="text-xs text-ink-muted mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Two-Column: Projects + Claims ──────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── Pending Project Validations (Module 3) ───────── */}
        <div className="xl:col-span-3 bg-surface rounded-lg border border-edge shadow-card">
          {/* Card header */}
          <div className="px-5 py-4 border-b border-edge-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
              <h2 className="text-base font-semibold text-ink">Pending Validations</h2>
              <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-warning border border-amber-200">
                {PENDING_PROJECTS.length}
              </span>
            </div>
            <button className="text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150">
              View all
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge-subtle">
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Project</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">Group</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden lg:table-cell">Submitted</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-ink-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge-subtle">
                {PENDING_PROJECTS.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-200/50 transition-colors duration-100">
                    <td className="px-5 py-3">
                      <p className="font-medium text-ink truncate max-w-[200px]">{p.title}</p>
                      <p className="text-xs text-ink-muted sm:hidden mt-0.5">{p.student}</p>
                    </td>
                    <td className="px-5 py-3 text-ink-secondary hidden sm:table-cell">{p.student}</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-surface-200 text-ink-tertiary">
                        {p.group}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-tertiary hidden lg:table-cell">{formatDate(p.submitted)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${PRIORITY_STYLES[p.priority]}`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="px-3 py-1.5 text-xs font-medium text-brand bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-150">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent Claims Feed (Module 5) ────────────────── */}
        <div className="xl:col-span-2 bg-surface rounded-lg border border-edge shadow-card">
          {/* Card header */}
          <div className="px-5 py-4 border-b border-edge-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h2 className="text-base font-semibold text-ink">Recent Claims</h2>
              <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-danger border border-red-200">
                {RECENT_CLAIMS.filter((c) => c.status === 'new').length} new
              </span>
            </div>
            <button className="text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150">
              View all
            </button>
          </div>

          {/* Feed list */}
          <ul className="divide-y divide-edge-subtle">
            {RECENT_CLAIMS.map((claim) => (
              <li key={claim.id} className="px-5 py-4 hover:bg-surface-200/50 transition-colors duration-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Avatar initial */}
                      <div className="shrink-0 w-7 h-7 rounded-full bg-surface-300 flex items-center justify-center">
                        <span className="text-[11px] font-semibold text-ink-secondary">
                          {claim.student.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-ink truncate">{claim.student}</p>
                    </div>
                    <p className="text-sm text-ink-secondary leading-snug mb-1.5">{claim.subject}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-ink-muted">{claim.time}</span>
                      <span className="text-ink-muted">·</span>
                      <span className="text-xs text-ink-tertiary">{claim.module}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 mt-1 px-2 py-0.5 text-[11px] font-medium rounded ${STATUS_STYLES[claim.status]}`}>
                    {claim.status === 'in-progress' ? 'In progress' : claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-edge-subtle">
            <button className="w-full text-center text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150">
              View all claims →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
