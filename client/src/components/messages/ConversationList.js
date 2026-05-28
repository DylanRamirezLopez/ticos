import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ConversationList = ({ conversations, activeChat, onSelectChat, loading }) => {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-ticos-dark-hover" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24 dark:bg-ticos-dark-hover" />
              <div className="h-2.5 bg-gray-100 rounded w-40 dark:bg-ticos-dark-card" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-ticos-secondary text-sm dark:text-ticos-dark-secondary">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv, idx) => {
        const isActive = activeChat?._id === conv.user._id;
        const lastMsg = conv.lastMessage;
        const isOwn = lastMsg?.sender?._id === user?._id;

        return (
          <motion.button
            key={conv.user._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.03 }}
            onClick={() => onSelectChat(conv.user)}
            className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
              isActive ? 'bg-gray-100 dark:bg-ticos-dark-hover' : 'hover:bg-gray-50 dark:hover:bg-ticos-dark-hover'
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-ticos-dark-hover">
              {conv.user.avatar ? (
                <img src={conv.user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-avatar flex items-center justify-center text-white font-bold">
                  {conv.user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-sm">{conv.user.username}</p>
              {lastMsg && (
                <p className="text-sm text-ticos-secondary truncate dark:text-ticos-dark-secondary">
                  {isOwn && <span className="text-gray-400 dark:text-ticos-dark-secondary">You: </span>}
                  {lastMsg.text}
                </p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default React.memo(ConversationList);
