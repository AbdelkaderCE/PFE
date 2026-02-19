/*
  Topbar — top navigation strip. Same canvas background.
  Height: 64px (h-16). Consistent with sidebar header.
  Profile dropdown: surface-200 elevated dropdown, border-edge. Opens below avatar.
  Hamburger on mobile triggers sidebar.
  Breadcrumb or page title for location context.
*/

import React, { useState, useRef, useEffect } from 'react';

export function Topbar({ title, onMenuToggle, user }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  return (
    <header className="h-16 bg-canvas border-b border-edge flex items-center justify-between px-4 lg:px-6 shrink-0">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md text-ink-secondary hover:bg-surface-200 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {title && (
          <h1 className="text-base font-semibold text-ink tracking-tight">{title}</h1>
        )}
      </div>

      {/* Right: profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface-200 transition-colors"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-brand-light text-brand flex items-center justify-center text-sm font-semibold">
            {user?.initials || 'U'}
          </div>
          <span className="hidden sm:block text-sm font-medium text-ink-secondary max-w-[120px] truncate">
            {user?.name || 'User'}
          </span>
          <svg className="w-3.5 h-3.5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <div className="absolute right-0 mt-1 w-56 bg-surface rounded-md shadow-card border border-edge py-1 z-50">
            {/* User info */}
            <div className="px-4 py-3 border-b border-edge-subtle">
              <p className="text-sm font-medium text-ink">{user?.name || 'User'}</p>
              <p className="text-xs text-ink-tertiary truncate">{user?.email || 'user@univ.dz'}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <DropdownItem label="Profile" icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              } />
              <DropdownItem label="Settings" icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              } />
            </div>

            <div className="border-t border-edge-subtle py-1">
              <DropdownItem label="Sign out" variant="danger" icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              } />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function DropdownItem({ label, icon, variant = 'default', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
        ${variant === 'danger'
          ? 'text-danger hover:bg-red-50'
          : 'text-ink-secondary hover:bg-surface-200 hover:text-ink'
        }
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
