import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
import { checkUserProfile } from '@/lib/profileSync';

export default function AuthCallback() {
  const navigate = useNavigate();
  const setIsAuthenticated = useAppStore(s => s.setIsAuthenticated);
  const setProfile = useAppStore(s => s.setProfile);
  const setOnboardingComplete = useAppStore(s => s.setOnboardingComplete);
  const setHasCompletedTour = useAppStore(s => s.setHasCompletedTour);

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate('/login', { replace: true });
        return;
      }

      // User is authenticated
      setIsAuthenticated(true);
      setHasCompletedTour(true); // Skip welcome slides for OAuth users

      // Check if they already have a completed profile in Supabase
      const result = await checkUserProfile(session.user.id);

      if (result.destination === 'dashboard' && result.profile) {
        setProfile(result.profile);
        setOnboardingComplete(true);
      }

      // Navigate to index — it will show dashboard or onboarding form as needed
      navigate('/', { replace: true });
    };

    handleCallback();
  }, [navigate, setIsAuthenticated, setProfile, setOnboardingComplete, setHasCompletedTour]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground text-sm font-medium">Authentification en cours...</p>
      </div>
    </div>
  );
}
