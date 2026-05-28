import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiSend } from 'react-icons/fi';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import LikeAnimation from './LikeAnimation';
import SharePostModal from '../messages/SharePostModal';

const PostCard = ({ post, index = 0, onLike, onOpenDetail }) => {
  const [showHeart, setShowHeart] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);

  const handleDoubleClick = () => {
    const isLiked = post.likes?.includes?.(post.user?._id);
    if (!isLiked) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 600);
      onLike?.(post._id);
    }
  };

  const isAnonymous = post.isAnonymous;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white border border-gray-200 dark:bg-ticos-dark-card dark:border-ticos-dark-border rounded-lg mb-4 overflow-hidden"
    >
      <PostHeader post={post} />

      {post.type === 'text' ? (
        <div className="relative group">
          <div
            className="px-4 py-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-ticos-dark-hover transition-colors"
            onClick={() => onOpenDetail?.(post._id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <FiMessageCircle size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary mb-1">
                  {isAnonymous ? (
                    <span className="text-purple-500 dark:text-purple-400 font-semibold">Anonymous</span>
                  ) : (
                    <span className="font-semibold">{post.user?.username}</span>
                  )}
                  {' '}&middot;{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
                  {post.text}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
            className="absolute top-3 right-3 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiSend size={12} className="text-white" />
          </button>
        </div>
      ) : (
        <div className="relative bg-black/5 dark:bg-white/5 group" onDoubleClick={handleDoubleClick}>
          <img
            src={post.image}
            alt={post.caption || 'Post image'}
            className="w-full max-h-[600px] object-contain cursor-pointer select-none"
            draggable={false}
            onClick={() => onOpenDetail?.(post._id)}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FiSend size={14} className="text-white" />
          </button>
          <LikeAnimation isVisible={showHeart} />
        </div>
      )}

      <PostActions post={post} onLike={onLike} onComment={() => onOpenDetail?.(post._id)} />

      <div className="px-4 pb-3">
        {post.caption && (
          <p className="text-sm">
            {isAnonymous ? (
              <span className="font-semibold text-purple-500 dark:text-purple-400 mr-1.5">Anonymous</span>
            ) : (
              <Link to={`/profile/${post.user?.username}`} className="font-semibold hover:underline mr-1.5">
                {post.user?.username}
              </Link>
            )}
            {post.caption}
          </p>
        )}
      </div>

      <SharePostModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        postId={post._id}
      />
    </motion.div>
  );
};

export default React.memo(PostCard);
