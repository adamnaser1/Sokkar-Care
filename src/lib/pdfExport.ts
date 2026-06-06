import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateMeasurementsPDF(params: {
  measurements: any[];
  hba1cHistory: any[];
  profile: any;
  dateFrom: Date;
  dateTo: Date;
  language: string;
}) {
  const { measurements, hba1cHistory, profile, dateFrom, dateTo, language } = params;
  const isAr = language === 'ar';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // ── PAGE 1 HEADER ──
  // Add app logo area (colored rectangle)
  doc.setFillColor(14, 165, 233); // primary blue
  doc.rect(0, 0, 210, 35, 'F');
  
  // App name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SokkarCare', 15, 20);
  
  // Subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(isAr ? 'تقرير قياسات الجلوكوز' : 'Rapport de Suivi Glycémique', 15, 28);

  // Patient info box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(10, 42, 190, 28, 3, 3, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  const patientName = profile 
    ? (profile.firstName || '') + ' ' + (profile.lastName || '')
    : 'Utilisateur';
  
  doc.text(isAr ? 'المريض:' : 'Patient:', 15, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(patientName.trim() || 'N/A', 40, 52);
  
  doc.setFont('helvetica', 'bold');
  doc.text(isAr ? 'الفترة:' : 'Période:', 15, 60);
  doc.setFont('helvetica', 'normal');
  const dateStr = formatDate(dateFrom) + ' → ' + formatDate(dateTo);
  doc.text(dateStr, 40, 60);
  
  doc.setFont('helvetica', 'bold');
  doc.text(isAr ? 'تاريخ التصدير:' : "Généré le:", 120, 52);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(new Date()), 155, 52);

  // ── FILTER MEASUREMENTS BY DATE RANGE ──
  const filtered = measurements.filter(m => {
    const d = new Date(m.date || m.measured_at);
    return d >= dateFrom && d <= dateTo;
  }).sort((a, b) => 
    new Date(a.date || a.measured_at).getTime() - 
    new Date(b.date || b.measured_at).getTime()
  );

  // ── STATS SUMMARY BOX ──
  const avg = filtered.length 
    ? Math.round(filtered.reduce((s, m) => s + (m.value || m.glucose_value || 0), 0) / filtered.length)
    : 0;
  const minVal = filtered.length 
    ? Math.min(...filtered.map(m => m.value || m.glucose_value || 999))
    : 0;
  const maxVal = filtered.length 
    ? Math.max(...filtered.map(m => m.value || m.glucose_value || 0))
    : 0;
  const inRange = filtered.filter(m => {
    const v = m.value || m.glucose_value || 0;
    return v >= 70 && v <= 180;
  }).length;
  const inRangePct = filtered.length 
    ? Math.round((inRange / filtered.length) * 100) 
    : 0;

  // Draw 4 stat boxes side by side
  const statsY = 78;
  const statsData = [
    { label: isAr ? 'إجمالي القياسات' : 'Total mesures', value: String(filtered.length) },
    { label: isAr ? 'المتوسط' : 'Moyenne', value: avg + ' mg/dL' },
    { label: isAr ? 'في النطاق' : 'Dans cible', value: inRangePct + '%' },
    { label: isAr ? 'الأدنى / الأعلى' : 'Min / Max', value: minVal + ' / ' + maxVal },
  ];
  
  statsData.forEach((stat, i) => {
    const x = 10 + i * 48;
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(x, statsY, 44, 22, 2, 2, 'F');
    doc.setTextColor(14, 165, 233);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, x + 22, statsY + 11, { align: 'center' });
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(stat.label, x + 22, statsY + 18, { align: 'center' });
  });

  // ── MEASUREMENTS TABLE grouped by day ──
  let currentY = statsY + 30;
  
  // Group measurements by day
  const byDay: Record<string, any[]> = {};
  filtered.forEach(m => {
    const d = new Date(m.date || m.measured_at);
    const dayKey = d.toISOString().split('T')[0];
    if (!byDay[dayKey]) byDay[dayKey] = [];
    byDay[dayKey].push(m);
  });

  const dayKeys = Object.keys(byDay).sort();

  if (dayKeys.length === 0) {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(11);
    doc.text(
      isAr ? 'لا توجد قياسات في هذه الفترة' : 'Aucune mesure pour cette période',
      105, currentY + 10, { align: 'center' }
    );
  }

  dayKeys.forEach(dayKey => {
    const dayMeasurements = byDay[dayKey];
    const dayDate = new Date(dayKey);
    
    // Day header
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFillColor(14, 165, 233);
    doc.roundedRect(10, currentY, 190, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(formatDayHeader(dayDate, isAr), 15, currentY + 5.5);
    
    // Day average on right
    const dayAvg = Math.round(
      dayMeasurements.reduce((s, m) => s + (m.value || m.glucose_value || 0), 0) / dayMeasurements.length
    );
    doc.text(
      (isAr ? 'المتوسط: ' : 'Moy: ') + dayAvg + ' mg/dL',
      195, currentY + 5.5, { align: 'right' }
    );
    
    currentY += 10;

    // Table for this day
    const tableData = dayMeasurements.map(m => {
      const time = new Date(m.date || m.measured_at)
        .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const value = (m.value || m.glucose_value || 0) + ' mg/dL';
      const context = translateContext(m.context || '', isAr);
      const notes = m.notes || '-';
      const status = getGlucoseStatus(m.value || m.glucose_value || 0, isAr);
      return [time, value, context, status, notes];
    });

    autoTable(doc, {
      startY: currentY,
      head: [[
        isAr ? 'الوقت' : 'Heure',
        isAr ? 'القيمة' : 'Valeur',
        isAr ? 'السياق' : 'Contexte',
        isAr ? 'الحالة' : 'Statut',
        isAr ? 'ملاحظات' : 'Notes',
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: { 
        fillColor: [240, 249, 255], 
        textColor: [14, 165, 233],
        fontStyle: 'bold',
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 28, fontStyle: 'bold' },
        2: { cellWidth: 38 },
        3: { cellWidth: 25 },
        4: { cellWidth: 75 },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 10, right: 10 },
      didParseCell: (data) => {
        // Color code glucose values
        if (data.column.index === 1 && data.section === 'body') {
          const val = parseFloat(data.cell.text[0]);
          if (val < 70) data.cell.styles.textColor = [220, 38, 38];
          else if (val > 180) data.cell.styles.textColor = [234, 88, 12];
          else data.cell.styles.textColor = [22, 163, 74];
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  });

  // ── HBA1C HISTORY TABLE ──
  const filteredHba1c = hba1cHistory.filter(h => {
    if (!h.recorded_date && !h.date) return true;
    const d = new Date(h.recorded_date || h.date);
    return d >= dateFrom && d <= dateTo;
  });

  if (filteredHba1c.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    
    doc.setFillColor(14, 165, 233);
    doc.roundedRect(10, currentY, 190, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(isAr ? 'سجل HbA1c' : 'Historique HbA1c', 15, currentY + 5.5);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [[
        isAr ? 'التاريخ' : 'Date',
        'HbA1c (%)',
        isAr ? 'التقييم' : 'Évaluation',
        isAr ? 'ملاحظات' : 'Commentaire',
      ]],
      body: filteredHba1c.map(h => {
        const val = h.value || 0;
        const evaluation = val < 7 ? (isAr ? 'ممتاز ✓' : 'Excellent ✓')
          : val < 8 ? (isAr ? 'جيد' : 'Bien')
          : (isAr ? 'يحتاج تحسين' : 'À améliorer');
        return [
          formatDate(new Date(h.recorded_date || h.date || new Date())),
          val.toFixed(1) + '%',
          evaluation,
          h.comment || '-',
        ];
      }),
      theme: 'striped',
      headStyles: { fillColor: [240, 249, 255], textColor: [14, 165, 233], fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [50, 50, 50] },
      margin: { left: 10, right: 10 },
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // ── FOOTER ON ALL PAGES ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('SokkarCare — ' + (isAr ? 'تقرير طبي سري' : 'Document médical confidentiel'), 15, 291);
    doc.text(isAr ? `صفحة ${i} من ${totalPages}` : `Page ${i} / ${totalPages}`, 195, 291, { align: 'right' });
  }

  // ── SAVE FILE ──
  const fileName = 'SokkarCare_Journal_' + 
    formatDate(dateFrom).replace(/\//g, '-') + '_' + 
    formatDate(dateTo).replace(/\//g, '-') + '.pdf';
  doc.save(fileName);
}

// ── HELPER FUNCTIONS ──
function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDayHeader(date: Date, isAr: boolean): string {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString(isAr ? 'ar-DZ' : 'fr-FR', options);
}

function translateContext(context: string, isAr: boolean): string {
  const map: Record<string, [string, string]> = {
    'avant_petit_dej': ['Avant petit-déj.', 'قبل الفطور'],
    'apres_petit_dej': ['Après petit-déj.', 'بعد الفطور'],
    'avant_dejeuner': ['Avant déjeuner', 'قبل الغداء'],
    'apres_dejeuner': ['Après déjeuner', 'بعد الغداء'],
    'avant_diner': ['Avant dîner', 'قبل العشاء'],
    'apres_diner': ['Après dîner', 'بعد العشاء'],
    'coucher': ['Au coucher', 'عند النوم'],
    'reveil': ['Au réveil', 'عند الاستيقاظ'],
    'autre': ['Autre', 'أخرى'],
  };
  const entry = map[context];
  if (!entry) return context;
  return isAr ? entry[1] : entry[0];
}

function getGlucoseStatus(value: number, isAr: boolean): string {
  if (value < 70) return isAr ? '⚠ نقص سكر' : '⚠ Hypo';
  if (value <= 180) return isAr ? '✓ طبيعي' : '✓ Normal';
  if (value <= 250) return isAr ? '↑ مرتفع' : '↑ Élevé';
  return isAr ? '⚠ مرتفع جداً' : '⚠ Très élevé';
}
