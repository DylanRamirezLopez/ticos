import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const CommentItem = ({ comment, onLike, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(
    comment.likes?.includes?.(user?._id) || false
  );
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);

  const handleLike = async () => {
    setLiked((l) => !l);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    onLike(comment._id);
  };

  const isOwner = comment.user?._id === user?._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2.5 px-4 py-2.5 group"
    >
      <Link to={`/profile/${comment.user?.username}`} className="flex-shrink-0 mt-0.5">
        {comment.user?.avatar ? (
          <img src={comment.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full gradient-avatar flex items-center justify-center text-white text-[10px] font-bold">
            {comment.user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <Link
            to={`/profile/${comment.user?.username}`}
            className="font-semibold hover:underline mr-1.5"
          >
            {comment.user?.username}
          </Link>
          {comment.text}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary">
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString()
              : ''}
          </span>
          <button
            onClick={handleLike}
            className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-primary dark:hover:text-ticos-dark-primary transition-colors"
          >
            {likeCount > 0 ? `${likeCount} likes` : 'Like'}
          </button>
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-like-red transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiTrash2 size={12} />
            </button>
          )}
        </div>
      </div>
      <button
        onClick={handleLike}
        className="flex-shrink-0 mt-0.5 focus:outline-none"
      >
        <FiHeart
          size={12}
          className={
            liked
              ? 'fill-ticos-like-red text-ticos-like-red'
              : 'text-gray-400 dark:text-ticos-dark-secondary'
          }
        />
      </button>
    </motion.div>
  );
};

const CommentSection = ({ postId, comments, onNewComment, socket }) => {
  const [localComments, setLocalComments] = useState(comments || []);
  const [loading, setLoading] = useState(!comments);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (comments) {
      setLocalComments(comments);
      setLoading(false);
    }
  }, [comments]);

  useEffect(() => {
    if (!postId) return;
    loadComments();
  }, [postId]);

  useEffect(() => {
    if (!socket || !postId) return;
    socket.emit('join-post', postId);
    const handleNewComment = (comment) => {
      if (comment.post === postId) {
        setLocalComments((prev) => [comment, ...prev]);
        onNewComment?.(comment);
      }
    };
    socket.on('new-comment', handleNewComment);
    return () => {
      socket.emit('leave-post', postId);
      socket.off('new-comment', handleNewComment);
    };
  }, [socket, postId]);

  const loadComments = async () => {
    try {
      const res = await api.get(`/comments/${postId}?page=1`);
      setLocalComments(res.data.comments);
      setHasMore(res.data.page < res.data.pages);
      setPage(1);
    } catch {} finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const next = page + 1;
      const res = await api.get(`/comments/${postId}?page=${next}`);
      setLocalComments((prev) => [...prev, ...res.data.comments]);
      setPage(next);
      setHasMore(next < res.data.pages);
    } catch {}
  };

  const handleLike = async (commentId) => {
    try {
      await api.put(`/comments/${commentId}/like`);
    } catch {}
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setLocalComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {}
  };

  if (loading) {
    return (
      <div className="px-4 py-6 text-center text-sm text-ticos-secondary dark:text-ticos-dark-secondary">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        {localComments.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary">No comments yet</p>
            <p className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary mt-1">
              Be the first to comment
            </p>
          </div>
        ) : (
          <>
            {localComments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-3 text-xs text-ticos-accent hover:underline"
              >
                Load more comments
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
