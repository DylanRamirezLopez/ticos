import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ label, type = 'text', value, onChange, error, className = '', ...props }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className={`relative border rounded-lg transition-all duration-200 ${focused ? 'border-gray-900 ring-1 ring-gray-900 dark:border-gray-100 dark:ring-gray-100' : error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 pt-5 pb-1.5 bg-transparent text-sm focus:outline-none"
          {...props}
        />
        <motion.label
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 pointer-events-none text-sm origin-left"
          animate={{
            y: focused || hasValue ? -14 : 0,
            scale: focused || hasValue ? 0.75 : 1,
            color: focused ? '#1A1A1A' : error ? '#ED4956' : '#8E8E8E',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      </div>
      {error && (
        <motion.p
          className="text-red-500 text-xs mt-1 px-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
