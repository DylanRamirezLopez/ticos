import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  const typingRef = useRef(false);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping?.();
    }
    clearTimeout(typingRef.current);
    const timeout = setTimeout(() => {
      typingRef.current = false;
      onStopTyping?.();
    }, 1000);
    typingRef.current = timeout;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend?.(text.trim());
    setText('');
    clearTimeout(typingRef.current);
    typingRef.current = false;
    onStopTyping?.();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white dark:border-ticos-dark-border dark:bg-ticos-dark-card">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Message..."
          className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:bg-white transition-all dark:bg-ticos-dark-card dark:focus:bg-ticos-dark-card dark:placeholder-gray-600"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-ticos-accent flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          <FiSend size={16} className="text-white" />
        </motion.button>
      </div>
    </form>
  );
};

export default React.memo(ChatInput);
