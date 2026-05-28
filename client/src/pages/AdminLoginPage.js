import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiKey, FiUser } from 'react-icons/fi';
import api from '../api/client';

const AdminLoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !adminCode) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/admin/login', { username, password, adminCode });
      localStorage.setItem('admin_token', res.data.token);
      onLogin?.(res.data.admin);
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-4 shadow-lg shadow-red-600/20">
              <FiShield size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">TICOS Security Dashboard</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium ml-1">Username</label>
              <div className="relative">
                <FiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                  placeholder="Admin username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium ml-1">Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 font-medium ml-1">Admin Code</label>
              <div className="relative">
                <FiKey size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 font-mono tracking-widest"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-xs bg-red-900/20 p-2.5 rounded-lg border border-red-900/30"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={!username || !password || !adminCode || loading}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl text-sm font-semibold hover:from-red-700 hover:to-red-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><FiLock size={14} /> Access Dashboard</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-2xs text-gray-600 mt-6">
            Authorized personnel only. All access is logged and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
