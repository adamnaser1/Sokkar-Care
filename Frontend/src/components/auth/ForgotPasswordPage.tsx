import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import SokkarLogo from '@/components/SokkarLogo';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ForgotPasswordPage = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Veuillez saisir votre email');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success(isRTL ? 'تم إرسال رابط الاستعادة إلى بريدك الإلكتروني' : 'Un lien de réinitialisation a été envoyé si le compte existe');
      navigate('/login');
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
        <h1 className="text-2xl font-bold text-foreground mt-6 mb-2">
          {isRTL ? 'استعادة كلمة المرور' : 'Mot de passe oublié'}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {isRTL ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور' : 'Saisissez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe'}
        </p>

        <form onSubmit={handleReset} className="w-full flex flex-col gap-4">
          <div className={`flex flex-col gap-1.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Label htmlFor="email">{isRTL ? 'البريد الإلكتروني' : 'Adresse e-mail'}</Label>
            <div className="relative">
              <Mail className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} size={18} />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-xl ${isRTL ? 'pr-10 text-right' : 'pl-10'}`}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 mt-2">
            {isLoading ? (isRTL ? 'جاري الإرسال...' : 'Envoi en cours...') : (isRTL ? 'إرسال الرابط' : 'Envoyer le lien')}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
