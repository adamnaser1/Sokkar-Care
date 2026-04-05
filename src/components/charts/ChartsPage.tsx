import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart
} from 'recharts';

type Period = '24h' | '7j' | '30j';

const ChartsPage = () => {
  const measurements = useAppStore(s => s.measurements);
  const [period, setPeriod] = useState<Period>('7j');

  const now = new Date();
  const cutoffMs = period === '24h' ? 86400000 : period === '7j' ? 7 * 86400000 : 30 * 86400000;
  const cutoff = new Date(now.getTime() - cutoffMs);
  const filtered = measurements.filter(m => new Date(m.measuredAt) >= cutoff);

  const chartData = (() => {
    if (period === '24h') {
      return filtered.map(m => ({
        time: new Date(m.measuredAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        value: m.value,
      })).reverse();
    }
    const days = period === '7j' ? 7 : 30;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayMeasures = filtered.filter(m => new Date(m.measuredAt).toDateString() === d.toDateString());
      const avg = dayMeasures.length ? Math.round(dayMeasures.reduce((s, m) => s + m.value, 0) / dayMeasures.length) : null;
      const label = period === '7j'
        ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][d.getDay()]
        : `${d.getDate()}/${d.getMonth() + 1}`;
      result.push({ time: label, value: avg });
    }
    return result;
  })();

  const avg = filtered.length ? Math.round(filtered.reduce((s, m) => s + m.value, 0) / filtered.length) : null;
  const min = filtered.length ? Math.min(...filtered.map(m => m.value)) : null;
  const max = filtered.length ? Math.max(...filtered.map(m => m.value)) : null;
  const normalCount = filtered.filter(m => getGlucoseStatus(m.value).color === 'normal').length;
  const normalPct = filtered.length ? Math.round((normalCount / filtered.length) * 100) : 0;

  const trend = (() => {
    if (filtered.length < 3) return { label: '—', icon: '→' };
    const recent = filtered.slice(0, Math.ceil(filtered.length / 2));
    const older = filtered.slice(Math.ceil(filtered.length / 2));
    const recentAvg = recent.reduce((s, m) => s + m.value, 0) / recent.length;
    const olderAvg = older.reduce((s, m) => s + m.value, 0) / older.length;
    const diff = recentAvg - olderAvg;
    if (diff > 5) return { label: 'En hausse', icon: '↗' };
    if (diff < -5) return { label: 'En baisse', icon: '↘' };
    return { label: 'Stable', icon: '→' };
  })();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-primary mb-4"
        >
          Graphiques
        </motion.h1>

        {/* Period Selector */}
        <div className="flex gap-2 mb-4">
          {(['24h', '7j', '30j'] as Period[]).map(p => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={`relative flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                period === p ? 'text-secondary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {period === p && (
                <motion.div
                  layoutId="period-indicator"
                  className="absolute inset-0 bg-secondary rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{p}</span>
            </motion.button>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-card card-shadow mb-4"
        >
          <div className="h-56">
            {filtered.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Aucune donnée pour cette période
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[40, 280]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(v: any) => v ? [`${v} mg/dL`, 'Glycémie'] : ['—', '']}
                  />
                  <ReferenceLine y={180} stroke="hsl(var(--warning))" strokeDasharray="4 4" />
                  <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(var(--secondary))' }} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Moyenne', value: `${avg} mg/dL`, color: '' },
              { label: 'Tendance', value: `${trend.icon} ${trend.label}`, color: '' },
              { label: 'Min / Max', value: `${min} / ${max}`, color: '' },
              { label: '% zone normale', value: `${normalPct}%`, color: 'text-success' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="p-3 rounded-2xl bg-card card-shadow"
              >
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</p>
              </motion.div>
            ))}
            {avg && avg > 180 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="col-span-2 p-3 rounded-2xl bg-warning/10 border border-warning/30"
              >
                <p className="text-sm text-warning font-medium">
                  ⚠ Moyenne élevée — HbA1c estimée : ~{(avg / 28.7 + 46.7 / 28.7).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Consultez votre médecin.</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsPage;
