import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageCircle } from 'react-icons/fi';
import api from '../../api/client';
import EchoSentimentBadge from './EchoSentimentBadge';

const EchoRepliesModal = ({ isOpen, onClose, echo }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !echo) return;
    loadReplies();
  }, [isOpen, echo]);

  const loadReplies = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/echo/${echo._id}/replies`);
      setReplies(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-ticos-dark-card rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-ticos-dark-border">
              <h3 className="font-bold">Replies</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-gray-50 dark:border-ticos-dark-border bg-gray-50/50 dark:bg-ticos-dark-hover/50">
              <EchoSentimentBadge
                sentiment={echo.sentiment}
                emoji={echo.emoji}
                label={echo.label}
                sameSentimentCount={echo.sameSentimentCount}
              />
              <p className="text-sm mt-2 text-ticos-primary dark:text-ticos-dark-primary">{echo.text}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-ticos-accent border-t-transparent rounded-full animate-spin" />
                </div>
              ) : replies.length === 0 ? (
                <div className="text-center py-8 text-ticos-secondary dark:text-ticos-dark-secondary text-sm">
                  No replies yet
                </div>
              ) : (
                replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-50 dark:bg-ticos-dark-hover rounded-xl p-3">
                    <EchoSentimentBadge
                      sentiment={reply.sentiment}
                      emoji={reply.emoji}
                      label={reply.label}
                      sameSentimentCount={0}
                    />
                    <p className="text-sm mt-1.5 text-ticos-primary dark:text-ticos-dark-primary">{reply.text}</p>
                    <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary mt-1">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EchoRepliesModal;
