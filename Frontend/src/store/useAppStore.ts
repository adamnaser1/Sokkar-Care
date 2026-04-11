import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Medication {
  id: string;
  name: string;
  type: string;
  dosage: string;
  frequency: string;
}

export interface HbA1cRecord {
  id: string;
  date: string;
  value: number;
  comment?: string;
}

export interface DoseRecord {
  medId: string;
  name: string;
  dose: string;
  skipped: boolean;
  notes?: string;
}

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
  avatarData?: string;
  referringDoctor?: string;
  medications?: Medication[];
  hba1cHistory?: HbA1cRecord[];
}

export interface GlucoseMeasurement {
  id: string;
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  context: string;
  notes: string;
  measuredAt: string;
  medicationDoses?: DoseRecord[];
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
  measureRemindersDays: string;
  injectionReminders: boolean;
  alertsEnabled: boolean;
  hypoThreshold: number;
  hyperThreshold: number;
  hba1cReminders: boolean;
  weeklyNews: boolean;
  pushSubscriptionStr?: string;
}

interface AppState {
  hasCompletedTour: boolean;
  onboardingComplete: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  measurements: GlucoseMeasurement[];
  calculatorHistory: CalculatorEntry[];
  points: number;
  streak: number;
  tipsRead: number;
  foodsViewed: number;
  glucoseUnit: 'mg/dL' | 'mmol/L';
  weightUnit: 'kg' | 'lb';
  language: 'fr' | 'ar';
  notifications: NotificationSettings;
  recipeCategoryFilter: string | null;
  isDataFetched: boolean;

