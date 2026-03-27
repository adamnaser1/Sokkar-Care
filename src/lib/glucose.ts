export function getGlucoseStatus(value: number): { label: string; color: 'normal' | 'hypo' | 'hyper'; icon: string } {
  if (value < 70) return { label: 'Hypoglycémie', color: 'hypo', icon: '✕' };
  if (value > 180) return { label: 'Hyperglycémie', color: 'hyper', icon: '⚠' };
  return { label: 'Normal', color: 'normal', icon: '✓' };
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

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'Hier';
  return `Il y a ${diffD}j`;
}
