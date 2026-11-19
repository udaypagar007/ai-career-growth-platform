import React from 'react';
import { useApp } from './context/AppContext';
import AppShell from './components/app/AppShell';
import LandingHero from './components/LandingHero';
import OverviewDashboard from './components/studios/OverviewDashboard';
import ResumeStudio from './components/studios/ResumeStudio';
import CareerMatrix from './components/studios/CareerMatrix';
import CurriculumIDE from './components/studios/CurriculumIDE';
import AssessmentArena from './components/studios/AssessmentArena';
import CredentialVault from './components/studios/CredentialVault';

import ResumeOptimizerModal from './components/ResumeOptimizerModal';
import SettingsModal from './components/SettingsModal';
import CertificateModal from './components/CertificateModal';
import CertificateVerification from './components/CertificateVerification';
import AICareerCoach from './components/AICareerCoach';
import Toast from './components/Toast';

export default function App() {
  const { activeTab, isLandingView } = useApp();

  if (isLandingView) {
    return (
      <div className="min-h-screen bg-app-bg text-zinc-100 flex flex-col font-sans antialiased">
        <LandingHero />
        <AICareerCoach />
        <SettingsModal />
        <CertificateVerification />
        <Toast />
      </div>
    );
  }

  return (
    <AppShell>
      {activeTab === 'dashboard' && <OverviewDashboard />}
      {(activeTab === 'resume' || activeTab === 'ats') && <ResumeStudio />}
      {(activeTab === 'jobs' || activeTab === 'skills') && <CareerMatrix />}
      {activeTab === 'roadmap' && <CurriculumIDE />}
      {activeTab === 'exam' && <AssessmentArena />}
      {activeTab === 'vault' && <CredentialVault />}

      {/* Slide-overs & Modals */}
      <AICareerCoach />
      <ResumeOptimizerModal />
      <SettingsModal />
      <CertificateModal />
      <CertificateVerification />
      <Toast />
    </AppShell>
  );
}
