import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { getGlucoseStatus, formatRelativeTime } from '@/lib/glucose';
import SokkarLogo from '@/components/SokkarLogo';
import MeasurementDialog from '@/components/dashboard/MeasurementDialog';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Bell, Plus, Coffee, Soup, UtensilsCrossed, Cookie, Activity, Calculator, History
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line, ComposedChart, Area
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

/* Circular gauge SVG */
const GlucoseCircle = ({ value, status }: { value: number; status: string }) => {
  const radius = 80;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 40), 300);
  const progress = (clampedValue - 40) / 260; // 40-300 range
  const dashOffset = circumference * (1 - progress);

  const colorMap: Record<string, string> = {
    normal: 'hsl(152, 60%, 45%)',
    hypo: 'hsl(0, 72%, 51%)',
    hyper: 'hsl(37, 92%, 55%)',
  };
  const strokeColor = colorMap[status] || 'hsl(187, 85%, 53%)';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={value}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="text-5xl font-extrabold text-foreground"
        >
          {value}
        </motion.span>
        <span className="text-sm text-muted-foreground font-medium">mg/dL</span>
      </div>
    </div>
  );
};

const Dashboard = ({ onNavigate }: Props) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const profile = useAppStore(s => s.profile);
  const measurements = useAppStore(s => s.measurements);
  const [measureOpen, setMeasureOpen] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: true, direction: isRTL ? 'rtl' : 'ltr' }, [Autoplay({ delay: 5000 })]);

  const carouselSlides = [
    { id: 1, image: '/images/ramadan_slide.png', title: t.tips.ramadan.label, desc: t.tips.ramadan.title },
    { id: 2, image: '/images/exercise_slide.png', title: t.tips.exercise.label, desc: t.tips.exercise.title }
  ];

  const lastMeasure = measurements[0];
  const lastStatus = lastMeasure ? getGlucoseStatus(lastMeasure.value, language) : null;

  const chartData = (() => {
    const days = t.dashboard.days;
    const now = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayMeasures = measurements.filter(m => new Date(m.measuredAt).toDateString() === d.toDateString());
      const avg = dayMeasures.length ? Math.round(dayMeasures.reduce((s, m) => s + m.value, 0) / dayMeasures.length) : null;
      result.push({ day: days[d.getDay()], value: avg, upper: 180, lower: 70 });
    }
    return result;
  })();

  const mealButtons = [
    { icon: Coffee, label: t.dashboard.breakfast, color: 'bg-amber-50 text-amber-600', recipeCategory: isRTL ? 'فطور' : 'Petit-déjeuner' },
    { icon: Soup, label: t.dashboard.lunch, color: 'bg-emerald-50 text-emerald-600', recipeCategory: isRTL ? 'غداء' : 'Déjeuner' },
    { icon: UtensilsCrossed, label: t.dashboard.dinner, color: 'bg-blue-50 text-blue-600', recipeCategory: isRTL ? 'عشاء' : 'Dîner' },
    { icon: Cookie, label: t.dashboard.snack, color: 'bg-purple-50 text-purple-600', recipeCategory: isRTL ? 'وجبة خفيفة' : 'Collation' },
  ];

  const todayMeasures = measurements.filter(m => new Date(m.measuredAt).toDateString() === new Date().toDateString());

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-5 pt-6 pb-4 flex items-center justify-between"
      >
        <div>
          <SokkarLogo size={28} />
          <p className="text-muted-foreground text-sm mt-1">
            {t.dashboard.greeting} <span className="font-semibold text-foreground">{profile?.firstName || ''}</span> 👋
          </p>
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
      </motion.div>

      <div className="px-5 flex flex-col gap-6">
        {/* Carousel Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl card-shadow-elevated relative group cursor-pointer" 
          ref={emblaRef}
          onClick={() => onNavigate('tips')}
        >
          <div className="flex">
            {carouselSlides.map((slide) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
                <img src={slide.image} alt={slide.title} className="w-full h-44 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">{slide.title}</span>
                  <p className="text-white font-bold text-lg leading-tight">{slide.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Subtle dots indicator can be added here if needed */}
        </motion.div>

        {/* Circular Glucose Indicator */}
        <motion.div
          custom={0}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center p-6 rounded-3xl bg-card card-shadow-elevated"
        >
          {lastMeasure ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">{t.dashboard.lastMeasurement}</p>
              <GlucoseCircle value={lastMeasure.value} status={lastStatus?.color || 'normal'} />
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  lastStatus?.color === 'normal' ? 'bg-success/10 text-success' :
                  lastStatus?.color === 'hypo' ? 'bg-destructive/10 text-destructive' :
                  'bg-warning/10 text-warning'
                }`}>
                  {lastStatus?.icon} {lastStatus?.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(lastMeasure.measuredAt, language)}
                </span>
              </div>
              {lastMeasure.context && (
                <p className="text-xs text-muted-foreground mt-1">{lastMeasure.context}</p>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <Activity className="text-muted-foreground mx-auto mb-3" size={40} />
              <p className="text-muted-foreground font-medium">{t.dashboard.noMeasurement}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.dashboard.startMeasuring}</p>
            </div>
          )}
          <Button
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-base font-semibold flex items-center justify-center gap-2"
            onClick={() => setMeasureOpen(true)}
          >
            <Plus size={18} /> {t.dashboard.newMeasurement}
          </Button>
        </motion.div>

        {/* Recommended Dose */}
        {lastMeasure && lastMeasure.value > 180 && (
          <motion.div
            custom={1}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('calculator')}
            className={`p-4 rounded-2xl bg-primary/5 border border-primary/20 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <p className="text-sm font-semibold text-foreground mb-1">{t.dashboard.recommendedDose}</p>
            <p className="text-xs text-muted-foreground">
              {t.dashboard.highGlucose}
            </p>
          </motion.div>
        )}

        {/* Meal Entry Buttons */}
        <motion.div
          custom={2}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
        >
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <p className="text-sm font-semibold text-foreground">{t.dashboard.mealsToday}</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {mealButtons.map((meal, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -3 }}
                onClick={() => {
                  useAppStore.getState().setRecipeCategoryFilter(meal.recipeCategory);
                  onNavigate('recipes');
                }}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl card-shadow bg-card hover:shadow-md transition-shadow`}
              >
                <div className={`w-11 h-11 rounded-xl ${meal.color} flex items-center justify-center`}>
                  <meal.icon size={20} />
                </div>
                <span className="text-[11px] text-foreground font-medium">{meal.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          custom={2.5}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('journal')}
            className={`p-3 rounded-2xl card-shadow bg-card flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <History size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">{t.dashboard.journal}</p>
            </div>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('calculator')}
            className={`p-3 rounded-2xl card-shadow bg-card flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Calculator size={18} />
            </div>
            <div>
              <p className="font-semibold text-sm">{t.dashboard.calculator}</p>
            </div>
          </motion.button>
        </motion.div>

        {/* 7-day Mini Chart */}
        <motion.div
          custom={3}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          whileTap={{ scale: 0.98 }}
          className="p-4 rounded-2xl bg-card card-shadow cursor-pointer"
          onClick={() => onNavigate('charts')}
        >
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h3 className="font-semibold text-foreground">{t.dashboard.trend7days}</h3>
            <span className="text-xs text-primary font-medium">{t.dashboard.seeAll}</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 250]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(v: any) => v ? [`${v} mg/dL`, t.dashboard.glucose] : ['—', t.dashboard.glucose]}
                />
                <ReferenceLine y={180} stroke="hsl(var(--warning))" strokeDasharray="4 4" strokeOpacity={0.5} />
                <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Area type="monotone" dataKey="value" fill="url(#glucoseGradient)" stroke="none" connectNulls />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          custom={4}
          variants={staggerItem}
          initial="hidden"
          animate="visible"
          className="p-4 rounded-2xl bg-card card-shadow"
        >
          <h3 className={`font-semibold text-foreground mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t.dashboard.daySummary}</h3>
          <div className={`grid grid-cols-3 gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {[
              { label: t.dashboard.measurements, value: todayMeasures.length.toString(), unit: t.dashboard.today, accent: 'text-primary' },
              { label: t.dashboard.average, value: todayMeasures.length ? Math.round(todayMeasures.reduce((s, m) => s + m.value, 0) / todayMeasures.length).toString() : '—', unit: 'mg/dL', accent: 'text-foreground' },
              { label: t.dashboard.target, value: todayMeasures.length ? Math.round((todayMeasures.filter(m => getGlucoseStatus(m.value, language).color === 'normal').length / todayMeasures.length) * 100).toString() : '—', unit: '%', accent: 'text-success' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-muted/50">
                <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.unit}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <MeasurementDialog open={measureOpen} onOpenChange={setMeasureOpen} />
    </div>
  );
};

export default Dashboard;
