import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
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

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

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

  const renderPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={(view: AppView) => setCurrentView(view)} />;
      case 'journal':
        return <GlucoseJournal />;
      case 'charts':
        return <ChartsPage />;
      case 'food':
        return <FoodDatabase />;
      case 'tips':
        return <TipsPage />;
      case 'calculator':
        return <InsulinCalculator />;
      case 'profile':
        return (
          <ProfilePage
            onOpenSettings={() => setCurrentView('settings')}
            onOpenTips={() => setCurrentView('tips')}
            onOpenCalculator={() => setCurrentView('calculator')}
          />
        );
      case 'settings':
        return <SettingsPage onBack={() => setCurrentView('profile')} />;
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <BottomNav current={navPage} onChange={(id) => setCurrentView(id)} />
    </>
  );
};

export default Index;
