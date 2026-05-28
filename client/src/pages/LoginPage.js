import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-ticos-dark-bg dark:to-purple-900/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white dark:bg-ticos-dark-card rounded-2xl shadow-ticos-lg dark:shadow-none p-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-ticos-primary dark:text-ticos-dark-primary select-none">
              TICOS
            </h1>
            <p className="text-ticos-secondary dark:text-ticos-dark-secondary mt-2 text-sm">
              Sign in to see your feed
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-50 dark:bg-red-900/20 text-ticos-like-red p-3 rounded-xl mb-4 text-sm flex items-center gap-2"
              >
                <span>⚠</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-ticos-accent focus:ring-ticos-accent cursor-pointer"
              />
              <span className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary">Remember me</span>
            </label>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={!email || !password}
            >
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-ticos-secondary dark:text-ticos-dark-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-ticos-accent font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