  setHasCompletedTour: (v: boolean) => void;
  setOnboardingComplete: (v: boolean) => void;
  setProfile: (p: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addMeasurement: (m: GlucoseMeasurement) => void;
  updateMeasurement: (id: string, m: Partial<GlucoseMeasurement>) => void;
  deleteMeasurement: (id: string) => void;
  addCalculatorEntry: (e: CalculatorEntry) => void;
  incrementTipsRead: () => void;
  incrementFoodsViewed: () => void;
  setGlucoseUnit: (u: 'mg/dL' | 'mmol/L') => void;
  setWeightUnit: (u: 'kg' | 'lb') => void;
  setLanguage: (l: 'fr' | 'ar') => void;
  setNotifications: (n: Partial<NotificationSettings>) => void;
  setRecipeCategoryFilter: (filter: string | null) => void;
  setIsAuthenticated: (v: boolean) => void;
  syncToSupabase: (type?: 'profile' | 'measurements' | 'stats' | 'medications' | 'hba1c' | 'calculator') => Promise<void>;
  loadFromSupabase: () => Promise<void>;
  logout: () => Promise<void>;
  resetData: () => void;
  setIsDataFetched: (v: boolean) => void;
}

const defaultNotifications: NotificationSettings = {
  measureReminders: true,
  measureTimes: ['08:00', '12:00', '17:00'],
  measureRemindersDays: 'all',
  injectionReminders: true,
  alertsEnabled: true,
  hypoThreshold: 70,
  hyperThreshold: 250,
  hba1cReminders: true,
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
  hasCompletedTour: saved.hasCompletedTour || false,
  onboardingComplete: saved.onboardingComplete || false,
  isAuthenticated: saved.isAuthenticated || false,
  profile: saved.profile || null,
  measurements: saved.measurements || [],
  calculatorHistory: saved.calculatorHistory || [],
  points: saved.points || 0,
  streak: saved.streak || 0,
  tipsRead: saved.tipsRead || 0,
  foodsViewed: saved.foodsViewed || 0,
  glucoseUnit: saved.glucoseUnit || 'mg/dL',
  weightUnit: saved.weightUnit || 'kg',
  language: saved.language || 'fr',
  notifications: saved.notifications || defaultNotifications,
  recipeCategoryFilter: null,
  isDataFetched: false,

  setHasCompletedTour: (v) => {
    set({ hasCompletedTour: v });
    persist(get());
  },
  setOnboardingComplete: (v) => {
    set({ onboardingComplete: v });
    persist(get());
  },
  setProfile: async (p) => {
    set({ profile: p });
    persist(get());
    await get().syncToSupabase('profile');
  },
  updateProfile: async (updates) => {
    const current = get().profile;
    if (current) {
      set({ profile: { ...current, ...updates } });
      persist(get());
      await get().syncToSupabase('profile');
    }
  },
  addMeasurement: async (m) => {
    const measurements = [m, ...get().measurements];
    const points = get().points + 50;
    set({ measurements, points });
    persist(get());
    await get().syncToSupabase('measurements');
    await get().syncToSupabase('stats');
  },
  updateMeasurement: async (id, updates) => {
    const measurements = get().measurements.map(m => m.id === id ? { ...m, ...updates } : m);
    set({ measurements });
    persist(get());
    await get().syncToSupabase('measurements');
  },
  deleteMeasurement: async (id) => {
    const measurements = get().measurements.filter(m => m.id !== id);
    set({ measurements });
    persist(get());
    await get().syncToSupabase('measurements');
  },
  addCalculatorEntry: async (e) => {
    const calculatorHistory = [e, ...get().calculatorHistory].slice(0, 20);
    set({ calculatorHistory });
    persist(get());
    await get().syncToSupabase('calculator');
  },
  incrementTipsRead: async () => {
    const tipsRead = get().tipsRead + 1;
    const points = get().points + 10;
    set({ tipsRead, points });
    persist(get());
    await get().syncToSupabase('stats');
  },
  incrementFoodsViewed: async () => {
    const foodsViewed = get().foodsViewed + 1;
    const points = get().points + 5;
    set({ foodsViewed, points });
    persist(get());
    await get().syncToSupabase('stats');
  },
  setGlucoseUnit: (u) => { set({ glucoseUnit: u }); persist(get()); },
  setWeightUnit: (u) => { set({ weightUnit: u }); persist(get()); },
  setLanguage: async (l) => { 
    set({ language: l }); 
    const profile = get().profile;
    if (profile) {
      set({ profile: { ...profile, language: l } });
      await get().syncToSupabase('profile');
    }
    persist(get()); 
  },
  setIsAuthenticated: (v) => { set({ isAuthenticated: v }); persist(get()); },
  setNotifications: (n) => {
    set({ notifications: { ...get().notifications, ...n } });
    persist(get());
  },
  setRecipeCategoryFilter: (f) => set({ recipeCategoryFilter: f }),

  syncToSupabase: async (type) => {
    const { isAuthenticated, profile, measurements, points, streak, tipsRead, foodsViewed, calculatorHistory } = get();
    if (!isAuthenticated) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userId = user.id;

      // Profile sync
      if (!type || type === 'profile') {
        if (profile) {
          const { storeProfileToDb } = await import('@/lib/profileSync');
          await supabase.from('profiles').upsert(storeProfileToDb(profile, userId));
        }
      }

      // Stats sync
      if (!type || type === 'stats') {
        await supabase.from('user_stats').upsert({
          user_id: userId,
          points,
          streak,
          tips_read: tipsRead,
          foods_viewed: foodsViewed,
          last_activity: new Date().toISOString()
        });
      }

      // Measurements sync
      if (!type || type === 'measurements') {
        if (measurements.length > 0) {
          await supabase.from('measurements').upsert(measurements.map(m => ({
            id: m.id,
            user_id: userId,
            glucose_value: m.value, // corrected
            context: m.context,
            notes: m.notes,
            measured_at: m.measuredAt
          })));
        }
      }

      // Medications sync
      if ((!type || type === 'medications') && profile?.medications) {
        await supabase.from('medications').upsert(profile.medications.map(m => ({
          id: m.id,
          user_id: userId,
          name: m.name,
          type: m.type,
          usual_dose: m.dosage, // corrected
          timing: m.frequency ? m.frequency.split(',').map(s => s.trim()) : [] // map to text array
        })));
      }

      // HbA1c History sync
      if ((!type || type === 'hba1c') && profile?.hba1cHistory) {
        await supabase.from('hba1c_records').upsert(profile.hba1cHistory.map(h => ({
          id: h.id,
          user_id: userId,
          recorded_date: h.date, // corrected
          value: h.value,
          comment: h.comment
        })));
      }

      // Calculator sync
      if (!type || type === 'calculator') {
        if (calculatorHistory.length > 0) {
          await supabase.from('calculator_history').upsert(calculatorHistory.map(e => ({
            id: e.id,
            user_id: userId,
            measured: e.measured,
            target: e.target,
            sensitivity: e.sensitivity,
            result: e.result,
            calculated_at: e.calculatedAt
          })));
        }
      }
    } catch (_err) {
      // Supabase sync failed silently in background
    }
  },

