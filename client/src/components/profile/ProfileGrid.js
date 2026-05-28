import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle } from 'react-icons/fi';

const ProfileGrid = ({ posts, onPostClick }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 text-ticos-secondary dark:text-ticos-dark-secondary">
        <p className="text-lg">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post, idx) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: idx * 0.03 }}
           className="aspect-square overflow-hidden bg-gray-100 dark:bg-ticos-dark-hover relative group cursor-pointer"
          onClick={() => onPostClick?.(post._id)}
        >
          {post.type === 'text' ? (
            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
              <p className="text-xs text-center text-gray-600 dark:text-ticos-dark-secondary line-clamp-5">
                {post.text}
              </p>
            </div>
          ) : (
            <img
              src={post.image}
              alt={post.caption || ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-1.5 text-white">
              <FiHeart size={18} fill="white" />
              <span className="text-sm font-semibold">{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <FiMessageCircle size={18} fill="white" />
              <span className="text-sm font-semibold">{post.commentCount || 0}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(ProfileGrid);
