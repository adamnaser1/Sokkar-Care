import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import ProfileForm from '@/components/onboarding/ProfileForm';
import Dashboard from '@/components/dashboard/Dashboard';
import ChartsPage from '@/components/charts/ChartsPage';
import FoodDatabase from '@/components/food/FoodDatabase';
import TipsPage from '@/components/tips/TipsPage';
import SettingsPage from '@/components/settings/SettingsPage';
import FaqPage from '@/components/settings/FaqPage';
import SupportPage from '@/components/settings/SupportPage';
import PrivacyPage from '@/components/settings/PrivacyPage';
import GlucoseJournal from '@/components/journal/GlucoseJournal';
import InsulinCalculator from '@/components/calculator/InsulinCalculator';
import ProfilePage from '@/components/gamification/ProfilePage';
import BottomNav, { PageId } from '@/components/layout/BottomNav';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.98 },
};

const Index = () => {
  const hasCompletedTour = useAppStore(s => s.hasCompletedTour);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const profile = useAppStore(s => s.profile);
  const setProfile = useAppStore(s => s.setProfile);
  const setIsAuthenticated = useAppStore(s => s.setIsAuthenticated);
  const onboardingComplete = useAppStore(s => s.onboardingComplete);
  const isDataFetched = useAppStore(s => s.isDataFetched);
  const [currentView, setCurrentView] = useState<PageId>('dashboard');
  
  // Derived loading state
  const isLoading = isAuthenticated && !isDataFetched;

  // When authenticated but data not yet fetched, fetch EVERYTHING from Supabase
  useEffect(() => {
    if (!isAuthenticated || isDataFetched) return;

    let cancelled = false;

    const initAppData = async () => {
      try {
        await useAppStore.getState().loadFromSupabase();
        
        // After loading, if profile is still null, it means session 
        // might be invalid or something went wrong
        const updatedState = useAppStore.getState();
        if (!cancelled && !updatedState.profile && updatedState.isAuthenticated) {
          // Double check if we really should be authenticated
          const { data: { user } } = await supabase.auth.getUser();
          if (!user && !cancelled) {
            setIsAuthenticated(false);
          }
        }
      } catch (_err) {
        // Initialization error handled silently
      }
    };

    initAppData();
    return () => { cancelled = true; };
  }, [isAuthenticated, isDataFetched, setIsAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking Supabase for existing profile
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground text-sm font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Ensure onboarding is complete before showing dashboard
  if (!onboardingComplete || !profile) {
    return <ProfileForm onComplete={() => useAppStore.getState().setOnboardingComplete(true)} />;
  }

  const renderPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={(view: string) => setCurrentView(view as PageId)} />;
      case 'recipes':
        return <FoodDatabase />;
      case 'tips':
        return <TipsPage />;
      case 'charts':
        return <ChartsPage />;
      case 'settings':
        return <SettingsPage onBack={() => setCurrentView('dashboard')} onNavigate={(view) => setCurrentView(view as PageId)} />;
      case 'journal':
        return <GlucoseJournal onBack={() => setCurrentView('dashboard')} onNavigate={(view) => setCurrentView(view as PageId)} />;
      case 'calculator':
        return <InsulinCalculator onBack={() => setCurrentView('dashboard')} onNavigate={(view) => setCurrentView(view as PageId)} />;
      case 'profile':
        return (
          <ProfilePage
            onOpenSettings={() => setCurrentView('settings')}
            onOpenTips={() => setCurrentView('tips')}
            onOpenCalculator={() => setCurrentView('calculator')}
          />
        );
      case 'faq':
        return <FaqPage onBack={() => setCurrentView('settings')} />;
      case 'support':
        return <SupportPage onBack={() => setCurrentView('settings')} />;
      case 'privacy':
        return <PrivacyPage onBack={() => setCurrentView('settings')} />;
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
      <BottomNav current={currentView} onChange={(id) => setCurrentView(id)} />
    </>
  );
};

export default Index;
