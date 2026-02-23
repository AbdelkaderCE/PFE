/*
  Intent: Administrative nerve-center for disciplinary oversight.
          Confidential by nature — the interface whispers, never shouts.
          A digital registrar's ledger: structured, sober, authoritative.
  Access: Teacher / Admin only. Students see StudentDisciplinaryView instead.
  Palette: canvas base, surface cards. Semantic colors for status only.
  Depth: shadow-card + border-edge on cards. No stacked shadows.
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-6. gap-6 between sections.
*/

import React, { useState } from 'react';
import CaseDetailPage from './CaseDetailPage';

/* ── Mock Data ──────────────────────────────────────────────── */

const MOCK_CASES = [
  {
    id: 'DC-2026-001',
    studentId: '202300456',
    studentName: 'Amira Bensalem',
    violationType: 'Plagiarism',
    status: 'pending',
    dateOfIncident: '2026-02-10',
    dateReported: '2026-02-11',
    department: 'Computer Science',
    description: 'Submitted a final project report with sections copied verbatim from an external source without attribution.',
    urgency: true,
    evidence: [
      { name: 'Original_Report.pdf', type: 'PDF', size: '2.4 MB' },
      { name: 'Plagiarism_Check.pdf', type: 'PDF', size: '1.1 MB' },
    ],
    timeline: [
      { date: '2026-02-11', event: 'Report Submitted', by: 'Prof. Boudiaf R.', detail: 'Plagiarism detected in PFE report submission.' },
      { date: '2026-02-13', event: 'Investigation Started', by: 'Discipline Committee', detail: 'Case assigned for review.' },
    ],
    decision: null,
  },
  {
    id: 'DC-2026-002',
    studentId: '202200312',
    studentName: 'Yacine Mehdaoui',
    violationType: 'Exam Fraud',
    status: 'hearing',
    dateOfIncident: '2026-01-28',
    dateReported: '2026-01-29',
    department: 'Mathematics',
    description: 'Student was found using a concealed electronic device during the S1 final examination.',
    urgency: false,
    evidence: [
      { name: 'Surveillance_Photo.jpg', type: 'Image', size: '890 KB' },
      { name: 'Proctor_Statement.pdf', type: 'PDF', size: '340 KB' },
    ],
    timeline: [
      { date: '2026-01-29', event: 'Report Submitted', by: 'Dr. Hamdani S.', detail: 'Electronic device confiscated during exam.' },
      { date: '2026-01-31', event: 'Investigation Started', by: 'Discipline Committee', detail: 'Case reviewed, evidence confirmed.' },
      { date: '2026-02-05', event: 'Meeting with Student', by: 'Committee Chair', detail: 'Student acknowledged the device but denied intent to cheat.' },
      { date: '2026-02-15', event: 'Hearing Scheduled', by: 'Discipline Committee', detail: 'Formal hearing set for February 20, 2026.' },
    ],
    decision: null,
    hearingDate: '2026-02-20',
  },
  {
    id: 'DC-2025-018',
    studentId: '202100198',
    studentName: 'Fatima Zerhouni',
    violationType: 'Misconduct',
    status: 'sanctioned',
    dateOfIncident: '2025-12-05',
    dateReported: '2025-12-06',
    department: 'Physics',
    description: 'Disruptive behavior during a laboratory session, resulting in damage to equipment.',
    urgency: false,
    evidence: [
      { name: 'Lab_Damage_Report.pdf', type: 'PDF', size: '560 KB' },
      { name: 'Witness_Statements.pdf', type: 'PDF', size: '420 KB' },
    ],
    timeline: [
      { date: '2025-12-06', event: 'Report Submitted', by: 'Prof. Khelifi M.', detail: 'Lab equipment damaged during session.' },
      { date: '2025-12-08', event: 'Investigation Started', by: 'Discipline Committee', detail: 'Witness interviews conducted.' },
      { date: '2025-12-12', event: 'Meeting with Student', by: 'Committee Chair', detail: 'Student expressed remorse and offered to cover repair costs.' },
      { date: '2025-12-18', event: 'Hearing Scheduled', by: 'Discipline Committee', detail: 'Formal hearing conducted.' },
      { date: '2025-12-20', event: 'Final Decision', by: 'Discipline Committee', detail: 'Official warning issued with financial restitution.' },
    ],
    decision: {
      verdict: 'Warning',
      details: 'Official written warning placed in student file. Financial restitution of 15,000 DZD for equipment repair. Student placed on behavioral probation for the remainder of the academic year.',
      issuedBy: 'Prof. Bouzid A., Committee Chair',
      date: '2025-12-20',
    },
  },
  {
    id: 'DC-2025-015',
    studentId: '202100087',
    studentName: 'Khaled Benali',
    violationType: 'Plagiarism',
    status: 'closed',
    dateOfIncident: '2025-11-15',
    dateReported: '2025-11-16',
    department: 'Computer Science',
    description: 'Copy of another student\'s assignment submitted as original work.',
    urgency: false,
    evidence: [
      { name: 'Assignment_Comparison.pdf', type: 'PDF', size: '1.8 MB' },
    ],
    timeline: [
      { date: '2025-11-16', event: 'Report Submitted', by: 'Dr. Messaoud L.', detail: 'Identical assignments detected.' },
      { date: '2025-11-18', event: 'Investigation Started', by: 'Discipline Committee', detail: 'Both students interviewed separately.' },
      { date: '2025-11-22', event: 'Meeting with Student', by: 'Committee Chair', detail: 'Student admitted to sharing assignment.' },
      { date: '2025-11-28', event: 'Final Decision', by: 'Discipline Committee', detail: 'Zero grade for the assignment. Written warning.' },
    ],
    decision: {
      verdict: 'Warning',
      details: 'Zero grade assigned for the affected assignment. Official written warning. No further action required.',
      issuedBy: 'Prof. Bouzid A., Committee Chair',
      date: '2025-11-28',
    },
  },
  {
    id: 'DC-2026-003',
    studentId: '202300621',
    studentName: 'Sara Djeraba',
    violationType: 'Exam Fraud',
    status: 'pending',
    dateOfIncident: '2026-02-18',
    dateReported: '2026-02-18',
    department: 'Biology',
    description: 'Unauthorized written notes found during S2 midterm examination.',
    urgency: false,
    evidence: [
      { name: 'Confiscated_Notes_Photo.jpg', type: 'Image', size: '1.2 MB' },
      { name: 'Exam_Proctor_Report.pdf', type: 'PDF', size: '280 KB' },
    ],
    timeline: [
      { date: '2026-02-18', event: 'Report Submitted', by: 'Dr. Rahmani K.', detail: 'Written notes confiscated during midterm.' },
    ],
    decision: null,
  },
];

