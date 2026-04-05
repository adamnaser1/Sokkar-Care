import { Droplets } from 'lucide-react';

const SokkarLogo = ({ size = 32 }: { size?: number }) => (
  <div className="flex items-center gap-2">
    <div 
      className="rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Droplets className="text-white" size={size * 0.55} />
    </div>
    <span className="font-bold text-foreground" style={{ fontSize: size * 0.55 }}>
      Sokkar<span className="text-primary ml-0.5">Care</span>
    </span>
  </div>
);

export default SokkarLogo;
