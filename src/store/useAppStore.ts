import { create } from 'zustand';

export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  weight: number;
  height: number;
  sex: string;
  diabetesType: string;
  diagnosisDate: string;
  usesRapidInsulin: boolean;
  rapidInsulinType: string;
  rapidInsulinUnits: number;
  usesLongInsulin: boolean;
  longInsulinType: string;
  longInsulinUnits: number;
  otherMedications: string;
  hba1c: number;
  lastGlucose: number;
  targetGlucose: number;
  sensitivityFactor: number;
  activityLevel: string;
  dietType: string[];
  language: string;
}

export interface GlucoseMeasurement {
  id: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  context: string;
  notes: string;
  measuredAt: string;
}

export interface Badge {
  id: string;
  type: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

interface AppState {
  onboardingComplete: boolean;
  profile: UserProfile | null;
  measurements: GlucoseMeasurement[];
  points: number;
  streak: number;
  setOnboardingComplete: (v: boolean) => void;
  setProfile: (p: UserProfile) => void;
  addMeasurement: (m: GlucoseMeasurement) => void;
  updateMeasurement: (id: string, m: Partial<GlucoseMeasurement>) => void;
}

const loadState = () => {
  try {
    const s = localStorage.getItem('sokkar-care-state');
    return s ? JSON.parse(s) : {};
  } catch { return {}; }
};

const saved = loadState();

export const useAppStore = create<AppState>((set, get) => ({
  onboardingComplete: saved.onboardingComplete || false,
  profile: saved.profile || null,
  measurements: saved.measurements || [],
  points: saved.points || 0,
  streak: saved.streak || 0,
  setOnboardingComplete: (v) => {
    set({ onboardingComplete: v });
    persist(get());
  },
  setProfile: (p) => {
    set({ profile: p });
    persist(get());
  },
  addMeasurement: (m) => {
    const measurements = [m, ...get().measurements];
    const points = get().points + 50;
    set({ measurements, points });
    persist(get());
  },
  updateMeasurement: (id, updates) => {
    const measurements = get().measurements.map(m => m.id === id ? { ...m, ...updates } : m);
    set({ measurements });
    persist(get());
  },
}));

function persist(state: AppState) {
  localStorage.setItem('sokkar-care-state', JSON.stringify({
    onboardingComplete: state.onboardingComplete,
    profile: state.profile,
    measurements: state.measurements,
    points: state.points,
    streak: state.streak,
  }));
}