/* ── Status Config ──────────────────────────────────────────── */

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Investigation',
    bg: 'bg-amber-50',
    text: 'text-warning',
    border: 'border-amber-200',
    dot: 'bg-warning',
  },
  hearing: {
    label: 'Hearing Scheduled',
    bg: 'bg-blue-50',
    text: 'text-brand',
    border: 'border-blue-200',
    dot: 'bg-brand',
  },
  sanctioned: {
    label: 'Sanction Applied',
    bg: 'bg-red-50',
    text: 'text-danger',
    border: 'border-red-200',
    dot: 'bg-danger',
  },
  closed: {
    label: 'Case Closed',
    bg: 'bg-green-50',
    text: 'text-success',
    border: 'border-green-200',
    dot: 'bg-success',
  },
};

const VIOLATION_TYPES = ['All', 'Plagiarism', 'Exam Fraud', 'Misconduct'];

/* ── Helpers ────────────────────────────────────────────────── */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

/* ── Sub-components ─────────────────────────────────────────── */

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon, accent = 'brand' }) {
  const accents = {
    brand:   'bg-blue-50 text-brand',
    warning: 'bg-amber-50 text-warning',
    danger:  'bg-red-50 text-danger',
    success: 'bg-green-50 text-success',
  };
  return (
    <div className="bg-surface rounded-lg border border-edge shadow-card p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${accents[accent]} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-ink tracking-tight">{value}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */

export default function DisciplinaryCasesPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  /* Derived data */
  const filtered = MOCK_CASES.filter((c) => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterType !== 'All' && c.violationType !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.studentName.toLowerCase().includes(q) ||
        c.studentId.includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: MOCK_CASES.length,
    pending: MOCK_CASES.filter((c) => c.status === 'pending').length,
    hearing: MOCK_CASES.filter((c) => c.status === 'hearing').length,
    resolved: MOCK_CASES.filter((c) => c.status === 'sanctioned' || c.status === 'closed').length,
  };

  /* ── Case Detail View ─────────────────────────────────────── */
  if (selectedCase) {
    return (
      <CaseDetailPage
        caseData={selectedCase}
        onBack={() => setSelectedCase(null)}
      />
    );
  }

  /* ── Cases Overview ────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ── Restricted Access Banner ─────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
        <svg className="w-5 h-5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-warning">Restricted Access — Confidential Records</p>
          <p className="text-xs text-amber-700 mt-0.5">This module contains sensitive disciplinary data. Access is logged and limited to authorized personnel only.</p>
        </div>
      </div>

      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Disciplinary Cases</h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            Track, investigate, and resolve disciplinary matters.
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark transition-all duration-150 flex items-center gap-2 shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Case
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Cases"
          value={stats.total}
          accent="brand"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>}
        />
        <StatCard
          label="Pending Investigation"
          value={stats.pending}
          accent="warning"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Hearing Scheduled"
          value={stats.hearing}
          accent="brand"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          accent="success"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* ── Filters & Search ─────────────────────────────────── */}
      <div className="bg-surface rounded-lg border border-edge shadow-card">
        <div className="px-6 py-4 border-b border-edge-subtle flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Status pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'hearing', label: 'Hearing' },
              { key: 'sanctioned', label: 'Sanctioned' },
              { key: 'closed', label: 'Closed' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-100 ${
                  filterStatus === f.key
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-ink-secondary bg-surface-200 hover:bg-surface-300 hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            {/* Violation type filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-sm bg-control-bg border border-control-border rounded-md text-ink-secondary focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            >
              {VIOLATION_TYPES.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-3 py-1.5 text-sm bg-control-bg border border-control-border rounded-md text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ── Cases Table ──────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-edge-subtle">
                <th className="px-6 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Case ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider hidden md:table-cell">Violation</th>
                <th className="px-6 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge-subtle">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <svg className="w-10 h-10 text-ink-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                    </svg>
                    <p className="text-sm font-medium text-ink-secondary">No cases found</p>
                    <p className="text-xs text-ink-muted mt-1">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const pending = c.status === 'pending';
                  const overdue = pending && daysSince(c.dateReported) > 14;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-surface-200/50 transition-colors duration-100 cursor-pointer ${overdue ? 'bg-amber-50/40' : ''}`}
                      onClick={() => setSelectedCase(c)}
                    >
                      {/* Case ID */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          {overdue && (
                            <span className="w-2 h-2 rounded-full bg-danger animate-pulse shrink-0" title="Overdue — pending > 14 days" />
                          )}
                          <span className="font-mono text-xs font-medium text-ink">{c.id}</span>
                        </div>
                      </td>

                      {/* Student */}
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-ink">{c.studentName}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{c.studentId} · {c.department}</p>
                      </td>

                      {/* Violation */}
                      <td className="px-6 py-3.5 hidden md:table-cell">
                        <span className="text-ink-secondary">{c.violationType}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5">
                        <StatusBadge status={c.status} />
                        {overdue && (
                          <p className="text-[10px] text-danger font-medium mt-1">{daysSince(c.dateReported)} days pending</p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-3.5 hidden lg:table-cell">
                        <span className="text-ink-tertiary text-xs">{formatDate(c.dateOfIncident)}</span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedCase(c); }}
                          className="px-3 py-1.5 text-xs font-medium text-brand bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors duration-100"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-6 py-3 border-t border-edge-subtle flex items-center justify-between">
          <p className="text-xs text-ink-muted">
            Showing {filtered.length} of {MOCK_CASES.length} cases
          </p>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 text-xs font-medium text-ink-tertiary bg-surface-200 rounded hover:bg-surface-300 transition-colors">Prev</button>
            <button className="px-2.5 py-1 text-xs font-medium text-white bg-brand rounded shadow-sm">1</button>
            <button className="px-2.5 py-1 text-xs font-medium text-ink-tertiary bg-surface-200 rounded hover:bg-surface-300 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal (for sanction actions) ─────────────── */}
      {confirmModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setConfirmModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-xl shadow-card border border-edge w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink">Confirm Sanction</h3>
                  <p className="text-xs text-ink-tertiary">This action cannot be easily undone.</p>
                </div>
              </div>
              <p className="text-sm text-ink-secondary mb-6">
                Are you sure you want to apply this sanction to <span className="font-medium text-ink">{confirmModal.studentName}</span>?
                This will be recorded permanently in the student's academic file.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-sm font-medium text-ink-secondary bg-surface border border-edge rounded-md hover:bg-surface-200 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-sm font-medium text-white bg-danger rounded-md hover:bg-red-700 transition-colors duration-150"
                >
                  Apply Sanction
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
