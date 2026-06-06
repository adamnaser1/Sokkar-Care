import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlucoseMeasurement, UserProfile } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import { Calendar, Download, X, FileText, CheckCircle2, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { generateMeasurementsPDF } from '@/lib/pdfExport';

export interface HbA1cEntry {
  id?: string;
  value: number;
  date?: string;
  measuredAt?: string;
  createdAt?: string;
}

interface ExportPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurements: GlucoseMeasurement[];
  hba1cHistory: HbA1cEntry[];
  profile: UserProfile | null;
  language: 'fr' | 'ar';
}

const translations = {
  fr: {
    title: "Exporter mon Journal",
    subtitle: "Sélectionnez une période pour générer un rapport médical au format PDF.",
    selectPeriod: "Choisir la période",
    last7Days: "7 derniers jours",
    last30Days: "30 derniers jours",
    last3Months: "3 derniers mois",
    custom: "Personnalisé",
    from: "Du",
    to: "Au",
    previewSummary: "Aperçu de la période",
    measurementsFound: (count: number) => `${count} ${count > 1 ? 'mesures trouvées' : 'mesure trouvée'} pour cette période`,
    hba1cEntries: (count: number) => `${count} ${count > 1 ? 'entrées' : 'entrée'} HbA1c`,
    avgGlucose: "Moyenne",
    inRange: "Dans la cible",
    inRangeSub: "70-180 mg/dL",
    cancel: "Annuler",
    downloadPDF: "Télécharger PDF",
    generating: "Génération du PDF...",
    noData: "Aucune mesure enregistrée pour cette période.",
    exportSuccess: "Rapport PDF téléchargé avec succès !",
    errorEmpty: "Impossible d'exporter : aucune donnée disponible pour cette période.",
    // Report fields
    reportTitle: "Rapport Clinique de Suivi du Diabète",
    generatedOn: (date: string) => `Généré le ${date}`,
    patientInfo: "Informations Patient",
    name: "Nom",
    age: "Âge",
    diabetesType: "Type de Diabète",
    targetGlucose: "Glycémie Cible",
    weight: "Poids",
    height: "Taille",
    statistics: "Indicateurs Clés & Statistiques",
    glucoseMin: "Glycémie Minimale",
    glucoseMax: "Glycémie Maximale",
    totalReadings: "Nombre Total de Mesures",
    hypoCount: "Hypoglycémies (<70)",
    hyperCount: "Hyperglycémies (>180)",
    inRangeCount: "Glycémies Normales (70-180)",
    measurementsJournal: "Journal Chronologique des Glycémies",
    hba1cHistoryTitle: "Historique du Taux d'HbA1c",
    date: "Date",
    time: "Heure",
    value: "Glycémie",
    context: "Contexte",
    notes: "Notes et Observations",
    hba1cValue: "Valeur HbA1c",
    clinicalDisclaimer: "⚕️ Ce document est un récapitulatif d'auto-surveillance destiné à faciliter vos échanges avec votre professionnel de santé. Il ne remplace pas une consultation médicale.",
  },
  ar: {
    title: "تصدير سجلي",
    subtitle: "اختر الفترة الزمنية المناسبة لإنشاء تقرير طبي بصيغة PDF.",
    selectPeriod: "اختر الفترة الزمنية",
    last7Days: "آخر 7 أيام",
    last30Days: "آخر 30 يوماً",
    last3Months: "آخر 3 أشهر",
    custom: "فترة مخصصة",
    from: "من",
    to: "إلى",
    previewSummary: "ملخص الفترة",
    measurementsFound: (count: number) => `تم العثور على ${count} ${count > 1 ? 'قياسات' : 'قياس'} لهذه الفترة`,
    hba1cEntries: (count: number) => `${count} ${count > 1 ? 'إدخالات' : 'إدخال'} لمخزون السكر (HbA1c)`,
    avgGlucose: "المتوسط",
    inRange: "ضمن المعدل",
    inRangeSub: "70-180 مجم/ديسيلتر",
    cancel: "إلغاء",
    downloadPDF: "تحميل PDF",
    generating: "جاري إنشاء PDF...",
    noData: "لا توجد قياسات مسجلة في هذه الفترة.",
    exportSuccess: "تم تحميل تقرير الـ PDF بنجاح!",
    errorEmpty: "تعذر التصدير: لا توجد بيانات كافية للفترة المحددة.",
    // Report fields
    reportTitle: "تقرير المتابعة السريرية للسكري",
    generatedOn: (date: string) => `تم الإنشاء في ${date}`,
    patientInfo: "بيانات المريض",
    name: "الاسم",
    age: "العمر",
    diabetesType: "نوع السكري",
    targetGlucose: "النسبة المستهدفة",
    weight: "الوزن",
    height: "الطول",
    statistics: "المؤشرات الإحصائية الرئيسية",
    glucoseMin: "أدنى قياس",
    glucoseMax: "أقصى قياس",
    totalReadings: "إجمالي عدد القياسات",
    hypoCount: "انخفاض السكر (<70)",
    hyperCount: "ارتفاع السكر (>180)",
    inRangeCount: "ضمن المعدل الطبيعي (70-180)",
    measurementsJournal: "السجل الزمني لقياسات السكر",
    hba1cHistoryTitle: "سجل معدل مخزون السكر (HbA1c)",
    date: "التاريخ",
    time: "الوقت",
    value: "القياس",
    context: "الحالة",
    notes: "ملاحظات وتنبيهات",
    hba1cValue: "مخزون السكر (HbA1c)",
    clinicalDisclaimer: "⚕️ هذا التقرير هو ملخص للمراقبة الذاتية لمساعدتك في التنسيق مع طبيبك المعالج، ولا يغني عن الاستشارة الطبية المتخصصة.",
  }
};

