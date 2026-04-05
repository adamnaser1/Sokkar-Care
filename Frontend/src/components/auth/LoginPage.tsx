import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppStore } from '@/store/useAppStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SokkarLogo from '@/components/SokkarLogo';
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const LoginPage = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const navigate = useNavigate();
  const setIsAuthenticated = useAppStore(s => s.setIsAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('loggedOut') === 'true') {
      toast.success(isRTL ? 'تم تسجيل خروجك بنجاح' : 'Vous avez été déconnecté avec succès');
      window.history.replaceState({}, document.title, '/login');
    }
  }, [isRTL]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t.auth.emailRequired);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setIsAuthenticated(true);
        toast.success(isRTL ? 'مرحباً بعودتك' : 'Bienvenue !');
        navigate('/');
      }
    } catch (error: any) {
      let errorMsg = error.message;
      switch (errorMsg) {
        case 'Invalid login credentials':
          errorMsg = isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Email ou mot de passe incorrect.';
          break;
        case 'Email not confirmed':
          errorMsg = isRTL ? 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول. تحقق من صندوق البريد الخاص بك.' : 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.';
          break;
        case 'Too many requests':
        case 'over_email_send_rate_limit':
          errorMsg = isRTL ? 'محاولات كثيرة. حاول مرة أخرى في غضون دقائق قليلة.' : 'Trop de tentatives. Réessayez dans quelques minutes.';
          break;
        case 'User not found':
            errorMsg = isRTL ? 'هذا الحساب غير موجود' : 'Aucun compte trouvé avec cet email';
            break;
        default:
          errorMsg = isRTL ? 'حدث خطأ. حاول مرة أخرى.' : 'Une erreur est survenue. Réessayez.';
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t.common.error || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />

      <motion.button
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`absolute top-12 ${isRTL ? 'right-6' : 'left-6'} p-2 rounded-full bg-card shadow-sm text-muted-foreground hover:text-foreground z-10`}
        onClick={() => navigate(-1)}
      >
        <BackIcon size={20} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center z-10"
      >
        <SokkarLogo size={48} />
        <h1 className="text-2xl font-bold text-foreground mt-6 mb-2">{t.auth.login}</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {t.auth.loginSubtitle}
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className={`flex flex-col gap-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="email">{t.auth.email}</Label>
            <div className="relative">
              <Mail className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-xl ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
              />
            </div>
          </div>
          
          <div className={`flex flex-col gap-1.5 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Label htmlFor="password">{t.auth.password}</Label>
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-xs text-primary font-medium hover:underline">
                {isRTL ? 'هل نسيت كلمة المرور؟' : 'Mot de passe oublié ?'}
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className={`absolute text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 rounded-xl ${isRTL ? 'pr-10 text-right pl-10' : 'pl-10 pr-10'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90">
            {isLoading ? (isRTL ? 'جاري الاتصال...' : 'Connexion en cours...') : t.auth.login}
          </Button>

          <div className="relative my-4 flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground">{t.common.or}</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl text-base font-medium flex items-center justify-center gap-3 bg-card"
            onClick={handleGoogleLogin}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            {t.auth.signInGoogle}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t.auth.noAccount}{' '}
            <button
              type="button"
              className="text-primary font-semibold hover:underline"
              onClick={() => navigate('/register')}
            >
              {t.auth.register}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
