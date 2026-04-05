import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  onBack: () => void;
}

const PrivacyPage = ({ onBack }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const contentFr = (
    <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">1. Collecte des données</h2>
        <p>Sokkar Care collecte les informations que vous saisissez volontairement (identifiants de santé, glycémie, médicaments). Ces données sont primordiales pour vous offrir un retour adapté.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">2. Stockage et Sécurité</h2>
        <p>Dans la configuration standard, vos données sont stockées <strong>exclusivement en local</strong> sur votre propre appareil. Si vous utilisez la fonction de synchronisation cloud (compte utilisateur), les informations sont chiffrées selon les meilleures normes de sécurité (Supabase Auth).</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">3. Utilisation des données</h2>
        <p>Vos données de santé ne sont traitées que pour générer votre journal personnel, vos recommandations, et calculer vos statistiques. Elles ne sont jamais vendues à des entités tierces à des fins publicitaires.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">4. Dispositions légales</h2>
        <p>Sokkar Care n'est pas un dispositif médical réglementé. L'application agit en tant que journal de suivi. Les décisions médicales (comme les doses d'insuline) doivent toujours être prises en accord avec votre médecin traitant.</p>
      </section>
    </div>
  );

  const contentAr = (
    <div className="space-y-6 text-sm text-foreground/80 leading-relaxed text-right">
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">1. جمع البيانات</h2>
        <p>يقوم "سكّر كير" بجمع المعلومات التي تدخلها طواعية (البيانات الصحية، نسبة السكر، الأدوية). هذه البيانات ضرورية لنقدم لك متابعة مخصصة.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">2. التخزين والأمان</h2>
        <p>في الإعدادات القياسية، يتم تخزين بياناتك <strong>محلياً فقط</strong> على جهازك الخاص. إذا كنت تستخدم ميزة المزامنة السحابية، يتم تشفير المعلومات وفقاً لأفضل معايير الأمان.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">3. استخدام البيانات</h2>
        <p>تتم معالجة بياناتك الصحية فقط لإنشاء سجلك الشخصي وتوصياتك وحساب إحصائياتك. لا يتم أبداً بيعها لجهات خارجية لأغراض إعلانية.</p>
      </section>
      <section>
        <h2 className="text-lg font-bold text-foreground mb-2">4. أحكام قانونية</h2>
        <p>"سكّر كير" ليس جهازاً طبياً معتمداً. يعمل التطبيق كسجل متابعة فقط. يجب دائماً اتخاذ القرارات الطبية (مثل جرعات الأنسولين) بالتشاور مع طبيبك المعالج.</p>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className={`px-5 pt-6 pb-4 flex items-center ${isRTL ? 'flex-row-reverse' : ''} mb-4`}>
        <button onClick={onBack} className={`p-2 bg-muted/50 rounded-full hover:bg-muted ${isRTL ? 'ml-3 rotate-180' : 'mr-3'}`}>
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">{t.settings.privacy}</h1>
      </div>
      
      <div className="px-5">
        <div className="bg-card card-shadow rounded-2xl p-6 border border-border/40">
          <div className="mb-6 pb-6 border-b border-border/50">
            <h3 className={`font-bold text-primary ${isRTL ? 'text-right' : ''}`}>Sokkar Care</h3>
            <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? 'text-right' : ''}`}>{isRTL ? 'آخر تحديث: أبريل 2026' : 'Dernière mise à jour : Avril 2026'}</p>
          </div>
          {isRTL ? contentAr : contentFr}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
