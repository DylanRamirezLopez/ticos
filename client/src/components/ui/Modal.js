import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 40 },
};

const Modal = ({ isOpen, onClose, children, title, className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
            variants={overlayVariants}
            onClick={onClose}
          />
          <motion.div
            className={`relative bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos-lg dark:shadow-none max-w-lg w-full max-h-[90vh] overflow-y-auto ${className}`}
            variants={modalVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-ticos-dark-border">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full transition">
                  <FiX size={20} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
