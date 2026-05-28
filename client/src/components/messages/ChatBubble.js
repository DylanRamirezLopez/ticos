import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';

const SharedPostPreview = ({ post, isOwn }) => {
  const navigate = useNavigate();
  if (!post) return null;

  return (
    <div
      className={`mt-2 rounded-xl overflow-hidden cursor-pointer border ${
        isOwn ? 'border-blue-400/30' : 'border-gray-200 dark:border-ticos-dark-border'
      }`}
      onClick={() => navigate(`/profile/${post.user?.username}`)}
    >
      {post.type === 'image' ? (
        <div className="relative">
          <img
            src={post.image}
            alt=""
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <p className="absolute bottom-2 left-2 text-xs text-white font-semibold truncate max-w-[90%]">
            {post.caption || 'Shared post'}
          </p>
        </div>
      ) : (
        <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center gap-2 mb-1">
            <FiImage size={14} className="text-purple-400" />
            <span className="text-2xs text-purple-500 font-medium">Shared Text</span>
          </div>
          <p className="text-xs line-clamp-2 text-ticos-primary dark:text-ticos-dark-primary">
            {post.text}
          </p>
        </div>
      )}
    </div>
  );
};

const ChatBubble = ({ message, isOwn }) => {
  const timeStr = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1.5`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 ${
          isOwn
            ? 'bg-ticos-accent text-white rounded-2xl rounded-br-sm'
            : 'bg-white border border-gray-200 text-ticos-primary rounded-2xl rounded-bl-sm dark:bg-ticos-dark-card dark:border-ticos-dark-border dark:text-ticos-dark-primary'
        }`}
      >
        {message.text && <p className="text-sm leading-snug">{message.text}</p>}
        {message.sharedPost && <SharedPostPreview post={message.sharedPost} isOwn={isOwn} />}
        <p className={`text-2xs mt-1 ${isOwn ? 'text-white/60' : 'text-ticos-secondary dark:text-ticos-dark-secondary'}`}>
          {timeStr}
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(ChatBubble);
