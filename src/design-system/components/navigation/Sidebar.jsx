/*
  Sidebar — same background as canvas (not a different color world).
  Separated by border-edge on the right — the border is enough.
  Active item: brand-light bg + brand text. Hover: surface-200.
  Collapsed state for mobile: overlay with scrim.
  Width: 256px (w-64). Compact enough for tools, not a brochure.
  Navigation teaches people how to think about the space they're in.
*/

import React from 'react';

export function Sidebar({ items = [], activeKey, onNavigate, collapsed, onClose, header }) {
  return (
    <>
      {/* Mobile scrim */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64
          bg-canvas border-r border-edge
          flex flex-col
          transition-transform duration-200 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${collapsed ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center border-b border-edge-subtle shrink-0">
          {header || (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <span className="text-white font-bold text-xs">IK</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink leading-tight">Ibn Khaldoun</p>
                <p className="text-xs text-ink-muted leading-tight">Pedagogical Platform</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <li key={item.key}>
                  {item.section && (
                    <p className="px-3 pt-4 pb-1.5 text-xs font-semibold text-ink-muted uppercase tracking-wider">
                      {item.section}
                    </p>
                  )}
                  {!item.section && (
                    <button
                      onClick={() => onNavigate?.(item.key)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                        transition-colors duration-100
                        ${isActive
                          ? 'bg-brand-light text-brand'
                          : 'text-ink-secondary hover:bg-surface-200 hover:text-ink'
                        }
                      `}
                    >
                      {item.icon && <span className="w-5 h-5 shrink-0">{item.icon}</span>}
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-surface-300 text-ink-tertiary px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-edge-subtle shrink-0">
          <p className="text-xs text-ink-muted">© 2026 Ibn Khaldoun University</p>
        </div>
      </aside>
    </>
  );
}
