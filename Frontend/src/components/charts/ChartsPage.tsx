import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart, Area
} from 'recharts';
import { useLanguage } from '@/hooks/useLanguage';

type Period = 'today' | 'week' | 'month';

const ChartsPage = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const measurements = useAppStore(s => s.measurements);
  const [period, setPeriod] = useState<Period>('week');

  const now = new Date();
  const cutoffMs = period === 'today' ? 86400000 : period === 'week' ? 7 * 86400000 : 30 * 86400000;
  const cutoff = new Date(now.getTime() - cutoffMs);
  const filtered = measurements.filter(m => new Date(m.measuredAt) >= cutoff);

  const chartData = (() => {
    if (period === 'today') {
      return filtered.map(m => ({
        time: new Date(m.measuredAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        value: m.value,
      })).reverse();
    }
    const days = period === 'week' ? 7 : 30;
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayMeasures = filtered.filter(m => new Date(m.measuredAt).toDateString() === d.toDateString());
      const avg = dayMeasures.length ? Math.round(dayMeasures.reduce((s, m) => s + m.value, 0) / dayMeasures.length) : null;
      const label = period === 'week'
        ? ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][d.getDay()]
        : `${d.getDate()}/${d.getMonth() + 1}`;
      result.push({ time: label, value: avg });
    }
    return result;
  })();

  const avg = filtered.length ? Math.round(filtered.reduce((s, m) => s + m.value, 0) / filtered.length) : null;
  const min = filtered.length ? Math.min(...filtered.map(m => m.value)) : null;
  const max = filtered.length ? Math.max(...filtered.map(m => m.value)) : null;
  const normalCount = filtered.filter(m => getGlucoseStatus(m.value, language).color === 'normal').length;
  const normalPct = filtered.length ? Math.round((normalCount / filtered.length) * 100) : 0;

  const trend = (() => {
    if (filtered.length < 3) return { label: '—', icon: '→' };
    const recent = filtered.slice(0, Math.ceil(filtered.length / 2));
    const older = filtered.slice(Math.ceil(filtered.length / 2));
    const recentAvg = recent.reduce((s, m) => s + m.value, 0) / recent.length;
    const olderAvg = older.reduce((s, m) => s + m.value, 0) / older.length;
    const diff = recentAvg - olderAvg;
    if (diff > 5) return { label: t.charts.rising, icon: '↗' };
    if (diff < -5) return { label: t.charts.falling, icon: '↘' };
    return { label: t.charts.stable, icon: '→' };
  })();

  const periodLabels: Record<Period, string> = {
    today: t.charts.today,
    week: t.charts.week,
    month: t.charts.month,
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-2xl font-bold text-foreground mb-5 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          {t.charts.title}
        </motion.h1>

        {/* Period Selector */}
        <div className={`flex gap-1 mb-5 p-1 bg-muted rounded-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
          {(['today', 'week', 'month'] as Period[]).map(p => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={`relative flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                period === p ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {period === p && (
                <motion.div
                  layoutId="period-indicator"
                  className="absolute inset-0 bg-primary rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{periodLabels[p]}</span>
            </motion.button>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-card card-shadow mb-5"
        >
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-sm font-semibold text-foreground">{t.charts.glucose}</h3>
            <div className={`flex items-center gap-3 text-[10px] ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`flex items-center gap-1 text-success ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-2 h-2 rounded-full bg-success/30" /> {t.charts.target}
              </span>
              <span className={`flex items-center gap-1 text-primary ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="w-2 h-2 rounded-full bg-primary" /> {t.charts.glucose}
              </span>
            </div>
          </div>
          <div className="h-56">
            {filtered.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-base font-medium">{t.charts.noData}</p>
                  <p className="text-xs mt-1">{t.charts.startMeasuring}</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <defs>
                    <linearGradient id="targetZone" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[40, 280]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(v: any) => v ? [`${v} mg/dL`, t.charts.glucose] : ['—', '']}
                  />
                  {/* Target zone shading */}
                  <ReferenceLine y={180} stroke="hsl(var(--success))" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <ReferenceLine y={70} stroke="hsl(var(--success))" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <Area type="monotone" dataKey="value" fill="url(#lineGradient)" stroke="none" connectNulls />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        {filtered.length > 0 && (
          <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            {[
              { label: t.charts.average, value: `${avg}`, unit: 'mg/dL', accent: 'text-foreground' },
              { label: t.charts.trend, value: `${trend.icon} ${trend.label}`, unit: '', accent: 'text-foreground' },
              { label: t.charts.minMax, value: `${min} / ${max}`, unit: '', accent: 'text-foreground' },
              { label: t.charts.targetZone, value: `${normalPct}%`, unit: t.charts.inTarget, accent: 'text-success' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                className="p-4 rounded-2xl bg-card card-shadow"
              >
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.accent}`}>{stat.value}</p>
                {stat.unit && <p className="text-[10px] text-muted-foreground">{stat.unit}</p>}
              </motion.div>
            ))}
            {avg && avg > 180 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="col-span-2 p-4 rounded-2xl bg-warning/10 border border-warning/20"
              >
                <p className="text-sm text-warning font-semibold">
                  ⚠ {t.charts.highAvgWarning} — {t.charts.estimatedHba1c} : ~{(avg / 28.7 + 46.7 / 28.7).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.charts.consultDoctor}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsPage;
