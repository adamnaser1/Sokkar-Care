import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { calculateBMI } from '@/lib/glucose';
import { UserProfile, useAppStore } from '@/store/useAppStore';
import SokkarLogo from '@/components/SokkarLogo';
import { supabase } from '@/lib/supabase';
import { storeProfileToDb } from '@/lib/profileSync';
import { toast } from 'sonner';

const formVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

const ProfileForm = ({ onComplete }: { onComplete: () => void }) => {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1);
  const setProfile = useAppStore(s => s.setProfile);
  const setOnboardingComplete = useAppStore(s => s.setOnboardingComplete);
  const isRTL = language === 'ar';

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const NextIcon = isRTL ? ArrowLeft : ArrowRight;

  const [form, setForm] = useState<Partial<UserProfile>>({
    firstName: '', lastName: '', dateOfBirth: '', weight: 0, height: 0, sex: '',
    diabetesType: '', diagnosisDate: '',
    usesRapidInsulin: false, rapidInsulinType: '', rapidInsulinUnits: 0,
    usesLongInsulin: false, longInsulinType: '', longInsulinUnits: 0,
    otherMedications: '', hba1c: 0, lastGlucose: 0, targetGlucose: 120,
    sensitivityFactor: 50, activityLevel: 'moderate', dietType: ['standard'], language: language,
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const bmi = calculateBMI(form.weight || 0, form.height || 0);

  const goNext = () => { setDirection(1); setPage(p => Math.min(p + 1, 3)); };
  const goPrev = () => { setDirection(-1); setPage(p => Math.max(p - 1, 1)); };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Save to local store
      setProfile(form as UserProfile);
      setOnboardingComplete(true);

      // Save to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbData = storeProfileToDb(form, user.id);
        const { error } = await supabase
          .from('profiles')
          .upsert(dbData);

        if (error) {
          console.error('Failed to save profile to Supabase:', error);
        }
      }

      onComplete();
    } catch (err) {
      console.error('Error saving profile:', err);
      toast.error(isRTL ? 'خطأ في حفظ الملف الشخصي' : 'Erreur lors de la sauvegarde du profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-background overflow-hidden relative">
      <div className="max-w-lg w-full mx-auto flex flex-col gap-6 relative z-10">
        <SokkarLogo size={36} />

        {/* Progress */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                className="h-2 w-full rounded-full"
                animate={{ backgroundColor: i <= page ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-xs font-medium text-muted-foreground">{t.profileForm.page} {i}/3</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {page === 1 && (
              <div className="flex flex-col gap-5 mt-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t.profileForm.pageIdentity}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>{t.profileForm.firstName}</Label>
                    <Input value={form.firstName} onChange={e => update('firstName', e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>{t.profileForm.lastName}</Label>
                    <Input value={form.lastName} onChange={e => update('lastName', e.target.value)} className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>{t.profileForm.dob}</Label>
                  <Input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>{t.profileForm.weight}</Label>
                    <Input type="number" value={form.weight || ''} onChange={e => update('weight', +e.target.value)} placeholder="70" className="h-12 rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>{t.profileForm.height}</Label>
                    <Input type="number" value={form.height || ''} onChange={e => update('height', +e.target.value)} placeholder="170" className="h-12 rounded-xl" />
                  </div>
                </div>
                <motion.div
                  className="p-4 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between"
                  animate={{ scale: bmi ? [1, 1.02, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-medium text-muted-foreground">{t.profileForm.calculatedBmi}</span>
                  <span className="text-lg font-bold text-primary">{bmi || '—'}</span>
                </motion.div>
                <div className="flex flex-col gap-1.5">
                  <Label>{t.profileForm.sex}</Label>
                  <Select value={form.sex} onValueChange={v => update('sex', v)}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t.profileForm.male}</SelectItem>
                      <SelectItem value="female">{t.profileForm.female}</SelectItem>
                      <SelectItem value="other">{t.profileForm.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {page === 2 && (
              <div className="flex flex-col gap-5 mt-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t.profileForm.pageDiabetes}</h2>
                <div className="flex flex-col gap-1.5">
                  <Label>{t.profileForm.diabetesType}</Label>
                  <Select value={form.diabetesType} onValueChange={v => update('diabetesType', v)}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">{t.profileForm.type1}</SelectItem>
                      <SelectItem value="type2">{t.profileForm.type2}</SelectItem>
                      <SelectItem value="gestational">{t.profileForm.gestational}</SelectItem>
                      <SelectItem value="other">{t.profileForm.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>{t.profileForm.diagnosisDate}</Label>
                  <Input type="date" value={form.diagnosisDate} onChange={e => update('diagnosisDate', e.target.value)} className="h-12 rounded-xl" />
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">{t.profileForm.rapidInsulin}</Label>
                    <Switch checked={form.usesRapidInsulin} onCheckedChange={v => update('usesRapidInsulin', v)} />
                  </div>
                  <AnimatePresence>
                    {form.usesRapidInsulin && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">{t.profileForm.selectInsulin}</Label>
                            <Select value={form.rapidInsulinType} onValueChange={v => update('rapidInsulinType', v)}>
                              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder={t.profileForm.selectInsulin || "Sélectionner"} /></SelectTrigger>
                              <SelectContent>
                                {['Humalog', 'NovoLog', 'Apidra', 'Fiasp'].map(val => (
                                  <SelectItem key={val} value={val}>{val}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">{t.profileForm.unitsPerDay}</Label>
                            <Input type="number" value={form.rapidInsulinUnits || ''} onChange={e => update('rapidInsulinUnits', +e.target.value)} className="h-10 rounded-lg" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-5 rounded-2xl bg-card border border-border flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">{t.profileForm.longInsulin}</Label>
                    <Switch checked={form.usesLongInsulin} onCheckedChange={v => update('usesLongInsulin', v)} />
                  </div>
                  <AnimatePresence>
                    {form.usesLongInsulin && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">{t.profileForm.selectInsulin}</Label>
                            <Select value={form.longInsulinType} onValueChange={v => update('longInsulinType', v)}>
                              <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder={t.profileForm.selectInsulin || "Sélectionner"} /></SelectTrigger>
                              <SelectContent>
                                {['Lantus', 'Tresiba', 'Levemir', 'Toujeo'].map(val => (
                                  <SelectItem key={val} value={val}>{val}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-xs text-muted-foreground">{t.profileForm.unitsPerDay}</Label>
                            <Input type="number" value={form.longInsulinUnits || ''} onChange={e => update('longInsulinUnits', +e.target.value)} className="h-10 rounded-lg" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <Label>{t.profileForm.otherMeds}</Label>
                  <Textarea value={form.otherMedications} onChange={e => update('otherMedications', e.target.value)} className="rounded-xl" rows={3} />
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="flex flex-col gap-5 mt-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t.profileForm.pageContext}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>{t.profileForm.hba1c}</Label>
                    <Input type="number" step="0.1" value={form.hba1c || ''} onChange={e => update('hba1c', +e.target.value)} placeholder="7.0" className="h-12 rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label>{t.profileForm.lastGlucose}</Label>
                    <Input type="number" value={form.lastGlucose || ''} onChange={e => update('lastGlucose', +e.target.value)} placeholder="120" className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <Label>{t.profileForm.targetGlucose}</Label>
                  <Input type="number" value={form.targetGlucose || ''} onChange={e => update('targetGlucose', +e.target.value)} className="h-12 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <Label>{t.profileForm.sensitivity}</Label>
                  <Input type="number" value={form.sensitivityFactor || ''} onChange={e => update('sensitivityFactor', +e.target.value)} placeholder="50" className="h-12 rounded-xl" />
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <Label>{t.profileForm.activityLevel}</Label>
                  <Select value={form.activityLevel} onValueChange={v => update('activityLevel', v)}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">{t.profileForm.sedentary}</SelectItem>
                      <SelectItem value="moderate">{t.profileForm.moderate}</SelectItem>
                      <SelectItem value="intense">{t.profileForm.intense}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <Label>{t.settings.language}</Label>
                  <Select value={form.language} onValueChange={v => update('language', v)}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4 mt-8 pt-4 border-t border-border/50">
          {page > 1 && (
            <Button variant="outline" size="lg" onClick={goPrev} className="flex-1 rounded-2xl h-14 font-semibold text-muted-foreground border-border bg-card">
              <BackIcon size={18} className={isRTL ? "ml-2" : "mr-2"} /> {t.profileForm.previous}
            </Button>
          )}
          {page < 3 ? (
            <Button size="lg" onClick={goNext} className="flex-[2] rounded-2xl h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {t.profileForm.next} <NextIcon size={18} className={isRTL ? "mr-2" : "ml-2"} />
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} disabled={isSaving} className="flex-[2] rounded-2xl h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
              ) : (
                <><Check size={18} className={isRTL ? "ml-2" : "mr-2"} /> {t.profileForm.finish}</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
