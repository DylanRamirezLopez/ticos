import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import api from '../../api/client';
import StoryCircle from './StoryCircle';
import StoryViewer from './StoryViewer';
import StoryUploader from './StoryUploader';

const StoryBar = ({ onStoryCreated }) => {
  const [storyGroups, setStoryGroups] = useState([]);
  const [viewingStories, setViewingStories] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await api.get('/stories/following');
      setStoryGroups(res.data);
    } catch {
      console.error('Failed to fetch stories');
    }
  };

  const handleCreated = () => {
    fetchStories();
    onStoryCreated?.();
  };

  const handleStoryClick = (group, index) => {
    setViewingIndex(index);
    setViewingStories(group);
  };

  const handleCloseViewer = () => {
    setViewingStories(null);
  };

  const hasUnviewed = (group) => {
    return group.stories?.some((s) => !s.viewers?.length);
  };

  return (
    <div className="max-w-lg mx-auto px-2 pt-4 pb-2">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <StoryUploader onStoryCreated={handleCreated} />

        {storyGroups.map((group, idx) => (
          <StoryCircle
            key={group.user._id}
            user={group.user}
            viewed={!hasUnviewed(group)}
            onClick={() => handleStoryClick(group.stories, idx)}
          />
        ))}
      </div>

      {viewingStories && (
        <StoryViewer
          stories={viewingStories}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default StoryBar;
