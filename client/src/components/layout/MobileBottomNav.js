import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCompass, FiSend, FiUser, FiSettings, FiMessageCircle } from 'react-icons/fi';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { path: '/', icon: FiHome, label: 'Home' },
  { path: '/explore', icon: FiCompass, label: 'Explore' },
  { path: '/echo', icon: FiMessageCircle, label: 'Echo' },
  { path: '/create', icon: null, label: 'Create', isCreate: true },
  { path: '/messages', icon: FiSend, label: 'Messages' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
  { path: '/profile', icon: FiUser, label: 'Profile', isProfile: true },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { user } = useAuth();

  if (!isMobile) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-ticos-dark-bg dark:border-ticos-dark-border z-50 pb-safe">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const isActive = tab.isProfile
            ? location.pathname === `/profile/${user?.username}`
            : location.pathname === tab.path;
          const Icon = tab.icon;

          if (tab.isCreate) {
            return (
              <Link
                key={tab.path}
                to="/create"
                className="relative"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-ticos-accent flex items-center justify-center"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </motion.div>
              </Link>
            );
          }

          if (tab.isProfile) {
            return (
              <Link key={tab.path} to={`/profile/${user?.username}`} className="relative p-1">
                <div className={`w-6 h-6 rounded-full overflow-hidden border-2 ${isActive ? 'border-ticos-primary' : 'border-transparent'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
            );
          }

          return (
            <Link key={tab.path} to={tab.path} className="relative p-1">
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon size={22} className={isActive ? 'text-ticos-primary dark:text-ticos-dark-primary' : 'text-gray-500 dark:text-ticos-dark-secondary'} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
