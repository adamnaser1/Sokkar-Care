import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getGlucoseStatus, formatRelativeTime } from '@/lib/glucose';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Filter } from 'lucide-react';

const GlucoseJournal = () => {
  const measurements = useAppStore(s => s.measurements);
  const updateMeasurement = useAppStore(s => s.updateMeasurement);
  const deleteMeasurement = useAppStore(s => s.deleteMeasurement);
  const [contextFilter, setContextFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('7');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editContext, setEditContext] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const now = new Date();
  const daysBack = parseInt(periodFilter);
  const cutoff = new Date(now.getTime() - daysBack * 86400000);

  const filtered = measurements.filter(m => {
    const d = new Date(m.measuredAt);
    if (d < cutoff) return false;
    if (contextFilter !== 'all' && m.context !== contextFilter) return false;
    return true;
  });

  const avg = filtered.length ? Math.round(filtered.reduce((s, m) => s + m.value, 0) / filtered.length) : 0;
  const min = filtered.length ? Math.min(...filtered.map(m => m.value)) : 0;
  const max = filtered.length ? Math.max(...filtered.map(m => m.value)) : 0;

  const startEdit = (m: typeof measurements[0]) => {
    setEditingId(m.id);
    setEditValue(String(m.value));
    setEditContext(m.context);
    setEditNotes(m.notes);
  };

  const saveEdit = () => {
    if (editingId) {
      updateMeasurement(editingId, { value: parseFloat(editValue), context: editContext, notes: editNotes });
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-primary mb-4"
        >
          Journal de Glycémie
        </motion.h1>

        {/* Stats */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-2 mb-4"
          >
            {[
              { label: 'Moyenne', value: `${avg}` },
              { label: 'Min', value: `${min}` },
              { label: 'Max', value: `${max}` },
              { label: 'Mesures', value: `${filtered.length}` },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-2 rounded-xl bg-card card-shadow text-center"
              >
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger className="flex-1">
              <Filter size={14} className="mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les contextes</SelectItem>
              <SelectItem value="Avant repas">Avant repas</SelectItem>
              <SelectItem value="Après repas">Après repas</SelectItem>
              <SelectItem value="Activité physique">Activité physique</SelectItem>
              <SelectItem value="Avant dodo">Avant dodo</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 jours</SelectItem>
              <SelectItem value="30">30 jours</SelectItem>
              <SelectItem value="90">90 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Measurement List */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground"
            >
              Aucune mesure pour cette période
            </motion.div>
          ) : (
            <AnimatePresence>
              {filtered.map((m, idx) => {
                const status = getGlucoseStatus(m.value);
                const date = new Date(m.measuredAt);
                const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    layout
                    className={`p-4 rounded-2xl border card-shadow ${
                      status.color === 'normal' ? 'bg-success/5 border-success/20' :
                      status.color === 'hypo' ? 'bg-destructive/5 border-destructive/20' :
                      'bg-warning/5 border-warning/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{timeStr} · {formatRelativeTime(m.measuredAt)}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className={`text-2xl font-bold ${
                            status.color === 'normal' ? 'text-success' :
                            status.color === 'hypo' ? 'text-destructive' : 'text-warning'
                          }`}>
                            {m.value}
                          </span>
                          <span className="text-sm text-muted-foreground">mg/dL</span>
                          {m.context && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{m.context}</span>
                          )}
                        </div>
                        <p className={`text-sm mt-0.5 ${
                          status.color === 'normal' ? 'text-success' :
                          status.color === 'hypo' ? 'text-destructive' : 'text-warning'
                        }`}>
                          {status.icon} {status.label}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => startEdit(m)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                          <Pencil size={16} />
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => deleteMeasurement(m.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                    {m.notes && <p className="text-xs text-muted-foreground mt-2 italic">📝 {m.notes}</p>}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-primary">Modifier la mesure</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <Label>Valeur (mg/dL)</Label>
              <Input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} />
            </div>
            <div>
              <Label>Contexte</Label>
              <Select value={editContext} onValueChange={setEditContext}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
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
              <Label>Notes</Label>
              <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} />
            </div>
            <Button onClick={saveEdit}>Sauvegarder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlucoseJournal;
