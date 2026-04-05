export function getGlucoseStatus(value: number, lang: string = 'fr'): { label: string; color: 'normal' | 'hypo' | 'hyper'; icon: string } {
  const isAr = lang === 'ar';
  if (value < 70) return { label: isAr ? 'نقص السكر' : 'Hypoglycémie', color: 'hypo', icon: '✕' };
  if (value > 180) return { label: isAr ? 'ارتفاع السكر' : 'Hyperglycémie', color: 'hyper', icon: '⚠' };
  return { label: isAr ? 'طبيعي' : 'Normal', color: 'normal', icon: '✓' };
}

export function calculateBMI(weight: number, heightCm: number): number {
  if (!weight || !heightCm) return 0;
  return Math.round((weight / ((heightCm / 100) ** 2)) * 10) / 10;
}

export function calculateInsulinDose(measured: number, target: number, sensitivity: number): number {
  if (!sensitivity) return 0;
  const dose = (measured - target) / sensitivity;
  return Math.round(Math.max(0, dose) * 10) / 10;
}

export function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatRelativeTime(dateStr: string, lang: string = 'fr'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const isAr = lang === 'ar';

  if (diffMin < 1) return isAr ? 'الآن' : "À l'instant";
  if (diffMin < 60) return isAr ? `منذ ${diffMin} دقيقة` : `Il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return isAr ? `منذ ${diffH} ساعة` : `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return isAr ? 'أمس' : 'Hier';
  return isAr ? `منذ ${diffD} يوم` : `Il y a ${diffD}j`;
}
