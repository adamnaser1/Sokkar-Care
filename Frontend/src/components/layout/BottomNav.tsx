import { Home, UtensilsCrossed, Lightbulb, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export type PageId = 'dashboard' | 'recipes' | 'tips' | 'charts' | 'settings' | 'journal' | 'calculator' | 'profile' | 'faq' | 'support' | 'privacy';

interface Props {
  current: PageId;
  onChange: (id: PageId) => void;
}

const BottomNav = ({ current, onChange }: Props) => {
  const { t } = useLanguage();
  
  const navItems: { id: PageId; icon: typeof Home; label: string }[] = [
    { id: 'dashboard', icon: Home, label: t.nav.dashboard },
    { id: 'recipes', icon: UtensilsCrossed, label: t.nav.recipes },
    { id: 'tips', icon: Lightbulb, label: t.nav.tips },
    { id: 'charts', icon: BarChart3, label: t.nav.charts },
    { id: 'settings', icon: Settings, label: t.nav.settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto safe-area-bottom">
        {navItems.map(item => {
          const isActive = current === item.id;
          return (
          <motion.button
            key={item.id}
            onClick={() => onChange(item.id)}
            whileTap={{ scale: 0.85 }}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <motion.div
              animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </motion.div>
            <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100 font-semibold' : 'opacity-60'}`}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
      </div>
    </nav>
  );
};

export default BottomNav;
