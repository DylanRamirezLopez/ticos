import React from 'react';
import { motion } from 'framer-motion';

const dotVariants = {
  initial: { y: 0 },
  animate: (i) => ({
    y: [0, -4, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: i * 0.15,
      ease: 'easeInOut',
    },
  }),
};

const TypingIndicator = ({ username }) => {
  return (
    <div className="flex justify-start mb-1.5">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-1 dark:bg-ticos-dark-card dark:border-ticos-dark-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-ticos-dark-secondary"
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(TypingIndicator);
