/*
  Intent: Role-permission matrix management. Admins can view roles,
          their assigned permissions, and manage the RBAC structure.
          Mirrors: roles, permissions, role_permissions tables.
  Access: SuperAdmin / Vice-Doyen only.
  Palette: canvas base, surface cards. Semantic colors for modules.
  Depth: shadow-card + border-edge on cards. No stacked shadows.
  Typography: Inter. Section headings = text-base font-semibold. Body = text-sm.
  Spacing: 4px base. Cards p-5/p-6. gap-6 between sections.
*/

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import request from '../services/api';

/* ── Inline SVG Icons ──────────────────────────────────────── */

const icons = {
  shield: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
  key: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
  ),
  check: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
  x: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  edit: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  users: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
};

/* ── Mock Roles (mirrors roles table) ──────────────────────── */

const MOCK_ROLES = [
  { id: 1, nom: 'admin',             description: 'Full system access', userCount: 12 },
  { id: 2, nom: 'vice_doyen',        description: 'Faculty-level administration', userCount: 3 },
  { id: 3, nom: 'chef_departement',  description: 'Department head', userCount: 12 },
  { id: 4, nom: 'chef_specialite',   description: 'Specialty head', userCount: 24 },
  { id: 5, nom: 'enseignant',        description: 'Teacher / Professor', userCount: 143 },
  { id: 6, nom: 'president_conseil', description: 'Disciplinary council president', userCount: 4 },
  { id: 7, nom: 'etudiant',          description: 'Student', userCount: 982 },
  { id: 8, nom: 'delegue',           description: 'Class delegate (student)', userCount: 48 },
];

/* ── Mock Permissions (mirrors permissions table) ─────────── */

const MODULES = ['auth', 'pfe', 'discipline', 'reclamations', 'documents', 'affectation', 'annonces', 'dashboard', 'ai'];
const ACTIONS = ['create', 'read', 'update', 'delete'];

const MOCK_PERMISSIONS = MODULES.flatMap((mod, mi) =>
  ACTIONS.map((act, ai) => ({
    id: mi * ACTIONS.length + ai + 1,
    nom: `${mod}.${act}`,
    description: `${act.charAt(0).toUpperCase() + act.slice(1)} ${mod}`,
    module: mod,
    action: act,
  }))
);

/* ── Mock role_permissions matrix ──────────────────────────── */

const MOCK_MATRIX = {
  1: MOCK_PERMISSIONS.map(p => p.id), // admin — all permissions
  2: MOCK_PERMISSIONS.filter(p => ['auth', 'discipline', 'affectation', 'annonces', 'dashboard', 'documents'].includes(p.module)).map(p => p.id),
  3: MOCK_PERMISSIONS.filter(p => ['auth', 'affectation', 'dashboard', 'pfe'].includes(p.module) && ['read', 'update'].includes(p.action)).map(p => p.id),
  4: MOCK_PERMISSIONS.filter(p => ['auth', 'pfe', 'dashboard'].includes(p.module) && ['read', 'update'].includes(p.action)).map(p => p.id),
  5: MOCK_PERMISSIONS.filter(p => ['pfe', 'documents', 'reclamations', 'dashboard', 'annonces'].includes(p.module) && ['read', 'create'].includes(p.action)).map(p => p.id),
  6: MOCK_PERMISSIONS.filter(p => ['discipline'].includes(p.module)).map(p => p.id),
  7: MOCK_PERMISSIONS.filter(p => ['pfe', 'reclamations', 'affectation', 'dashboard', 'annonces'].includes(p.module) && p.action === 'read').map(p => p.id),
  8: MOCK_PERMISSIONS.filter(p => ['pfe', 'reclamations', 'dashboard', 'annonces'].includes(p.module) && ['read', 'create'].includes(p.action)).map(p => p.id),
};

/* ── Module color map ──────────────────────────────────────── */

