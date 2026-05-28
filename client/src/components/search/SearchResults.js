import React from 'react';
import { motion } from 'framer-motion';

const SearchResults = ({ results, loading, onSelect }) => {
  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-2.5 bg-gray-100 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!results?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="divide-y divide-gray-100"
    >
      {results.map((u) => (
        <button
          key={u._id}
          onClick={() => onSelect(u)}
          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {u.avatar ? (
              <img src={u.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                {u.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{u.username}</p>
            <p className="text-2xs text-ticos-secondary">{u.name}</p>
          </div>
        </button>
      ))}
    </motion.div>
  );
};

export default SearchResults;