const ExportPDFModal = ({
  isOpen,
  onClose,
  measurements = [],
  hba1cHistory = [],
  profile,
  language = 'fr'
}: ExportPDFModalProps) => {
  const t = translations[language];
  const isRtl = language === 'ar';

  const [range, setRange] = useState<'7' | '30' | '90' | 'custom'>('7');
  
  // Format helpers
  const formatDateString = (d: Date) => d.toISOString().split('T')[0];
  const now = new Date();
  
  const [startDate, setStartDate] = useState(formatDateString(new Date(now.getTime() - 7 * 86400000)));
  const [endDate, setEndDate] = useState(formatDateString(now));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Range options listing
  const rangeOptions = [
    { id: '7', label: t.last7Days },
    { id: '30', label: t.last30Days },
    { id: '90', label: t.last3Months },
    { id: 'custom', label: t.custom }
  ];

  // Helper to filter data based on selected option
  const getFilteredData = () => {
    let start: Date;
    let end = new Date();

    if (range === '7') {
      start = new Date(now.getTime() - 7 * 86400000);
      start.setHours(0, 0, 0, 0);
    } else if (range === '30') {
      start = new Date(now.getTime() - 30 * 86400000);
      start.setHours(0, 0, 0, 0);
    } else if (range === '90') {
      start = new Date(now.getTime() - 90 * 86400000);
      start.setHours(0, 0, 0, 0);
    } else {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    }

    const filteredMeasurements = measurements.filter(m => {
      const d = new Date(m.measuredAt || new Date());
      return d >= start && d <= end;
    });

    const filteredHbA1c = hba1cHistory.filter(h => {
      const d = new Date(h.measuredAt || h.date || h.createdAt || new Date());
      return d >= start && d <= end;
    });

    return { filteredMeasurements, filteredHbA1c, start, end };
  };

  const { filteredMeasurements, filteredHbA1c, start: filterStart, end: filterEnd } = getFilteredData();

  // Statistics calculation
  const totalMeas = filteredMeasurements.length;
  const totalHb = filteredHbA1c.length;

  const sumVal = filteredMeasurements.reduce((acc, m) => acc + m.value, 0);
  const avgGlucose = totalMeas > 0 ? Math.round(sumVal / totalMeas) : 0;
  const minGlucose = totalMeas > 0 ? Math.min(...filteredMeasurements.map(m => m.value)) : 0;
  const maxGlucose = totalMeas > 0 ? Math.max(...filteredMeasurements.map(m => m.value)) : 0;

  // Percentage in Target (70-180 mg/dL)
  const inRangeCount = filteredMeasurements.filter(m => m.value >= 70 && m.value <= 180).length;
  const hypoCount = filteredMeasurements.filter(m => m.value < 70).length;
  const hyperCount = filteredMeasurements.filter(m => m.value > 180).length;
  const percentInRange = totalMeas > 0 ? Math.round((inRangeCount / totalMeas) * 100) : 0;

  // Handle Export PDF function
  const handleExport = async () => {
    if (totalMeas === 0 && totalHb === 0) {
      toast.error(t.errorEmpty);
      return;
    }

    setIsGenerating(true);
    setIsSuccess(false);

    try {
      // Small delay to let the UI update with spinner
      await new Promise(resolve => setTimeout(resolve, 100));

      generateMeasurementsPDF({
        measurements: filteredMeasurements.map(m => ({
          date: m.measuredAt,
          measured_at: m.measuredAt,
          value: m.value,
          glucose_value: m.value,
          context: m.context,
          notes: m.notes,
        })),
        hba1cHistory: filteredHbA1c.map(h => ({
          value: h.value,
          recorded_date: h.measuredAt || h.date || h.createdAt,
          date: h.measuredAt || h.date || h.createdAt,
        })),
        profile,
        dateFrom: filterStart,
        dateTo: filterEnd,
        language,
      });

      setIsSuccess(true);
      toast.success(t.exportSuccess);

      // Reset success state after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      toast.error("Impossible de générer le PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper age calculator from dob string
  function calculateAge(dobString: string): number {
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "max-w-md w-[92%] sm:w-full rounded-[28px] sm:rounded-[32px] p-6 card-shadow border border-muted bg-background focus:outline-none overflow-hidden",
          isRtl ? "rtl text-right" : "ltr text-left"
        )}
      >
        <DialogHeader className={cn("mb-2", isRtl ? "text-right" : "text-left")}>
          <DialogTitle className="text-xl font-extrabold text-primary flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <FileText size={20} />
            </span>
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        {/* Motion content container for slick spring reveal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="flex flex-col gap-5 py-2"
        >
          {/* Range Selection */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
              <Calendar size={14} className="text-secondary" />
              {t.selectPeriod}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {rangeOptions.map((opt) => {
                const isActive = range === opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setRange(opt.id as any)}
                    className={cn(
                      "px-3 py-3 rounded-2xl text-xs font-semibold border transition-all text-center relative overflow-hidden flex items-center justify-center min-h-[46px]",
                      isActive 
                        ? "text-primary-foreground border-primary shadow-sm" 
                        : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="export-range-indicator"
                        className="absolute inset-0 bg-primary -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Inputs Panel */}
          <AnimatePresence initial={false}>
            {range === 'custom' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-muted/30 p-3 rounded-2xl border border-muted flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">
                        {t.from}
                      </Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-xl border-muted bg-card hover:border-muted-foreground focus:border-primary transition-all text-xs h-10 px-3 w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">
                        {t.to}
                      </Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-xl border-muted bg-card hover:border-muted-foreground focus:border-primary transition-all text-xs h-10 px-3 w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview summary dashboard */}
          <div className="bg-muted/40 rounded-3xl p-4 border border-muted/50 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-foreground/80 flex items-center gap-1.5 border-b border-muted pb-2">
              <BarChart3 size={14} className="text-secondary" />
              {t.previewSummary}
            </h4>
            
            <div className="flex flex-col gap-2">
              {/* Measurements Row */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {t.measurementsFound(totalMeas)}
                </span>
                {totalMeas > 0 && (
                  <span className="font-bold text-foreground">{totalMeas}</span>
                )}
              </div>

              {/* HbA1c Row */}
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {t.hba1cEntries(totalHb)}
                </span>
                {totalHb > 0 && (
                  <span className="font-bold text-foreground">{totalHb}</span>
                )}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            {totalMeas > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-muted"
              >
                {/* Stat 1: Moyenne */}
                <div className="bg-card rounded-2xl p-2.5 text-center border border-muted/40 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <p className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                    <TrendingUp size={10} className="text-secondary" />
                    {t.avgGlucose}
                  </p>
                  <p className="text-sm font-bold text-primary mt-0.5">
                    {avgGlucose} <span className="text-[9px] font-normal text-muted-foreground">mg/dL</span>
                  </p>
                </div>

                {/* Stat 2: Dans la cible */}
                <div className="bg-card rounded-2xl p-2.5 text-center border border-muted/40 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                  <p className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 size={10} className="text-success" />
                    {t.inRange}
                  </p>
                  <p className="text-sm font-bold text-success mt-0.5">
                    {percentInRange}%
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Buttons at the bottom */}
        <div className={cn("flex gap-3 mt-4", isRtl ? "flex-row-reverse" : "flex-row")}>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 text-xs font-bold border-muted hover:bg-muted/30 active:scale-95 transition-all"
            disabled={isGenerating}
          >
            {t.cancel}
          </Button>
          <Button
            onClick={handleExport}
            className="flex-1 rounded-2xl h-12 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 active:scale-95 transition-all shadow-md gap-2"
            disabled={isGenerating || (totalMeas === 0 && totalHb === 0)}
          >
            {isGenerating ? (
              <><Loader2 size={14} className="animate-spin" /> {t.generating}</>
            ) : isSuccess ? (
              <><CheckCircle2 size={14} /> {isRtl ? '✓ تم التحميل!' : '✓ Téléchargé !'}</>
            ) : (
              <><Download size={14} /> {t.downloadPDF}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPDFModal;
