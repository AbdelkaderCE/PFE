/*
  Intent: The student's formal channel to the institution — a digital guichet.
          Two modes: the "My Requests" history (a ledger of filed grievances
          and justifications), and the "New Request" form (a careful, structured
          submission with evidence upload). Calm, institutional, never adversarial.
          The student should feel heard, not interrogated.
  Access: Student role (primary). Teachers see AdminRequestsPage instead.
  Palette: canvas base, surface cards. Brand for actions. Semantic for status.
  Depth: shadow-card + border-edge on cards.
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-6. gap-6 between sections.
*/

import React, { useState, useRef } from 'react';
import RequestDetailPage from './RequestDetailPage';
import AdminRequestsPage from './AdminRequestsPage';

/* ── Mock Data ──────────────────────────────────────────────── */

const MOCK_REQUESTS = [
  {
    id: 'REQ-2026-014',
    title: 'Absence Justification — Medical Emergency',
    type: 'Absence Justification',
    status: 'resolved',
    dateSubmitted: '2026-02-10',
    lastUpdated: '2026-02-15',
    description: 'I was unable to attend classes from February 8–10 due to a medical emergency requiring hospitalization. I have attached the hospital discharge summary and medical certificate from Dr. Benmoussa.',
    linkedExam: null,
    attachments: [
      { name: 'Medical_Certificate.pdf', type: 'PDF', size: '420 KB' },
      { name: 'Hospital_Discharge.pdf', type: 'PDF', size: '1.1 MB' },
    ],
    timeline: [
      { date: '2026-02-10', event: 'Submitted', by: 'You' },
      { date: '2026-02-11', event: 'Under Review', by: 'Student Affairs' },
      { date: '2026-02-15', event: 'Resolved — Approved', by: 'Prof. Bouzid A.' },
    ],
    adminResponse: {
      decision: 'Approved',
      message: 'Absence justified. The medical certificate has been verified. Your attendance record has been updated accordingly. No further action required.',
      respondedBy: 'Prof. Bouzid A., Vice-Dean of Pedagogy',
      date: '2026-02-15',
    },
  },
  {
    id: 'REQ-2026-019',
    title: 'Grade Reclamation — Algorithms Final Exam',
    type: 'Grade Error',
    status: 'under-review',
    dateSubmitted: '2026-02-18',
    lastUpdated: '2026-02-20',
    description: 'I believe there is an error in my Algorithms final exam grade. My calculated score based on the answer sheet should be 14/20, but the posted grade shows 09/20. I am requesting a re-verification of my exam paper. I have attached a photo of my answer sheet for reference.',
    linkedExam: { name: 'Algorithms — S1 Final', deadline: '2026-02-28' },
    attachments: [
      { name: 'Answer_Sheet_Photo.jpg', type: 'Image', size: '3.2 MB' },
    ],
    timeline: [
      { date: '2026-02-18', event: 'Submitted', by: 'You' },
      { date: '2026-02-20', event: 'Under Review', by: 'Department of Computer Science' },
    ],
    adminResponse: null,
  },
  {
    id: 'REQ-2026-022',
    title: 'Schedule Conflict — Overlapping Modules',
    type: 'Schedule Conflict',
    status: 'submitted',
    dateSubmitted: '2026-02-22',
    lastUpdated: '2026-02-22',
    description: 'My S2 schedule has a conflict: "Database Systems" (Group 2) and "Software Engineering" (Group 1) are both scheduled for Sunday 10:00–11:30 in different buildings. I am requesting reassignment to a different group for one of these modules.',
    linkedExam: null,
    attachments: [
      { name: 'Schedule_Screenshot.png', type: 'Image', size: '890 KB' },
    ],
    timeline: [
      { date: '2026-02-22', event: 'Submitted', by: 'You' },
    ],
    adminResponse: null,
  },
  {
    id: 'REQ-2026-008',
    title: 'Absence Justification — Family Obligation',
    type: 'Absence Justification',
    status: 'rejected',
    dateSubmitted: '2026-01-28',
    lastUpdated: '2026-02-02',
    description: 'I was absent on January 25–27 due to a family obligation (wedding in Oran). I have attached the invitation card as supporting document.',
    linkedExam: null,
    attachments: [
      { name: 'Wedding_Invitation.jpg', type: 'Image', size: '1.5 MB' },
    ],
    timeline: [
      { date: '2026-01-28', event: 'Submitted', by: 'You' },
      { date: '2026-01-30', event: 'Under Review', by: 'Student Affairs' },
      { date: '2026-02-02', event: 'Resolved — Rejected', by: 'Student Affairs' },
    ],
    adminResponse: {
      decision: 'Rejected',
      message: 'Family events (weddings, celebrations) are not considered valid justification for academic absences per Article 12 of the Internal Regulations. The absences remain marked as unjustified.',
      respondedBy: 'Student Affairs Office',
      date: '2026-02-02',
    },
  },
];

