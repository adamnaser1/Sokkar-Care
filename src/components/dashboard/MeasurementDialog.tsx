import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore, GlucoseMeasurement } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import { Check, X } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MeasurementDialog = ({ open, onOpenChange }: Props) => {
  const addMeasurement = useAppStore(s => s.addMeasurement);
  const [value, setValue] = useState('');
  const [context, setContext] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState<GlucoseMeasurement | null>(null);

  const handleSave = () => {
    const num = parseFloat(value);
    if (!num || num < 20 || num > 600) return;
    const m: GlucoseMeasurement = {
      id: crypto.randomUUID(),
      value: num,
      unit: 'mg/dL',
      context,
      notes,
      measuredAt: new Date().toISOString(),
    };
    addMeasurement(m);
    setSaved(m);
  };

  const handleClose = () => {
    setValue(''); setContext(''); setNotes(''); setSaved(null);
    onOpenChange(false);
  };

  const handleAnother = () => {
    setValue(''); setContext(''); setNotes(''); setSaved(null);
  };

  if (saved) {
    const status = getGlucoseStatus(saved.value);
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              status.color === 'normal' ? 'bg-success/20' : status.color === 'hypo' ? 'bg-destructive/20' : 'bg-warning/20'
            }`}>
              <Check className={status.color === 'normal' ? 'text-success' : status.color === 'hypo' ? 'text-destructive' : 'text-warning'} size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Mesure enregistrée !</h3>
            <div className={`text-4xl font-bold ${
              status.color === 'normal' ? 'text-success' : status.color === 'hypo' ? 'text-destructive' : 'text-warning'
            }`}>
              {saved.value} mg/dL
            </div>
            <p className="text-muted-foreground">{status.icon} {status.label}</p>
            {saved.context && <p className="text-sm text-muted-foreground">{saved.context}</p>}
            <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
              {status.color === 'normal' && "Votre glycémie est bien contrôlée. Continuez ainsi !"}
              {status.color === 'hypo' && "Attention : glycémie basse. Prenez 15g de glucides rapides."}
              {status.color === 'hyper' && "Glycémie élevée. Pensez à vérifier votre dose d'insuline."}
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={handleAnother} className="flex-1">Ajouter une autre</Button>
              <Button onClick={handleClose} className="flex-1">Retour</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-primary">Enregistrer une Mesure</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Glycémie (mg/dL) *</Label>
            <Input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Ex: 120"
              className="text-2xl font-bold h-14 text-center"
              min={20} max={600}
            />
          </div>
          <div>
            <Label>Contexte</Label>
            <Select value={context} onValueChange={setContext}>
              <SelectTrigger><SelectValue placeholder="Sélectionner (optionnel)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Avant repas">Avant repas</SelectItem>
                <SelectItem value="Après repas">Après repas</SelectItem>
                <SelectItem value="Activité physique">Activité physique</SelectItem>
                <SelectItem value="Avant dodo">Avant dodo</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes (optionnel)</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Stress, exercice, etc." rows={2} />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X size={16} className="mr-1" /> Annuler
            </Button>
            <Button onClick={handleSave} className="flex-1" disabled={!value || parseFloat(value) < 20}>
              <Check size={16} className="mr-1" /> Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementDialog;
