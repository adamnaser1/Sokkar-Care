import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import OnboardingWelcome from '@/components/onboarding/OnboardingWelcome';
import ProfileForm from '@/components/onboarding/ProfileForm';
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  const onboardingComplete = useAppStore(s => s.onboardingComplete);
  const [step, setStep] = useState<'welcome' | 'profile' | 'done'>(
    onboardingComplete ? 'done' : 'welcome'
  );

  if (step === 'welcome') {
    return <OnboardingWelcome onNext={() => setStep('profile')} />;
  }

  if (step === 'profile') {
    return <ProfileForm onComplete={() => setStep('done')} />;
  }

  return <Dashboard />;
};

export default Index;
