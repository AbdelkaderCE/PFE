/*
  Intent: Full CRUD table for managing platform users.
          Admin can search, filter by role/status, view details, and manage accounts.
          Mock data mirrors the users, enseignants, etudiants, user_roles, grades tables.
  Access: SuperAdmin / Vice-Doyen only.
  Palette: canvas base, surface cards. Semantic colors for status.
  Depth: shadow-card + border-edge on cards. No stacked shadows.
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-5/p-6. gap-6 between sections.
*/

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import request from '../services/api';

/* ── Inline SVG Icons ──────────────────────────────────────── */

const icons = {
  search: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  plus: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  edit: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  trash: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  x: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  eye: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ),
  chevronLeft: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  ),
  chevronRight: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  ),
  users: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
};

/* ── Status & Role Configs ──────────────────────────────────── */

const USER_STATUS_CONFIG = {
  active:    { label: 'Active',    bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-success', border: 'border-green-200 dark:border-green-800/50', dot: 'bg-success' },
  inactive:  { label: 'Inactive',  bg: 'bg-surface-200', text: 'text-ink-muted', border: 'border-edge', dot: 'bg-ink-muted' },
  suspended: { label: 'Suspended', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-danger', border: 'border-red-200 dark:border-red-800/50', dot: 'bg-danger' },
};

const ROLE_BADGES = {
  'Étudiant':          'bg-blue-50 dark:bg-blue-950/40 text-brand border-blue-200 dark:border-blue-800/50',
  'Enseignant':        'bg-green-50 dark:bg-green-950/40 text-success border-green-200 dark:border-green-800/50',
  'Chef Département':  'bg-amber-50 dark:bg-amber-950/40 text-warning border-amber-200 dark:border-amber-800/50',
  'Chef Spécialité':   'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50',
  'Vice-Doyen':        'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
  'Admin':             'bg-red-50 dark:bg-red-950/40 text-danger border-red-200 dark:border-red-800/50',
  'Délégué':           'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50',
};

const FILTER_ROLES = ['All', 'Étudiant', 'Enseignant', 'Chef Département', 'Chef Spécialité', 'Vice-Doyen', 'Admin', 'Délégué'];
const FILTER_STATUS = ['all', 'active', 'inactive', 'suspended'];

/* ── Helpers ────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const cfg = USER_STATUS_CONFIG[status];
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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Mock Data (mirrors users, enseignants, etudiants tables) ─ */

const MOCK_USERS = [
  { id: 1, nom: 'Benali', prenom: 'Ahmed', email: 'a.benali@univ.dz', sexe: 'H', telephone: '0555123456', status: 'active', roles: ['Étudiant'], matricule: 'ETU2024001', promo: 'L3 SIC', moyenne: 14.5, created_at: '2025-09-01T10:00:00', last_login: '2026-03-12T09:30:00' },
  { id: 2, nom: 'Kaci', prenom: 'Sara', email: 's.kaci@univ.dz', sexe: 'F', telephone: '0555987654', status: 'active', roles: ['Enseignant'], grade: 'Maître de Conférences A', bureau: 'B204', date_recrutement: '2018-09-01', created_at: '2024-01-15T08:00:00', last_login: '2026-03-12T08:15:00' },
  { id: 3, nom: 'Merniz', prenom: 'Yousef', email: 'y.merniz@univ.dz', sexe: 'H', telephone: '0555456789', status: 'suspended', roles: ['Étudiant'], matricule: 'ETU2023045', promo: 'L2 MI', moyenne: 9.8, created_at: '2024-09-01T10:00:00', last_login: '2026-02-28T16:00:00' },
  { id: 4, nom: 'Hamidi', prenom: 'Lina', email: 'l.hamidi@univ.dz', sexe: 'F', telephone: '0555111222', status: 'active', roles: ['Vice-Doyen'], grade: 'Professeur', bureau: 'A101', date_recrutement: '2010-09-01', created_at: '2023-01-01T08:00:00', last_login: '2026-03-12T10:00:00' },
  { id: 5, nom: 'Saadi', prenom: 'Omar', email: 'o.saadi@univ.dz', sexe: 'H', telephone: '0555333444', status: 'inactive', roles: ['Étudiant'], matricule: 'ETU2022098', promo: 'M1 RSI', moyenne: 12.3, created_at: '2023-09-01T10:00:00', last_login: '2025-12-15T14:00:00' },
  { id: 6, nom: 'Boudiaf', prenom: 'Fatima', email: 'f.boudiaf@univ.dz', sexe: 'F', telephone: '0555666777', status: 'active', roles: ['Enseignant', 'Chef Département'], grade: 'Professeur', bureau: 'C301', date_recrutement: '2008-09-01', created_at: '2022-01-01T08:00:00', last_login: '2026-03-11T17:30:00' },
  { id: 7, nom: 'Cherif', prenom: 'Karim', email: 'k.cherif@univ.dz', sexe: 'H', telephone: '0555888999', status: 'active', roles: ['Enseignant', 'Chef Spécialité'], grade: 'Maître de Conférences B', bureau: 'B115', date_recrutement: '2015-09-01', created_at: '2023-06-01T08:00:00', last_login: '2026-03-12T07:45:00' },
  { id: 8, nom: 'Rahmani', prenom: 'Nour', email: 'n.rahmani@univ.dz', sexe: 'F', telephone: '0555444555', status: 'active', roles: ['Étudiant', 'Délégué'], matricule: 'ETU2024123', promo: 'L3 SIC', moyenne: 15.2, created_at: '2025-09-01T10:00:00', last_login: '2026-03-12T11:00:00' },
  { id: 9, nom: 'Amrani', prenom: 'Djamel', email: 'd.amrani@univ.dz', sexe: 'H', telephone: '0555222333', status: 'active', roles: ['Admin'], created_at: '2022-01-01T08:00:00', last_login: '2026-03-12T06:00:00' },
  { id: 10, nom: 'Tounsi', prenom: 'Amira', email: 'a.tounsi@univ.dz', sexe: 'F', telephone: '0555777888', status: 'active', roles: ['Étudiant'], matricule: 'ETU2025001', promo: 'M2 GL', moyenne: 16.1, created_at: '2025-09-01T10:00:00', last_login: '2026-03-11T20:00:00' },
  { id: 11, nom: 'Bouzid', prenom: 'Amine', email: 'a.bouzid@univ.dz', sexe: 'H', telephone: '0555999000', status: 'active', roles: ['Étudiant'], matricule: 'ETU2024089', promo: 'L3 MI', moyenne: 11.7, created_at: '2025-09-01T10:00:00', last_login: '2026-03-10T15:00:00' },
  { id: 12, nom: 'Messaoudi', prenom: 'Yasmine', email: 'y.messaoudi@univ.dz', sexe: 'F', telephone: '0555112233', status: 'active', roles: ['Enseignant'], grade: 'Maître Assistant A', bureau: 'B310', date_recrutement: '2020-09-01', created_at: '2024-01-01T08:00:00', last_login: '2026-03-12T10:30:00' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function UsersManagementPage({ role }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await request('/api/v1/admin/users');
        if (!cancelled && res.data) setUsers(res.data);
      } catch {
        /* API not ready — use mock */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const displayUsers = (users.length ? users : MOCK_USERS)
    .filter((u) => {
      if (filterRole !== 'All' && !u.roles.includes(filterRole)) return false;
      if (filterStatus !== 'all' && u.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          u.nom.toLowerCase().includes(q) ||
          u.prenom.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.matricule && u.matricule.toLowerCase().includes(q))
        );
      }
      return true;
    });

  const totalPages = Math.ceil(displayUsers.length / pageSize);
  const paginatedUsers = displayUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusCounts = {
    all: (users.length ? users : MOCK_USERS).length,
    active: (users.length ? users : MOCK_USERS).filter(u => u.status === 'active').length,
    inactive: (users.length ? users : MOCK_USERS).filter(u => u.status === 'inactive').length,
    suspended: (users.length ? users : MOCK_USERS).filter(u => u.status === 'suspended').length,
  };

  /* ── Loading state ──────────────────────────────────────── */
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
            {t('superAdmin.usersTitle', 'User Management')}
          </h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            {t('superAdmin.usersSubtitle', 'Manage all platform users, roles, and account statuses.')}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm">
          <icons.plus className="w-4 h-4" />
          {t('superAdmin.addUser', 'Add User')}
        </button>
      </div>

      {/* ── Stat Summary ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('superAdmin.allUsers', 'All Users'), value: statusCounts.all, accent: 'brand' },
          { label: t('superAdmin.activeUsers', 'Active'), value: statusCounts.active, accent: 'success' },
          { label: t('superAdmin.inactiveUsers', 'Inactive'), value: statusCounts.inactive, accent: 'warning' },
          { label: t('superAdmin.suspendedUsers', 'Suspended'), value: statusCounts.suspended, accent: 'danger' },
        ].map((s) => {
          const accents = {
            brand:   'bg-blue-50 dark:bg-blue-950/40 text-brand',
            success: 'bg-green-50 dark:bg-green-950/40 text-success',
            warning: 'bg-amber-50 dark:bg-amber-950/40 text-warning',
            danger:  'bg-red-50 dark:bg-red-950/40 text-danger',
          };
          return (
            <div key={s.label} className="bg-surface rounded-lg border border-edge shadow-card p-4 flex items-center gap-3">
              <div className={`shrink-0 w-9 h-9 rounded-lg ${accents[s.accent]} flex items-center justify-center`}>
                <icons.users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-ink tracking-tight">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Search + Filters ───────────────────────────────── */}
      <div className="bg-surface rounded-lg border border-edge shadow-card">
        <div className="px-5 py-4 border-b border-edge-subtle space-y-3">
          {/* Search bar */}
          <div className="relative">
            <icons.search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder={t('superAdmin.searchPlaceholder', 'Search by name, email, or matricule...')}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-md border border-control-border bg-control-bg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-150"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                <icons.x className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter pills row */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Role filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-ink-muted uppercase tracking-wider mr-1">{t('superAdmin.filterRole', 'Role')}:</span>
              <div className="bg-surface-200 rounded-md p-1 inline-flex flex-wrap gap-0.5">
                {FILTER_ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setFilterRole(r); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
                      filterRole === r
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {r === 'All' ? t('common.all', 'All') : r}
                  </button>
                ))}
              </div>
            </div>
            {/* Status filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-ink-muted uppercase tracking-wider mr-1">{t('superAdmin.filterStatus', 'Status')}:</span>
              <div className="bg-surface-200 rounded-md p-1 inline-flex flex-wrap gap-0.5">
                {FILTER_STATUS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                    className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-all duration-150 ${
                      filterStatus === s
                        ? 'bg-brand text-white shadow-sm'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    {s === 'all' ? t('common.all', 'All') : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Users Table ──────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge-subtle">
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.thUser', 'User')}</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider hidden sm:table-cell">{t('superAdmin.thEmail', 'Email')}</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider hidden md:table-cell">{t('superAdmin.thRole', 'Roles')}</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.thStatus', 'Status')}</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-ink-muted uppercase tracking-wider hidden lg:table-cell">{t('superAdmin.thLastLogin', 'Last Login')}</th>
                <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.thActions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge-subtle">
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <icons.users className="w-10 h-10 mx-auto text-ink-muted mb-3" />
                    <p className="text-sm font-medium text-ink-secondary">{t('superAdmin.noUsersFound', 'No users found')}</p>
                    <p className="text-xs text-ink-muted mt-1">{t('superAdmin.tryDifferentFilter', 'Try adjusting your search or filters.')}</p>
                  </td>
                </tr>
              )}
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-200/50 transition-colors duration-100">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${u.prenom} ${u.nom}`} />
                      <div>
                        <p className="font-medium text-ink">{u.prenom} {u.nom}</p>
                        <p className="text-xs text-ink-muted sm:hidden">{u.email}</p>
                        {u.matricule && <p className="text-xs text-ink-tertiary mt-0.5">{u.matricule}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-secondary hidden sm:table-cell">{u.email}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {u.roles.map((r) => (
                        <span key={r} className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded border ${ROLE_BADGES[r] || 'bg-surface-200 text-ink-secondary border-edge'}`}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-3 text-right text-ink-muted hidden lg:table-cell">
                    {u.last_login ? formatDate(u.last_login) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => { setSelectedUser(u); setShowModal(true); }}
                        className="p-1.5 rounded-md text-ink-muted hover:text-brand hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        title="View Details"
                      >
                        <icons.eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-ink-muted hover:text-brand hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors" title="Edit">
                        <icons.edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-ink-muted hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors" title="Delete">
                        <icons.trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ───────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-edge-subtle flex items-center justify-between">
            <p className="text-xs text-ink-muted">
              {t('common.showing', 'Showing')} {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, displayUsers.length)} {t('common.of', 'of')} {displayUsers.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <icons.chevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                    pg === currentPage
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-ink-secondary hover:bg-surface-200'
                  }`}
                >
                  {pg}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <icons.chevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── User Detail Modal ──────────────────────────────── */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-surface rounded-xl border border-edge shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-edge-subtle">
              <h3 className="text-base font-semibold text-ink">{t('superAdmin.userDetails', 'User Details')}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors">
                <icons.x className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <Avatar name={`${selectedUser.prenom} ${selectedUser.nom}`} size="w-14 h-14 text-lg" />
                <div>
                  <p className="text-lg font-bold text-ink">{selectedUser.prenom} {selectedUser.nom}</p>
                  <p className="text-sm text-ink-secondary">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={selectedUser.status} />
                    {selectedUser.roles.map((r) => (
                      <span key={r} className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded border ${ROLE_BADGES[r] || 'bg-surface-200 text-ink-secondary border-edge'}`}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.gender', 'Gender')}</p>
                  <p className="text-ink font-medium">{selectedUser.sexe === 'H' ? 'Male' : 'Female'}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.phone', 'Phone')}</p>
                  <p className="text-ink font-medium">{selectedUser.telephone || '—'}</p>
                </div>
                {selectedUser.matricule && (
                  <>
                    <div>
                      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.matricule', 'Matricule')}</p>
                      <p className="text-ink font-medium">{selectedUser.matricule}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.promo', 'Promo')}</p>
                      <p className="text-ink font-medium">{selectedUser.promo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.average', 'Average')}</p>
                      <p className="text-ink font-medium">{selectedUser.moyenne}/20</p>
                    </div>
                  </>
                )}
                {selectedUser.grade && (
                  <>
                    <div>
                      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.grade', 'Grade')}</p>
                      <p className="text-ink font-medium">{selectedUser.grade}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.office', 'Office')}</p>
                      <p className="text-ink font-medium">{selectedUser.bureau}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.recruitmentDate', 'Recruitment')}</p>
                      <p className="text-ink font-medium">{formatDate(selectedUser.date_recrutement)}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.registered', 'Registered')}</p>
                  <p className="text-ink font-medium">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1">{t('superAdmin.lastLogin', 'Last Login')}</p>
                  <p className="text-ink font-medium">{selectedUser.last_login ? formatDate(selectedUser.last_login) : '—'}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-edge-subtle bg-canvas">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-ink-secondary bg-surface border border-edge rounded-md hover:bg-surface-200 active:bg-surface-300 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 transition-all duration-150"
              >
                {t('common.close', 'Close')}
              </button>
              <button className="px-4 py-2.5 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-hover active:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm">
                {t('superAdmin.editUser', 'Edit User')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
