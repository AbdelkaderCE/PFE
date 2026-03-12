/*
  Intent: System-wide command center for the super administrator.
          At a glance: how many users, what roles are distributed,
          recent activity, system health. Not overwhelming — orienting.
  Access: SuperAdmin / Vice-Doyen only.
  Palette: canvas base, surface cards. Semantic colors for status only.
  Depth: shadow-card + border-edge on cards. No stacked shadows.
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-5/p-6. gap-6 between sections.
*/

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import request from '../services/api';

/* ── Inline SVG Icons (stroke 1.5) ─────────────────────────── */

const icons = {
  users: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  academic: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.905 59.905 0 0 1 12 3.493a59.902 59.902 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
    </svg>
  ),
  shield: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  building: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  chart: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  clock: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  document: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  alert: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  check: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  folder: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  ),
  arrowUp: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
  ),
  arrowDown: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
    </svg>
  ),
};

/* ── Status Configs ─────────────────────────────────────────── */

const USER_STATUS = {
  active:    { label: 'Active',    bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-success', border: 'border-green-200 dark:border-green-800/50', dot: 'bg-success' },
  inactive:  { label: 'Inactive',  bg: 'bg-surface-200', text: 'text-ink-muted', border: 'border-edge', dot: 'bg-ink-muted' },
  suspended: { label: 'Suspended', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-danger', border: 'border-red-200 dark:border-red-800/50', dot: 'bg-danger' },
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

function StatCard({ label, value, icon, accent = 'brand', change, changeDir }) {
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
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold text-ink tracking-tight">{value}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">{label}</p>
      </div>
      {change && (
        <div className={`shrink-0 flex items-center gap-0.5 text-xs font-medium ${changeDir === 'up' ? 'text-success' : 'text-danger'}`}>
          {changeDir === 'up'
            ? <icons.arrowUp className="w-3 h-3" />
            : <icons.arrowDown className="w-3 h-3" />
          }
          {change}
        </div>
      )}
    </div>
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

/* ── Helpers ────────────────────────────────────────────────── */

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const mins = Math.floor((now - d) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function SuperAdminDashboard({ role }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [sRes, uRes, rRes, aRes, alRes] = await Promise.allSettled([
          request('/api/v1/admin/stats'),
          request('/api/v1/admin/users/recent'),
          request('/api/v1/admin/roles/distribution'),
          request('/api/v1/admin/activity'),
          request('/api/v1/admin/alerts'),
        ]);
        if (cancelled) return;
        if (sRes.status === 'fulfilled') setStats(sRes.value.data || null);
        if (uRes.status === 'fulfilled') setRecentUsers(uRes.value.data || []);
        if (rRes.status === 'fulfilled') setRoleDistribution(rRes.value.data || []);
        if (aRes.status === 'fulfilled') setRecentActivity(aRes.value.data || []);
        if (alRes.status === 'fulfilled') setSystemAlerts(alRes.value.data || []);
      } catch {
        /* API not ready — keep empty state */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  /* ── Mock fallback data (shown when API isn't ready) ─────── */
  const s = stats || {
    totalUsers: 1247,
    totalStudents: 982,
    totalTeachers: 143,
    totalAdmins: 12,
    activeSessions: 89,
    pendingRequests: 23,
    activeCampaigns: 2,
    openDisciplinary: 5,
  };

  const users = recentUsers.length ? recentUsers : [
    { id: 1, nom: 'Benali', prenom: 'Ahmed', email: 'a.benali@univ.dz', status: 'active', role: 'Étudiant', created_at: '2026-03-10T14:30:00' },
    { id: 2, nom: 'Kaci', prenom: 'Sara', email: 's.kaci@univ.dz', status: 'active', role: 'Enseignant', created_at: '2026-03-09T10:15:00' },
    { id: 3, nom: 'Merniz', prenom: 'Yousef', email: 'y.merniz@univ.dz', status: 'suspended', role: 'Étudiant', created_at: '2026-03-08T08:45:00' },
    { id: 4, nom: 'Hamidi', prenom: 'Lina', email: 'l.hamidi@univ.dz', status: 'active', role: 'Vice-Doyen', created_at: '2026-03-07T16:00:00' },
    { id: 5, nom: 'Saadi', prenom: 'Omar', email: 'o.saadi@univ.dz', status: 'inactive', role: 'Étudiant', created_at: '2026-03-06T11:20:00' },
  ];

  const roles = roleDistribution.length ? roleDistribution : [
    { name: 'Étudiant', count: 982, color: 'bg-brand' },
    { name: 'Enseignant', count: 143, color: 'bg-success' },
    { name: 'Chef Département', count: 12, color: 'bg-warning' },
    { name: 'Chef Spécialité', count: 24, color: 'bg-violet-500' },
    { name: 'Vice-Doyen', count: 3, color: 'bg-rose-500' },
    { name: 'Admin', count: 12, color: 'bg-danger' },
    { name: 'Délégué', count: 48, color: 'bg-cyan-500' },
    { name: 'Président Conseil', count: 4, color: 'bg-amber-500' },
  ];

  const activity = recentActivity.length ? recentActivity : [
    { id: 1, action: 'User registered', target: 'Ahmed Benali (Étudiant)', time: '2026-03-12T10:30:00', type: 'user' },
    { id: 2, action: 'Role assigned', target: 'Sara Kaci → Enseignant', time: '2026-03-12T09:45:00', type: 'role' },
    { id: 3, action: 'Document approved', target: 'Attestation de travail #89', time: '2026-03-12T09:15:00', type: 'document' },
    { id: 4, action: 'Campaign opened', target: 'Affectation L3→M1 2025/2026', time: '2026-03-11T16:00:00', type: 'campaign' },
    { id: 5, action: 'Disciplinary case created', target: 'Dossier #DC-2026-012', time: '2026-03-11T14:30:00', type: 'discipline' },
    { id: 6, action: 'PFE subject validated', target: '"IA appliquée aux réseaux"', time: '2026-03-11T11:00:00', type: 'pfe' },
    { id: 7, action: 'User suspended', target: 'Yousef Merniz (Étudiant)', time: '2026-03-10T17:20:00', type: 'user' },
    { id: 8, action: 'Reclamation resolved', target: 'Réclamation #R-456', time: '2026-03-10T15:00:00', type: 'reclamation' },
  ];

  const alerts = systemAlerts.length ? systemAlerts : [
    { id: 1, level: 'warning', message: '23 pending document requests awaiting review', time: '2026-03-12T08:00:00' },
    { id: 2, level: 'info', message: 'Affectation campaign "L3→M1" closing in 5 days', time: '2026-03-12T07:00:00' },
    { id: 3, level: 'danger', message: '3 users locked out after failed login attempts', time: '2026-03-11T22:00:00' },
  ];

  const totalRoleCount = roles.reduce((sum, r) => sum + r.count, 0);

  const ACTIVITY_ICONS = {
    user: <icons.users className="w-4 h-4" />,
    role: <icons.shield className="w-4 h-4" />,
    document: <icons.document className="w-4 h-4" />,
    campaign: <icons.folder className="w-4 h-4" />,
    discipline: <icons.alert className="w-4 h-4" />,
    pfe: <icons.academic className="w-4 h-4" />,
    reclamation: <icons.document className="w-4 h-4" />,
  };

  const ALERT_STYLES = {
    warning: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800/50', text: 'text-warning', icon: <icons.alert className="w-4 h-4" /> },
    info: { bg: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800/50', text: 'text-brand', icon: <icons.check className="w-4 h-4" /> },
    danger: { bg: 'bg-red-50 dark:bg-red-950/40', border: 'border-red-200 dark:border-red-800/50', text: 'text-danger', icon: <icons.alert className="w-4 h-4" /> },
  };

  /* ── Loading state ─────────────────────────────────────────── */
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
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">
          {t('superAdmin.dashboardTitle', 'System Administration')}
        </h1>
        <p className="mt-1 text-sm text-ink-tertiary">
          {t('superAdmin.dashboardSubtitle', 'Overview of university platform activity and system health.')}
        </p>
      </div>

      {/* ── System Alerts ──────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((al) => {
            const s = ALERT_STYLES[al.level] || ALERT_STYLES.info;
            return (
              <div key={al.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${s.bg} ${s.border}`}>
                <div className={`shrink-0 ${s.text}`}>{s.icon}</div>
                <p className={`text-sm font-medium flex-1 ${s.text}`}>{al.message}</p>
                <span className="text-xs text-ink-muted shrink-0">{timeAgo(al.time)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Stat Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('superAdmin.totalUsers', 'Total Users')}
          value={s.totalUsers.toLocaleString()}
          icon={<icons.users className="w-5 h-5" />}
          accent="brand"
          change="+12%"
          changeDir="up"
        />
        <StatCard
          label={t('superAdmin.students', 'Students')}
          value={s.totalStudents.toLocaleString()}
          icon={<icons.academic className="w-5 h-5" />}
          accent="success"
          change="+8%"
          changeDir="up"
        />
        <StatCard
          label={t('superAdmin.teachers', 'Teachers')}
          value={s.totalTeachers.toLocaleString()}
          icon={<icons.building className="w-5 h-5" />}
          accent="warning"
          change="+3%"
          changeDir="up"
        />
        <StatCard
          label={t('superAdmin.activeSessions', 'Active Sessions')}
          value={s.activeSessions}
          icon={<icons.chart className="w-5 h-5" />}
          accent="brand"
        />
      </div>

      {/* ── Second Row Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('superAdmin.pendingRequests', 'Pending Requests')}
          value={s.pendingRequests}
          icon={<icons.clock className="w-5 h-5" />}
          accent="warning"
        />
        <StatCard
          label={t('superAdmin.activeCampaigns', 'Active Campaigns')}
          value={s.activeCampaigns}
          icon={<icons.folder className="w-5 h-5" />}
          accent="brand"
        />
        <StatCard
          label={t('superAdmin.openDisciplinary', 'Open Disciplinary')}
          value={s.openDisciplinary}
          icon={<icons.alert className="w-5 h-5" />}
          accent="danger"
        />
        <StatCard
          label={t('superAdmin.administrators', 'Administrators')}
          value={s.totalAdmins}
          icon={<icons.shield className="w-5 h-5" />}
          accent="success"
        />
      </div>

      {/* ── Two-Column: Role Distribution + Recent Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── Role Distribution ────────────────────────────── */}
        <div className="xl:col-span-2 bg-surface rounded-lg border border-edge shadow-card">
          <div className="px-5 py-4 border-b border-edge-subtle flex items-center gap-2">
            <icons.shield className="w-5 h-5 text-ink-tertiary" />
            <h2 className="text-base font-semibold text-ink">
              {t('superAdmin.roleDistribution', 'Role Distribution')}
            </h2>
            <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50">
              {roles.length} {t('superAdmin.roles', 'roles')}
            </span>
          </div>
          <div className="p-5 space-y-3">
            {roles.map((r) => (
              <div key={r.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{r.name}</span>
                  <span className="text-ink-muted">{r.count} <span className="text-ink-tertiary text-xs">({totalRoleCount ? Math.round((r.count / totalRoleCount) * 100) : 0}%)</span></span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.color} transition-all duration-300`}
                    style={{ width: `${totalRoleCount ? (r.count / totalRoleCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Activity ──────────────────────────────── */}
        <div className="xl:col-span-3 bg-surface rounded-lg border border-edge shadow-card">
          <div className="px-5 py-4 border-b border-edge-subtle flex items-center gap-2">
            <icons.clock className="w-5 h-5 text-ink-tertiary" />
            <h2 className="text-base font-semibold text-ink">
              {t('superAdmin.recentActivity', 'Recent Activity')}
            </h2>
            <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50">
              {t('superAdmin.live', 'Live')}
            </span>
          </div>
          <ul className="divide-y divide-edge-subtle">
            {activity.map((act) => (
              <li key={act.id} className="px-5 py-3.5 hover:bg-surface-200/50 transition-colors duration-100">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-surface-200 flex items-center justify-center text-ink-tertiary">
                    {ACTIVITY_ICONS[act.type] || <icons.check className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{act.action}</p>
                    <p className="text-xs text-ink-muted mt-0.5 truncate">{act.target}</p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-muted">{timeAgo(act.time)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t border-edge-subtle">
            <button className="w-full text-center text-sm font-medium text-brand hover:text-brand-hover active:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 rounded-md transition-all duration-150">
              {t('common.viewAll', 'View All Activity')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Recent Users Table ─────────────────────────────── */}
      <div className="bg-surface rounded-lg border border-edge shadow-card">
        <div className="px-5 py-4 border-b border-edge-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <icons.users className="w-5 h-5 text-ink-tertiary" />
            <h2 className="text-base font-semibold text-ink">
              {t('superAdmin.recentUsers', 'Recently Registered Users')}
            </h2>
            <span className="ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50">
              {users.length}
            </span>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium text-brand bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 active:bg-blue-200 dark:active:bg-blue-900/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 transition-all duration-150">
            {t('superAdmin.manageUsers', 'Manage Users')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge-subtle">
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.thUser', 'User')}</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">{t('superAdmin.thEmail', 'Email')}</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">{t('superAdmin.thRole', 'Role')}</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.thStatus', 'Status')}</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-ink-muted uppercase tracking-wider hidden lg:table-cell">{t('superAdmin.thRegistered', 'Registered')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge-subtle">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-200/50 transition-colors duration-100">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${u.prenom} ${u.nom}`} />
                      <div>
                        <p className="font-medium text-ink">{u.prenom} {u.nom}</p>
                        <p className="text-xs text-ink-muted sm:hidden">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-secondary hidden sm:table-cell">{u.email}</td>
                  <td className="px-5 py-3 text-center hidden md:table-cell">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-surface-200 text-ink-secondary border border-edge">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={u.status} config={USER_STATUS} />
                  </td>
                  <td className="px-5 py-3 text-right text-ink-muted hidden lg:table-cell">
                    {formatDate(u.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-edge-subtle">
          <button className="w-full text-center text-sm font-medium text-brand hover:text-brand-hover active:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 rounded-md transition-all duration-150">
            {t('superAdmin.viewAllUsers', 'View All Users →')}
          </button>
        </div>
      </div>
    </div>
  );
}
