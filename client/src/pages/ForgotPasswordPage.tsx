/*
  Intent: Same user, but stressed — they can't get in. Calm them down, guide clearly.
          Same tokens as Login for visual continuity. Success state should feel reassuring, not celebratory.
  Palette: Same as Login — canvas, surface, brand.
  Depth: shadow-card on card. No other shadows.
  Surfaces: canvas base, surface card, surface-200 for email highlight.
  Typography: Same hierarchy as Login. Success state uses ink-secondary, not brand.
  Spacing: 4px base. Same card padding as Login (32px).
*/

import React, { useState } from 'react';

export default function ForgotPasswordPage({ onBackToLogin }: { onBackToLogin?: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-[420px] bg-surface rounded-lg shadow-card border border-edge">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-edge-subtle">
          <div className="mx-auto mb-4 w-14 h-14 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-tight">IK</span>
          </div>
          <h1 className="text-xl font-bold text-ink tracking-tight">
            {sent ? 'Check your email' : 'Reset your password'}
          </h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            {sent
              ? 'We sent a reset link to your inbox.'
              : "Enter your email and we'll send a reset link."}
          </p>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div className="px-8 pt-6 pb-8">
          {sent ? (
            <div>
              {/* Success icon — quiet, reassuring */}
              <div className="mb-6 mx-auto w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <p className="text-sm text-ink-secondary text-center mb-2">
                A password reset link has been sent to:
              </p>
              <p className="text-sm font-medium text-ink text-center mb-6 px-3 py-2 bg-surface-200 rounded-md">
                {email}
              </p>
              <p className="text-xs text-ink-muted text-center mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={onBackToLogin}
                className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white
                           bg-brand hover:bg-brand-hover active:bg-brand-dark
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2
                           transition-all duration-150"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Error banner */}
              {error && (
                <div className="mb-5 px-3 py-2.5 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-sm text-danger flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="reset-email" className="block mb-1.5 text-sm font-medium text-ink-secondary">
                  Email address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@univ-ibn-khaldoun.dz"
                  autoFocus
                  className="w-full px-3 py-2.5 text-sm text-ink bg-control-bg border border-control-border rounded-md
                             placeholder:text-ink-muted
                             focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                             transition-colors duration-150"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white
                           bg-brand hover:bg-brand-hover active:bg-brand-dark
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-150
                           flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Sending…' : 'Send reset link'}
              </button>

              {/* Back link */}
              <button
                type="button"
                onClick={onBackToLogin}
                className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