const MODULE_COLORS = {
  auth:          'bg-blue-50 dark:bg-blue-950/40 text-brand border-blue-200 dark:border-blue-800/50',
  pfe:           'bg-green-50 dark:bg-green-950/40 text-success border-green-200 dark:border-green-800/50',
  discipline:    'bg-red-50 dark:bg-red-950/40 text-danger border-red-200 dark:border-red-800/50',
  reclamations:  'bg-amber-50 dark:bg-amber-950/40 text-warning border-amber-200 dark:border-amber-800/50',
  documents:     'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/50',
  affectation:   'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50',
  annonces:      'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
  dashboard:     'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
  ai:            'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function RolesPermissionsPage({ role }) {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeModule, setActiveModule] = useState('all');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [rRes, pRes, mRes] = await Promise.allSettled([
          request('/api/v1/admin/roles'),
          request('/api/v1/admin/permissions'),
          request('/api/v1/admin/role-permissions'),
        ]);
        if (cancelled) return;
        if (rRes.status === 'fulfilled') setRoles(rRes.value.data || []);
        if (pRes.status === 'fulfilled') setPermissions(pRes.value.data || []);
        if (mRes.status === 'fulfilled') setMatrix(mRes.value.data || {});
      } catch {
        /* API not ready — use mocks */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const displayRoles = roles.length ? roles : MOCK_ROLES;
  const displayPerms = permissions.length ? permissions : MOCK_PERMISSIONS;
  const displayMatrix = Object.keys(matrix).length ? matrix : MOCK_MATRIX;

  const filteredPerms = activeModule === 'all'
    ? displayPerms
    : displayPerms.filter(p => p.module === activeModule);

  const activeRoleData = selectedRole
    ? displayRoles.find(r => r.id === selectedRole)
    : null;

  const activeRolePerms = selectedRole
    ? new Set(displayMatrix[selectedRole] || [])
    : new Set();

  /* ── Loading ────────────────────────────────────────────── */
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
          {t('superAdmin.rolesTitle', 'Roles & Permissions')}
        </h1>
        <p className="mt-1 text-sm text-ink-tertiary">
          {t('superAdmin.rolesSubtitle', 'Configure role-based access control for every module.')}
        </p>
      </div>

      {/* ── Stats Strip ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('superAdmin.totalRoles', 'Total Roles'), value: displayRoles.length, icon: <icons.shield className="w-5 h-5" />, accent: 'bg-blue-50 dark:bg-blue-950/40 text-brand' },
          { label: t('superAdmin.totalPermissions', 'Permissions'), value: displayPerms.length, icon: <icons.key className="w-5 h-5" />, accent: 'bg-green-50 dark:bg-green-950/40 text-success' },
          { label: t('superAdmin.modules', 'Modules'), value: MODULES.length, icon: <icons.shield className="w-5 h-5" />, accent: 'bg-amber-50 dark:bg-amber-950/40 text-warning' },
          { label: t('superAdmin.totalAssignments', 'Assignments'), value: Object.values(displayMatrix).reduce((s, arr) => s + arr.length, 0), icon: <icons.users className="w-5 h-5" />, accent: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-lg border border-edge shadow-card p-4 flex items-center gap-3">
            <div className={`shrink-0 w-9 h-9 rounded-lg ${s.accent} flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-ink tracking-tight">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-Column: Roles List + Permission Matrix ─────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* ── Roles List (Left) ────────────────────────────── */}
        <div className="xl:col-span-4 bg-surface rounded-lg border border-edge shadow-card">
          <div className="px-5 py-4 border-b border-edge-subtle flex items-center gap-2">
            <icons.shield className="w-5 h-5 text-ink-tertiary" />
            <h2 className="text-base font-semibold text-ink">{t('superAdmin.rolesList', 'Roles')}</h2>
            <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-950/40 text-brand border border-blue-200 dark:border-blue-800/50">
              {displayRoles.length}
            </span>
          </div>
          <ul className="divide-y divide-edge-subtle">
            {displayRoles.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setSelectedRole(r.id)}
                  className={`w-full px-5 py-3.5 text-left hover:bg-surface-200/50 transition-colors duration-100 ${
                    selectedRole === r.id ? 'bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-brand' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{r.nom}</p>
                      <p className="text-xs text-ink-muted mt-0.5">{r.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                        <icons.users className="w-3.5 h-3.5" />
                        {r.userCount}
                      </span>
                      <p className="text-[10px] text-ink-tertiary mt-0.5">
                        {(displayMatrix[r.id] || []).length} perms
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Permission Matrix (Right) ────────────────────── */}
        <div className="xl:col-span-8 bg-surface rounded-lg border border-edge shadow-card">
          <div className="px-5 py-4 border-b border-edge-subtle">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <icons.key className="w-5 h-5 text-ink-tertiary" />
                <h2 className="text-base font-semibold text-ink">
                  {activeRoleData
                    ? `${t('superAdmin.permissionsFor', 'Permissions for')} "${activeRoleData.nom}"`
                    : t('superAdmin.selectRole', 'Select a role to view permissions')
                  }
                </h2>
              </div>
              {activeRoleData && (
                <button className="px-3 py-1.5 text-xs font-medium text-brand bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 active:bg-blue-200 dark:active:bg-blue-900/60 focus:ring-2 focus:ring-brand/30 focus:ring-offset-2 transition-all duration-150">
                  <icons.edit className="w-3.5 h-3.5 inline mr-1" />
                  {t('superAdmin.editPermissions', 'Edit')}
                </button>
              )}
            </div>

            {/* Module filter pills — segmented control */}
            <div className="bg-surface-200 rounded-md p-1 flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setActiveModule('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  activeModule === 'all'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {t('common.all', 'All')}
              </button>
              {MODULES.map((mod) => (
                <button
                  key={mod}
                  onClick={() => setActiveModule(mod)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-150 ${
                    activeModule === mod
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix content */}
          {!selectedRole ? (
            <div className="px-5 py-16 text-center">
              <icons.shield className="w-12 h-12 mx-auto text-ink-muted mb-3" />
              <p className="text-sm font-medium text-ink-secondary">{t('superAdmin.noRoleSelected', 'No role selected')}</p>
              <p className="text-xs text-ink-muted mt-1">{t('superAdmin.clickRole', 'Click a role on the left to view its permissions.')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-edge-subtle">
                    <th className="px-5 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.permission', 'Permission')}</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.module', 'Module')}</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.action', 'Action')}</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-ink-muted uppercase tracking-wider">{t('superAdmin.granted', 'Granted')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge-subtle">
                  {filteredPerms.map((p) => {
                    const granted = activeRolePerms.has(p.id);
                    return (
                      <tr key={p.id} className="hover:bg-surface-200/50 transition-colors duration-100">
                        <td className="px-5 py-3">
                          <p className="font-medium text-ink">{p.nom}</p>
                          <p className="text-xs text-ink-muted mt-0.5">{p.description}</p>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded capitalize border ${MODULE_COLORS[p.module] || 'bg-surface-200 text-ink-secondary border-edge'}`}>
                            {p.module}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-surface-200 text-ink-secondary border border-edge capitalize">
                            {p.action}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          {granted ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 dark:bg-green-950/40">
                              <icons.check className="w-4 h-4 text-success" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-200">
                              <icons.x className="w-3.5 h-3.5 text-ink-muted" />
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
