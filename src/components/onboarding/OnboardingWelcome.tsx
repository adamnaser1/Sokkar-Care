import { useState } from 'react';
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

const OnboardingWelcome = ({ onNext }: Props) => {
  const [step, setStep] = useState(0); // 0 = welcome, 1 = benefits

  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
        <div className="max-w-md w-full flex flex-col items-center text-center gap-8">
          <SokkarLogo size={48} />
          <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="text-primary" size={80} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary mb-3">Bienvenue dans Sokkar Care</h1>
            <p className="text-muted-foreground text-lg">
              Votre santé diabétique, simplifiée et personnalisée
            </p>
          </div>
          <Button size="lg" className="w-full text-lg py-6" onClick={() => setStep(1)}>
            Commencer <ArrowRight className="ml-2" size={20} />
          </Button>
          <p className="text-xs text-muted-foreground max-w-xs">
            ⚕️ Cette application ne remplace pas le conseil médical professionnel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="max-w-md w-full flex flex-col gap-8">
        <SokkarLogo size={36} />
        <h2 className="text-2xl font-bold text-primary">Découvrez Sokkar Care</h2>
        <div className="flex flex-col gap-5">
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg bg-card card-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <b.icon className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
            <ArrowLeft size={16} className="mr-1" /> Retour
          </Button>
          <Button onClick={onNext} className="flex-1">
            Continuer <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;
