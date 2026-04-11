import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SokkarLogo from '@/components/SokkarLogo';
import { Activity, Apple, Bell, ArrowRight, ArrowLeft, Droplets, Utensils, ActivitySquare } from 'lucide-react';
import type { Lang } from '@/i18n/translations';

interface Props {
  onNext: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const OnboardingWelcome = ({ onNext }: Props) => {
  const { t, language, changeLang } = useLanguage();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = [
    {
      id: 'welcome',
      icon: Droplets,
      color: 'bg-primary/20 text-primary',
    },
    {
      id: 'slide1',
      icon: Activity,
      title: t.onboarding.slide1Title,
      text: t.onboarding.slide1Text,
      color: 'bg-primary/10 text-primary',
    },
    {
      id: 'slide2',
      icon: Apple,
      title: t.onboarding.slide2Title,
      text: t.onboarding.slide2Text,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      id: 'slide3',
      icon: Utensils,
      title: t.onboarding.slide3Title,
      text: t.onboarding.slide3Text,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'slide4',
      icon: Bell,
      title: t.onboarding.slide4Title,
      text: t.onboarding.slide4Text,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const goNext = () => {
    if (step < slides.length - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      onNext();
    }
  };

  const goBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const isRTL = language === 'ar';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const NextIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-12 px-6 bg-background overflow-hidden relative">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />

      {/* Language Selector (only top screen) */}
      <div className="w-full flex justify-end z-10">
        <Select value={language} onValueChange={(v) => changeLang(v as Lang)}>
          <SelectTrigger className="w-32 bg-card border-border">
            <SelectValue placeholder="Langue / لغة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français 🇫🇷</SelectItem>
            <SelectItem value="ar">العربية 🇹🇳</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 w-full max-w-sm flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 ? (
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center gap-8"
            >
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <SokkarLogo size={56} />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative shadow-inner"
              >
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow"></div>
                <Droplets className="text-primary" size={80} />
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }}>
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  {t.onboarding.welcomeTitle}<br/>
                  <span className="text-primary">{t.onboarding.appName}</span>
                </h1>
                <p className="text-muted-foreground text-base px-4">
                  {t.onboarding.welcomeSubtitle}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={`slide${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center gap-8"
            >
              <SokkarLogo size={40} />

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                className={`w-40 h-40 rounded-full ${slides[step].color} flex items-center justify-center shadow-inner`}
              >
                {(() => {
                  const Icon = slides[step].icon;
                  return <Icon size={72} />;
                })()}
              </motion.div>

              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
                <h2 className="text-2xl font-bold text-foreground mb-4">{slides[step].title}</h2>
                <p className="text-muted-foreground text-lg px-2 leading-relaxed">
                  {slides[step].text}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-8 mt-8 z-10">
        {/* Pagination Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full ${i === step ? 'w-6 bg-primary' : 'w-2 bg-primary/20'}`}
              animate={{ width: i === step ? 24 : 8, backgroundColor: i === step ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.2)' }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={goBack} className="w-14 rounded-2xl h-14 flex-shrink-0">
              <BackIcon size={24} />
            </Button>
          )}
          <Button size="lg" className="flex-1 text-lg rounded-2xl h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={goNext}>
            {step === slides.length - 1 ? t.common.getStarted : t.common.next}
            {step < slides.length - 1 && <NextIcon className={isRTL ? "mr-2" : "ml-2"} size={20} />}
          </Button>
        </div>
        
        {step === 0 && (
          <p className="text-xs text-muted-foreground max-w-xs text-center">
            {t.onboarding.disclaimer}
          </p>
        )}
      </div>
    </div>
  );
};

export default OnboardingWelcome;
