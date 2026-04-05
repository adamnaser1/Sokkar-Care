import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  onBack: () => void;
}

const FaqPage = ({ onBack }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqsFr = [
    { q: "Comment ajouter une mesure ?", a: "Allez sur l'onglet 'Journal' ou sur le tableau de bord, puis cliquez sur le bouton '+ Nouvelle Mesure'." },
    { q: "Comment calculer ma dose d'insuline ?", a: "Ouvrez l'onglet 'Calculateur', entrez votre glycémie actuelle et laissez le calculateur utiliser votre facteur de sensibilité pour recommander une dose." },
    { q: "Pourquoi l'application me dit-elle que ma glycémie est élevée ?", a: "Les seuils peuvent être configurés dans les Paramètres. Par défaut, Sokkar Care vous alerte si votre glycémie dépasse la norme pour prévenir les risques." },
    { q: "Mes données sont-elles sécurisées ?", a: "Oui, toutes vos données (journal, paramètres) sont stockées localement sur votre téléphone ou de manière sécurisée si vous activez le compte en ligne." },
    { q: "Comment modifier un médicament ?", a: "Rendez-vous dans 'Paramètres' > 'Mon Profil' et allez dans l'onglet 'Médicaments'. Vous pouvez en ajouter ou en supprimer." },
  ];

  const faqsAr = [
    { q: "كيف أضيف قياسًا جديدًا؟", a: "اذهب إلى علامة التبويب 'السجل' أو لوحة القيادة، ثم انقر على زر '+ قياس جديد'." },
    { q: "كيف أحسب جرعة الأنسولين الخاصة بي؟", a: "افتح علامة التبويب 'الحاسبة'، أدخل مستوى السكر الحالي واترك الحاسبة تستخدم معامل الحساسية الخاص بك للتوصية بالجرعة." },
    { q: "لماذا يخبرني التطبيق أن مستوى السكر مرتفع؟", a: "يمكن إعداد الحدود في الإعدادات. افتراضيًا، يُنبهك التطبيق إذا تجاوز السكر مستوى الخطر لتجنب المضاعفات." },
    { q: "هل بياناتي آمنة؟", a: "نعم، جميع بياناتك مخزنة محليًا على هاتفك، أو محفوظة بآمان تام إذا قمت بتفعيل التزامن عبر الإنترنت." },
    { q: "كيف يمكنني تعديل الأدوية؟", a: "اذهب إلى 'الإعدادات' > 'ملفي الشخصي' ثم علامة التبويب 'الأدوية'. يمكنك إضافة أو حذف الأدوية من هناك." },
  ];

  const faqs = isRTL ? faqsAr : faqsFr;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className={`px-5 pt-6 pb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
        <button onClick={onBack} className={`p-2 bg-muted/50 rounded-full hover:bg-muted ${isRTL ? 'ml-3 rotate-180' : 'mr-3'}`}>
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{t.settings.faq}</h1>
      </div>
      
      <div className="px-5 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-card card-shadow rounded-2xl overflow-hidden border border-border/40">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`w-full p-4 flex items-center justify-between text-left ${isRTL ? 'flex-row-reverse text-right' : ''}`}
            >
              <h3 className="font-semibold text-foreground text-sm pr-4 leading-tight">{faq.q}</h3>
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }}>
                <ChevronDown size={18} className="text-muted-foreground flex-shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`p-4 pt-0 text-sm text-muted-foreground leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
