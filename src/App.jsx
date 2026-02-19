import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

export default function App() {
  const [page, setPage] = useState('login');

  return (
    <>
      {page === 'login' && <LoginPage onForgotPassword={() => setPage('forgot')} />}
      {page === 'forgot' && <ForgotPasswordPage onBackToLogin={() => setPage('login')} />}
    </>
  );
}
