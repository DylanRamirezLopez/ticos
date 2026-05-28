import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCamera, FiUser, FiEdit2 } from 'react-icons/fi';
import api from '../../api/client';
import Button from '../ui/Button';

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatar('');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let avatarUrl = avatar;

      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const uploadRes = await api.post('/upload/avatar', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        avatarUrl = uploadRes.data.url;
      }

      const updates = { name: name.trim() };
      if (bio !== undefined) updates.bio = bio.trim();
      if (avatarUrl) updates.avatar = avatarUrl;

      await api.put('/auth/profile', updates);
      onSave?.(updates);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-ticos-dark-card rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Edit Profile</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full transition">
                <FiX size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-ticos-dark-hover">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                  ) : avatar ? (
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiUser size={32} />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-ticos-accent rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <FiCamera size={12} className="text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>
              <span className="text-xs text-ticos-secondary">Tap camera to change photo</span>
            </div>

            {error && (
              <p className="text-xs text-ticos-like-red mb-3 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-2xs font-medium text-ticos-secondary dark:text-ticos-dark-secondary mb-1">Name</label>
                <div className="relative">
                  <FiEdit2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-ticos-dark-hover border border-gray-200 dark:border-ticos-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-medium text-ticos-secondary dark:text-ticos-dark-secondary mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-ticos-dark-hover border border-gray-200 dark:border-ticos-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:border-transparent resize-none transition-all"
                  placeholder="Tell us about yourself..."
                />
                <div className="text-right text-2xs text-ticos-secondary dark:text-ticos-dark-secondary mt-1">{bio.length}/150</div>
              </div>

              <div>
                <label className="block text-2xs font-medium text-ticos-secondary dark:text-ticos-dark-secondary mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => { setAvatar(e.target.value); setAvatarFile(null); setAvatarPreview(''); }}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-ticos-dark-hover border border-gray-200 dark:border-ticos-dark-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent focus:border-transparent transition-all"
                  placeholder="https://example.com/avatar.jpg"
                  disabled={!!avatarPreview}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleSave}
                loading={saving}
                disabled={!name.trim()}
              >
                Save
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
