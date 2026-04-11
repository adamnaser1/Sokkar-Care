import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const formVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
};

const ProfileForm = ({ onComplete }: { onComplete: () => void }) => {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState(1);
  const setProfile = useAppStore(s => s.setProfile);
  const setOnboardingComplete = useAppStore(s => s.setOnboardingComplete);

  const [form, setForm] = useState<Partial<UserProfile>>({
    firstName: '', lastName: '', dateOfBirth: '', weight: 0, height: 0, sex: '',
    diabetesType: '', diagnosisDate: '',
    usesRapidInsulin: false, rapidInsulinType: '', rapidInsulinUnits: 0,
    usesLongInsulin: false, longInsulinType: '', longInsulinUnits: 0,
    otherMedications: '', hba1c: 0, lastGlucose: 0, targetGlucose: 120,
    sensitivityFactor: 50, activityLevel: 'moderate', dietType: ['standard'], language: 'fr',
  });

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const bmi = calculateBMI(form.weight || 0, form.height || 0);

  const goNext = () => { setDirection(1); setPage(p => Math.min(p + 1, 3)); };
  const goPrev = () => { setDirection(-1); setPage(p => Math.max(p - 1, 1)); };

  const handleSubmit = () => {
    setProfile(form as UserProfile);
    setOnboardingComplete(true);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-background overflow-hidden">
      <div className="max-w-lg w-full mx-auto flex flex-col gap-6">
        <SokkarLogo size={32} />

        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="h-1.5 w-full rounded-full"
                animate={{ backgroundColor: i <= page ? 'hsl(var(--secondary))' : 'hsl(var(--muted))' }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-xs text-muted-foreground">Page {i}/3</span>
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
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-primary">Identité & Anthropométrie</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Prénom *</Label>
                    <Input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Votre prénom" />
                  </div>
                  <div>
                    <Label>Nom *</Label>
                    <Input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Votre nom" />
                  </div>
                </div>
                <div>
                  <Label>Date de naissance *</Label>
                  <Input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Poids (kg) *</Label>
                    <Input type="number" value={form.weight || ''} onChange={e => update('weight', +e.target.value)} placeholder="70" />
                  </div>
                  <div>
                    <Label>Taille (cm) *</Label>
                    <Input type="number" value={form.height || ''} onChange={e => update('height', +e.target.value)} placeholder="170" />
                  </div>
                </div>
                <motion.div
                  className="p-3 rounded-lg bg-muted"
                  animate={{ scale: bmi ? [1, 1.03, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm text-muted-foreground">IMC calculé : </span>
                  <span className="font-bold text-foreground">{bmi || '—'}</span>
                </motion.div>
                <div>
                  <Label>Sexe *</Label>
                  <Select value={form.sex} onValueChange={v => update('sex', v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {page === 2 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-primary">Diabète & Médicaments</h2>
                <div>
                  <Label>Type de diabète *</Label>
                  <Select value={form.diabetesType} onValueChange={v => update('diabetesType', v)}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                      <SelectItem value="gestational">Gestationnel</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date de diagnostic</Label>
                  <Input type="date" value={form.diagnosisDate} onChange={e => update('diagnosisDate', e.target.value)} />
                </div>

                <div className="p-4 rounded-xl bg-card card-shadow flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Insuline rapide ?</Label>
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
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Type</Label>
                            <Select value={form.rapidInsulinType} onValueChange={v => update('rapidInsulinType', v)}>
                              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                              <SelectContent>
                                {['Humalog', 'NovoLog', 'Apidra', 'Fiasp'].map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Unités/jour</Label>
                            <Input type="number" value={form.rapidInsulinUnits || ''} onChange={e => update('rapidInsulinUnits', +e.target.value)} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-4 rounded-xl bg-card card-shadow flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Insuline lente ?</Label>
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
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Type</Label>
                            <Select value={form.longInsulinType} onValueChange={v => update('longInsulinType', v)}>
                              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                              <SelectContent>
                                {['Lantus', 'Tresiba', 'Levemir', 'Toujeo'].map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Unités/jour</Label>
                            <Input type="number" value={form.longInsulinUnits || ''} onChange={e => update('longInsulinUnits', +e.target.value)} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <Label>Autres médicaments (optionnel)</Label>
                  <Textarea value={form.otherMedications} onChange={e => update('otherMedications', e.target.value)} placeholder="Metformine, etc." />
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-primary">Contexte & Préférences</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>HbA1c (%) (optionnel)</Label>
                    <Input type="number" step="0.1" value={form.hba1c || ''} onChange={e => update('hba1c', +e.target.value)} placeholder="7.0" />
                  </div>
                  <div>
                    <Label>Dernière glycémie</Label>
                    <Input type="number" value={form.lastGlucose || ''} onChange={e => update('lastGlucose', +e.target.value)} placeholder="120" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Glycémie cible (mg/dL)</Label>
                    <Input type="number" value={form.targetGlucose || ''} onChange={e => update('targetGlucose', +e.target.value)} />
                  </div>
                  <div>
                    <Label>Facteur de sensibilité</Label>
                    <Input type="number" value={form.sensitivityFactor || ''} onChange={e => update('sensitivityFactor', +e.target.value)} placeholder="50" />
                  </div>
                </div>
                <div>
                  <Label>Niveau d'activité physique</Label>
                  <Select value={form.activityLevel} onValueChange={v => update('activityLevel', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sédentaire</SelectItem>
                      <SelectItem value="moderate">Modéré (3-4x/sem)</SelectItem>
                      <SelectItem value="intense">Intense (5-7x/sem)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Langue</Label>
                  <Select value={form.language} onValueChange={v => update('language', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

        <div className="flex gap-3 mt-2">
          {page > 1 && (
            <Button variant="outline" onClick={goPrev} className="flex-1">
              <ArrowLeft size={16} className="mr-1" /> Précédent
            </Button>
          )}
          {page < 3 ? (
            <Button onClick={goNext} className="flex-1">
              Suivant <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="flex-1">
              <Check size={16} className="mr-1" /> Terminer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
