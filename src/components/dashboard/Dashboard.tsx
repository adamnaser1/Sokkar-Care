import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getGlucoseStatus, formatRelativeTime } from '@/lib/glucose';
import SokkarLogo from '@/components/SokkarLogo';
import MeasurementDialog from '@/components/dashboard/MeasurementDialog';
import { Button } from '@/components/ui/button';
import {
  Activity, BookOpen, Calculator, Heart, Plus, User,
  TrendingUp, TrendingDown, Minus, Droplets, UtensilsCrossed, Lightbulb
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart
} from 'recharts';

const Dashboard = () => {
  const profile = useAppStore(s => s.profile);
  const measurements = useAppStore(s => s.measurements);
  const points = useAppStore(s => s.points);
  const [measureOpen, setMeasureOpen] = useState(false);

  const lastMeasure = measurements[0];
  const lastStatus = lastMeasure ? getGlucoseStatus(lastMeasure.value) : null;

  // Chart data - last 7 days
  const chartData = (() => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayMeasures = measurements.filter(m => {
        const md = new Date(m.measuredAt);
        return md.toDateString() === d.toDateString();
      });
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
    { icon: BookOpen, label: 'Journal', color: 'text-primary', action: () => {} },
    { icon: UtensilsCrossed, label: 'Aliments', color: 'text-success', action: () => {} },
    { icon: Lightbulb, label: 'Conseils', color: 'text-warning', action: () => {} },
    { icon: Calculator, label: 'Calculateur', color: 'text-destructive', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <SokkarLogo size={28} />
          <p className="text-muted-foreground text-sm mt-1">
            Bonjour, <span className="font-semibold text-foreground">{profile?.firstName || 'Utilisateur'}</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="text-primary" size={20} />
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Last Measurement Card */}
        <div className={`p-5 rounded-xl card-shadow-elevated border ${
          !lastMeasure ? 'bg-card border-border' :
          lastStatus?.color === 'normal' ? 'bg-success/5 border-success/20' :
          lastStatus?.color === 'hypo' ? 'bg-destructive/5 border-destructive/20' :
          'bg-warning/5 border-warning/20'
        }`}>
          {lastMeasure ? (
            <>
              <p className="text-sm text-muted-foreground mb-1">Dernière Mesure</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className={`text-5xl font-bold ${
                    lastStatus?.color === 'normal' ? 'text-success' :
                    lastStatus?.color === 'hypo' ? 'text-destructive' : 'text-warning'
                  }`}>
                    {lastMeasure.value}
                  </span>
                  <span className="text-lg text-muted-foreground ml-1">mg/dL</span>
                </div>
                <div className="text-right text-sm">
                  <p className={`font-medium ${
                    lastStatus?.color === 'normal' ? 'text-success' :
                    lastStatus?.color === 'hypo' ? 'text-destructive' : 'text-warning'
                  }`}>
                    {lastStatus?.icon} {lastStatus?.label}
                  </p>
                  <p className="text-muted-foreground">{lastMeasure.context || ''}</p>
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
        </div>

        {/* 7-day Chart */}
        <div className="p-4 rounded-xl bg-card card-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">7 Derniers Jours</h3>
            {avg && (
              <span className="text-sm text-muted-foreground">Moy: {avg} mg/dL</span>
            )}
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[40, 250]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(v: any) => v ? [`${v} mg/dL`, 'Glycémie'] : ['—', 'Glycémie']}
                />
                <ReferenceLine y={180} stroke="hsl(var(--warning))" strokeDasharray="4 4" label={{ value: '180', fontSize: 10, fill: 'hsl(var(--warning))' }} />
                <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="4 4" label={{ value: '70', fontSize: 10, fill: 'hsl(var(--destructive))' }} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--secondary))' }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="p-4 rounded-xl bg-card card-shadow">
          <h3 className="font-semibold text-foreground mb-2">Progression du Jour</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${todayProgress}%` }} />
            </div>
            <span className="text-sm font-medium text-secondary">{Math.round(todayProgress)}%</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{todayMeasures.length} mesure{todayMeasures.length > 1 ? 's' : ''} aujourd'hui</span>
            <span>+{points} points ⭐</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-5 gap-2">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              onClick={link.action}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card card-shadow hover:bg-muted transition-colors"
            >
              <link.icon className={link.color} size={22} />
              <span className="text-xs text-foreground font-medium">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      <MeasurementDialog open={measureOpen} onOpenChange={setMeasureOpen} />
    </div>
  );
};

export default Dashboard;
