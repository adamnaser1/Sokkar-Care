import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore, Medication, HbA1cRecord } from '@/store/useAppStore';
import { useLanguage } from '@/hooks/useLanguage';
import { Camera, Check, X, Plus, Trash2, User, Heart, Pill, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ReferenceArea, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({ open, onOpenChange }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const profile = useAppStore(s => s.profile);
  const updateProfile = useAppStore(s => s.updateProfile);

  // Section 1: Personal
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || '');
  const [sex, setSex] = useState(profile?.sex || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [avatarData, setAvatarData] = useState(profile?.avatarData || '');

  // Section 2: Medical
  const [diabetesType, setDiabetesType] = useState(profile?.diabetesType || '');
  const [diagnosisDate, setDiagnosisDate] = useState(profile?.diagnosisDate || '');
  const [referringDoctor, setReferringDoctor] = useState(profile?.referringDoctor || '');

  // Section 3: Medications
  const [medications, setMedications] = useState<Medication[]>(profile?.medications || []);
  const [newMedName, setNewMedName] = useState('');
  const [newMedType, setNewMedType] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  // Section 4: HbA1c
  const [hba1cHistory, setHba1cHistory] = useState<HbA1cRecord[]>(profile?.hba1cHistory || []);
  const [newHba1cValue, setNewHba1cValue] = useState('');
  const [newHba1cDate, setNewHba1cDate] = useState('');
  const [newHba1cComment, setNewHba1cComment] = useState('');

  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedication = () => {
    if (!newMedName || !newMedDosage || !newMedFreq) {
      toast.error(isRTL ? 'الرجاء ملء جميع الحقول المطلوبة' : 'Veuillez remplir les champs obligatoires');
      return;
    }
    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedName,
      type: newMedType || 'Autre',
      dosage: newMedDosage,
      frequency: newMedFreq
    };
    setMedications([...medications, newMed]);
    setNewMedName('');
    setNewMedType('');
    setNewMedDosage('');
    setNewMedFreq('');
  };

  const handleDeleteMed = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleAddHba1c = () => {
    const val = parseFloat(newHba1cValue);
    if (isNaN(val) || !newHba1cDate) {
      toast.error(isRTL ? 'الرجاء إدخال قيمة وتاريخ' : 'Veuillez entrer une valeur et une date');
      return;
    }
    const record: HbA1cRecord = {
      id: Date.now().toString(),
      value: val,
      date: newHba1cDate,
      comment: newHba1cComment
    };
    // Sort array by date after insertion
    const updated = [...hba1cHistory, record].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setHba1cHistory(updated);
    setNewHba1cValue('');
    setNewHba1cDate('');
    setNewHba1cComment('');
  };

  const handleDeleteHba1c = (id: string) => {
    setHba1cHistory(hba1cHistory.filter(h => h.id !== id));
  };

  const handleSave = () => {
    updateProfile({
      firstName,
      lastName,
      dateOfBirth,
      sex,
      weight: parseFloat(weight) || undefined,
      avatarData,
      diabetesType,
      diagnosisDate,
      referringDoctor,
      medications,
      hba1cHistory
    });
    toast.success(isRTL ? 'تم تحديث الملف بنجاح' : 'Profil mis à jour avec succès');
    onOpenChange(false);
  };

  const getHbA1cZoneColor = (val: number) => {
    if (val < 7) return 'text-green-500';
    if (val <= 8) return 'text-orange-500';
    return 'text-red-500';
  };

  const chartData = hba1cHistory.map(h => ({
    date: new Date(h.date).toLocaleDateString(isRTL ? 'ar-TN' : 'fr-FR', { month: 'short', year: '2-digit' }),
    value: h.value
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-background rounded-3xl hide-scrollbar">
        <DialogHeader className="px-6 py-4 border-b border-border/50 sticky top-0 bg-background z-10 flex-shrink-0">
          <DialogTitle className={`text-xl font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.gamification.editProfileTitle}
          </DialogTitle>
          <DialogDescription className={`sr-only ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.gamification.editProfileDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir={isRTL ? 'rtl' : 'ltr'} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 rounded-xl h-auto p-1 bg-muted/60">
              <TabsTrigger value="personal" className="flex flex-col items-center gap-1.5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs transition-all">
                <User size={16} /> <span className="hidden sm:inline">{isRTL ? 'شخصي' : 'Personnel'}</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex flex-col items-center gap-1.5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs transition-all">
                <Heart size={16} /> <span className="hidden sm:inline">{isRTL ? 'طبي' : 'Médical'}</span>
              </TabsTrigger>
              <TabsTrigger value="medications" className="flex flex-col items-center gap-1.5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs transition-all">
                <Pill size={16} /> <span className="hidden sm:inline">{isRTL ? 'أدوية' : 'Traitements'}</span>
              </TabsTrigger>
              <TabsTrigger value="hba1c" className="flex flex-col items-center gap-1.5 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg text-xs transition-all">
                <Activity size={16} /> <span className="hidden sm:inline">HbA1c</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 focus-visible:outline-none">
              <div className="flex flex-col items-center gap-3 mb-6">
                <div 
                  className="relative w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer overflow-hidden border-[3px] border-primary/20 hover:border-primary transition-colors shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarData ? (
                    <img src={avatarData} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={36} className="text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{t.gamification.changePhoto}</span>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <Label>{t.auth.firstName}</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} className={`h-11 rounded-xl ${isRTL ? 'text-right' : ''}`} />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <Label>{t.auth.lastName}</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} className={`h-11 rounded-xl ${isRTL ? 'text-right' : ''}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <Label>{t.profileForm.dob || (isRTL ? 'تاريخ الميلاد' : 'Date de naissance')}</Label>
                  <Input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className={`h-11 rounded-xl ${isRTL ? 'text-right' : ''}`} />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <Label>{t.profileForm.sex || (isRTL ? 'الجنس' : 'Sexe')}</Label>
                  <Select value={sex} onValueChange={setSex}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t.profileForm.male || 'Homme'}</SelectItem>
                      <SelectItem value="female">{t.profileForm.female || 'Femme'}</SelectItem>
                      <SelectItem value="other">{t.profileForm.other || 'Autre'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className={isRTL ? 'text-right' : 'text-left'}>
                <Label>{t.settings.weightUnit} ({t.common.kg || 'kg'})</Label>
                <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} className={`h-11 rounded-xl w-1/2 ${isRTL ? 'text-right' : ''}`} />
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-5 focus-visible:outline-none">
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <Label className="mb-2 block">{t.profileForm.diabetesType || (isRTL ? 'نوع السكري' : 'Type de diabète')}</Label>
                <Select value={diabetesType} onValueChange={setDiabetesType}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type1">{t.profileForm.type1 || 'Type 1'}</SelectItem>
                    <SelectItem value="type2">{t.profileForm.type2 || 'Type 2'}</SelectItem>
                    <SelectItem value="gestational">{t.profileForm.gestational || 'Gestationnel'}</SelectItem>
                    <SelectItem value="other">{t.profileForm.other || 'Autre'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className={isRTL ? 'text-right' : 'text-left'}>
                <Label className="mb-2 block">{t.profileForm.diagnosisDate || (isRTL ? 'تاريخ التشخيص' : 'Date de diagnostic')}</Label>
                <Input type="date" value={diagnosisDate} onChange={e => setDiagnosisDate(e.target.value)} className={`h-11 rounded-xl ${isRTL ? 'text-right' : ''}`} />
              </div>

              <div className={isRTL ? 'text-right' : 'text-left'}>
                <Label className="mb-2 block">{isRTL ? 'الطبيب المتابع (اختياري)' : 'Médecin référent (optionnel)'}</Label>
                <Input value={referringDoctor} onChange={e => setReferringDoctor(e.target.value)} placeholder={isRTL ? 'اسم الطبيب' : 'Dr. Martin'} className={`h-11 rounded-xl ${isRTL ? 'text-right' : ''}`} />
              </div>
            </TabsContent>

            <TabsContent value="medications" className="space-y-5 focus-visible:outline-none">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                <h4 className={`text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'إضافة دواء جديد' : 'Ajouter un traitement'}</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className={isRTL ? 'text-right' : ''}>
                    <Select value={newMedType} onValueChange={setNewMedType}>
                      <SelectTrigger className="h-10 rounded-lg text-xs"><SelectValue placeholder={isRTL ? 'النوع' : 'Type'} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Insuline rapide">{isRTL ? 'أنسولين سريع' : 'Insuline rapide'}</SelectItem>
                        <SelectItem value="Insuline lente">{isRTL ? 'أنسولين بطيء' : 'Insuline lente'}</SelectItem>
                        <SelectItem value="Antidiabétique oral">{isRTL ? 'أقراص/حبوب' : 'Antidiabétique oral'}</SelectItem>
                        <SelectItem value="Autre">{isRTL ? 'أخرى' : 'Autre'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input value={newMedName} onChange={e => setNewMedName(e.target.value)} placeholder={isRTL ? 'الاسم (مثل Metformine)' : 'Nom (ex: NovoRapid)'} className={`h-10 rounded-lg text-xs ${isRTL ? 'text-right' : ''}`} />
                  </div>
                  <div>
                    <Input value={newMedDosage} onChange={e => setNewMedDosage(e.target.value)} placeholder={isRTL ? 'الجرعة (مثل 10U)' : 'Dosage (ex: 10U, 500mg)'} className={`h-10 rounded-lg text-xs ${isRTL ? 'text-right' : ''}`} />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <Select value={newMedFreq} onValueChange={setNewMedFreq}>
                      <SelectTrigger className="h-10 rounded-lg text-xs"><SelectValue placeholder={isRTL ? 'وقت الأخذ' : 'Fréquence'} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Matin">{isRTL ? 'الصباح' : 'Matin'}</SelectItem>
                        <SelectItem value="Midi">{isRTL ? 'الظهر' : 'Midi'}</SelectItem>
                        <SelectItem value="Soir">{isRTL ? 'المساء' : 'Soir'}</SelectItem>
                        <SelectItem value="Au coucher">{isRTL ? 'قبل النوم' : 'Au coucher'}</SelectItem>
                        <SelectItem value="Selon glycémie">{isRTL ? 'حسب السكر' : 'Selon glycémie'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddMedication} variant="secondary" className="w-full h-10 rounded-lg text-xs font-semibold gap-2">
                  <Plus size={14} /> {isRTL ? 'أضف الدواء' : 'Ajouter'}
                </Button>
              </div>

              {medications.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className={`text-sm font-semibold mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'الأدوية الحالية' : 'Traitements actuels'}</h4>
                  {medications.map(med => (
                    <div key={med.id} className={`flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card shadow-sm ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-sm">{med.name}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium tracking-wide">
                            {med.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {med.dosage} · {med.frequency}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMed(med.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive w-8 h-8 rounded-lg flex-shrink-0">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hba1c" className="space-y-5 focus-visible:outline-none">
              {/* Formulaire ajout */}
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                <h4 className={`text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'إضافة نتيجة HbA1c' : 'Ajouter un résultat HbA1c'}</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Input type="number" step="0.1" value={newHba1cValue} onChange={e => setNewHba1cValue(e.target.value)} placeholder="0.0 %" className={`h-10 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} />
                  </div>
                  <div>
                    <Input type="date" value={newHba1cDate} onChange={e => setNewHba1cDate(e.target.value)} className={`h-10 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} />
                  </div>
                  <div className="col-span-2">
                    <Input value={newHba1cComment} onChange={e => setNewHba1cComment(e.target.value)} placeholder={isRTL ? 'ملاحظة (اختياري)' : 'Commentaire (optionnel)'} className={`h-10 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} />
                  </div>
                </div>
                <Button onClick={handleAddHba1c} className="w-full h-10 rounded-lg text-sm font-semibold gap-2">
                  <Plus size={16} /> {isRTL ? 'تأكيد' : 'Confirmer'}
                </Button>
              </div>

              {/* Chart */}
              {hba1cHistory.length > 0 && (
                <div className="h-[220px] w-full mt-6 bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                      <YAxis domain={[3, 14]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                        formatter={(val: number) => [`${val}%`, 'HbA1c']}
                      />
                      <ReferenceArea y1={0} y2={7} fill="rgba(34, 197, 94, 0.08)" />
                      <ReferenceArea y1={7} y2={8} fill="rgba(249, 115, 22, 0.08)" />
                      <ReferenceArea y1={8} y2={14} fill="rgba(239, 68, 68, 0.08)" />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ stroke: 'hsl(var(--background))', strokeWidth: 2, r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* List */}
              {hba1cHistory.length > 0 && (
                <div className="flex flex-col gap-2 mt-4">
                  {hba1cHistory.slice().reverse().map(h => (
                    <div key={h.id} className={`flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card shadow-sm ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <div>
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className={`font-bold text-lg ${getHbA1cZoneColor(h.value)}`}>{h.value}%</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{new Date(h.date).toLocaleDateString(isRTL ? 'ar-TN' : 'fr-FR')}</span>
                        </div>
                        {h.comment && <p className="text-xs text-muted-foreground mt-1">{h.comment}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteHba1c(h.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive w-8 h-8 rounded-lg flex-shrink-0">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className={`p-4 border-t border-border/50 bg-card flex-shrink-0 flex sm:justify-between items-center ${isRTL ? 'flex-row-reverse sm:flex-row-reverse' : 'flex-row sm:flex-row'} gap-3`}>
          <Button variant="outline" onClick={() => onOpenChange(false)} className={`flex-1 sm:flex-none h-12 rounded-xl text-sm font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
             {t.common.cancel || (isRTL ? 'إلغاء' : 'Annuler')}
          </Button>
          <Button onClick={handleSave} className={`flex-[2] sm:flex-none h-12 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
             <Check size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.common.save || (isRTL ? 'حفظ التغييرات' : 'Enregistrer')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
