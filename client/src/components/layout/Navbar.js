import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiCompass, FiSend, FiPlusSquare, FiUser, FiLogOut, FiSettings, FiMoon, FiSun, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import useMediaQuery from '../../hooks/useMediaQuery';
import Avatar from '../ui/Avatar';
import SearchBar from '../search/SearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isMobile) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-ticos-dark-bg dark:border-ticos-dark-border sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-ticos-primary dark:text-ticos-dark-primary select-none">
          TICOS
        </Link>

        <div className="hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-5">
          <NavIcon to="/" active={isActive('/')} icon={<FiHome size={22} />} />
          <NavIcon to="/explore" active={isActive('/explore')} icon={<FiCompass size={22} />} />
          <NavIcon to="/echo" active={isActive('/echo')} icon={<FiMessageCircle size={22} />} />
          <NavIcon to="/messages" active={isActive('/messages')} icon={<FiSend size={22} />} />
          <NavIcon to="/create" active={isActive('/create')} icon={<FiPlusSquare size={22} />} />

          <div className="relative">
            <button onClick={() => setShowLogout(!showLogout)}>
              <Avatar src={user?.avatar} name={user?.name} size="sm" toProfile={false} />
            </button>
            {showLogout && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 dark:bg-ticos-dark-card dark:border-ticos-dark-border rounded-xl shadow-ticos-lg dark:shadow-none py-2"
              >
                <Link
                  to={`/profile/${user?.username}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover text-sm"
                  onClick={() => setShowLogout(false)}
                >
                  <FiUser size={16} />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover text-sm"
                  onClick={() => setShowLogout(false)}
                >
                  <FiSettings size={16} />
                  Settings
                </Link>
                <button
                  onClick={() => { toggleTheme(); setShowLogout(false); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover text-sm w-full text-left"
                >
                  {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
                  {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover text-sm w-full text-left"
                >
                  <FiLogOut size={16} />
                  Log Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavIcon = ({ to, active, icon }) => (
  <Link to={to} className="relative p-1">
    <span className={active ? 'text-ticos-primary dark:text-ticos-dark-primary' : 'text-gray-500 dark:text-ticos-dark-secondary hover:text-ticos-primary dark:hover:text-ticos-dark-primary transition-colors'}>
      {icon}
    </span>
    {active && (
      <motion.div
        layoutId="nav-indicator"
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-ticos-accent"
      />
    )}
  </Link>
);

export default Navbar;
