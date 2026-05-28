import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../api/client';
import { useSocket } from '../context/SocketContext';
import PostCard from '../components/feed/PostCard';
import StoryBar from '../components/stories/StoryBar';
import PostDetailModal from '../components/feed/PostDetailModal';
import { FeedSkeletonList } from '../components/ui/Skeleton';

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [detailPostId, setDetailPostId] = useState(null);
  const { socket } = useSocket();

  const fetchPosts = useCallback(async (pageNum) => {
    const res = await api.get(`/posts/feed?page=${pageNum}`);
    return res.data;
  }, []);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchPosts(1);
      setPosts(data.posts);
      setHasMore(data.page < data.pages);
      setPage(1);
    } catch {
      console.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const data = await fetchPosts(nextPage);
      setPosts((prev) => [...prev, ...data.posts]);
      setPage(nextPage);
      setHasMore(nextPage < data.pages);
    } catch {}
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewPost = (post) => {
      setPosts((prev) => [post, ...prev]);
    };
    socket.on('new-post', handleNewPost);
    return () => socket.off('new-post', handleNewPost);
  }, [socket]);

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch {}
  };

  const handleOpenDetail = (postId) => {
    setDetailPostId(postId);
  };

  if (loading) return <FeedSkeletonList />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto"
    >
      <StoryBar />

      {posts.length === 0 ? (
        <div className="text-center py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-ticos-primary dark:text-ticos-dark-primary mb-2">
              Welcome to TICOS
            </h2>
            <p className="text-ticos-secondary dark:text-ticos-dark-secondary text-sm">
              Follow users to see their photos here
            </p>
          </motion.div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-ticos-accent border-t-transparent rounded-full animate-spin" />
            </div>
          }
          endMessage={
            <p className="text-center text-ticos-secondary dark:text-ticos-dark-secondary text-sm py-6">
              You're all caught up
            </p>
          }
          className="px-4"
        >
          {posts.map((post, idx) => (
            <PostCard
              key={post._id}
              post={post}
              index={idx}
              onLike={handleLike}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </InfiniteScroll>
      )}

      {detailPostId && (
        <PostDetailModal
          postId={detailPostId}
          onClose={() => setDetailPostId(null)}
        />
      )}
    </motion.div>
  );
};

export default FeedPage;
