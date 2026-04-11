import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  pageKey: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
};

const PageTransition = ({ children, pageKey }: Props) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={pageKey}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default PageTransition;
