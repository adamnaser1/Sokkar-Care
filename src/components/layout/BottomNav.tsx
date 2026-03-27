import { Droplets, BookOpen, BarChart3, UtensilsCrossed, User } from 'lucide-react';
import { motion } from 'framer-motion';

export type PageId = 'dashboard' | 'journal' | 'charts' | 'food' | 'profile';

const navItems: { id: PageId; icon: typeof Droplets; label: string }[] = [
  { id: 'dashboard', icon: Droplets, label: 'Accueil' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'charts', icon: BarChart3, label: 'Graphiques' },
  { id: 'food', icon: UtensilsCrossed, label: 'Aliments' },
  { id: 'profile', icon: User, label: 'Profil' },
];

interface Props {
  current: PageId;
  onChange: (id: PageId) => void;
}

const BottomNav = ({ current, onChange }: Props) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border z-50">
    <div className="flex justify-around items-center h-16 max-w-lg mx-auto safe-area-bottom">
      {navItems.map(item => {
        const isActive = current === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => onChange(item.id)}
            whileTap={{ scale: 0.85 }}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
              isActive ? 'text-secondary' : 'text-muted-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full bg-secondary"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <motion.div
              animate={isActive ? { y: -2 } : { y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            </motion.div>
            <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
