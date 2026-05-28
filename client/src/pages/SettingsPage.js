import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEyeOff, FiGlobe, FiMoon, FiShield, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import TermsModal from '../components/settings/TermsModal';
import Button from '../components/ui/Button';

const SettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const { lang, t, changeLanguage } = useLanguage();
  const { dark, toggleTheme } = useTheme();
  const [anonymousEnabled, setAnonymousEnabled] = useState(
    user?.anonymousModeEnabled || false
  );
  const [showTerms, setShowTerms] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleLanguageChange = async (newLang) => {
    changeLanguage(newLang);
    try {
      await api.put('/auth/settings', { language: newLang });
    } catch {}
  };

  const handleAnonymousToggle = () => {
    if (!anonymousEnabled) {
      setShowTerms(true);
    } else {
      setShowDisableConfirm(true);
    }
  };

  const handleAcceptTerms = async () => {
    setShowTerms(false);
    setAnonymousEnabled(true);
    setSaving(true);
    try {
      await api.put('/auth/settings', {
        anonymousModeEnabled: true,
        acceptedTermsVersion: '1.0',
      });
      await refreshUser();
      setMessage(
        lang === 'es'
          ? 'Modo anónimo activado correctamente'
          : 'Anonymous mode enabled successfully'
      );
      setTimeout(() => setMessage(''), 3000);
    } catch {} finally {
      setSaving(false);
    }
  };

  const disableAnonymous = async () => {
    setAnonymousEnabled(false);
    setSaving(true);
    try {
      await api.put('/auth/settings', {
        anonymousModeEnabled: false,
      });
      await refreshUser();
      setMessage(
        lang === 'es'
          ? 'Modo anónimo desactivado'
          : 'Anonymous mode disabled'
      );
      setTimeout(() => setMessage(''), 3000);
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto py-8 px-4"
    >
      <div className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos dark:shadow-none p-6">
        <h2 className="text-xl font-semibold mb-6">{t('settings.title')}</h2>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2"
          >
            <FiCheck size={16} />
            {message}
          </motion.div>
        )}

        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <FiGlobe size={18} className="text-ticos-accent" />
                <span className="font-medium text-sm">{t('settings.language')}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-ticos-accent text-white'
                    : 'bg-white border border-gray-200 text-ticos-primary hover:border-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  lang === 'es'
                    ? 'bg-ticos-accent text-white'
                    : 'bg-white border border-gray-200 text-ticos-primary hover:border-gray-300'
                }`}
              >
                Español
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiMoon size={18} className={dark ? 'text-yellow-400' : 'text-ticos-secondary'} />
                <div>
                  <p className="font-medium text-sm">{t('settings.darkMode')}</p>
                  <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary mt-0.5">
                    {t('settings.darkModeDesc')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={dark}
                  onChange={toggleTheme}
                />
                <div className={`w-10 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                  dark
                    ? 'bg-yellow-500 peer-checked:after:translate-x-full'
                    : 'bg-gray-300 peer-checked:after:translate-x-full'
                }`} />
              </label>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiEyeOff
                  size={18}
                  className={
                    anonymousEnabled ? 'text-purple-500 dark:text-purple-400' : 'text-ticos-secondary dark:text-ticos-dark-secondary'
                  }
                />
                <div>
                  <p className="font-medium text-sm">{t('settings.anonymousMode')}</p>
                  <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary mt-0.5">
                    {t('settings.anonymousDesc')}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={anonymousEnabled}
                  onChange={handleAnonymousToggle}
                  disabled={saving}
                />
                <div
                  className={`w-10 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                    anonymousEnabled
                      ? 'bg-purple-500 peer-checked:after:translate-x-full'
                      : 'bg-gray-300 peer-checked:after:translate-x-full'
                  }`}
                />
              </label>
            </div>

            {anonymousEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
              >
                <p className="text-xs text-purple-700 leading-relaxed">
                  {t('anonymous.info')}
                </p>
                <p className="text-xs text-purple-700 leading-relaxed mt-1">
                  {t('anonymous.info2')}
                </p>
                <p className="text-xs text-purple-500 leading-relaxed mt-1">
                  {t('anonymous.legal')}
                </p>
                <p className="text-xs text-purple-400 leading-relaxed mt-1">
                  {t('anonymous.warning')}
                </p>
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <FiShield size={18} className="text-purple-500" />
              <span className="font-medium text-sm text-purple-700">
                {t('anonymous.title')}
              </span>
            </div>
            <p className="text-xs text-purple-600 leading-relaxed">
              {anonymousEnabled ? t('anonymous.enabled') : t('anonymous.disabled')}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDisableConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
             onClick={() => setShowDisableConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-ticos-dark-card rounded-2xl max-w-sm w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
                  <FiAlertTriangle size={24} className="text-ticos-like-red" />
                </div>
                <h3 className="text-lg font-bold">
                  {lang === 'es' ? 'Desactivar Modo Anónimo' : 'Disable Anonymous Mode'}
                </h3>
                <p className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary mt-1">
                  {lang === 'es'
                    ? 'Al desactivar el modo anónimo, perderás acceso a todo el contenido anónimo. Esta acción requiere confirmación.'
                    : 'Disabling anonymous mode will remove access to all anonymous content. This action requires confirmation.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowDisableConfirm(false)}
                >
                  {lang === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => {
                    setShowDisableConfirm(false);
                    disableAnonymous();
                  }}
                  loading={saving}
                >
                  {lang === 'es' ? 'Desactivar' : 'Disable'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
        lang={lang}
      />
    </motion.div>
  );
};

export default SettingsPage;
