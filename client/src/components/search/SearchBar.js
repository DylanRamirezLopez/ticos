import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';
import useDebounce from '../../hooks/useDebounce';
import api from '../../api/client';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const ref = useRef(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }
    const fetchResults = async () => {
      setSearching(true);
      try {
        const res = await api.get(`/users/search?q=${debouncedQuery}`);
        setResults(res.data);
      } catch {} finally {
        setSearching(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ticos-secondary" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className="w-64 h-9 pl-9 pr-4 bg-gray-100 dark:bg-ticos-dark-hover rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:bg-white dark:focus:bg-ticos-dark-card transition-all placeholder:text-ticos-secondary"
        />
      </div>

      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full mt-2 w-80 bg-white dark:bg-ticos-dark-card border border-gray-200 dark:border-ticos-dark-border rounded-xl shadow-ticos-lg dark:shadow-none overflow-hidden z-50"
          >
            {searching ? (
              <div className="px-4 py-6 text-center">
                <div className="w-5 h-5 border-2 border-ticos-accent border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-ticos-secondary dark:text-ticos-dark-secondary">
                <FiUser size={24} className="mx-auto mb-2 text-gray-300 dark:text-gray-500" />
                No users found for "{query}"
              </div>
            ) : (
              <div>
                <p className="px-4 pt-2.5 pb-1.5 text-2xs font-semibold text-ticos-secondary dark:text-ticos-dark-secondary uppercase tracking-wide">
                  Users
                </p>
                {results.map((u) => (
                  <Link
                    key={u._id}
                    to={`/profile/${u.username}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-ticos-dark-hover flex-shrink-0">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{u.username}</p>
                      <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary truncate">{u.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
