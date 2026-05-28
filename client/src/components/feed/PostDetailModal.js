import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiMessageCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import CommentSection from './CommentSection';
import CommentForm from './CommentForm';
import PostActions from './PostActions';

const PostDetailModal = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comments');
  const [commentCount, setCommentCount] = useState(0);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!postId) return;
    loadPost();
  }, [postId]);

  useEffect(() => {
    if (!socket) return;
    const handleNewComment = () => {
      setCommentCount((c) => c + 1);
    };
    socket.on('new-comment', handleNewComment);
    return () => socket.off('new-comment', handleNewComment);
  }, [socket]);

  const loadPost = async () => {
    try {
      const res = await api.get(`/posts/${postId}`);
      setPost(res.data);
      setCommentCount(res.data.commentCount || 0);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await api.put(`/posts/${postId}/like`);
    } catch {}
  };

  const handleComment = async (text) => {
    await api.post(`/comments/${postId}`, { text });
    setCommentCount((c) => c + 1);
  };

  const isAnonymous = post?.isAnonymous;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-ticos-dark-card rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition-colors md:hidden"
          >
            <FiX size={18} className="text-white" />
          </button>

          {loading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-ticos-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !post ? (
            <div className="w-full h-96 flex items-center justify-center text-ticos-secondary">
              Post not found
            </div>
          ) : (
            <>
              <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[300px] max-h-[90vh]">
                {post.type === 'text' ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <FiMessageCircle size={28} className="text-white" />
                    </div>
                    <p className="text-white text-lg leading-relaxed whitespace-pre-wrap max-w-md">
                      {post.text}
                    </p>
                  </div>
                ) : (
                  <img
                    src={post.image}
                    alt={post.caption || ''}
                    className="w-full h-full object-contain max-h-[90vh]"
                  />
                )}
              </div>

              <div className="md:w-2/5 flex flex-col border-l border-gray-100 dark:border-ticos-dark-border max-h-[90vh]">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-ticos-dark-border">
                  {isAnonymous ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                  ) : (
                    <Link to={`/profile/${post.user?.username}`}>
                      {post.user?.avatar ? (
                        <img src={post.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                          {post.user?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </Link>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {isAnonymous ? (
                        <span className="text-purple-500 dark:text-purple-400">Anonymous</span>
                      ) : (
                        <Link to={`/profile/${post.user?.username}`} className="hover:underline">
                          {post.user?.username}
                        </Link>
                      )}
                    </p>
                    <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="hidden md:block p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                  {post.caption && (
                    <div className="px-4 py-2.5 border-b border-gray-50 dark:border-ticos-dark-border">
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
                    </div>
                  )}

                  <div className="flex-1 overflow-hidden">
                    <CommentSection
                      postId={post._id}
                      socket={socket}
                      onNewComment={() => setCommentCount((c) => c + 1)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-ticos-dark-border">
                  <PostActions
                    post={post}
                    onLike={handleLike}
                    simplified
                  />
                </div>

                <CommentForm onSubmit={handleComment} />
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostDetailModal;
