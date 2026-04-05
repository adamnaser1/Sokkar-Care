import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getGlucoseStatus, formatRelativeTime } from '@/lib/glucose';
import SokkarLogo from '@/components/SokkarLogo';
import MeasurementDialog from '@/components/dashboard/MeasurementDialog';
import { Button } from '@/components/ui/button';
import {
  Activity, BookOpen, Calculator, Plus, User,
  Droplets, UtensilsCrossed, Lightbulb
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line, ComposedChart
} from 'recharts';

interface Props {
  onNavigate: (view: string) => void;
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const Dashboard = ({ onNavigate }: Props) => {
  const profile = useAppStore(s => s.profile);
  const measurements = useAppStore(s => s.measurements);
  const points = useAppStore(s => s.points);
  const [measureOpen, setMeasureOpen] = useState(false);

  const lastMeasure = measurements[0];
  const lastStatus = lastMeasure ? getGlucoseStatus(lastMeasure.value) : null;

  const chartData = (() => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayMeasures = measurements.filter(m => new Date(m.measuredAt).toDateString() === d.toDateString());
      const avg = dayMeasures.length ? Math.round(dayMeasures.reduce((s, m) => s + m.value, 0) / dayMeasures.length) : null;
      result.push({ day: days[d.getDay()], value: avg });
    }
    return result;
  })();

  const todayMeasures = measurements.filter(m => new Date(m.measuredAt).toDateString() === new Date().toDateString());
  const todayProgress = Math.min(100, (todayMeasures.length / 4) * 100);

  const avg = measurements.length
    ? Math.round(measurements.slice(0, 30).reduce((s, m) => s + m.value, 0) / Math.min(measurements.length, 30))
    : null;

  const quickLinks = [
    { icon: Droplets, label: 'Mesurer', color: 'text-secondary', action: () => setMeasureOpen(true) },
    { icon: BookOpen, label: 'Journal', color: 'text-primary', action: () => onNavigate('journal') },
    { icon: UtensilsCrossed, label: 'Aliments', color: 'text-success', action: () => onNavigate('food') },
    { icon: Lightbulb, label: 'Conseils', color: 'text-warning', action: () => onNavigate('tips') },
    { icon: Calculator, label: 'Calculateur', color: 'text-destructive', action: () => onNavigate('calculator') },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5 pt-6 pb-4 flex items-center justify-between"
      >
        <div>
          <SokkarLogo size={28} />
          <p className="text-muted-foreground text-sm mt-1">
            Bonjour, <span className="font-semibold text-foreground">{profile?.firstName || 'Utilisateur'}</span>
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('profile')}
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <User className="text-primary" size={20} />
        </motion.button>
      </motion.div>

      <div className="px-5 flex flex-col gap-4">
        {/* Last Measurement Card */}
        <motion.div
          custom={0}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className={`p-5 rounded-2xl card-shadow-elevated border ${
            !lastMeasure ? 'bg-card border-border' :
            lastStatus?.color === 'normal' ? 'bg-success/5 border-success/20' :
            lastStatus?.color === 'hypo' ? 'bg-destructive/5 border-destructive/20' :
            'bg-warning/5 border-warning/20'
          }`}
        >
          {lastMeasure ? (
            <>
              <p className="text-sm text-muted-foreground mb-1">Dernière Mesure</p>
              <div className="flex items-end justify-between">
                <div>
                  <motion.span
                    key={lastMeasure.value}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-5xl font-bold inline-block ${
                      lastStatus?.color === 'normal' ? 'text-success' :
                      lastStatus?.color === 'hypo' ? 'text-destructive' : 'text-warning'
                    }`}
                  >
                    {lastMeasure.value}
                  </motion.span>
                  <span className="text-lg text-muted-foreground ml-1">mg/dL</span>
                </div>
                <div className="text-right text-sm">
                  <p className={`font-medium ${
                    lastStatus?.color === 'normal' ? 'text-success' :
                    lastStatus?.color === 'hypo' ? 'text-destructive' : 'text-warning'
                  }`}>{lastStatus?.icon} {lastStatus?.label}</p>
                  {lastMeasure.context && <p className="text-muted-foreground">{lastMeasure.context}</p>}
                  <p className="text-muted-foreground">{formatRelativeTime(lastMeasure.measuredAt)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <Activity className="text-muted-foreground mx-auto mb-2" size={32} />
              <p className="text-muted-foreground">Aucune mesure enregistrée</p>
            </div>
          )}
          <Button className="w-full mt-4" size="lg" onClick={() => setMeasureOpen(true)}>
            <Plus size={18} className="mr-2" /> Mesurer Maintenant
          </Button>
        </motion.div>

        {/* 7-day Chart */}
        <motion.div
          custom={1}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-2xl bg-card card-shadow cursor-pointer"
          onClick={() => onNavigate('charts')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">7 Derniers Jours</h3>
            {avg && <span className="text-sm text-muted-foreground">Moy: {avg} mg/dL</span>}
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[40, 250]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: any) => v ? [`${v} mg/dL`, 'Glycémie'] : ['—', 'Glycémie']}
                />
                <ReferenceLine y={180} stroke="hsl(var(--warning))" strokeDasharray="4 4" label={{ value: '180', fontSize: 10, fill: 'hsl(var(--warning))' }} />
                <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: '70', fontSize: 10, fill: 'hsl(var(--destructive))' }} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--secondary))' }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Daily Progress */}
        <motion.div
          custom={2}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-2xl bg-card card-shadow"
        >
          <h3 className="font-semibold text-foreground mb-2">Progression du Jour</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${todayProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
            <span className="text-sm font-medium text-secondary">{Math.round(todayProgress)}%</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{todayMeasures.length} mesure{todayMeasures.length > 1 ? 's' : ''} aujourd'hui</span>
            <span>+{points} points ⭐</span>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          custom={3}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-5 gap-2"
        >
          {quickLinks.map((link, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={link.action}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card card-shadow hover:bg-muted transition-colors"
            >
              <link.icon className={link.color} size={22} />
              <span className="text-xs text-foreground font-medium">{link.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <MeasurementDialog open={measureOpen} onOpenChange={setMeasureOpen} />
    </div>
  );
};

export default Dashboard;
