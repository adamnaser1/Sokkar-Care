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

export interface CalculatorEntry {
  id: string;
  measured: number;
  target: number;
  sensitivity: number;
  result: number;
  calculatedAt: string;
}

export interface Badge {
  id: string;
  type: string;
  name: string;
  icon: string;
  description: string;
  progress: number;
  total: number;
}

export const BADGES: Badge[] = [
  { id: '1', type: 'streak7', name: '7 jours d\'affilée', icon: '🏆', description: 'Mesurez 7 jours consécutifs', progress: 0, total: 7 },
  { id: '2', type: 'reader', name: 'Lecteur Quotidien', icon: '📚', description: 'Consultez 10 conseils', progress: 0, total: 10 },
  { id: '3', type: 'stable', name: 'Glycémie Stable', icon: '💪', description: '4 mesures normales d\'affilée', progress: 0, total: 4 },
  { id: '4', type: 'foodie', name: 'Gourmand Sain', icon: '🎯', description: 'Consultez 20 aliments', progress: 0, total: 20 },
  { id: '5', type: 'beginner', name: 'Débutant', icon: '🚀', description: 'Complétez l\'onboarding', progress: 0, total: 1 },
  { id: '6', type: 'streak30', name: '30 jours', icon: '🎖', description: 'Utilisez l\'app 30 jours', progress: 0, total: 30 },
  { id: '7', type: 'master', name: 'Maître Glucose', icon: '⭐', description: 'Atteignez 5000 points', progress: 0, total: 5000 },
];

interface NotificationSettings {
  measureReminders: boolean;
  measureTimes: string[];
  injectionReminders: boolean;
  injectionTimes: string[];
  alertsEnabled: boolean;
  hypoThreshold: number;
  hyperThreshold: number;
  weeklyNews: boolean;
}

interface AppState {
  onboardingComplete: boolean;
  profile: UserProfile | null;
  measurements: GlucoseMeasurement[];
  calculatorHistory: CalculatorEntry[];
  points: number;
  streak: number;
  tipsRead: number;
  foodsViewed: number;
  glucoseUnit: 'mg/dL' | 'mmol/L';
  weightUnit: 'kg' | 'lb';
  notifications: NotificationSettings;
  setOnboardingComplete: (v: boolean) => void;
  setProfile: (p: UserProfile) => void;
  addMeasurement: (m: GlucoseMeasurement) => void;
  updateMeasurement: (id: string, m: Partial<GlucoseMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  addCalculatorEntry: (e: CalculatorEntry) => void;
  incrementTipsRead: () => void;
  incrementFoodsViewed: () => void;
  setGlucoseUnit: (u: 'mg/dL' | 'mmol/L') => void;
  setWeightUnit: (u: 'kg' | 'lb') => void;
  setNotifications: (n: Partial<NotificationSettings>) => void;
  resetData: () => void;
}

const defaultNotifications: NotificationSettings = {
  measureReminders: true,
  measureTimes: ['08:00', '12:00', '17:00', '22:00'],
  injectionReminders: true,
  injectionTimes: ['08:00', '20:00'],
  alertsEnabled: true,
  hypoThreshold: 70,
  hyperThreshold: 180,
  weeklyNews: false,
};

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
  calculatorHistory: saved.calculatorHistory || [],
  points: saved.points || 0,
  streak: saved.streak || 0,
  tipsRead: saved.tipsRead || 0,
  foodsViewed: saved.foodsViewed || 0,
  glucoseUnit: saved.glucoseUnit || 'mg/dL',
  weightUnit: saved.weightUnit || 'kg',
  notifications: saved.notifications || defaultNotifications,
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
  deleteMeasurement: (id) => {
    const measurements = get().measurements.filter(m => m.id !== id);
    set({ measurements });
    persist(get());
  },
  addCalculatorEntry: (e) => {
    const calculatorHistory = [e, ...get().calculatorHistory].slice(0, 20);
    set({ calculatorHistory });
    persist(get());
  },
  incrementTipsRead: () => {
    const tipsRead = get().tipsRead + 1;
    const points = get().points + 10;
    set({ tipsRead, points });
    persist(get());
  },
  incrementFoodsViewed: () => {
    const foodsViewed = get().foodsViewed + 1;
    const points = get().points + 5;
    set({ foodsViewed, points });
    persist(get());
  },
  setGlucoseUnit: (u) => { set({ glucoseUnit: u }); persist(get()); },
  setWeightUnit: (u) => { set({ weightUnit: u }); persist(get()); },
  setNotifications: (n) => {
    set({ notifications: { ...get().notifications, ...n } });
    persist(get());
  },
  resetData: () => {
    set({ measurements: [], calculatorHistory: [], points: 0, streak: 0, tipsRead: 0, foodsViewed: 0 });
    persist(get());
  },
}));

function persist(state: AppState) {
  localStorage.setItem('sokkar-care-state', JSON.stringify({
    onboardingComplete: state.onboardingComplete,
    profile: state.profile,
    measurements: state.measurements,
    calculatorHistory: state.calculatorHistory,
    points: state.points,
    streak: state.streak,
    tipsRead: state.tipsRead,
    foodsViewed: state.foodsViewed,
    glucoseUnit: state.glucoseUnit,
    weightUnit: state.weightUnit,
    notifications: state.notifications,
  }));
}
