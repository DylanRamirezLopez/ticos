import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const CommentForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(text.trim());
      setText('');
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-ticos-dark-border">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        className="flex-1 text-sm bg-transparent focus:outline-none placeholder-ticos-secondary"
      />
      <motion.button
        type="submit"
        whileTap={{ scale: 0.9 }}
        disabled={!text.trim() || loading}
        className={`p-1.5 rounded-full transition-colors ${
          text.trim()
            ? 'text-ticos-accent hover:bg-blue-50 dark:hover:bg-ticos-dark-hover'
            : 'text-gray-300 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        <FiSend size={18} className={loading ? 'animate-pulse' : ''} />
      </motion.button>
    </form>
  );
};

export default CommentForm;
