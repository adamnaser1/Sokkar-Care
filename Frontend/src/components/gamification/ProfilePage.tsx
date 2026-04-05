import { motion } from 'framer-motion';
import { useAppStore, BADGES } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import { Settings, Edit2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';
import EditProfileDialog from './EditProfileDialog';

interface Props {
  onOpenSettings: () => void;
  onOpenTips: () => void;
  onOpenCalculator: () => void;
}

const ProfilePage = ({ onOpenSettings, onOpenTips, onOpenCalculator }: Props) => {
  const profile = useAppStore(s => s.profile);
  const measurements = useAppStore(s => s.measurements);
  const points = useAppStore(s => s.points);
  const streak = useAppStore(s => s.streak);
  const tipsRead = useAppStore(s => s.tipsRead);
  const foodsViewed = useAppStore(s => s.foodsViewed);
  const calculatorHistory = useAppStore(s => s.calculatorHistory);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const normalStreak = (() => {
    let count = 0;
    for (const m of measurements) {
      if (getGlucoseStatus(m.value, language).color === 'normal') count++;
      else break;
    }
    return count;
  })();

  const badges = BADGES.map(b => {
    let progress = 0;
    switch (b.type) {
      case 'beginner': progress = profile ? 1 : 0; break;
      case 'streak7': progress = Math.min(streak, 7); break;
      case 'reader': progress = Math.min(tipsRead, 10); break;
      case 'stable': progress = Math.min(normalStreak, 4); break;
      case 'foodie': progress = Math.min(foodsViewed, 20); break;
      case 'streak30': progress = Math.min(streak, 30); break;
      case 'master': progress = Math.min(points, 5000); break;
    }
    
    // Retrieve translated badge info
    const translatedBadge = t.gamification.badgesList[b.type as keyof typeof t.gamification.badgesList];
    const name = translatedBadge ? translatedBadge.name : b.name;
    const description = translatedBadge ? translatedBadge.desc : b.description;

    return { ...b, progress, name, description };
  });

  const unlockedCount = badges.filter(b => b.progress >= b.total).length;
  const nextBadge = badges.find(b => b.progress < b.total);
  const nextProgress = nextBadge ? Math.round((nextBadge.progress / nextBadge.total) * 100) : 100;

  const last30 = measurements.filter(m => new Date(m.measuredAt) >= new Date(Date.now() - 30 * 86400000));
  const avg30 = last30.length ? Math.round(last30.reduce((s, m) => s + m.value, 0) / last30.length) : null;
  const bestDay = (() => {
    if (!measurements.length) return null;
    const dayMap: Record<string, { total: number; count: number; day: string }> = {};
    measurements.forEach(m => {
      const d = new Date(m.measuredAt);
      const key = d.toDateString();
      const dayName = t.dashboard.days[d.getDay()]; // Translated day
      if (!dayMap[key]) dayMap[key] = { total: 0, count: 0, day: dayName };
      dayMap[key].total += m.value;
      dayMap[key].count++;
    });
    let best: { day: string; avg: number; count: number } | null = null;
    Object.values(dayMap).forEach(v => {
      const avg = v.total / v.count;
      if (!best || (avg >= 70 && avg <= 180 && v.count > (best.count || 0))) {
        best = { day: v.day, avg: Math.round(avg), count: v.count };
      }
    });
    return best;
  })();

  const level = points < 500 ? t.gamification.levelBeginner : points < 1500 ? t.gamification.levelRegular : points < 3000 ? t.gamification.levelExpert : t.gamification.levelMaster;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <h1 className="text-2xl font-bold text-primary">{t.gamification.myProfile}</h1>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onOpenSettings} className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <Settings size={20} />
          </motion.button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-2xl bg-card card-shadow-elevated mb-4 text-center"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 overflow-visible"
          >
            {profile?.avatarData ? (
              <img src={profile.avatarData} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/80"
            >
              <Edit2 size={14} />
            </button>
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">
            {profile?.firstName} {profile?.lastName?.charAt(0)}.
          </h2>
          <p className="text-secondary font-medium">🏅 {level}</p>
          <div className={`flex justify-center gap-6 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {[
              { value: points, label: t.gamification.points },
              { value: streak, label: t.gamification.days },
              { value: unlockedCount, label: t.gamification.badges },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Next Badge Progress */}
        {nextBadge && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`p-4 rounded-2xl bg-card card-shadow mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <p className="text-sm text-muted-foreground mb-1">
              {t.gamification.nextBadge} : "<span className="font-semibold text-foreground">{nextBadge.name}</span>"
            </p>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${nextProgress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                />
              </div>
              <span className="text-sm font-medium text-secondary">{nextProgress}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {nextBadge.total - nextBadge.progress} {(nextBadge.total - nextBadge.progress > 1 && !isRTL) ? t.gamification.remainingPlural : t.gamification.remaining} {t.gamification.toUnlock}
            </p>
          </motion.div>
        )}

        {/* Badges Grid */}
        <h3 className={`font-semibold text-foreground mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t.gamification.badges.replace(' 🏆', '')}</h3>
        <div className={`grid grid-cols-4 gap-2 mb-6 ${isRTL ? 'direction-rtl' : ''}`}>
          {badges.map((badge, i) => {
            const unlocked = badge.progress >= badge.total;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-2xl text-center card-shadow ${
                  unlocked ? 'bg-card' : 'bg-muted/50 opacity-70'
                }`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-[10px] font-semibold text-foreground leading-tight">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5" dir={isRTL ? 'rtl' : 'ltr'}>
                  {unlocked ? t.gamification.won : `⏳ ${badge.progress}/${badge.total}`}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Personal Stats */}
        <h3 className={`font-semibold text-foreground mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>{t.gamification.yourStats}</h3>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-card card-shadow flex flex-col gap-2"
        >
          <StatRow label={t.gamification.measurementsTaken} value={`${measurements.length}`} sub={t.gamification.total} isRTL={isRTL} />
          <StatRow label={t.gamification.consecutiveDays} value={`${streak}`} sub="" isRTL={isRTL} />
          <StatRow label={t.gamification.foodsViewed} value={`${foodsViewed}`} sub="" isRTL={isRTL} />
          <StatRow label={t.gamification.tipsRead} value={`${tipsRead}`} sub="" isRTL={isRTL} />
          <StatRow label={t.gamification.calculationsDone} value={`${calculatorHistory.length}`} sub="" isRTL={isRTL} />
          {avg30 && <StatRow label={t.gamification.glucoseTrend30} value={`${avg30} ${t.common.mgdl}`} sub={t.dashboard.average.toLowerCase()} isRTL={isRTL} />}
          {bestDay && <StatRow label={t.gamification.bestDay} value={bestDay.day} sub={`${bestDay.count} ${t.dashboard.measurements.toLowerCase()}, ${t.dashboard.average.toLowerCase()} ${bestDay.avg}`} isRTL={isRTL} />}
        </motion.div>

        {/* Quick Actions */}
        <div className={`flex gap-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {[
            { emoji: '💡', label: t.gamification.tips, action: onOpenTips },
            { emoji: '🧮', label: t.gamification.calculator, action: onOpenCalculator },
            { emoji: '⚙️', label: t.gamification.settings, action: onOpenSettings },
          ].map((item, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={item.action}
              className="flex-1 p-3 rounded-2xl bg-card card-shadow text-center hover:bg-muted transition-colors"
            >
              <span className="text-xl">{item.emoji}</span>
              <p className="text-xs font-medium text-foreground mt-1">{item.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Edit Profile Dialog */}
      <EditProfileDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
    </div>
  );
};

const StatRow = ({ label, value, sub, isRTL }: { label: string; value: string; sub: string, isRTL: boolean }) => (
  <div className={`flex items-center justify-between py-1 border-b border-border last:border-0 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className={isRTL ? 'text-left' : 'text-right'}>
      <span className="text-sm font-semibold text-foreground">{value}</span>
      {sub && <span className={`text-xs text-muted-foreground ${isRTL ? 'mr-1' : 'ml-1'}`}>({sub})</span>}
    </div>
  </div>
);

export default ProfilePage;