const DRAFT_REQUEST = {
  id: 'DRAFT-001',
  title: 'Absence Justification — Illness',
  type: 'Absence Justification',
  status: 'draft',
  dateSubmitted: null,
  lastUpdated: '2026-02-23',
  description: 'I was sick on February 21 and could not attend the TP session for Operating Systems.',
  linkedExam: null,
  attachments: [],
  timeline: [],
  adminResponse: null,
};

/* ── Status Config ──────────────────────────────────────────── */

const STATUS_CONFIG = {
  draft:          { label: 'Draft',         bg: 'bg-surface-200',                        text: 'text-ink-tertiary', border: 'border-edge',                               dot: 'bg-ink-muted',     step: 0 },
  submitted:      { label: 'Submitted',     bg: 'bg-blue-50 dark:bg-blue-950/40',        text: 'text-brand',        border: 'border-blue-200 dark:border-blue-800/50',   dot: 'bg-brand',         step: 1 },
  'under-review': { label: 'Under Review',  bg: 'bg-amber-50 dark:bg-amber-950/40',      text: 'text-warning',      border: 'border-amber-200 dark:border-amber-800/50', dot: 'bg-warning',       step: 2 },
  resolved:       { label: 'Resolved',      bg: 'bg-green-50 dark:bg-green-950/40',      text: 'text-success',      border: 'border-green-200 dark:border-green-800/50', dot: 'bg-success',       step: 3 },
  rejected:       { label: 'Rejected',      bg: 'bg-red-50 dark:bg-red-950/40',          text: 'text-danger',       border: 'border-red-200 dark:border-red-800/50',     dot: 'bg-danger',        step: 3 },
};

const REQUEST_TYPES = [
  { value: '', label: 'Select type…' },
  { value: 'Grade Error', label: 'Grade Error / Reclamation' },
  { value: 'Absence Justification', label: 'Absence Justification' },
  { value: 'Schedule Conflict', label: 'Schedule Conflict' },
  { value: 'Administrative Request', label: 'Administrative Request' },
  { value: 'Other', label: 'Other' },
];

