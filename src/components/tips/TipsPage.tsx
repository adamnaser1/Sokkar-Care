import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Syringe, AlertTriangle, TrendingUp, Moon, Dumbbell } from 'lucide-react';

interface TipSection {
  id: string;
  icon: typeof Syringe;
  label: string;
  content: { title: string; sections: { heading: string; emoji: string; items: string[] }[]; tip: string };
}

const tipsData: TipSection[] = [
  {
    id: 'injection', icon: Syringe, label: 'Injection',
    content: {
      title: "Comment bien s'injecter ?",
      sections: [
        { heading: 'Sites de ponction', emoji: '🎯', items: ['Abdomen (meilleur site, absorption rapide)', 'Bras (face externe)', 'Cuisse (face antérieure)', 'Fesses (quadrant supéro-externe)'] },
        { heading: 'Technique', emoji: '📋', items: ['Lavez-vous les mains soigneusement', 'Nettoyez la zone à l\'alcool', 'Pincez la peau légèrement', 'Injectez à 90° (perpendiculaire)', 'Maintenez 5-10 secondes avant de retirer'] },
        { heading: 'À Éviter', emoji: '⚠️', items: ['Injecter au même endroit tous les jours (risque: lipohypertrophie)', 'Utiliser une aiguille plus d\'une fois', 'Injecter de l\'insuline froide (sortir 15 min avant)', 'Masser la zone après injection'] },
      ],
      tip: 'Alternez les zones d\'injection en suivant un schéma rotatif. Tenez un journal des sites !',
    },
  },
  {
    id: 'hypo', icon: AlertTriangle, label: 'Hypoglycémie',
    content: {
      title: 'Gérer une hypoglycémie (< 70 mg/dL)',
      sections: [
        { heading: 'Symptômes', emoji: '🔍', items: ['Tremblements, sueurs froides', 'Pâleur, faim intense', 'Confusion, irritabilité', 'Vision trouble, vertiges', 'Palpitations'] },
        { heading: 'Règle des 15-15', emoji: '🍬', items: ['Prenez 15g de glucides rapides :', '→ 3-4 morceaux de sucre', '→ 1 verre de jus de fruit (15 cl)', '→ 1 cuillère à soupe de miel', 'Attendez 15 minutes', 'Re-mesurez votre glycémie', 'Si toujours < 70 : répétez'] },
        { heading: 'Prévention', emoji: '🛡️', items: ['Ne sautez pas de repas', 'Ajustez l\'insuline avant l\'exercice', 'Gardez toujours du sucre sur vous', 'Portez un bracelet d\'identification'] },
      ],
      tip: 'Gardez toujours 3 morceaux de sucre dans votre poche ou sac. Informez votre entourage des gestes à faire.',
    },
  },
  {
    id: 'hyper', icon: TrendingUp, label: 'Hyperglycémie',
    content: {
      title: 'Gérer une hyperglycémie (> 180 mg/dL)',
      sections: [
        { heading: 'Symptômes', emoji: '🔍', items: ['Soif excessive (polydipsie)', 'Urines fréquentes (polyurie)', 'Fatigue inhabituelle', 'Vision floue', 'Nausées (si prolongée)'] },
        { heading: 'Actions immédiates', emoji: '⚡', items: ['Buvez de l\'eau régulièrement', 'Vérifiez votre dose d\'insuline', 'Utilisez le calculateur de correction', 'Évitez les glucides rapides', 'Marchez 15-20 minutes si possible'] },
        { heading: 'Quand consulter ?', emoji: '🏥', items: ['Glycémie > 300 mg/dL persistante', 'Présence de corps cétoniques', 'Nausées ou vomissements', 'Douleurs abdominales', 'Confusion ou somnolence'] },
      ],
      tip: 'Une glycémie élevée occasionnelle est normale. L\'important est la tendance sur plusieurs jours.',
    },
  },
  {
    id: 'ramadan', icon: Moon, label: 'Ramadan',
    content: {
      title: 'Diabète et Ramadan',
      sections: [
        { heading: 'Avant le Ramadan', emoji: '📋', items: ['Consultez votre médecin 1-2 mois avant', 'Ajustez vos doses d\'insuline', 'Apprenez à reconnaître les signes de danger', 'Préparez un plan alimentaire adapté'] },
        { heading: 'Pendant le jeûne', emoji: '🌙', items: ['Mesurez votre glycémie plusieurs fois/jour', 'Suhoor : glucides lents + protéines', 'Iftar : commencez par des dattes + eau', 'Évitez les aliments très sucrés à l\'Iftar', 'Hydratez-vous abondamment la nuit'] },
        { heading: 'Quand rompre le jeûne ?', emoji: '⚠️', items: ['Glycémie < 70 mg/dL → rompre immédiatement', 'Glycémie > 300 mg/dL → rompre le jeûne', 'Symptômes d\'hypoglycémie → rompre', 'Malaise, nausées → rompre', 'Votre santé passe avant tout'] },
      ],
      tip: 'Le jeûne n\'est pas obligatoire pour les personnes malades en Islam. Consultez votre médecin ET un imam.',
    },
  },
  {
    id: 'exercise', icon: Dumbbell, label: 'Exercice',
    content: {
      title: 'Activité physique et diabète',
      sections: [
        { heading: 'Bénéfices', emoji: '💪', items: ['Améliore la sensibilité à l\'insuline', 'Aide à contrôler le poids', 'Réduit le stress et l\'anxiété', 'Protège le système cardiovasculaire', 'Améliore le sommeil'] },
        { heading: 'Précautions', emoji: '🛡️', items: ['Mesurez votre glycémie avant l\'exercice', 'Si < 100 mg/dL : prenez une collation', 'Si > 250 mg/dL : reportez l\'exercice', 'Gardez du sucre à portée de main', 'Hydratez-vous régulièrement'] },
        { heading: 'Activités recommandées', emoji: '🏃', items: ['Marche rapide : 30 min/jour', 'Natation : excellente pour les articulations', 'Vélo : à intensité modérée', 'Yoga : réduit le stress', 'Évitez les sports extrêmes sans supervision'] },
      ],
      tip: 'L\'exercice peut faire baisser la glycémie pendant 24h. Adaptez vos doses d\'insuline les jours actifs.',
    },
  },
];

