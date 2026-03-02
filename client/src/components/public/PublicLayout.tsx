import React from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <PublicNavbar />
      {/* pt-16 offsets the fixed navbar */}
      <main className="flex-1 pt-16">{children}</main>
      <PublicFooter />
    </div>
  );
}
