/*
  Navbar — public-facing navigation bar.
  Converted from friend's TS. FaBars/FaTimes → inline SVGs, generic grays → tokens.
  Image import removed (asset may not exist yet) — fallback text always used.
*/

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Inline SVG icons */
const MenuIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);
const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-md shadow-card py-2 border-b border-edge'
          : 'bg-canvas py-4 border-b border-edge'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* IK monogram — matches the Institutional Seal from rules.md */}
            <div className="w-10 h-10 rounded-lg bg-brand text-white flex items-center justify-center font-bold text-sm tracking-tight select-none">
              IK
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg font-bold text-ink">Ibn Khaldoun</span>
              <span className="text-xs text-ink-tertiary">University</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-ink-secondary hover:text-ink font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <Link
              to="/login"
              className="bg-brand text-white px-5 py-2 rounded-md font-medium hover:bg-brand-hover transition-all duration-150"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-md text-ink-secondary hover:bg-surface-200 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-md text-ink-secondary hover:bg-surface-200 hover:text-ink transition font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-md bg-brand text-white text-center font-medium hover:bg-brand-hover transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
