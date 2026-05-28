import React from 'react';
import { motion } from 'framer-motion';

const StoryProgressBar = ({ total, current, paused }) => {
  return (
    <div className="flex gap-1 w-full px-2 pt-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-0.5 bg-white/40 rounded-full overflow-hidden">
          {i === current && (
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: paused ? '0%' : '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          )}
          {i < current && (
            <div className="h-full bg-white rounded-full w-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(StoryProgressBar);
