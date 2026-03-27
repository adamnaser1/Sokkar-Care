import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import OnboardingWelcome from '@/components/onboarding/OnboardingWelcome';
import ProfileForm from '@/components/onboarding/ProfileForm';
import Dashboard from '@/components/dashboard/Dashboard';
import GlucoseJournal from '@/components/journal/GlucoseJournal';
import ChartsPage from '@/components/charts/ChartsPage';
import FoodDatabase from '@/components/food/FoodDatabase';
import TipsPage from '@/components/tips/TipsPage';
import InsulinCalculator from '@/components/calculator/InsulinCalculator';
import ProfilePage from '@/components/gamification/ProfilePage';
import SettingsPage from '@/components/settings/SettingsPage';
import BottomNav, { PageId } from '@/components/layout/BottomNav';

type AppView = PageId | 'tips' | 'calculator' | 'settings';

const Index = () => {
  const onboardingComplete = useAppStore(s => s.onboardingComplete);
  const [onboardingStep, setOnboardingStep] = useState<'welcome' | 'profile' | 'done'>(
    onboardingComplete ? 'done' : 'welcome'
  );
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  if (onboardingStep === 'welcome') {
    return <OnboardingWelcome onNext={() => setOnboardingStep('profile')} />;
  }
  if (onboardingStep === 'profile') {
    return <ProfileForm onComplete={() => setOnboardingStep('done')} />;
  }

  const navPage: PageId = (['dashboard', 'journal', 'charts', 'food', 'profile'] as PageId[]).includes(currentView as PageId)
    ? (currentView as PageId)
    : currentView === 'settings' ? 'profile' : 'dashboard';

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard
          onNavigate={(view: AppView) => setCurrentView(view)}
        />
      )}
      {currentView === 'journal' && <GlucoseJournal />}
      {currentView === 'charts' && <ChartsPage />}
      {currentView === 'food' && <FoodDatabase />}
      {currentView === 'tips' && <TipsPage />}
      {currentView === 'calculator' && <InsulinCalculator />}
      {currentView === 'profile' && (
        <ProfilePage
          onOpenSettings={() => setCurrentView('settings')}
          onOpenTips={() => setCurrentView('tips')}
          onOpenCalculator={() => setCurrentView('calculator')}
        />
      )}
      {currentView === 'settings' && (
        <SettingsPage onBack={() => setCurrentView('profile')} />
      )}
      <BottomNav
        current={navPage}
        onChange={(id) => setCurrentView(id)}
      />
    </>
  );
};

export default Index;
