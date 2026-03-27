import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SokkarLogo from '@/components/SokkarLogo';
import { Activity, Apple, Bell, ArrowRight, ArrowLeft } from 'lucide-react';

const benefits = [
  {
    icon: Activity,
    title: 'Suivi Glycémique',
    text: 'Suivez vos niveaux de glycémie quotidiennement avec une visualisation claire et intuitive.',
  },
  {
    icon: Apple,
    title: 'Base Alimentaire Visuelle',
    text: "Découvrez l'indice glycémique et la teneur en glucides de vos aliments préférés avec photos.",
  },
  {
    icon: Bell,
    title: 'Rappels Intelligents',
    text: 'Recevez des rappels personnalisés pour vos injections et mesures de glycémie.',
  },
];

interface Props {
  onNext: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -200 : 200, opacity: 0 }),
};

const OnboardingWelcome = ({ onNext }: Props) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const goForward = () => { setDirection(1); setStep(1); };
  const goBack = () => { setDirection(-1); setStep(0); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background overflow-hidden">
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
            className="max-w-md w-full flex flex-col items-center text-center gap-8"
          >
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
              <SokkarLogo size={48} />
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Activity className="text-primary" size={80} />
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }}>
              <h1 className="text-3xl font-bold text-primary mb-3">Bienvenue dans Sokkar Care</h1>
              <p className="text-muted-foreground text-lg">
                Votre santé diabétique, simplifiée et personnalisée
              </p>
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }} className="w-full">
              <Button size="lg" className="w-full text-lg py-6" onClick={goForward}>
                Commencer <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
            <p className="text-xs text-muted-foreground max-w-xs">
              ⚕️ Cette application ne remplace pas le conseil médical professionnel.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="benefits"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-md w-full flex flex-col gap-8"
          >
            <SokkarLogo size={36} />
            <h2 className="text-2xl font-bold text-primary">Découvrez Sokkar Care</h2>
            <div className="flex flex-col gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
                  className="flex gap-4 p-4 rounded-xl bg-card card-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <b.icon className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={goBack} className="flex-1">
                <ArrowLeft size={16} className="mr-1" /> Retour
              </Button>
              <Button onClick={onNext} className="flex-1">
                Continuer <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingWelcome;
