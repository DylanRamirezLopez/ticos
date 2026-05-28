import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiSearch } from 'react-icons/fi';
import api from '../api/client';
import PostDetailModal from '../components/feed/PostDetailModal';
import { FeedSkeletonList } from '../components/ui/Skeleton';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailPostId, setDetailPostId] = useState(null);

  const fetchPosts = useCallback(async (pageNum) => {
    const res = await api.get(`/posts/global?page=${pageNum}`);
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
    } catch {} finally {
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

  const handleOpenDetail = (postId) => {
    setDetailPostId(postId);
  };

  if (loading) return <FeedSkeletonList />;

  const filtered = searchQuery
    ? posts.filter((p) =>
        p.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-4 px-4"
    >
      <div className="relative max-w-md mx-auto mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ticos-secondary" size={16} />
        <input
          type="text"
          placeholder="Search explore..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-ticos-dark-card border border-gray-200 dark:border-ticos-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:border-transparent transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ticos-secondary dark:text-ticos-dark-secondary">
          <h2 className="text-lg font-semibold mb-1">Explore</h2>
          <p className="text-sm">No posts found</p>
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
        >
          <div className="grid grid-cols-3 gap-1">
            {filtered.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="aspect-square overflow-hidden bg-gray-100 dark:bg-ticos-dark-hover relative group cursor-pointer"
                onClick={() => handleOpenDetail(post._id)}
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
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-3 text-white">
                    <div className="flex items-center gap-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span className="text-sm font-semibold">{post.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

export default ExplorePage;
