import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const variants = {
  primary: 'bg-ticos-accent text-white hover:bg-blue-600',
  secondary: 'border border-gray-300 text-ticos-primary bg-white hover:bg-gray-50',
  ghost: 'text-ticos-primary hover:bg-gray-100',
  danger: 'bg-ticos-like-red text-white hover:bg-red-600',
  follow: 'bg-ticos-accent text-white hover:bg-blue-600',
  following: 'border border-gray-300 bg-white text-ticos-primary hover:border-gray-400',
};

const sizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-5 py-1.5 text-sm',
  lg: 'px-6 py-2 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', loading = false, className = '', disabled, ...props }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <FiLoader className="animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
