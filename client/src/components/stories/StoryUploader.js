import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiCamera } from 'react-icons/fi';
import api from '../../api/client';
import Button from '../ui/Button';

const StoryUploader = ({ onStoryCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', image);
      await api.post('/stories', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onStoryCreated?.();
      setIsOpen(false);
      setImage(null);
      setPreview('');
    } catch {
      console.error('Failed to upload story');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-1 flex-shrink-0 w-16"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors dark:border-ticos-dark-border">
          <FiPlus size={24} className="text-gray-400 dark:text-ticos-dark-secondary" />
        </div>
        <span className="text-2xs text-gray-600 dark:text-ticos-dark-primary">Your Story</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 dark:bg-black/80"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full dark:bg-ticos-dark-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-center mb-4">Add to Story</h3>

              {preview ? (
                <div className="mb-4 rounded-xl overflow-hidden aspect-square bg-gray-100 dark:bg-ticos-dark-card">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-gray-400 transition-colors mb-4 dark:border-ticos-dark-border">
                  <FiCamera size={40} className="text-gray-300 mb-3 dark:text-gray-500" />
                  <p className="text-sm text-gray-500 dark:text-ticos-dark-secondary">Tap to select a photo</p>
                  <input type="file" accept="image/*" onChange={handleSelect} className="hidden" />
                </label>
              )}

              <div className="flex gap-2">
                <Button variant="primary" onClick={handleSubmit} disabled={!image} loading={uploading} className="flex-1">
                  Share
                </Button>
                <Button variant="secondary" onClick={() => { setIsOpen(false); setImage(null); setPreview(''); }}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoryUploader;
