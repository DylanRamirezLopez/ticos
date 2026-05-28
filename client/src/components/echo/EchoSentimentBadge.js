import React from 'react';
import { motion } from 'framer-motion';

const EchoSentimentBadge = ({ sentiment, emoji, label, sameSentimentCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-medium bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/10"
    >
      <span>{emoji}</span>
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      {sameSentimentCount > 0 && (
        <span className="text-gray-400 dark:text-gray-500">
          &middot; {sameSentimentCount.toLocaleString()} {sameSentimentCount === 1 ? 'person' : 'people'} felt this
        </span>
      )}
    </motion.div>
  );
};

export default EchoSentimentBadge;
