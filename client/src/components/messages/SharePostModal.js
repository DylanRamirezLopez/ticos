import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const SharePostModal = ({ isOpen, onClose, postId, onShared }) => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [sending, setSending] = useState(null);

  const handleSearch = async (q) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    try {
      const res = await api.get(`/users/search?q=${q}`);
      setResults(res.data.filter((u) => u._id !== user._id));
    } catch {}
  };

  const handleSend = async (receiverId) => {
    setSending(receiverId);
    try {
      await api.post('/messages', { receiverId, text: '', sharedPost: postId });
      onShared?.();
      onClose();
    } catch {} finally {
      setSending(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-ticos-dark-card rounded-2xl max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{lang === 'es' ? 'Compartir Post' : 'Share Post'}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full">
                <FiX size={18} />
              </button>
            </div>
            <div className="relative mb-3">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={lang === 'es' ? 'Buscar usuarios...' : 'Search users...'}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-ticos-dark-hover rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent dark:placeholder-gray-500"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto -mx-2">
              {results.length === 0 && query.trim() ? (
                <p className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary text-center py-6">
                  {lang === 'es' ? 'No se encontraron usuarios' : 'No users found'}
                </p>
              ) : (
                results.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleSend(u._id)}
                    disabled={sending === u._id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover rounded-xl transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-ticos-dark-hover flex-shrink-0">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{u.username}</p>
                      <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary truncate">{u.name}</p>
                    </div>
                    {sending === u._id ? (
                      <div className="w-4 h-4 border-2 border-ticos-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs text-ticos-accent font-semibold">
                        {lang === 'es' ? 'Enviar' : 'Send'}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharePostModal;
