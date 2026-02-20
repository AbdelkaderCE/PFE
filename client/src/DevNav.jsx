import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DEV_PAGES } from './pages/_devPages';

export default function DevNav() {
  const { pathname } = useLocation();
  return (
    <nav className="w-full bg-surface border-b border-edge px-4 py-2 flex gap-4 z-50 shrink-0 overflow-x-auto">
      {DEV_PAGES.map((page) => (
        <Link
          key={page.path}
          to={page.path}
          className={
            'text-sm font-medium px-3 py-1.5 rounded transition-colors duration-150 whitespace-nowrap' +
            (pathname === page.path
              ? ' bg-brand text-white shadow-sm'
              : ' text-ink-secondary hover:bg-surface-200')
          }
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}
