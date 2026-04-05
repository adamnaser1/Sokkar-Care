import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore, GlucoseMeasurement, DoseRecord } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import { Check, X, Pill } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MeasurementDialog = ({ open, onOpenChange }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const addMeasurement = useAppStore(s => s.addMeasurement);
  const profile = useAppStore(s => s.profile);
  
  const [value, setValue] = useState('');
  const [context, setContext] = useState('');
  const [notes, setNotes] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [saved, setSaved] = useState<GlucoseMeasurement | null>(null);

  const [trackDose, setTrackDose] = useState(false);
  const [doses, setDoses] = useState<Record<string, DoseRecord>>({});

  useEffect(() => {
    if (open) {
      if (profile?.medications && profile.medications.length > 0) {
        // Initialize doses state
        const initialDoses: Record<string, DoseRecord> = {};
        profile.medications.forEach(m => {
          // pre-fill the dose value implicitly based on the prescription dosage string
          let defaultNumericDose = '';
          const match = m.dosage.match(/[\d.]+/);
          if (match) defaultNumericDose = match[0];
          
          initialDoses[m.id] = {
            medId: m.id,
            name: m.name,
            dose: defaultNumericDose,
            skipped: false,
            notes: ''
          };
        });
        setDoses(initialDoses);
      } else {
        setTrackDose(false);
      }
    }
  }, [open, profile]);

  const handleDoseChange = (id: string, field: keyof DoseRecord, val: any) => {
    setDoses(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: val
      }
    }));
  };

  const handleSave = () => {
    const num = parseFloat(value);
    if (!num || num < 20 || num > 600) return;
    
    // Filter to only include doses that were actually marked as taken (has dose > 0) or skipped
    const recordedDoses = trackDose 
      ? Object.values(doses).filter(d => (d.dose && parseFloat(d.dose) > 0) || d.skipped)
      : [];

    const m: GlucoseMeasurement = {
      id: crypto.randomUUID(),
      value: num,
      unit: 'mg/dL',
      context,
      notes,
      measuredAt: (customDate && customTime) ? new Date(`${customDate}T${customTime}`).toISOString() : new Date().toISOString(),
      medicationDoses: recordedDoses.length > 0 ? recordedDoses : undefined
    };

    addMeasurement(m);
    setSaved(m);
  };

  const handleClose = () => {
    setValue(''); setContext(''); setNotes(''); setCustomDate(''); setCustomTime(''); setSaved(null); setTrackDose(false);
    onOpenChange(false);
  };

  const handleAnother = () => {
    setValue(''); setContext(''); setNotes(''); setCustomDate(''); setCustomTime(''); setSaved(null); setTrackDose(false);
  };

  if (saved) {
    const status = getGlucoseStatus(saved.value, language);
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.measurement.recorded}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              status.color === 'normal' ? 'bg-success/20' : status.color === 'hypo' ? 'bg-destructive/20' : 'bg-warning/20'
            }`}>
              <Check className={status.color === 'normal' ? 'text-success' : status.color === 'hypo' ? 'text-destructive' : 'text-warning'} size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t.measurement.recorded}</h3>
            <div className={`text-4xl font-bold ${
              status.color === 'normal' ? 'text-success' : status.color === 'hypo' ? 'text-destructive' : 'text-warning'
            }`}>
              {saved.value} mg/dL
            </div>
            <p className="text-muted-foreground">{status.icon} {status.label}</p>
            {saved.medicationDoses && saved.medicationDoses.length > 0 && (
              <div className="text-sm font-medium text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">
                💉 {saved.medicationDoses.length} {isRTL ? 'جرعات مسجلة' : 'dose(s) enregistrée(s)'}
              </div>
            )}
            <div className={`flex gap-3 w-full mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button variant="outline" onClick={handleAnother} className="flex-1">{t.measurement.another}</Button>
              <Button onClick={handleClose} className="flex-1">{t.measurement.back}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const hasMedications = profile?.medications && profile.medications.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto px-5 py-6 hide-scrollbar rounded-3xl">
        <DialogHeader>
          <DialogTitle className={`text-primary ${isRTL ? 'text-right' : 'text-left'}`}>{t.measurement.saveNew}</DialogTitle>
          <DialogDescription className="sr-only">Details</DialogDescription>
        </DialogHeader>

        <div className={`flex flex-col gap-5 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Main Glucose Input */}
          <div>
            <Label className="mb-2 block">{t.measurement.glucoseLabel}</Label>
            <Input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Ex: 110"
              className="text-2xl font-bold h-14 text-center rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-2 block">{t.measurement.dateLabel}</Label>
              <Input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div>
              <Label className="mb-2 block">{t.measurement.timeLabel}</Label>
              <Input type="time" value={customTime} onChange={e => setCustomTime(e.target.value)} className="h-11 rounded-xl" />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">{t.measurement.contextLabel}</Label>
            <Select value={context} onValueChange={setContext}>
              <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'} className="h-11 rounded-xl"><SelectValue placeholder={t.measurement.contextSelect} /></SelectTrigger>
              <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                <SelectItem value={t.measurement.contexts.beforeMeal}>{t.measurement.contexts.beforeMeal}</SelectItem>
                <SelectItem value={t.measurement.contexts.afterMeal}>{t.measurement.contexts.afterMeal}</SelectItem>
                <SelectItem value={t.measurement.contexts.physicalActivity}>{t.measurement.contexts.physicalActivity}</SelectItem>
                <SelectItem value={t.measurement.contexts.beforeBed}>{t.measurement.contexts.beforeBed}</SelectItem>
                <SelectItem value={t.measurement.contexts.other}>{t.measurement.contexts.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Doses section */}
          {hasMedications && (
            <div className="bg-muted/40 rounded-2xl p-4 border border-border/50">
              <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 text-primary p-1.5 rounded-lg"><Pill size={16}/></div>
                  <Label className="font-semibold">{isRTL ? 'تسجيل جرعة الدواء' : 'Enregistrer ma dose'}</Label>
                </div>
                <Switch checked={trackDose} onCheckedChange={setTrackDose} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
              
              {trackDose && (
                <div className="mt-4 flex flex-col gap-4">
                  {profile.medications!.map(med => {
                    const doseState = doses[med.id];
                    if (!doseState) return null;
                    return (
                      <div key={med.id} className="bg-card p-3 rounded-xl border border-border/50 relative overflow-hidden">
                        <p className={`font-semibold text-sm mb-2 ${isRTL ? 'text-right' : ''}`}>{med.name}</p>
                        
                        <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1 relative">
                            <Input 
                              type="number" 
                              value={doseState.dose} 
                              onChange={e => handleDoseChange(med.id, 'dose', e.target.value)} 
                              placeholder="0" 
                              disabled={doseState.skipped}
                              className={`h-9 pl-3 pr-8 ${isRTL ? 'text-right pr-3 pl-8' : ''}`} 
                            />
                            <span className={`absolute top-2.5 text-xs text-muted-foreground ${isRTL ? 'left-3' : 'right-3'}`}>
                              {med.type.toLowerCase().includes('insuline') ? 'U' : 'mg'}
                            </span>
                          </div>
                          
                          <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <Checkbox 
                              id={`skip-${med.id}`} 
                              checked={doseState.skipped} 
                              onCheckedChange={(c) => handleDoseChange(med.id, 'skipped', !!c)} 
                            />
                            <label htmlFor={`skip-${med.id}`} className="text-xs font-medium leading-none cursor-pointer text-muted-foreground whitespace-nowrap">
                              {isRTL ? 'تجاهل الجرعة' : 'Dose sautée'}
                            </label>
                          </div>
                        </div>
                        
                        <Input 
                          placeholder={isRTL ? 'ملاحظة (اختياري)' : 'Note (optionnel)'} 
                          value={doseState.notes || ''}
                          onChange={e => handleDoseChange(med.id, 'notes', e.target.value)}
                          className={`h-8 text-xs bg-transparent border-t-0 border-x-0 border-b-border rounded-none px-0 shadow-none focus-visible:ring-0 ${isRTL ? 'text-right' : ''}`}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div>
            <Label className="mb-2 block">{t.measurement.notesLabel}</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.measurement.notesPlaceholder} rows={2} className="rounded-xl" />
          </div>

          <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outline" onClick={handleClose} className="flex-1 h-12 rounded-xl border-border">
               {t.measurement.cancel}
            </Button>
            <Button onClick={handleSave} className="flex-[2] h-12 rounded-xl text-primary-foreground font-semibold" disabled={!value || parseFloat(value) < 20}>
              <Check size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> {t.measurement.validate}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementDialog;