  loadFromSupabase: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userId = user.id;
      const { dbProfileToStore, dbMeasurementToStore, dbCalculatorToStore, dbMedicationToStore, dbHba1cToStore } = await import('@/lib/profileSync');

      // Fetch profile and stats first (core data)
      const [profileRes, statsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_stats').select('*').eq('user_id', userId).maybeSingle()
      ]);

      const newState: Partial<AppState> = { isAuthenticated: true };

      if (profileRes.data) {
        newState.profile = dbProfileToStore(profileRes.data);
        newState.onboardingComplete = profileRes.data.onboarding_completed;
        newState.language = profileRes.data.language || 'fr';
      }

      if (statsRes.data) {
        newState.points = statsRes.data.points || 0;
        newState.streak = statsRes.data.streak || 0;
        newState.tipsRead = statsRes.data.tips_read || 0;
        newState.foodsViewed = statsRes.data.foods_viewed || 0;
      }

      // Fetch other data collections
      const [measurementsRes, medsRes, hba1cRes, calcRes] = await Promise.all([
        supabase.from('measurements').select('*').eq('user_id', userId).order('measured_at', { ascending: false }),
        supabase.from('medications').select('*').eq('user_id', userId),
        supabase.from('hba1c_records').select('*').eq('user_id', userId).order('recorded_date', { ascending: false }),
        supabase.from('calculator_history').select('*').eq('user_id', userId).limit(20).order('calculated_at', { ascending: false })
      ]);

      if (measurementsRes.data) {
        newState.measurements = measurementsRes.data.map(dbMeasurementToStore);
      }

      if (medsRes.data && newState.profile) {
        newState.profile.medications = medsRes.data.map(dbMedicationToStore);
      }

      if (hba1cRes.data && newState.profile) {
        newState.profile.hba1cHistory = hba1cRes.data.map(dbHba1cToStore);
      }

      if (calcRes.data) {
        newState.calculatorHistory = calcRes.data.map(dbCalculatorToStore);
      }

      set({ ...newState, isDataFetched: true });
      persist(get());
    } catch (_err) {
      // Ensure we don't block the UI forever even on error
      set({ isDataFetched: true });
    }
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ 
        isAuthenticated: false, 
        profile: null, 
        hasCompletedTour: false,
        onboardingComplete: false,
        measurements: [],
        calculatorHistory: [],
        points: 0,
        streak: 0,
        tipsRead: 0,
        foodsViewed: 0
      });
      localStorage.removeItem('sokkar-care-state');
      // Invalidate the auth session local keys if any exist via supabase
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
      window.location.href = '/login?loggedOut=true';
    } catch (_err) {
      // Logout failed
    }
  },
  resetData: () => {
    set({ measurements: [], calculatorHistory: [], points: 0, streak: 0, tipsRead: 0, foodsViewed: 0, isDataFetched: false });
    persist(get());
  },
  setIsDataFetched: (v) => set({ isDataFetched: v }),
}));

function persist(state: AppState) {
  localStorage.setItem('sokkar-care-state', JSON.stringify({
    hasCompletedTour: state.hasCompletedTour,
    onboardingComplete: state.onboardingComplete,
    isAuthenticated: state.isAuthenticated,
    profile: state.profile,
    measurements: state.measurements,
    calculatorHistory: state.calculatorHistory,
    points: state.points,
    streak: state.streak,
    tipsRead: state.tipsRead,
    foodsViewed: state.foodsViewed,
    glucoseUnit: state.glucoseUnit,
    weightUnit: state.weightUnit,
    language: state.language,
    notifications: state.notifications,
  }));
}
