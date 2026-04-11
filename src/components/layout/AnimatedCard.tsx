import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const AnimatedCard = ({ children, className = '', delay = 0, onClick }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay, ease: [0.25, 0.1, 0.25, 1] }}
    whileTap={onClick ? { scale: 0.97 } : undefined}
    onClick={onClick}
    className={className}
  >
    {children}
  </motion.div>
);

export default AnimatedCard;
