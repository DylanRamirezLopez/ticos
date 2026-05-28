import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';

const StoryCircle = ({ user, viewed, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-shrink-0 w-16"
    >
      <div className={`w-16 h-16 rounded-full p-0.5 ${viewed ? 'bg-gray-300 dark:bg-ticos-dark-border' : 'gradient-story'}`}>
        <div className="w-full h-full rounded-full bg-white p-0.5 dark:bg-ticos-dark-card">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            size="lg"
            hasStory={false}
            toProfile={false}
          />
        </div>
      </div>
      <span className="text-2xs text-gray-600 truncate w-full text-center dark:text-ticos-dark-primary">
        {user?.username}
      </span>
    </motion.button>
  );
};

export default React.memo(StoryCircle);
