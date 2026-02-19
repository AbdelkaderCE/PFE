/*
  Intent: A dev-only preview page showing the theme system in action.
          Shows all accent swatches, mode toggle, and token preview cards.
*/

import React from 'react';
import ThemeSwitcher from '../theme/ThemeSwitcher';
import { useTheme } from '../theme/ThemeProvider';

export default function ThemePreviewPage() {
  const { mode, accent } = useTheme();

  return (
    <div className="min-h-screen bg-canvas px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Theme System</h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            Current: <span className="font-medium text-ink-secondary">{mode}</span> mode
            + <span className="font-medium text-ink-secondary">{accent}</span> accent
          </p>
        </div>

        {/* Controls */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6">
          <h2 className="text-base font-semibold text-ink mb-4">Controls</h2>
          <ThemeSwitcher />
        </div>

        {/* Surface preview */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-ink mb-4">Surfaces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Canvas', cls: 'bg-canvas' },
              { name: 'Surface', cls: 'bg-surface' },
              { name: 'Surface 200', cls: 'bg-surface-200' },
              { name: 'Surface 300', cls: 'bg-surface-300' },
            ].map((s) => (
              <div key={s.name} className="text-center">
                <div className={`${s.cls} w-full h-16 rounded-lg border border-edge`} />
                <p className="mt-2 text-xs font-medium text-ink-secondary">{s.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Typography preview */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6 space-y-3">
          <h2 className="text-base font-semibold text-ink mb-4">Typography</h2>
          <p className="text-xl font-bold text-ink tracking-tight">Heading — text-ink</p>
          <p className="text-base font-semibold text-ink">Subheading — text-ink</p>
          <p className="text-sm text-ink">Body text — text-ink</p>
          <p className="text-sm font-medium text-ink-secondary">Label — text-ink-secondary</p>
          <p className="text-xs text-ink-tertiary">Caption — text-ink-tertiary</p>
          <p className="text-xs text-ink-muted">Muted — text-ink-muted</p>
        </div>

        {/* Brand colors preview */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-ink mb-4">Brand Colors</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Brand', cls: 'bg-brand' },
              { name: 'Brand Light', cls: 'bg-brand-light' },
              { name: 'Brand Hover', cls: 'bg-brand-hover' },
              { name: 'Brand Dark', cls: 'bg-brand-dark' },
            ].map((s) => (
              <div key={s.name} className="text-center">
                <div className={`${s.cls} w-full h-12 rounded-lg border border-edge`} />
                <p className="mt-2 text-xs font-medium text-ink-secondary">{s.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic colors */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-ink mb-4">Semantic Colors</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Success', cls: 'bg-success' },
              { name: 'Warning', cls: 'bg-warning' },
              { name: 'Danger', cls: 'bg-danger' },
            ].map((s) => (
              <div key={s.name} className="text-center">
                <div className={`${s.cls} w-full h-10 rounded-lg`} />
                <p className="mt-2 text-xs font-medium text-ink-secondary">{s.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Button preview */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-ink mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <button className="py-2.5 px-4 rounded-md text-sm font-medium text-white bg-brand hover:bg-brand-hover active:bg-brand-dark transition-all duration-150">
              Primary
            </button>
            <button className="py-2.5 px-4 rounded-md text-sm font-medium text-ink-secondary bg-surface border border-edge hover:bg-surface-200 transition-all duration-150">
              Secondary
            </button>
            <button className="py-2.5 px-4 rounded-md text-sm font-medium text-ink-secondary hover:bg-surface-200 transition-all duration-150">
              Ghost
            </button>
            <button className="py-2.5 px-4 rounded-md text-sm font-medium text-white bg-danger hover:opacity-90 transition-all duration-150">
              Danger
            </button>
          </div>
        </div>

        {/* Card + Input preview */}
        <div className="bg-surface rounded-lg border border-edge shadow-card p-6 space-y-4">
          <h2 className="text-base font-semibold text-ink mb-4">Form Controls</h2>
          <div>
            <label htmlFor="preview-input" className="block mb-1.5 text-sm font-medium text-ink-secondary">
              Sample input
            </label>
            <input
              id="preview-input"
              type="text"
              placeholder="Type something…"
              className="w-full max-w-sm px-3 py-2.5 text-sm text-ink bg-control-bg border border-control-border rounded-md
                         placeholder:text-ink-muted
                         focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                         transition-colors duration-150"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
