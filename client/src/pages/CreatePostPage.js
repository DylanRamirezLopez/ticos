import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX, FiFileText, FiEyeOff, FiShield } from 'react-icons/fi';
import api from '../api/client';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import TermsModal from '../components/settings/TermsModal';
import { useLanguage } from '../context/LanguageContext';

const CreatePostPage = () => {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const [postType, setPostType] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(user?.anonymousModeEnabled || false);
  const [showTerms, setShowTerms] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const anonymousForced = user?.anonymousModeEnabled === true;

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPostType('image');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleSubmit = async () => {
    if (postType === 'image' && !image) return;
    if (postType === 'text' && !text.trim()) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('isAnonymous', anonymousForced || isAnonymous);

      if (postType === 'image') {
        fd.append('image', image);
        fd.append('caption', caption);
      } else {
        fd.append('text', text);
        fd.append('caption', '');
        fd.append('image', new File([], ''));
      }

      await api.post('/posts', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to create post', err);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setPostType(null);
    setImage(null);
    setPreview('');
    setCaption('');
    setText('');
    if (!anonymousForced) setIsAnonymous(false);
  };

  if (!postType) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto py-8 px-4"
      >
        <div className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos dark:shadow-none p-6">
          <h2 className="text-xl font-semibold text-center mb-6">Create Post</h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPostType('image')}
              className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-ticos-accent hover:bg-blue-50 dark:hover:bg-ticos-dark-hover transition-all"
            >
              <FiCamera size={40} className="text-gray-400 dark:text-ticos-dark-secondary" />
              <span className="text-sm font-medium text-gray-600 dark:text-ticos-dark-secondary">Photo Post</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPostType('text')}
              className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-ticos-dark-hover transition-all"
            >
              <FiFileText size={40} className="text-gray-400 dark:text-ticos-dark-secondary" />
              <span className="text-sm font-medium text-gray-600 dark:text-ticos-dark-secondary">Text Post</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto py-8 px-4"
    >
      <div className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos dark:shadow-none p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={resetForm} className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary hover:text-ticos-primary dark:hover:text-ticos-dark-primary">
            &larr; Back
          </button>
          <h2 className="text-xl font-semibold">
            {postType === 'image' ? 'New Photo Post' : 'New Text Post'}
          </h2>
          <div />
        </div>

        <AnimatePresence mode="wait">
          {postType === 'image' ? (
            <motion.div
              key="image-post"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {preview ? (
                <>
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-ticos-dark-hover mb-4 aspect-square max-h-72">
                    <img src={preview} alt="" className="w-full h-full object-contain" />
                    <button
                      onClick={() => { setImage(null); setPreview(''); }}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <FiX size={16} className="text-white" />
                    </button>
                  </div>
                  <textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2200}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent resize-none transition-all mb-2"
                  />
                  <div className="text-right text-2xs text-ticos-secondary dark:text-ticos-dark-secondary mb-4">
                    {caption.length}/2200
                  </div>
                </>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all mb-4 ${
                    dragOver
                      ? 'border-ticos-accent bg-blue-50 dark:bg-ticos-dark-hover'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover'
                  }`}
                >
                  <motion.div
                    animate={{ scale: dragOver ? 1.1 : 1 }}
                    className="flex flex-col items-center"
                  >
                    <FiCamera size={48} className="text-gray-300 dark:text-gray-500 mb-4" />
                    <p className="text-gray-500 dark:text-ticos-dark-secondary text-sm font-medium">Click or drag to upload</p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">PNG, JPG, GIF up to 5MB</p>
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSelect}
                    className="hidden"
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="text-post"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <textarea
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={10000}
                rows={8}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition-all mb-2"
              />
              <div className="text-right text-2xs text-ticos-secondary dark:text-ticos-dark-secondary mb-4">
                {text.length}/10000
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {anonymousForced ? (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <FiShield size={16} className="text-purple-500" />
            <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              {lang === 'es' ? 'Modo Anónimo activo — todas las publicaciones son anónimas' : 'Anonymous Mode active — all posts are anonymous'}
            </span>
          </div>
        ) : (
          <div
            className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-ticos-dark-card transition-colors"
            onClick={() => setShowTerms(true)}
          >
            <div className="flex items-center gap-2 pointer-events-none">
              <FiEyeOff size={16} className="text-ticos-secondary dark:text-ticos-dark-secondary" />
              <span className="text-sm text-ticos-primary dark:text-ticos-dark-primary">
                {lang === 'es' ? 'Publicar anónimamente' : 'Post anonymously'}
              </span>
            </div>
            <div className="pointer-events-none w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative">
              <div className="absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={anonymousForced ? 'follow' : 'primary'}
            className="flex-1"
            onClick={handleSubmit}
            loading={uploading}
            disabled={uploading || (postType === 'text' && !text.trim())}
          >
            {anonymousForced || isAnonymous ? (lang === 'es' ? 'Publicar Anónimamente' : 'Post Anonymously') : (lang === 'es' ? 'Compartir' : 'Share')}
          </Button>
          <Button variant="secondary" onClick={resetForm}>
            {lang === 'es' ? 'Descartar' : 'Discard'}
          </Button>
        </div>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setShowTerms(false);
          setIsAnonymous(true);
        }}
        lang={lang}
      />
    </motion.div>
  );
};

export default CreatePostPage;
