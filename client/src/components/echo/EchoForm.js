import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import api from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

const EchoForm = ({ onNewEcho, replyTo, onCancelReply }) => {
  const { lang } = useLanguage();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const body = { text: text.trim() };
      if (replyTo) body.replyTo = replyTo._id;

      const res = await api.post('/echo', body);
      onNewEcho?.(res.data);
      setText('');
    } catch {} finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos dark:shadow-none p-5 border border-gray-100 dark:border-ticos-dark-border mb-4"
    >
      {replyTo && (
        <div className="flex items-start gap-2 mb-3 p-2.5 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl">
          <div className="flex-1 min-w-0">
            <p className="text-2xs text-ticos-accent font-medium mb-0.5">
              {lang === 'es' ? 'Respondiendo a:' : 'Replying to:'}
            </p>
            <p className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary truncate">
              {replyTo.text}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          >
            <FiX size={14} className="text-ticos-secondary" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder={
            replyTo
              ? lang === 'es' ? 'Escribe tu respuesta...' : 'Write your reply...'
              : lang === 'es'
                ? '¿Cómo te sientes? Compártelo anónimamente...'
                : 'How are you feeling? Share it anonymously...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          rows={3}
          className="w-full px-0 py-0 bg-transparent text-sm text-ticos-primary dark:text-ticos-dark-primary placeholder-ticos-secondary dark:placeholder-ticos-dark-secondary focus:outline-none resize-none mb-3"
          autoFocus={!!replyTo}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary">
              {text.length}/2000
            </span>
          </div>
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={!text.trim() || sending}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              text.trim()
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-gray-100 dark:bg-ticos-dark-hover text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiSend size={12} />
            {sending
              ? (lang === 'es' ? 'Enviando...' : 'Sending...')
              : replyTo
                ? (lang === 'es' ? 'Responder' : 'Reply')
                : (lang === 'es' ? 'Publicar' : 'Post')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default EchoForm;
