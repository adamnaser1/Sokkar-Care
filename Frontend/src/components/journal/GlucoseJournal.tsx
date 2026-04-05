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
import { Pencil, Trash2, Filter, ArrowLeft, Activity, Pill } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  onBack?: () => void;
  onNavigate: (view: string) => void;
}

const GlucoseJournal = ({ onBack, onNavigate }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
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

  const profile = useAppStore(s => s.profile);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <motion.button whileTap={{ scale: 0.9 }} onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted text-primary">
                <ArrowLeft size={22} />
              </motion.button>
            )}
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-2xl font-bold text-primary ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {t.journal.title}
            </motion.h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center overflow-hidden bg-muted"
          >
            {profile?.avatarData ? (
              <img src={profile.avatarData} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Activity className="text-primary" size={20} />
            )}
          </motion.button>
        </div>

        {/* Stats */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-2 mb-4"
          >
            {[
              { label: t.journal.stats.average, value: `${avg}` },
              { label: t.journal.stats.min, value: `${min}` },
              { label: t.journal.stats.max, value: `${max}` },
              { label: t.journal.stats.measurements, value: `${filtered.length}` },
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
        <div className={`flex gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger className="flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
              <Filter size={14} className={isRTL ? 'ml-1' : 'mr-1'} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
              <SelectItem value="all">{t.journal.filters.allContexts}</SelectItem>
              <SelectItem value={t.measurement.contexts.beforeMeal}>{t.measurement.contexts.beforeMeal}</SelectItem>
              <SelectItem value={t.measurement.contexts.afterMeal}>{t.measurement.contexts.afterMeal}</SelectItem>
              <SelectItem value={t.measurement.contexts.physicalActivity}>{t.measurement.contexts.physicalActivity}</SelectItem>
              <SelectItem value={t.measurement.contexts.beforeBed}>{t.measurement.contexts.beforeBed}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-32" dir={isRTL ? 'rtl' : 'ltr'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
              <SelectItem value="7">{t.journal.filters.days7}</SelectItem>
              <SelectItem value="30">{t.journal.filters.days30}</SelectItem>
              <SelectItem value="90">{t.journal.filters.days90}</SelectItem>
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
              {t.journal.noMeasurementsPeriod}
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
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <div>
                        <p className="text-xs text-muted-foreground">{timeStr} · {formatRelativeTime(m.measuredAt, language)}</p>
                        <div className={`flex items-baseline gap-2 mt-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
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
                    {m.notes && <p className={`text-xs text-muted-foreground mt-2 italic ${isRTL ? 'text-right' : 'text-left'}`}>📝 {m.notes}</p>}
                    {m.medicationDoses && m.medicationDoses.length > 0 && (
                      <div className={`mt-3 flex flex-wrap gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        {m.medicationDoses.map((d, i) => (
                          <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${d.skipped ? 'bg-destructive/10 text-destructive' : 'bg-blue-500/10 text-blue-600'}`}>
                            <Pill size={12} />
                            <span>{d.name}: {d.skipped ? (isRTL ? 'تجاهل' : 'Sauté') : `${d.dose}`}</span>
                            {d.notes && <span className="opacity-70 ml-1 italic">"{d.notes}"</span>}
                          </span>
                        ))}
                      </div>
                    )}
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
            <DialogTitle className={`text-primary ${isRTL ? 'text-right' : 'text-left'}`}>{t.journal.editMeasurement}</DialogTitle>
          </DialogHeader>
          <div className={`flex flex-col gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div>
              <Label>{t.journal.valueLabel}</Label>
              <Input type="number" value={editValue} onChange={e => setEditValue(e.target.value)} />
            </div>
            <div>
              <Label>{t.journal.contextLabel}</Label>
              <Select value={editContext} onValueChange={setEditContext}>
                <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'}><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                  <SelectItem value={t.measurement.contexts.beforeMeal}>{t.measurement.contexts.beforeMeal}</SelectItem>
                  <SelectItem value={t.measurement.contexts.afterMeal}>{t.measurement.contexts.afterMeal}</SelectItem>
                  <SelectItem value={t.measurement.contexts.physicalActivity}>{t.measurement.contexts.physicalActivity}</SelectItem>
                  <SelectItem value={t.measurement.contexts.beforeBed}>{t.measurement.contexts.beforeBed}</SelectItem>
                  <SelectItem value={t.measurement.contexts.other}>{t.measurement.contexts.other}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.journal.notesLabel}</Label>
              <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} />
            </div>
            <Button onClick={saveEdit}>{t.journal.save}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlucoseJournal;
