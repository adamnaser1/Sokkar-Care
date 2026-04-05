import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  onBack: () => void;
}

const SupportPage = ({ onBack }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(isRTL ? 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا!' : 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt !');
      onBack();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className={`px-5 pt-6 pb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
        <button onClick={onBack} className={`p-2 bg-muted/50 rounded-full hover:bg-muted ${isRTL ? 'ml-3 rotate-180' : 'mr-3'}`}>
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{t.settings.contactSupport}</h1>
      </div>
      
      <div className="px-5">
        <div className="bg-card card-shadow rounded-2xl p-5 border border-border/40">
          <p className={`text-sm text-muted-foreground mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL 
              ? 'هل لديك سؤال أو اقتراح أو تواجه مشكلة؟ أرسل لنا رسالة وسنقوم بالرد عليك في أقرب وقت.' 
              : 'Vous avez une question, une suggestion ou vous rencontrez un problème ? Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.'}
          </p>

          <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div>
              <Label className="mb-2 block">{isRTL ? 'الموضوع *' : 'Sujet *'}</Label>
              <Input 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                placeholder={isRTL ? 'موضوع رسالتك' : 'Sujet de votre message'}
                className="h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                required
              />
            </div>
            
            <div>
              <Label className="mb-2 block">{isRTL ? 'الرسالة *' : 'Message *'}</Label>
              <Textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Écrivez votre message ici...'}
                className="min-h-[150px] rounded-xl bg-muted/50 border-transparent focus-visible:bg-background resize-none"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !subject || !message}
              className="w-full h-12 rounded-xl mt-4 font-semibold text-primary-foreground gap-2 transition-all active:scale-95"
            >
              <Send size={18} className={isRTL ? 'rotate-180' : ''} />
              {loading ? (isRTL ? 'جاري الإرسال...' : 'Envoi en cours...') : (isRTL ? 'إرسال الرسالة' : 'Envoyer le message')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
