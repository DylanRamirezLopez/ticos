import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Avatar = ({ src, name, username, size = 'md', hasStory = false, toProfile = true }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-32 h-32 text-3xl',
  };

  const initial = name?.[0]?.toUpperCase() || '?';

  const content = (
    <div className={`${sizes[size]} relative flex-shrink-0`}>
      {hasStory && (
        <motion.div
          className="absolute inset-0 rounded-full gradient-story p-0.5"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full bg-white p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
              {src ? (
                <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold gradient-avatar text-white">
                  {initial}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      {!hasStory && (
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
          {src ? (
            <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold gradient-avatar text-white">
              {initial}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (toProfile && username) {
    return <Link to={`/profile/${username}`}>{content}</Link>;
  }

  return content;
};

export default Avatar;
