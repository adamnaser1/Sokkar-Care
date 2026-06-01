import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlucoseMeasurement, UserProfile } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import { Calendar, Download, X, FileText, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const handleExport = () => {
    if (totalMeas === 0 && totalHb === 0) {
      toast.error(t.errorEmpty);
      return;
    }

    setIsGenerating(true);

    // Create a hidden print iframe to achieve perfect CSS styling, modern grids, 
    // vector output, and seamless Arabic RTL character rendering.
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.zIndex = '-9999';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (!frameDoc) {
      toast.error("Échec du démarrage de l'impression.");
      setIsGenerating(false);
      return;
    }

    // Sort chronologically ascending for standard clinical layout
    const sortedMeasurements = [...filteredMeasurements].sort(
      (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
    );

    const formattedStart = filterStart.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEnd = filterEnd.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    const generationDate = new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'fr-FR');

    const patientAge = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html dir="${isRtl ? 'rtl' : 'ltr'}" lang="${language}">
      <head>
        <title>${t.reportTitle} - ${profile?.firstName || ''} ${profile?.lastName || ''}</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-family: ${isRtl ? "'Cairo'" : "'Outfit'"}, system-ui, -apple-system, sans-serif;
            margin: 30px;
            color: #2d3748;
            background-color: #ffffff;
            direction: ${isRtl ? 'rtl' : 'ltr'};
            text-align: ${isRtl ? 'right' : 'left'};
            line-height: 1.5;
          }
          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #1a365d;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-heart {
            width: 38px;
            height: 38px;
            background-color: #1a365d;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            font-weight: bold;
          }
          .brand-name {
            font-size: 26px;
            font-weight: 700;
            color: #1a365d;
          }
          .brand-name span {
            color: #3182ce;
          }
          .report-meta {
            text-align: ${isRtl ? 'left' : 'right'};
            font-size: 13px;
            color: #718096;
          }
          .report-meta h1 {
            margin: 0 0 6px 0;
            font-size: 20px;
            color: #1a365d;
            font-weight: 700;
          }
          .patient-card {
            background-color: #f7fafc;
            border-radius: 16px;
            padding: 18px 24px;
            margin-bottom: 24px;
            border: 1px solid #e2e8f0;
          }
          .patient-card h2 {
            margin-top: 0;
            font-size: 16px;
            color: #1a365d;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .grid-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            font-size: 14px;
          }
          .grid-item {
            display: flex;
            flex-direction: column;
          }
          .grid-label {
            color: #718096;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .grid-value {
            font-weight: 600;
            color: #2d3748;
          }
          .section-title {
            font-size: 17px;
            color: #1a365d;
            margin-top: 24px;
            margin-bottom: 14px;
            font-weight: 600;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 6px;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 24px;
          }
          .stat-box {
            border: 1px solid #e2e8f0;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 14px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          }
          .stat-box .label {
            font-size: 12px;
            color: #718096;
          }
          .stat-box .number {
            font-size: 22px;
            font-weight: 700;
            color: #1a365d;
            margin-top: 4px;
          }
          .stat-box.normal { border-${isRtl ? 'right' : 'left'}: 4px solid #48bb78; }
          .stat-box.hypo { border-${isRtl ? 'right' : 'left'}: 4px solid #f56565; }
          .stat-box.hyper { border-${isRtl ? 'right' : 'left'}: 4px solid #ed8936; }
          .stat-box.in-target { border-${isRtl ? 'right' : 'left'}: 4px solid #3182ce; }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th, td {
            padding: 10px 12px;
            text-align: ${isRtl ? 'right' : 'left'};
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
          }
          th {
            background-color: #f7fafc;
            color: #4a5568;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
          }
          tr:nth-child(even) {
            background-color: #fafbfe;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 500;
            text-align: center;
          }
          .badge.normal {
            background-color: #c6f6d5;
            color: #22543d;
          }
          .badge.hypo {
            background-color: #fed7d7;
            color: #742a2a;
          }
          .badge.hyper {
            background-color: #feebc8;
            color: #744210;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #a0aec0;
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            margin-top: 36px;
            page-break-inside: avoid;
          }
          @media print {
            body {
              margin: 15px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header-container {
              margin-bottom: 16px;
            }
            .patient-card {
              margin-bottom: 16px;
            }
            tr {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="logo-area">
            <div class="logo-heart">♥</div>
            <div class="brand-name">Sokkar <span>Care</span></div>
          </div>
          <div class="report-meta">
            <h1>${t.reportTitle}</h1>
            <div>${formattedStart} ${isRtl ? 'إلى' : 'au'} ${formattedEnd}</div>
            <div style="font-size: 11px; margin-top: 4px;">${t.generatedOn(generationDate)}</div>
          </div>
        </div>

        <div class="patient-card">
          <h2>${t.patientInfo}</h2>
          <div class="grid-container">
            <div class="grid-item">
              <span class="grid-label">${t.name}</span>
              <span class="grid-value">${profile?.firstName || ''} ${profile?.lastName || ''}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">${t.diabetesType}</span>
              <span class="grid-value">
                ${profile?.diabetesType === 'type1' ? (isRtl ? 'النوع 1' : 'Type 1') : 
                  profile?.diabetesType === 'type2' ? (isRtl ? 'النوع 2' : 'Type 2') : 
                  profile?.diabetesType || '-'}
              </span>
            </div>
            <div class="grid-item">
              <span class="grid-label">${t.targetGlucose}</span>
              <span class="grid-value">${profile?.targetGlucose || 120} mg/dL</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">${t.age}</span>
              <span class="grid-value">${patientAge ? `${patientAge} ${isRtl ? 'عاماً' : 'ans'}` : '-'}</span>
            </div>
          </div>
          <div class="grid-container" style="margin-top: 10px;">
            <div class="grid-item">
              <span class="grid-label">${t.weight}</span>
              <span class="grid-value">${profile?.weight ? `${profile.weight} kg` : '-'}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">${t.height}</span>
              <span class="grid-value">${profile?.height ? `${profile.height} cm` : '-'}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">${isRtl ? 'مستويات مخزون السكر' : 'HbA1c Courante'}</span>
              <span class="grid-value">${profile?.hba1c ? `${profile.hba1c} %` : '-'}</span>
            </div>
            <div class="grid-item">
              <span class="grid-label">${isRtl ? 'وحدة القياس' : 'Unité'}</span>
              <span class="grid-value">mg/dL</span>
            </div>
          </div>
        </div>

        <div class="section-title">${t.statistics}</div>
        <div class="stats-grid">
          <div class="stat-box in-target">
            <div class="label">${t.avgGlucose}</div>
            <div class="number">${avgGlucose} <span style="font-size: 11px; font-weight: normal;">mg/dL</span></div>
          </div>
          <div class="stat-box normal">
            <div class="label">${t.inRange} (%)</div>
            <div class="number">${percentInRange}%</div>
          </div>
          <div class="stat-box hypo">
            <div class="label">${t.hypoCount}</div>
            <div class="number">${hypoCount}</div>
          </div>
          <div class="stat-box hyper">
            <div class="label">${t.hyperCount}</div>
            <div class="number">${hyperCount}</div>
          </div>
        </div>

        ${sortedMeasurements.length > 0 ? `
          <div class="section-title">${t.measurementsJournal} (${totalMeas})</div>
          <table>
            <thead>
              <tr>
                <th>${t.date}</th>
                <th>${t.time}</th>
                <th>${t.value} (mg/dL)</th>
                <th>${t.context}</th>
                <th>${t.notes}</th>
              </tr>
            </thead>
            <tbody>
              ${sortedMeasurements.map(m => {
                const status = getGlucoseStatus(m.value);
                const d = new Date(m.measuredAt);
                const dateStr = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', { weekday: 'short', month: 'numeric', day: 'numeric' });
                const timeStr = d.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
                
                let badgeClass = 'normal';
                let statusLabel = isRtl ? 'طبيعي' : 'Normal';
                if (status.color === 'hypo') {
                  badgeClass = 'hypo';
                  statusLabel = isRtl ? 'منخفض' : 'Hypo';
                } else if (status.color === 'hyper') {
                  badgeClass = 'hyper';
                  statusLabel = isRtl ? 'مرتفع' : 'Hyper';
                }

                return `
                  <tr>
                    <td><strong>${dateStr}</strong></td>
                    <td>${timeStr}</td>
                    <td>
                      <span class="badge ${badgeClass}" style="font-size: 13px; font-weight: bold; padding: 4px 10px;">
                        ${m.value}
                      </span>
                    </td>
                    <td><span style="color: #4a5568;">${m.context || '-'}</span></td>
                    <td style="color: #718096; font-style: italic; max-width: 250px; word-wrap: break-word;">${m.notes || '-'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        ` : ''}

        ${filteredHbA1c.length > 0 ? `
          <div class="section-title">${t.hba1cHistoryTitle} (${totalHb})</div>
          <table>
            <thead>
              <tr>
                <th>${t.date}</th>
                <th>${t.hba1cValue}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHbA1c.map(h => {
                const d = new Date(h.measuredAt || h.date || h.createdAt || new Date());
                const dateStr = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
                return `
                  <tr>
                    <td><strong>${dateStr}</strong></td>
                    <td style="font-size: 14px; font-weight: bold; color: #1a365d;">${h.value} %</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        ` : ''}

        <div class="footer">
          <p>${t.clinicalDisclaimer}</p>
          <p style="margin-top: 8px; color: #cbd5e0; font-size: 10px;">Sokkar Care v1.0 - ${isRtl ? 'تطبيق إدارة السكري المتكامل' : 'Application de suivi du diabète'}</p>
        </div>
      </body>
      </html>
    `);
    frameDoc.close();

    // Set timeout to ensure CSS/Fonts render cleanly in the iframe before printing
    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        toast.success(t.exportSuccess);
      } catch (err) {
        // Fallback or debug keep
        // console.error("Export failure", err); // keep in production
        toast.error("Impossible de lancer l'export.");
      } finally {
        setIsGenerating(false);
        // Safely remove frame after system print dialogue is dismissed
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1500);
      }
    }, 1000);
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
            <Download size={14} />
            {isGenerating ? t.generating : t.downloadPDF}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportPDFModal;
