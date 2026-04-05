import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SokkarLogo from '@/components/SokkarLogo';
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ResetPasswordPage = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Supabase sets tokens in the URL hash, let's just listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          // Ready to reset password
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const passwordStrength = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password)
    };
  }, [password]);

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Veuillez remplir tous les champs');
      return;
    }
    if (!isPasswordStrong) {
      toast.error(isRTL ? 'كلمة المرور ضعيفة' : 'Le mot de passe est trop faible');
      return;
    }
    if (password !== confirmPassword) {
      toast.error(isRTL ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success(isRTL ? 'تم تحديث كلمة المرور بنجاح' : 'Mot de passe mis à jour avec succès');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center z-10"
      >
        <SokkarLogo size={48} />
        <h1 className="text-2xl font-bold text-foreground mt-6 mb-2">
          {isRTL ? 'تعيين كلمة مرور جديدة' : 'Nouveau mot de passe'}
        </h1>

        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-4 mt-6">
          <div className={`flex flex-col gap-1.5 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="password">{isRTL ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}</Label>
            <div className="relative flex items-center">
              <Lock className={`absolute text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-12 rounded-xl ${isRTL ? 'pr-10 text-right pl-10' : 'pl-10 pr-10'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute text-muted-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex gap-2 text-[10px] mt-1 flex-wrap">
               <span className={`flex items-center gap-1 ${passwordStrength.length ? 'text-success' : 'text-muted-foreground'}`}>
                 {passwordStrength.length ? <CheckCircle2 size={12}/> : <XCircle size={12}/>} 8+ carac.
               </span>
               <span className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-success' : 'text-muted-foreground'}`}>
                 {passwordStrength.uppercase ? <CheckCircle2 size={12}/> : <XCircle size={12}/>} 1 Majuscule
               </span>
               <span className={`flex items-center gap-1 ${passwordStrength.number ? 'text-success' : 'text-muted-foreground'}`}>
                 {passwordStrength.number ? <CheckCircle2 size={12}/> : <XCircle size={12}/>} 1 Chiffre
               </span>
            </div>
          </div>

          <div className={`flex flex-col gap-1.5 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="confirmPassword">{isRTL ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}</Label>
            <div className="relative flex items-center">
              <Lock className={`absolute text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 rounded-xl border ${confirmPassword && password !== confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''} ${isRTL ? 'pr-10 text-right pl-10' : 'pl-10 pr-10'}`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute text-muted-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 mt-2">
            {isLoading ? (isRTL ? 'جاري التحديث...' : 'Mise à jour...') : (isRTL ? 'تحديث كلمة المرور' : 'Mettre à jour')}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
