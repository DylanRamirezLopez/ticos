import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiEye } from 'react-icons/fi';
import api from '../../api/client';
import EchoSentimentBadge from './EchoSentimentBadge';
import EchoRepliesModal from './EchoRepliesModal';

const reactions = ['❤️', '🫂', '💪', '😢', '😂', '🔥', '🕊️', '💡'];

const EchoCard = ({ echo, onReply, index = 0 }) => {
  const [reactionCounts, setReactionCounts] = useState(echo.reactionCounts || {});
  const [showReactions, setShowReactions] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReact = async (reaction) => {
    try {
      const res = await api.post(`/echo/${echo._id}/react`, { reaction });
      setReactionCounts(res.data.reactionCounts);
    } catch {}
  };

  const timeLeft = () => {
    const diff = new Date(echo.expiresAt).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m`;
    return '< 1m';
  };

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos dark:shadow-none p-5 border border-gray-100 dark:border-ticos-dark-border"
    >
      <div className="flex items-start justify-between mb-3">
        <EchoSentimentBadge
          sentiment={echo.sentiment}
          emoji={echo.emoji}
          label={echo.label}
          sameSentimentCount={echo.sameSentimentCount}
        />
        <span className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary flex-shrink-0 ml-2">
          {timeLeft()} left
        </span>
      </div>

      <p className="text-sm leading-relaxed text-ticos-primary dark:text-ticos-dark-primary whitespace-pre-wrap mb-4">
        {echo.text}
      </p>

      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="flex items-center gap-1">
            {reactions.slice(0, 4).map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className="text-sm hover:scale-110 transition-transform px-1 py-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5"
              >
                {emoji}
              </button>
            ))}
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-primary dark:hover:text-ticos-dark-primary px-1.5 py-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              +{Math.max(0, reactions.length - 4)}
            </button>
          </div>

          {showReactions && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 mb-2 flex gap-1 p-2 bg-white dark:bg-ticos-dark-card rounded-xl shadow-ticos dark:shadow-none border border-gray-100 dark:border-ticos-dark-border"
            >
              {reactions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => { handleReact(emoji); setShowReactions(false); }}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}

          {totalReactions > 0 && (
            <span className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary ml-2">
              {totalReactions}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReplies(true)}
            className="flex items-center gap-1 text-xs text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-accent transition-colors"
          >
            <FiEye size={13} />
            {echo.replyCount || 0}
          </button>
          <button
            onClick={() => onReply?.(echo)}
            className="flex items-center gap-1.5 text-xs text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-accent transition-colors"
          >
            <FiMessageCircle size={13} />
            Reply
          </button>
        </div>
      </div>

      <EchoRepliesModal
        isOpen={showReplies}
        onClose={() => setShowReplies(false)}
        echo={echo}
      />
    </motion.div>
  );
};

export default React.memo(EchoCard);
