import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiTrendingUp } from 'react-icons/fi';
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import EchoCard from '../components/echo/EchoCard';
import EchoForm from '../components/echo/EchoForm';
import EchoSentimentBadge from '../components/echo/EchoSentimentBadge';

const EchoPage = () => {
  const [echoes, setEchoes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState([]);
  const { lang } = useLanguage();

  const fetchEchoes = useCallback(async (pageNum) => {
    const res = await api.get(`/echo/feed?page=${pageNum}`);
    return res.data;
  }, []);

  useEffect(() => {
    loadEchoes();
  }, []);

  const loadEchoes = async () => {
    try {
      const data = await fetchEchoes(1);
      setEchoes(data.echoes);
      setHasMore(data.page < data.pages);
      setPage(1);
    } catch {} finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const next = page + 1;
      const data = await fetchEchoes(next);
      setEchoes((prev) => [...prev, ...data.echoes]);
      setPage(next);
      setHasMore(next < data.pages);
    } catch {}
  };

  const handleNewEcho = (newEcho) => {
    if (!newEcho.replyTo) {
      setEchoes((prev) => [newEcho, ...prev]);
    } else {
      setEchoes((prev) =>
        prev.map((e) =>
          e._id === newEcho.replyTo
            ? { ...e, replyCount: (e.replyCount || 0) + 1 }
            : e
        )
      );
    }
    setReplyTo(null);
  };

  const handleStats = async () => {
    if (stats.length > 0) {
      setShowStats(!showStats);
      return;
    }
    try {
      const res = await api.get('/echo/stats');
      setStats(res.data.stats);
      setShowStats(true);
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto py-8 px-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-ticos-dark-card rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-ticos-dark-hover rounded w-1/3 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-ticos-dark-hover rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-ticos-dark-hover rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-lg mx-auto py-6 px-4"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ticos-primary dark:text-ticos-dark-primary">
            {lang === 'es' ? 'Echo' : 'Echo'}
          </h1>
          <p className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary mt-0.5">
            {lang === 'es'
              ? 'Comparte cómo te sientes, 100% anónimo'
              : 'Share how you feel, 100% anonymous'}
          </p>
        </div>
        <button
          onClick={handleStats}
          className={`p-2 rounded-xl transition-colors ${
            showStats
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
              : 'bg-gray-100 dark:bg-ticos-dark-hover text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-primary'
          }`}
        >
          <FiTrendingUp size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showStats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/30">
              <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-3">
                {lang === 'es' ? 'Sentimiento de la Semana' : 'Weekly Sentiment'}
              </h3>
              <div className="space-y-2">
                {stats.map((s) => (
                  <div key={s.sentiment} className="flex items-center gap-2">
                    <span className="text-sm w-5">{s.emoji}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300 w-24 truncate">
                      {s.label}
                    </span>
                    <div className="flex-1 h-2 bg-white/60 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.percentage}%` }}
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                      {s.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EchoForm onNewEcho={handleNewEcho} />

      {replyTo && (
        <EchoForm
          onNewEcho={handleNewEcho}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      )}

      {echoes.length === 0 ? (
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center"
          >
            <FiMessageCircle size={28} className="text-purple-400" />
          </motion.div>
          <h3 className="text-lg font-semibold text-ticos-primary dark:text-ticos-dark-primary mb-1">
            {lang === 'es' ? 'Sin echoes aún' : 'No echoes yet'}
          </h3>
          <p className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary">
            {lang === 'es'
              ? 'Sé el primero en compartir cómo te sientes'
              : 'Be the first to share how you feel'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {echoes.map((echo, idx) => (
            <EchoCard
              key={echo._id}
              echo={echo}
              index={idx}
              onReply={setReplyTo}
            />
          ))}
          {hasMore && (
            <div className="flex justify-center py-4">
              <button
                onClick={loadMore}
                className="text-sm text-ticos-accent hover:underline"
              >
                {lang === 'es' ? 'Cargar más' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="text-center py-6">
        <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary">
          {lang === 'es'
            ? 'Los echoes se eliminan automáticamente después de 24 horas. 100% anónimo.'
            : 'Echoes are automatically deleted after 24 hours. 100% anonymous.'}
        </p>
      </div>
    </motion.div>
  );
};

export default EchoPage;
