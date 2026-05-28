import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark } from 'react-icons/fi';

const PostActions = ({ post, onLike, onComment, simplified }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((c) => c + 1);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 600);
    } else {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
    onLike?.(post._id);
  };

  return (
    <div className={simplified ? 'px-4 py-2' : 'px-4 py-2'}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.8 }}
            className="focus:outline-none"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {liked ? (
                <FiHeart size={22} className="text-ticos-like-red fill-current" />
              ) : (
                <FiHeart size={22} className="text-ticos-primary dark:text-ticos-dark-primary" />
              )}
            </motion.div>
          </motion.button>
          <button onClick={onComment} className="focus:outline-none">
            <FiMessageCircle size={22} className="text-ticos-primary dark:text-ticos-dark-primary hover:text-gray-600 dark:hover:text-gray-400 transition-colors" />
          </button>
          <FiSend size={22} className="text-ticos-primary dark:text-ticos-dark-primary" />
        </div>
        <FiBookmark size={22} className="text-ticos-primary dark:text-ticos-dark-primary cursor-pointer hover:text-gray-600 dark:hover:text-gray-400 transition-colors" />
      </div>

      <p className="text-sm font-semibold">{likeCount.toLocaleString()} likes</p>
    </div>
  );
};

export default React.memo(PostActions);
