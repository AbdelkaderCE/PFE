/*
  Intent: Teacher document management — document requests, types,
          and exam copies tracking. Admin views all; teacher sees own.
          Mock data mirrors: document_types, document_requests,
          copies_remise, modules, enseignements.
  Access: Teachers (own documents), Admin/Chef (all).
  Palette: canvas base, surface cards. Semantic colors for status.
  Depth: shadow-card + border-edge on cards.
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-5/p-6. gap-6 between sections.
*/

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import request from '../services/api';

/* ── Inline SVG Icons ──────────────────────────────────────── */

const icons = {
  document: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  clock: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  check: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  clipboard: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
    </svg>
  ),
  plus: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  eye: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  download: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
};

/* ── Status Configs ─────────────────────────────────────────── */

const REQUEST_STATUS = {
  en_attente:     { label: 'En attente', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-warning', border: 'border-amber-200 dark:border-amber-800/50', dot: 'bg-warning' },
  en_traitement:  { label: 'En traitement', bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-brand', border: 'border-blue-200 dark:border-blue-800/50', dot: 'bg-brand' },
  valide:         { label: 'Validé', bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-success', border: 'border-green-200 dark:border-green-800/50', dot: 'bg-success' },
  refuse:         { label: 'Refusé', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-danger', border: 'border-red-200 dark:border-red-800/50', dot: 'bg-danger' },
};

const COPY_STATUS = {
  non_remis:  { label: 'Non remis', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-danger', border: 'border-red-200 dark:border-red-800/50', dot: 'bg-danger' },
  remis:      { label: 'Remis', bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-success', border: 'border-green-200 dark:border-green-800/50', dot: 'bg-success' },
  en_retard:  { label: 'En retard', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-warning', border: 'border-amber-200 dark:border-amber-800/50', dot: 'bg-warning' },
};

const CATEGORIE_COLORS = {
  enseignement:   'bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50',
  administratif:  'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50',
  scientifique:   'bg-green-50 dark:bg-green-950/40 text-success border border-green-200 dark:border-green-800/50',
  pedagogique:    'bg-amber-50 dark:bg-amber-950/40 text-warning border border-amber-200 dark:border-amber-800/50',
  autre:          'bg-surface-200 text-ink-muted border border-edge',
};

/* ── Shared Sub-components ──────────────────────────────────── */

function StatusBadge({ status, config }) {
  const cfg = config[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function Avatar({ name, size = 'w-8 h-8 text-xs' }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className={`${size} rounded-full bg-brand-light flex items-center justify-center shrink-0`}>
      <span className="font-bold text-brand">{initials}</span>
    </div>
  );
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Tab Definitions ────────────────────────────────────────── */

const TABS = [
  { id: 'requests', label: 'Document Requests', Icon: icons.document },
  { id: 'copies',   label: 'Exam Copies',       Icon: icons.clipboard },
  { id: 'types',    label: 'Document Types',     Icon: icons.eye },
];

/* ── Mock Data — Document Types ────────────────────────────── */

const MOCK_TYPES = [
  { id: 1, nom: 'Attestation de travail', description: 'Official proof of employment', categorie: 'administratif' },
  { id: 2, nom: 'Certificat de scolarité', description: 'Enrollment certificate for students', categorie: 'administratif' },
  { id: 3, nom: 'Relevé de notes', description: 'Grade transcript', categorie: 'enseignement' },
  { id: 4, nom: 'Attestation de réussite', description: 'Graduation success certificate', categorie: 'enseignement' },
  { id: 5, nom: 'Attestation de publication', description: 'Certificate confirming a published paper', categorie: 'scientifique' },
  { id: 6, nom: 'Fiche pédagogique', description: 'Teaching methodology sheet', categorie: 'pedagogique' },
  { id: 7, nom: 'Autorisation d\'absence', description: 'Leave of absence authorization', categorie: 'autre' },
];

/* ── Mock Data — Document Requests ─────────────────────────── */

const MOCK_REQUESTS = [
  { id: 1, enseignant: 'Dr. Belkacem Ali', type_doc: 'Attestation de travail', categorie: 'administratif', description: 'For visa application', date_demande: '2025-06-01', status: 'valide', traite_par: 'Admin Khelifi', date_traitement: '2025-06-03', document_url: '/files/att-001.pdf' },
  { id: 2, enseignant: 'Dr. Belkacem Ali', type_doc: 'Relevé de notes', categorie: 'enseignement', description: 'Master 2 transcript copy', date_demande: '2025-06-10', status: 'en_traitement', traite_par: null, date_traitement: null, document_url: null },
  { id: 3, enseignant: 'Prof. Saidi Naima', type_doc: 'Attestation de publication', categorie: 'scientifique', description: 'Confirmation of publication in IEEE', date_demande: '2025-05-28', status: 'en_attente', traite_par: null, date_traitement: null, document_url: null },
  { id: 4, enseignant: 'Dr. Mebarki Rachid', type_doc: 'Fiche pédagogique', categorie: 'pedagogique', description: 'Pedagogical sheet for TCP/IP module', date_demande: '2025-06-12', status: 'en_attente', traite_par: null, date_traitement: null, document_url: null },
  { id: 5, enseignant: 'Dr. Mebarki Rachid', type_doc: 'Attestation de travail', categorie: 'administratif', description: 'Needed for housing loan', date_demande: '2025-04-15', status: 'refuse', traite_par: 'Admin Khelifi', date_traitement: '2025-04-18', document_url: null },
];

/* ── Mock Data — Copies Remise (exam papers tracking) ─────── */

const MOCK_COPIES = [
  { id: 1, enseignant: 'Dr. Belkacem Ali', module: 'TCP/IP', session: 'normale', date_exam: '2025-05-20', date_remise: '2025-05-25', nb_copies: 42, status: 'remis' },
  { id: 2, enseignant: 'Dr. Belkacem Ali', module: 'Base de données', session: 'normale', date_exam: '2025-05-22', date_remise: null, nb_copies: 38, status: 'non_remis' },
  { id: 3, enseignant: 'Prof. Saidi Naima', module: 'Algorithmes avancés', session: 'rattrapage', date_exam: '2025-06-10', date_remise: '2025-06-18', nb_copies: 25, status: 'en_retard' },
  { id: 4, enseignant: 'Dr. Mebarki Rachid', module: 'Programmation Web', session: 'normale', date_exam: '2025-05-21', date_remise: '2025-05-23', nb_copies: 55, status: 'remis' },
  { id: 5, enseignant: 'Dr. Mebarki Rachid', module: 'Intelligence Artificielle', session: 'dette', date_exam: '2025-06-05', date_remise: null, nb_copies: 12, status: 'non_remis' },
];

const SESSION_BADGE = {
  normale:     'bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50',
  rattrapage:  'bg-amber-50 dark:bg-amber-950/40 text-warning border border-amber-200 dark:border-amber-800/50',
  dette:       'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50',
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function DocumentsPage({ role }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('requests');
  const [docTypes, setDocTypes] = useState([]);
  const [docRequests, setDocRequests] = useState([]);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [tRes, rRes, cRes] = await Promise.allSettled([
          request('/api/v1/document-types'),
          request('/api/v1/document-requests'),
          request('/api/v1/copies-remise'),
        ]);
        if (cancelled) return;
        if (tRes.status === 'fulfilled') setDocTypes(tRes.value.data || []);
        if (rRes.status === 'fulfilled') setDocRequests(rRes.value.data || []);
        if (cRes.status === 'fulfilled') setCopies(cRes.value.data || []);
      } catch {
        /* API not ready */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const displayTypes = docTypes.length ? docTypes : MOCK_TYPES;
  const displayReqs = docRequests.length ? docRequests : MOCK_REQUESTS;
  const displayCopies = copies.length ? copies : MOCK_COPIES;

  /* Filter logic */
  const statusKeys = activeTab === 'requests' ? Object.keys(REQUEST_STATUS) : Object.keys(COPY_STATUS);
  const filteredReqs = filter === 'all' ? displayReqs : displayReqs.filter(r => r.status === filter);
  const filteredCopies = filter === 'all' ? displayCopies : displayCopies.filter(c => c.status === filter);

  /* Stats */
  const totalReqs = displayReqs.length;
  const pendingReqs = displayReqs.filter(r => r.status === 'en_attente').length;
  const totalCopies = displayCopies.length;
  const overdueCopies = displayCopies.filter(c => c.status === 'en_retard' || c.status === 'non_remis').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0">

      {/* ── Page Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">
            {t('documents.title', 'Documents & Copies')}
          </h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            {t('documents.subtitle', 'Document requests, exam copy tracking, and document type management.')}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm">
          <icons.plus className="w-4 h-4" />
          {activeTab === 'requests' ? t('documents.newRequest', 'New Request') : activeTab === 'copies' ? t('documents.recordCopy', 'Record Copy') : t('documents.addType', 'Add Type')}
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('documents.statRequests', 'Requests'), value: totalReqs, icon: <icons.document className="w-5 h-5" />, accent: 'bg-blue-50 dark:bg-blue-950/40 text-brand' },
          { label: t('documents.statPending', 'Pending'), value: pendingReqs, icon: <icons.clock className="w-5 h-5" />, accent: 'bg-amber-50 dark:bg-amber-950/40 text-warning' },
          { label: t('documents.statCopies', 'Exam Copies'), value: totalCopies, icon: <icons.clipboard className="w-5 h-5" />, accent: 'bg-green-50 dark:bg-green-950/40 text-success' },
          { label: t('documents.statOverdue', 'Missing / Late'), value: overdueCopies, icon: <icons.check className="w-5 h-5" />, accent: 'bg-red-50 dark:bg-red-950/40 text-danger' },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-lg border border-edge shadow-card p-4 flex items-center gap-3">
            <div className={`shrink-0 w-9 h-9 rounded-lg ${s.accent} flex items-center justify-center`}>{s.icon}</div>
            <div>
              <p className="text-lg font-bold text-ink tracking-tight">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ───────────────────────────────────────────── */}
      <div className="border-b border-edge-subtle">
        <div className="flex gap-0 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setFilter('all'); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'border-brand text-brand'
                  : 'border-transparent text-ink-muted hover:text-ink hover:border-edge'
              }`}
            >
              <tab.Icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter Pills (for Requests & Copies tabs) ──── */}
      {(activeTab === 'requests' || activeTab === 'copies') && (
        <div className="bg-surface-200 rounded-md p-1 flex gap-1 flex-wrap">
          {['all', ...(activeTab === 'requests' ? statusKeys : Object.keys(COPY_STATUS))].map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                filter === k
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              {k === 'all' ? 'All' : (activeTab === 'requests' ? REQUEST_STATUS[k]?.label : COPY_STATUS[k]?.label) || k}
            </button>
          ))}
        </div>
      )}

      {/* ═════ TAB: DOCUMENT REQUESTS ══════════════════════════ */}
      {activeTab === 'requests' && (
        <div className="bg-surface rounded-lg border border-edge shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge-subtle">
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thTeacher', 'Teacher')}</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thType', 'Document Type')}</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">{t('documents.thCategory', 'Category')}</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">{t('documents.thDate', 'Date')}</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thStatus', 'Status')}</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thActions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge-subtle">
                {filteredReqs.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-200/50 transition-colors duration-100">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={r.enseignant} />
                        <span className="font-medium text-ink">{r.enseignant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-secondary">{r.type_doc}</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${CATEGORIE_COLORS[r.categorie] || CATEGORIE_COLORS.autre}`}>
                        {r.categorie}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-muted hidden sm:table-cell">{formatDate(r.date_demande)}</td>
                    <td className="px-5 py-3 text-center">
                      <StatusBadge status={r.status} config={REQUEST_STATUS} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setDetailModal(r)}
                          className="p-1.5 rounded-md hover:bg-surface-200 text-ink-muted hover:text-ink transition-colors"
                          title="View details"
                        >
                          <icons.eye className="w-4 h-4" />
                        </button>
                        {r.document_url && (
                          <button
                            className="p-1.5 rounded-md hover:bg-surface-200 text-ink-muted hover:text-ink transition-colors"
                            title="Download"
                          >
                            <icons.download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReqs.length === 0 && (
              <div className="py-16 text-center">
                <icons.document className="w-10 h-10 mx-auto mb-3 text-ink-muted/40" />
                <p className="text-base font-semibold text-ink">No requests found</p>
                <p className="text-sm text-ink-tertiary mt-1">Adjust your filters to see results.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════ TAB: EXAM COPIES ════════════════════════════════ */}
      {activeTab === 'copies' && (
        <div className="bg-surface rounded-lg border border-edge shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge-subtle">
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thTeacher', 'Teacher')}</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thModule', 'Module')}</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thSession', 'Session')}</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">{t('documents.thExamDate', 'Exam Date')}</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">{t('documents.thReturnDate', 'Return Date')}</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thNbCopies', 'Copies')}</th>
                  <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('documents.thStatus', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge-subtle">
                {filteredCopies.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-200/50 transition-colors duration-100">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.enseignant} />
                        <span className="font-medium text-ink">{c.enseignant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-secondary">{c.module}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${SESSION_BADGE[c.session] || ''}`}>
                        {c.session}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-muted hidden sm:table-cell">{formatDate(c.date_exam)}</td>
                    <td className="px-5 py-3 text-ink-muted hidden md:table-cell">{formatDate(c.date_remise)}</td>
                    <td className="px-5 py-3 text-center font-medium text-ink">{c.nb_copies}</td>
                    <td className="px-5 py-3 text-center">
                      <StatusBadge status={c.status} config={COPY_STATUS} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCopies.length === 0 && (
              <div className="py-16 text-center">
                <icons.clipboard className="w-10 h-10 mx-auto mb-3 text-ink-muted/40" />
                <p className="text-base font-semibold text-ink">No copies found</p>
                <p className="text-sm text-ink-tertiary mt-1">Adjust your filters to see results.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════ TAB: DOCUMENT TYPES ═════════════════════════════ */}
      {activeTab === 'types' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTypes.map((dt) => (
            <div key={dt.id} className="bg-surface rounded-lg border border-edge shadow-card p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 text-[11px] font-medium rounded ${CATEGORIE_COLORS[dt.categorie] || CATEGORIE_COLORS.autre}`}>
                  {dt.categorie}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-ink">{dt.nom}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{dt.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail Modal ───────────────────────────────────── */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailModal(null)} />
          <div className="relative bg-surface rounded-xl border border-edge shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink">Request Details</h2>
              <button onClick={() => setDetailModal(null)} className="text-ink-muted hover:text-ink transition-colors text-lg font-bold leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Teacher</p>
                <p className="font-medium text-ink">{detailModal.enseignant}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Document Type</p>
                <p className="text-ink-secondary">{detailModal.type_doc}</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Description</p>
                <p className="text-ink-secondary">{detailModal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Requested</p>
                  <p className="text-ink-secondary">{formatDate(detailModal.date_demande)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Processed</p>
                  <p className="text-ink-secondary">{formatDate(detailModal.date_traitement)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Status</p>
                  <StatusBadge status={detailModal.status} config={REQUEST_STATUS} />
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">Processed by</p>
                  <p className="text-ink-secondary">{detailModal.traite_par || '—'}</p>
                </div>
              </div>
              {detailModal.document_url && (
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 transition-all duration-150">
                  <icons.download className="w-4 h-4" />
                  Download Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
