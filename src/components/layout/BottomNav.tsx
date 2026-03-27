import { Droplets, BookOpen, BarChart3, UtensilsCrossed, User } from 'lucide-react';

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
  <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
    <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
            current === item.id
              ? 'text-secondary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <item.icon size={20} strokeWidth={current === item.id ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default BottomNav;