/* ── Helpers ────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date('2026-02-24');
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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

function StatusTracker({ status }) {
  const cfg = STATUS_CONFIG[status];
  const currentStep = cfg?.step ?? 0;
  const isRejected = status === 'rejected';
  const steps = ['Submitted', 'Under Review', 'Resolved'];

  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                isCurrent && isRejected
                  ? 'bg-red-50 dark:bg-red-950/40 text-danger border-2 border-danger'
                  : isActive
                    ? 'bg-brand text-white'
                    : 'bg-surface-200 text-ink-muted border border-edge'
              }`}>
                {isCurrent && isRejected ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : isActive ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : stepNum}
              </div>
              <p className={`text-[10px] mt-1 font-medium ${
                isCurrent && isRejected ? 'text-danger' :
                isActive ? 'text-brand' : 'text-ink-muted'
              }`}>
                {isCurrent && isRejected ? 'Rejected' : label}
              </p>
            </div>
            {!isLast && (
              <div className={`h-0.5 w-8 sm:w-12 mt-[-14px] ${
                stepNum < currentStep ? 'bg-brand' : 'bg-edge'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, icon, accent = 'brand' }) {
  const accents = {
    brand:   'bg-blue-50 dark:bg-blue-950/40 text-brand',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-warning',
    danger:  'bg-red-50 dark:bg-red-950/40 text-danger',
    success: 'bg-green-50 dark:bg-green-950/40 text-success',
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

/* ── File type icon ──────────────────────────────────────────── */
function FileIcon({ type }) {
  if (type === 'Image') {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════
   ██  MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */

export default function RequestsPage({ role }) {
  const [view, setView] = useState('list');        // 'list' | 'new' | 'detail'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('All');
  const [emailNotify, setEmailNotify] = useState(true);

  /* New request form state */
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFiles, setFormFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  /* Teachers/Admins see the management inbox */
  if (role === 'teacher') return <AdminRequestsPage />;

  /* Combine requests + draft */
  const allRequests = [DRAFT_REQUEST, ...MOCK_REQUESTS];

  const filtered = allRequests.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterType !== 'All' && r.type !== filterType) return false;
    return true;
  });

  const stats = {
    total: MOCK_REQUESTS.length,
    pending: MOCK_REQUESTS.filter((r) => r.status === 'submitted' || r.status === 'under-review').length,
    resolved: MOCK_REQUESTS.filter((r) => r.status === 'resolved').length,
    rejected: MOCK_REQUESTS.filter((r) => r.status === 'rejected').length,
  };

  /* File drop handlers */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.type.startsWith('image/') ? 'Image' : 'PDF',
      }));
      setFormFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        type: f.type.startsWith('image/') ? 'Image' : 'PDF',
      }));
      setFormFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (idx) => {
    setFormFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ─── Detail View ──────────────────────────────────────────── */
  if (view === 'detail' && selectedRequest) {
    return (
      <RequestDetailPage
        request={selectedRequest}
        onBack={() => { setView('list'); setSelectedRequest(null); }}
      />
    );
  }

  /* ─── New Request Form ─────────────────────────────────────── */
  if (view === 'new') {
    return (
      <div className="space-y-6 max-w-2xl">

        {/* Back */}
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-secondary hover:text-ink transition-colors duration-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to My Requests
        </button>

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">New Request</h1>
          <p className="text-sm text-ink-tertiary mt-1">
            Submit a formal request, grievance, or justification. Attach any supporting documents.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-lg border border-edge shadow-card">
          <div className="px-6 py-4 border-b border-edge-subtle flex items-center gap-2">
            <svg className="w-5 h-5 text-ink-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <h2 className="text-base font-semibold text-ink">Request Details</h2>
          </div>

          <div className="p-6 space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                Subject <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Grade reclamation — Algorithms S1 Final"
                className="w-full px-3 py-2.5 text-sm bg-control-bg border border-control-border rounded-md text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors duration-150"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                Type <span className="text-danger">*</span>
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-control-bg border border-control-border rounded-md text-ink focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors duration-150"
              >
                {REQUEST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                rows={6}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Provide a detailed explanation of your request, including dates, module names, and any relevant context…"
                className="w-full px-3 py-2.5 text-sm bg-control-bg border border-control-border rounded-md text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-brand/30 focus:border-brand outline-none transition-colors duration-150 resize-none"
              />
              <p className="text-xs text-ink-muted mt-1">Be specific. Include dates, module names, and group numbers if applicable.</p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-ink-secondary mb-1.5">
                Supporting Documents
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-150 ${
                  dragActive
                    ? 'border-brand bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-control-border bg-control-bg hover:border-ink-muted'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <svg className="w-8 h-8 text-ink-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-ink-secondary">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-medium text-brand hover:text-brand-hover transition-colors"
                  >
                    Browse files
                  </button>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-ink-muted mt-1">PDF, JPG, PNG — up to 10 MB per file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Uploaded files list */}
              {formFiles.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {formFiles.map((file, idx) => (
                    <li key={idx} className="flex items-center gap-3 px-3 py-2 bg-surface-200 rounded-md">
                      <div className="w-7 h-7 rounded bg-surface flex items-center justify-center text-ink-tertiary shrink-0">
                        <FileIcon type={file.type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink truncate">{file.name}</p>
                        <p className="text-xs text-ink-muted">{file.type} · {file.size}</p>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1 rounded text-ink-muted hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Email notification toggle */}
            <div className="flex items-center justify-between py-2 border-t border-edge-subtle">
              <div>
                <p className="text-sm font-medium text-ink">Email notifications</p>
                <p className="text-xs text-ink-tertiary mt-0.5">Notify me by email when a decision is made.</p>
              </div>
              <button
                role="switch"
                aria-checked={emailNotify}
                onClick={() => setEmailNotify(!emailNotify)}
                className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 ${
                  emailNotify ? 'bg-brand' : 'bg-surface-300'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                  emailNotify ? 'translate-x-[18px]' : 'translate-x-[3px]'
                }`} />
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 border-t border-edge-subtle flex items-center justify-between">
            <button
              onClick={() => setView('list')}
              className="px-4 py-2 text-sm font-medium text-ink-secondary bg-surface border border-edge rounded-md hover:bg-surface-200 transition-colors duration-150"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-ink-secondary bg-surface border border-edge rounded-md hover:bg-surface-200 transition-colors duration-150 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                Save as Draft
              </button>
              <button
                disabled={!formTitle || !formType || !formDescription}
                className="px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark transition-all duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── My Requests List (Default View) ──────────────────────── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Requests & Appeals</h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            Submit justifications, reclamations, and track their progress.
          </p>
        </div>
        <button
          onClick={() => setView('new')}
          className="px-4 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark transition-all duration-150 flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          accent="brand"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" /></svg>}
        />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          accent="warning"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Approved"
          value={stats.resolved}
          accent="success"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          accent="danger"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
        />
      </div>

      {/* Filters + List */}
      <div className="bg-surface rounded-lg border border-edge shadow-card">
        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-edge-subtle flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { key: 'all', label: 'All' },
              { key: 'draft', label: 'Drafts' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'under-review', label: 'Under Review' },
              { key: 'resolved', label: 'Resolved' },
              { key: 'rejected', label: 'Rejected' },
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

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="sm:ml-auto px-3 py-1.5 text-sm bg-control-bg border border-control-border rounded-md text-ink-secondary focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          >
            <option value="All">All Types</option>
            <option value="Grade Error">Grade Error</option>
            <option value="Absence Justification">Absence Justification</option>
            <option value="Schedule Conflict">Schedule Conflict</option>
          </select>
        </div>

        {/* Request cards */}
        <ul className="divide-y divide-edge-subtle">
          {filtered.length === 0 ? (
            <li className="px-6 py-12 text-center">
              <svg className="w-10 h-10 text-ink-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
              </svg>
              <p className="text-sm font-medium text-ink-secondary">No requests found</p>
              <p className="text-xs text-ink-muted mt-1">Try adjusting your filters or submit a new request.</p>
            </li>
          ) : (
            filtered.map((req) => (
              <li
                key={req.id}
                onClick={() => { setSelectedRequest(req); setView('detail'); }}
                className="px-6 py-4 hover:bg-surface-200/50 transition-colors duration-100 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-ink-muted">{req.id}</span>
                      <StatusBadge status={req.status} />
                      {req.status === 'draft' && (
                        <span className="text-[10px] font-medium text-ink-muted italic">— not submitted</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-ink mt-1">{req.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-ink-tertiary">{req.type}</span>
                      <span className="text-xs text-ink-muted">·</span>
                      <span className="text-xs text-ink-muted">
                        {req.dateSubmitted ? formatDate(req.dateSubmitted) : `Last edited ${formatDate(req.lastUpdated)}`}
                      </span>
                    </div>

                    {/* Deadline warning for grade-linked requests */}
                    {req.linkedExam && req.status !== 'resolved' && req.status !== 'rejected' && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded text-xs">
                        <svg className="w-3.5 h-3.5 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-warning">
                          {daysUntil(req.linkedExam.deadline)} days left to appeal
                        </span>
                        <span className="text-amber-600 dark:text-amber-400">— {req.linkedExam.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Status tracker (compact) */}
                  <div className="hidden sm:block shrink-0">
                    <StatusTracker status={req.status} />
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-edge-subtle flex items-center justify-between">
          <p className="text-xs text-ink-muted">
            Showing {filtered.length} of {allRequests.length} requests
          </p>
        </div>
      </div>
    </div>
  );
}
