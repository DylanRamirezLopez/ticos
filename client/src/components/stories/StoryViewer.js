import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import api from '../../api/client';
import StoryProgressBar from './StoryProgressBar';

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;
    const markViewed = async () => {
      try {
        await api.put(`/stories/${currentStory._id}/view`);
      } catch {}
    };
    markViewed();
  }, [currentStory]);

  useEffect(() => {
    if (paused || !stories.length) return;
    const timer = setTimeout(() => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onClose();
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, stories, paused, onClose]);

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e) => {
    touchEnd.current = e.changedTouches[0].clientX;
    setPaused(false);
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const handleMouseDown = (e) => {
    touchStart.current = e.clientX;
    setPaused(true);
  };

  const handleMouseUp = (e) => {
    touchEnd.current = e.clientX;
    setPaused(false);
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  if (!stories.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div className="relative w-full max-w-lg h-full max-h-[90vh] flex flex-col">
          <StoryProgressBar total={stories.length} current={currentIndex} paused={paused} />

          <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              {currentStory.user?.avatar ? (
                <img src={currentStory.user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                  {currentStory.user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-white text-sm font-semibold">{currentStory.user?.username}</span>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/80 hover:text-white transition-colors"
          >
            <FiX size={24} />
          </button>

          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={currentStory.image}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg select-none"
              draggable={false}
            />
          </div>

          {currentStory.caption && (
            <div className="px-6 pb-6 text-center">
              <p className="text-white/80 text-sm">{currentStory.caption}</p>
            </div>
          )}

          <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={goPrev} />
          <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={goNext} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;
