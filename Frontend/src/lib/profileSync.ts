import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/store/useAppStore';

/**
 * Maps a Supabase DB profile row → frontend UserProfile object.
 */
export function dbProfileToStore(db: any): UserProfile {
  return {
    firstName: db.first_name || '',
    lastName: db.last_name || '',
    dateOfBirth: db.date_of_birth || '',
    weight: db.weight_kg || 0,
    height: db.height_cm || 0,
    sex: db.gender || '',
    diabetesType: db.diabetes_type || '',
    diagnosisDate: db.diagnosis_date || '',
    usesRapidInsulin: db.uses_rapid_insulin || false,
    rapidInsulinType: db.rapid_insulin_type || '',
    rapidInsulinUnits: db.rapid_insulin_units || 0,
    usesLongInsulin: db.uses_long_insulin || false,
    longInsulinType: db.long_insulin_type || '',
    longInsulinUnits: db.long_insulin_units || 0,
    otherMedications: db.other_medications || '',
    hba1c: db.hba1c || 0,
    lastGlucose: db.last_glucose || 0,
    targetGlucose: db.target_glucose || 120,
    sensitivityFactor: db.sensitivity_factor || 50,
    activityLevel: db.activity_level || 'moderate',
    dietType: db.diet_type || ['standard'],
    language: db.language || 'fr',
    avatarData: db.avatar_url || undefined,
    referringDoctor: db.doctor_name || undefined,
  };
}

/**
 * Maps a frontend UserProfile → Supabase DB row (partial, for upsert).
 */
export function storeProfileToDb(profile: Partial<UserProfile>, userId: string) {
  return {
    id: userId,
    first_name: profile.firstName || null,
    last_name: profile.lastName || null,
    date_of_birth: profile.dateOfBirth || null,
    weight_kg: profile.weight || null,
    height_cm: profile.height || null,
    gender: profile.sex || null,
    diabetes_type: profile.diabetesType || null,
    diagnosis_date: profile.diagnosisDate || null,
    uses_rapid_insulin: profile.usesRapidInsulin || false,
    rapid_insulin_type: profile.rapidInsulinType || null,
    rapid_insulin_units: profile.rapidInsulinUnits || 0,
    uses_long_insulin: profile.usesLongInsulin || false,
    long_insulin_type: profile.longInsulinType || null,
    long_insulin_units: profile.longInsulinUnits || 0,
    other_medications: profile.otherMedications || null,
    hba1c: profile.hba1c || null,
    last_glucose: profile.lastGlucose || null,
    target_glucose: profile.targetGlucose || 120,
    sensitivity_factor: profile.sensitivityFactor || 50,
    activity_level: profile.activityLevel || 'moderate',
    diet_type: profile.dietType || ['standard'],
    language: profile.language || 'fr',
    avatar_url: profile.avatarData || null,
    doctor_name: profile.referringDoctor || null,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  };
}

export type ProfileCheckResult = 'dashboard' | 'onboarding';

/**
 * Checks Supabase for an existing profile for the given user.
 * Returns the profile data and destination.
 */
export async function checkUserProfile(userId: string): Promise<{
  destination: ProfileCheckResult;
  profile: UserProfile | null;
}> {
  try {
    const { data: dbProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !dbProfile) {
      // No profile row exists → create a skeleton and go to onboarding
      await supabase.from('profiles').upsert({
        id: userId,
        onboarding_completed: false,
      });
      return { destination: 'onboarding', profile: null };
    }

    if (dbProfile.onboarding_completed) {
      // Profile marked complete → load it (even if some fields are null)
      return { destination: 'dashboard', profile: dbProfileToStore(dbProfile) };
    }

    // Profile exists but onboarding not completed
    return { destination: 'onboarding', profile: null };
  } catch (err) {
    console.error('Failed to check user profile:', err);
    return { destination: 'onboarding', profile: null };
  }
}
