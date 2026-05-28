import React from 'react';
import { motion } from 'framer-motion';
import { FiGrid, FiBookmark } from 'react-icons/fi';

const tabs = [
  { key: 'posts', icon: FiGrid, label: 'Posts' },
  { key: 'saved', icon: FiBookmark, label: 'Saved' },
];

const ProfileTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-t border-gray-200 mt-8 dark:border-ticos-dark-border">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
              isActive ? 'text-ticos-primary border-t border-ticos-primary -mt-px dark:text-ticos-dark-primary dark:border-ticos-dark-primary' : 'text-ticos-secondary dark:text-ticos-dark-secondary'
            }`}
          >
            <Icon size={12} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(ProfileTabs);
