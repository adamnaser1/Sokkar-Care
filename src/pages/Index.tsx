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

import SokkarLogo from '@/components/SokkarLogo';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

const Index = () => {
  const onboardingComplete = useAppStore(s => s.onboardingComplete);
  const session = useAppStore(s => s.session);
  const isLoadingAuth = useAppStore(s => s.isLoadingAuth);
  
  const [showWelcome, setShowWelcome] = useState(!onboardingComplete);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <SokkarLogo size={80} />
        </motion.div>
      </div>
    );
  }

  if (!onboardingComplete && showWelcome) {
    return <OnboardingWelcome onNext={() => setShowWelcome(false)} />;
  }

  if (!onboardingComplete) {
    return <ProfileForm onComplete={() => setShowWelcome(false)} />;
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
