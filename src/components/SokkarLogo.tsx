import { Heart } from 'lucide-react';

const SokkarLogo = ({ size = 32 }: { size?: number }) => (
  <div className="flex items-center gap-2">
    <div 
      className="rounded-lg bg-primary flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Heart className="text-primary-foreground" size={size * 0.55} fill="currentColor" />
    </div>
    <span className="font-bold text-primary" style={{ fontSize: size * 0.6 }}>
      Sokkar <span className="text-secondary">Care</span>
    </span>
  </div>
);

export default SokkarLogo;
