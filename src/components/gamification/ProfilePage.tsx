import { useAppStore, BADGES } from '@/store/useAppStore';
import { getGlucoseStatus } from '@/lib/glucose';
import { Settings, Trophy, Star, Flame } from 'lucide-react';

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

  // Calculate badge progress
  const normalStreak = (() => {
    let count = 0;
    for (const m of measurements) {
      if (getGlucoseStatus(m.value).color === 'normal') count++;
      else break;
    }
    return count;
  })();

  const badges = BADGES.map(b => {
    switch (b.type) {
      case 'beginner': return { ...b, progress: profile ? 1 : 0 };
      case 'streak7': return { ...b, progress: Math.min(streak, 7) };
      case 'reader': return { ...b, progress: Math.min(tipsRead, 10) };
      case 'stable': return { ...b, progress: Math.min(normalStreak, 4) };
      case 'foodie': return { ...b, progress: Math.min(foodsViewed, 20) };
      case 'streak30': return { ...b, progress: Math.min(streak, 30) };
      case 'master': return { ...b, progress: Math.min(points, 5000) };
      default: return b;
    }
  });

  const unlockedCount = badges.filter(b => b.progress >= b.total).length;

  // Find next badge to unlock
  const nextBadge = badges.find(b => b.progress < b.total);
  const nextProgress = nextBadge ? Math.round((nextBadge.progress / nextBadge.total) * 100) : 100;

  // Stats
  const last30 = measurements.filter(m => new Date(m.measuredAt) >= new Date(Date.now() - 30 * 86400000));
  const avg30 = last30.length ? Math.round(last30.reduce((s, m) => s + m.value, 0) / last30.length) : null;
  const bestDay = (() => {
    if (!measurements.length) return null;
    const dayMap: Record<string, { total: number; count: number; day: string }> = {};
    measurements.forEach(m => {
      const d = new Date(m.measuredAt);
      const key = d.toDateString();
      const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][d.getDay()];
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

  const level = points < 500 ? 'Débutant' : points < 1500 ? 'Régulier' : points < 3000 ? 'Expert' : 'Glucose Master';

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Mon Profil</h1>
          <button onClick={onOpenSettings} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground">
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-5 rounded-xl bg-card card-shadow-elevated mb-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {profile?.firstName} {profile?.lastName?.charAt(0)}.
          </h2>
          <p className="text-secondary font-medium">🏅 {level}</p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{points}</p>
              <p className="text-xs text-muted-foreground">Points ⭐</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Jours 🔥</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{unlockedCount}</p>
              <p className="text-xs text-muted-foreground">Badges 🏆</p>
            </div>
          </div>
        </div>

        {/* Next Badge Progress */}
        {nextBadge && (
          <div className="p-4 rounded-xl bg-card card-shadow mb-4">
            <p className="text-sm text-muted-foreground mb-1">
              Prochain badge : "<span className="font-semibold text-foreground">{nextBadge.name}</span>"
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-secondary transition-all" style={{ width: `${nextProgress}%` }} />
              </div>
              <span className="text-sm font-medium text-secondary">{nextProgress}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {nextBadge.total - nextBadge.progress} restant{nextBadge.total - nextBadge.progress > 1 ? 's' : ''} pour déverrouiller !
            </p>
          </div>
        )}

        {/* Badges Grid */}
        <h3 className="font-semibold text-foreground mb-3">Badges</h3>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {badges.map(badge => {
            const unlocked = badge.progress >= badge.total;
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl text-center card-shadow ${
                  unlocked ? 'bg-card' : 'bg-muted/50 opacity-70'
                }`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-[10px] font-semibold text-foreground leading-tight">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {unlocked ? '✓ Gagné' : `⏳ ${badge.progress}/${badge.total}`}
                </p>
              </div>
            );
          })}
        </div>

        {/* Personal Stats */}
        <h3 className="font-semibold text-foreground mb-3">📊 Vos Statistiques</h3>
        <div className="p-4 rounded-xl bg-card card-shadow flex flex-col gap-2">
          <StatRow label="Mesures saisies" value={`${measurements.length}`} sub="total" />
          <StatRow label="Jours consécutifs" value={`${streak}`} sub="" />
          <StatRow label="Aliments consultés" value={`${foodsViewed}`} sub="" />
          <StatRow label="Conseils lus" value={`${tipsRead}`} sub="" />
          <StatRow label="Calculs effectués" value={`${calculatorHistory.length}`} sub="" />
          {avg30 && (
            <StatRow label="Tendance glycémie (30j)" value={`${avg30} mg/dL`} sub="moyenne" />
          )}
          {bestDay && (
            <StatRow label="Meilleur jour" value={bestDay.day} sub={`${bestDay.count} mesures, moy ${bestDay.avg}`} />
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <button onClick={onOpenTips} className="flex-1 p-3 rounded-xl bg-card card-shadow text-center hover:bg-muted transition-colors">
            <span className="text-xl">💡</span>
            <p className="text-xs font-medium text-foreground mt-1">Conseils</p>
          </button>
          <button onClick={onOpenCalculator} className="flex-1 p-3 rounded-xl bg-card card-shadow text-center hover:bg-muted transition-colors">
            <span className="text-xl">🧮</span>
            <p className="text-xs font-medium text-foreground mt-1">Calculateur</p>
          </button>
          <button onClick={onOpenSettings} className="flex-1 p-3 rounded-xl bg-card card-shadow text-center hover:bg-muted transition-colors">
            <span className="text-xl">⚙️</span>
            <p className="text-xs font-medium text-foreground mt-1">Paramètres</p>
          </button>
        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value, sub }: { label: string; value: string; sub: string }) => (
  <div className="flex items-center justify-between py-1 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="text-right">
      <span className="text-sm font-semibold text-foreground">{value}</span>
      {sub && <span className="text-xs text-muted-foreground ml-1">({sub})</span>}
    </div>
  </div>
);

export default ProfilePage;