const TipsPage = () => {
  const [activeTab, setActiveTab] = useState('injection');
  const incrementTipsRead = useAppStore(s => s.incrementTipsRead);
  const activeTip = tipsData.find(t => t.id === activeTab)!;

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    incrementTipsRead();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-primary mb-4"
        >
          Conseils Pratiques
        </motion.h1>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {tipsData.map(tab => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tips-tab"
                  className="absolute inset-0 bg-secondary rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <tab.icon size={14} />
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-lg font-bold text-foreground">{activeTip.content.title}</h2>

            {activeTip.content.sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.08 }}
                className="p-4 rounded-2xl bg-card card-shadow"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  {section.emoji} {section.heading}
                </h3>
                <ul className="space-y-1.5">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex gap-2">
                      {item.startsWith('→') ? (
                        <span className="text-secondary ml-4">{item}</span>
                      ) : item.startsWith('✕') ? (
                        <span className="text-destructive">{item}</span>
                      ) : (
                        <>
                          <span className="text-secondary flex-shrink-0">•</span>
                          <span>{item}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Tip of the day */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20"
            >
              <p className="text-sm font-semibold text-secondary mb-1">💡 Conseil du jour</p>
              <p className="text-sm text-foreground">{activeTip.content.tip}</p>
            </motion.div>

            <p className="text-xs text-muted-foreground text-center px-4">
              ⚕️ Ces conseils sont informatifs et ne remplacent pas l'avis de votre médecin.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TipsPage;
