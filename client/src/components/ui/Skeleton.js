import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className = '', variant = 'rectangular', width, height }) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-ticos-dark-hover ${variant === 'circular' ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/5" />
      </motion.div>
    </div>
  );
};

export default Skeleton;

export const PostSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden dark:bg-ticos-dark-card dark:border-ticos-dark-border">
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton width={120} height={14} />
    </div>
    <Skeleton className="w-full" height={400} />
    <div className="p-4 space-y-2">
      <div className="flex gap-4">
        <Skeleton width={24} height={24} variant="circular" />
        <Skeleton width={24} height={24} variant="circular" />
        <Skeleton width={24} height={24} variant="circular" />
      </div>
      <Skeleton width={80} height={14} />
      <Skeleton width="60%" height={14} />
      <Skeleton width="40%" height={12} />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto py-8 px-4">
    <div className="flex items-center gap-8 mb-8">
      <Skeleton variant="circular" width={128} height={128} />
      <div className="space-y-3 flex-1">
        <Skeleton width={160} height={24} />
        <div className="flex gap-8">
          <Skeleton width={80} height={16} />
          <Skeleton width={80} height={16} />
          <Skeleton width={80} height={16} />
        </div>
        <Skeleton width={200} height={14} />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
    </div>
  </div>
);

export const FeedSkeletonList = () => (
  <div className="max-w-lg mx-auto py-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
);
