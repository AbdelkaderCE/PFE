/*
  ChangePasswordPage — shown when requiresPasswordChange is true after first login
  (firstUse flag), or when the user navigates to /change-password manually.
  Wired to POST /api/v1/auth/change-password via authAPI.changePassword.
*/

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setDone(true);
      // Backend clears cookies on password change — log out after 2s and redirect
      setTimeout(async () => {
        await logout();
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-[420px] bg-surface rounded-lg shadow-card border border-edge">

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-edge-subtle">
          <img
            src="/Logo.png"
            alt="Ibn Khaldoun University"
            className="mx-auto mb-4 w-14 h-14 rounded-lg object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="text-xl font-bold text-ink tracking-tight">
            {done ? 'Password Changed' : 'Change Password'}
          </h1>
          <p className="mt-1 text-sm text-ink-tertiary">
            {done
              ? 'Redirecting you to login…'
              : 'You must set a new password before continuing.'}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pt-6 pb-8">
          {done ? (
            <div className="text-center">
              <div className="mb-6 mx-auto w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm text-ink-secondary">Your password has been updated. Please sign in again.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 px-3 py-2.5 rounded-md bg-red-50 border border-red-200 text-sm text-danger flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Current password */}
              <div className="mb-4">
                <label htmlFor="current-password" className="block mb-1.5 text-sm font-medium text-ink-secondary">
                  Current Password
                </label>
                <input
                  id="current-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-2.5 text-sm text-ink bg-control-bg border border-control-border rounded-md
                             placeholder:text-ink-muted
                             focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                             disabled:opacity-50 transition-colors duration-150"
                />
              </div>

              {/* New password */}
              <div className="mb-4">
                <label htmlFor="new-password" className="block mb-1.5 text-sm font-medium text-ink-secondary">
                  New Password
                </label>
                <input
                  id="new-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-ink bg-control-bg border border-control-border rounded-md
                             placeholder:text-ink-muted
                             focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                             disabled:opacity-50 transition-colors duration-150"
                />
                <p className="mt-1.5 text-xs text-ink-muted">Min. 8 characters with uppercase, number, and symbol.</p>
              </div>

              {/* Confirm password */}
              <div className="mb-5">
                <label htmlFor="confirm-password" className="block mb-1.5 text-sm font-medium text-ink-secondary">
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm text-ink bg-control-bg border border-control-border rounded-md
                             placeholder:text-ink-muted
                             focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                             disabled:opacity-50 transition-colors duration-150"
                />
              </div>

              {/* Show/hide toggle */}
              <label className="mb-5 flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={() => setShowPasswords((v) => !v)}
                  className="rounded border-control-border text-brand focus:ring-brand/30"
                />
                <span className="text-sm text-ink-secondary">Show passwords</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white
                           bg-brand hover:bg-brand-hover active:bg-brand-dark
                           focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-150 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Saving…' : 'Change Password'}
              </button>

              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150"
                >
                  <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
