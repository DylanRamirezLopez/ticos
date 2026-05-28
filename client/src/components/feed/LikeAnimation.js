import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LikeAnimation = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.3, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LikeAnimation;
