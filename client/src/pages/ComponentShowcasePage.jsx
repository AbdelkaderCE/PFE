/*
  ComponentShowcasePage — previews all new reusable components from the merge.
  Accessible via DevNav at /components.
*/

import React, { useState } from 'react';

/* ── Common components ── */
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Skeleton from '../components/common/Skeleton';
import DashboardCard from '../components/common/DashboardCard';

/* ── Feature components — About ── */
import AboutHero from '../components/features/about/AboutHero';
import HistorySection from '../components/features/about/HistorySection';
import MissionSection from '../components/features/about/MissionSection';
import TeamSection from '../components/features/about/TeamSection';

/* ── Feature components — Home ── */
import HeroSection from '../components/features/home/HeroSection';
import BannerSection from '../components/features/home/BannerSection';
import FeaturesSection from '../components/features/home/FeaturesSection';
import GallerySection from '../components/features/home/GallerySection';
import StatisticsSection from '../components/features/home/StatisticsSection';

/* ── Feature components — Contact ── */
import ContactHero from '../components/features/contact/ContactHero';
import ContactForm from '../components/features/contact/ContactForm';
import ContactInfo from '../components/features/contact/ContactInfo';
import MapSection from '../components/features/contact/MapSection';

/* ── Layout components ── */
import AuthLayout from '../components/layout/AuthLayout';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

/* ── Section wrapper ── */
const Section = ({ id, title, description, children, dark = false }) => (
  <section id={id} className={`py-12 ${dark ? 'bg-surface-200' : 'bg-canvas'}`}>
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-2xl font-bold text-ink tracking-tight mb-1">{title}</h2>
      {description && <p className="text-sm text-ink-secondary mb-6">{description}</p>}
      <div className="mt-6">{children}</div>
    </div>
  </section>
);

/* ── Sections nav data ── */
const sections = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'cards', label: 'Cards' },
  { id: 'skeleton', label: 'Skeleton' },
  { id: 'navbar', label: 'Navbar' },
  { id: 'footer', label: 'Footer' },
  { id: 'auth-layout', label: 'AuthLayout' },
  { id: 'about', label: 'About Sections' },
  { id: 'home', label: 'Home Sections' },
  { id: 'contact', label: 'Contact Sections' },
];

const ComponentShowcasePage = () => {
  const [inputVal, setInputVal] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sticky nav */}
      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-edge px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto">
          <span className="text-sm font-bold text-ink whitespace-nowrap mr-2">🧩 Component Showcase</span>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition ${
                activeSection === s.id
                  ? 'bg-brand text-white'
                  : 'text-ink-secondary hover:bg-surface-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Buttons ── */}
      <Section id="buttons" title="Button" description="components/common/Button — 5 variants × 3 sizes">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button isLoading>Loading…</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      {/* ── Inputs ── */}
      <Section id="inputs" title="Input" description="components/common/Input — label, placeholder, error, required" dark>
        <div className="max-w-sm space-y-4">
          <Input label="Full Name" value={inputVal} onChange={setInputVal} placeholder="Enter your name" required />
          <Input label="Email" value="" onChange={() => {}} placeholder="you@example.com" error="This field is required" />
          <Input label="Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
        </div>
      </Section>

      {/* ── Cards ── */}
      <Section id="cards" title="Card & DashboardCard" description="components/common/Card + DashboardCard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-ink mb-2">Simple Card</h3>
            <p className="text-sm text-ink-secondary">A basic card using surface + shadow-card + border-edge.</p>
          </Card>
          <Card className="p-6" onClick={() => alert('Clicked!')}>
            <h3 className="font-semibold text-ink mb-2">Clickable Card</h3>
            <p className="text-sm text-ink-secondary">Click me — cards support onClick.</p>
          </Card>
          <DashboardCard>
            <h3 className="font-semibold text-ink mb-2">Dashboard Card</h3>
            <p className="text-sm text-ink-secondary">Pre-styled for dashboard widgets.</p>
          </DashboardCard>
        </div>
      </Section>

      {/* ── Skeleton ── */}
      <Section id="skeleton" title="Skeleton" description="components/common/Skeleton — loading placeholder" dark>
        <div className="space-y-3 max-w-md">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-32 w-full rounded-lg mt-4" />
        </div>
      </Section>

      {/* ── Navbar ── */}
      <Section id="navbar" title="Navbar" description="components/common/Navbar — public-facing navigation with IK monogram">
        <div className="border border-edge rounded-lg overflow-hidden relative h-20">
          <div className="absolute inset-0" style={{ position: 'relative' }}>
            <Navbar />
          </div>
        </div>
        <p className="text-xs text-ink-tertiary mt-2">Note: Shown inline here. In production it's fixed to top.</p>
      </Section>

      {/* ── Footer ── */}
      <Section id="footer" title="Footer" description="components/common/Footer — 4-column public footer" dark>
        <div className="border border-edge rounded-lg overflow-hidden">
          <Footer />
        </div>
      </Section>

      {/* ── AuthLayout ── */}
      <Section id="auth-layout" title="AuthLayout" description="components/layout/AuthLayout — centered auth wrapper">
        <div className="border border-edge rounded-lg overflow-hidden bg-canvas">
          <AuthLayout title="Sign In to Your Account">
            <div className="text-center text-sm text-ink-secondary py-8">
              (Form content goes here)
            </div>
          </AuthLayout>
        </div>
      </Section>

      {/* ── About sections ── */}
      <Section id="about" title="About Page Sections" description="features/about/ — AboutHero, HistorySection, MissionSection, TeamSection">
        <p className="text-xs text-ink-tertiary mb-4">Full-width sections rendered below:</p>
      </Section>
      <AboutHero />
      <HistorySection />
      <MissionSection />
      <TeamSection />

      {/* ── Home sections ── */}
      <Section id="home" title="Home Page Sections" description="features/home/ — HeroSection, BannerSection, FeaturesSection, GallerySection, StatisticsSection">
        <p className="text-xs text-ink-tertiary mb-4">Full-width sections rendered below:</p>
      </Section>
      <HeroSection />
      <BannerSection />
      <FeaturesSection />
      <StatisticsSection />
      <GallerySection />

      {/* ── Contact sections ── */}
      <Section id="contact" title="Contact Page Sections" description="features/contact/ — ContactHero, ContactForm, ContactInfo, MapSection">
        <p className="text-xs text-ink-tertiary mb-4">Full-width sections rendered below:</p>
      </Section>
      <ContactHero />
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactForm />
        <ContactInfo />
      </div>
      <MapSection />

      {/* Spacer */}
      <div className="h-20" />
    </div>
  );
};

export default ComponentShowcasePage;
